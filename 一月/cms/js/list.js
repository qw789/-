var vm = new Vue({
    el: '#rrapp',
    data: {
        currentBt: null,
        tenantId: 0,
        addStation: false,
        activeName: 0, //充点电选择,默认选择第一个
        stationId: null,
        pileNumber: "", //桩编号
        pilemodelId: 0, //型号
        pilegroupId: 0, //组
        status: -1, // 状态值
        statCtner: {},
        btCtner: {},
        q: { //增加编辑充点电
            address: "",
            area: "",
            city: "",
            createId: 0,
            createName: "",
            created: "",
            deleteState: 0,
            extraCharge: 0,
            id: 0,
            latitude: 0,
            longitude: 0,
            maintainer: "",
            name: "",
            number: "",
            parking: 0,
            peak: null,
            peakTime: "",
            phone: "",
            province: "",
            service: null,
            state: 0,
            tenantId: 0,
            tenantName: "",
            updated: "",
            usually: null,
            usuallyTime: "",
            valley: null,
            valleyTime: ""
        },
        list: [], //充点电列表
        addGroup: false,
        g: { //增加编辑充点桩
            addr: "",
            createId: 0,
            created: "",
            deleteState: 0,
            id: 0,
            machineCode: "",
            modelId: 0,
            name: "",
            number: "",
            position: "",
            remark: "",
            state: 0,
            stationId: null,
            stationNumber: "",
            tenantId: null,
            totalElectricity: null,
            totalUse: null,
            updated: ""
        },
        pileLists: { //电桩列表
            charging: null,
            disable: null,
            fault: null,
            free: null,
            lock: null,
            notConnect: null,
            occupy: null,
            pileList: [{
                addr: "",
                createId: null,
                created: "",
                current: "",
                deleteState: null,
                id: null,
                machineCode: "",
                modelId: null,
                modelNumber: "",
                name: "",
                number: "",
                pileType: null,
                position: "",
                power: "",
                remark: "",
                state: null,
                stationId: null,
                stationNumber: "",
                status: null,
                tenantId: null,
                totalElectricity: null,
                totalUse: null,
                updated: "",
                voltage: ""
            }],
            "total": 0
        },
        xsShow: "",
        styShow: "",
        onChargeInfo: {

        },
        modelList: []
    },
    methods: {
        //获取充电点列表
        stationList: function () {
            var tId = 0;
            if (this.tenantId) {
                tId = this.tenantId;
            }
            var url = baseURL + "charge/station/list"
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json",
                data: JSON.stringify({
                    tenantId: tId
                }),
                success: function (r) {
                    if (r.code === 0) {
                        vm.list = r.list;
                        if (r.list[0].id != undefined) {
                            vm.stationId = r.list[0].id;
                            vm.g.stationId = r.list[0].id;
                        }
                        if (vm.stationId == null) {
                            return;
                        }
                        vm.searchPile(); //获取桩列表
                        vm.modelLists(); //获取型号

                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        //获取充点桩列表
        searchPile: function () {
            var url = "charge/pile/list"
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify({
                    stationId: vm.stationId,
                    number: vm.pileNumber,
                    modelId: vm.pilemodelId,
                    groupId: vm.pilegroupId,
                    status: vm.statCtner[vm.stationId]
                }),
                success: function (r) {
                    if (r.code === 0) {
                        vm
                        vm.pileLists = r.info;

                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        //增加充点电
        addStations: function () {
            this.q = {
                address: "",
                area: "",
                city: "",
                createId: 0,
                createName: "",
                created: "",
                deleteState: 0,
                extraCharge: 0,
                id: 0,
                latitude: 0,
                longitude: 0,
                maintainer: "",
                name: "",
                number: "",
                parking: 0,
                peak: null,
                peakTime: "",
                phone: "",
                province: "",
                service: null,
                state: 0,
                tenantId: this.tenantId,
                tenantName: "",
                updated: "",
                usually: null,
                usuallyTime: "",
                valley: null,
                valleyTime: ""
            }
            this.addStation = true;
        },
        //编辑充点电
        upDate: function (item) {
            this.addStation = true;
            this.q = item;
        },
        //增加或者编辑
        saveOrUpdate: function () {
            if (vm.q.state === 0) {
                vm.q.state = 1;
            } else if (vm.q.state === true) {
                vm.q.state = 2;
            }
            var url = vm.q.number == "" ? "charge/station/save" : "charge/station/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.q),
                beforeSend: function () {
                    window.load();
                },
                success: function (r) {
                    if (r.code === 0) {
                        close();
                        alert('操作成功', function (index) {
                            vm.addStation = false;
                            vm.stationList();
                        });
                    } else {
                        close();
                        alert(r.msg);
                    }
                }
            });
        },
        //充点电切换
        selected: function (index, item) {
            this.activeName = index;
            this.stationId = item.id;
            this.g.stationId = item.id;
            this.searchPile(); //获取充电桩列表
            this.modelLists(); //型号切换
            //this.currentBt=null;
        },
        //删除充电点
        del: function (index, item) {
            confirm("确认删除", function () {
                var ids = [item.id];
                vm.list.splice(index, 1);
                var url = "charge/station/delete";
                $.ajax({
                    type: "POST",
                    url: baseURL + url,
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    beforeSend: function () {
                        window.load();
                    },
                    success: function (r) {
                        if (r.code === 0) {
                            close();
                            alert('操作成功', function (index) {
                                vm.stationId = null;
                                vm.g.stationId = null;
                            });
                        } else {
                            close();
                            alert(r.msg);
                        }
                    }
                });
            })
        },
        //修改费率
        upDateRate: function (item) {
            var url = "charge/station/updateRate";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(item.id),
                beforeSend: function () {
                    window.load();
                },
                success: function (r) {
                    if (r.code === 0) {
                        close();
                        alert('操作成功', function (index) {
                            vm.stationList();
                        });
                    } else {
                        close();
                        alert(r.msg);
                    }
                }
            });
        },
        //后退关闭蒙层1
        closeModel1: function () {
            this.addStation = false;
        },
        //增加充电桩
        addGroups: function () {
            this.g = {
                addr: "",
                createId: 0,
                created: "",
                deleteState: 0,
                id: 0,
                machineCode: "",
                modelId: 0,
                name: "",
                number: "",
                position: "",
                remark: "",
                state: 0,
                stationId: vm.stationId,
                stationNumber: "",
                tenantId: this.tenantId,
                totalElectricity: null,
                totalUse: null,
                updated: ""
            }
            this.addGroup = true;
        },
        //后退关闭蒙层2
        closeModel2: function () {
            this.addGroup = false;
        },
        //增加或者编辑
        saveOrUpdateGroup: function () {
            var url = vm.g.number == "" ? "charge/pile/save" : "charge/pile/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.g),
                beforeSend: function () {
                    window.load();
                },
                success: function (r) {
                    if (r.code === 0) {
                        close();
                        alert('操作成功', function (index) {
                            vm.addGroup = false;
                            vm.searchPile();
                        });
                    } else {
                        close();
                        alert(r.msg);
                    }
                }
            });
        },
        toggleShow: function (index, item) {
            this.styShow = index;
            if (item.status == 2) {
                this.xsShow = index;
                var url = "charge/pile/onChargeInfo";
                var that = this;
                $.ajax({
                    type: "POST",
                    url: baseURL + url,
                    contentType: "application/json",
                    data: JSON.stringify(item.id),
                    success: function (r) {
                        if (r.code === 0) {
                            that.onChargeInfo = r.info;
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            }
        },
        toggleHide: function (index, item) {
            this.xsShow = false;
        },
        goDetail: function (item) {
            window.location = "./pileDetail.html?id=" + item.id + "&stationId=" + vm.stationId + "&tenantId=" + vm.tenantId;
        },
        //获取型号
        modelLists: function () {
            var url = "charge/model/listAll";
            $.ajax({
                type: "GET",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.stationId),
                success: function (r) {
                    vm.modelList = r;
                }
            });
        },
        changeStatus: function (e) {
            if (this.btCtner[this.stationId] == e.currentTarget) {
                return
            }

            if (this.btCtner[this.stationId] == null) {
                e.currentTarget.parentNode.children[0].style.border = "1px solid #ccc";
            } else
                this.btCtner[this.stationId].style.border = "1px solid #ccc";

            e.currentTarget.style.border = "1px solid blue";
            this.btCtner[this.stationId] = e.currentTarget;
            switch (e.currentTarget.id) {
                case "status":
                    this.status = -1
                    break;
                case "status0":
                    this.status = 0
                    break;
                case 'status1':
                    this.status = 1
                    break;
                case 'status2':
                    this.status = 2
                    break;
                case 'status3':
                    this.status = 3
                    break;
                case 'status4':
                    this.status = 4
                    break;
                case 'status5':
                    this.status = 5
                    break;
                case 'status6':
                    this.status = 6
                    break;
            }
            this.statCtner[this.stationId] = this.status;
            this.searchPile();
        },
        //启用
        enable: function (item) {
            var url = "charge/station/enable";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(item.id),
                beforeSend: function () {
                    window.load();
                },
                success: function (r) {
                    if (r.code === 0) {
                        close();
                        alert('操作成功', function (index) {
                            vm.stationList();
                        });
                    } else {
                        close();
                        alert(r.msg);
                    }
                }
            });
        },
        //停用
        disable: function (item) {
            var url = "charge/station/disable";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(item.id),
                beforeSend: function () {
                    window.load();
                },
                success: function (r) {
                    if (r.code === 0) {
                        close();
                        alert('操作成功', function (index) {
                            vm.stationList();
                        });
                    } else {
                        close();
                        alert(r.msg);
                    }
                }
            });
        },
        packUp: function () {
            this.activeName = null;
            this.$refs.pack.style.background = "#ccc";
            this.$refs.down.style.background = "rgba(26, 188, 156, 1)";
            this.$refs.pack.disabled = true;
            this.$refs.down.disabled = false;
        },
        packDown: function () {
            this.activeName = 0;
            this.$refs.down.style.background = "#ccc";
            this.$refs.pack.style.background = "rgba(26, 188, 156, 1)";
            this.$refs.down.disabled = true;
            this.$refs.pack.disabled = false;
        }
    },
    created: function () {
        //         setTimeout(function(){
        //            vm.searchPile();//获取桩列表
        //            vm.modelLists();//获取型号
    },
    mounted() {},
    filters: {
        toImg: function (value) {
            switch (value) {
                case 0:
                    return "../../statics/images/电桩绿.png"
                    break;
                case 1:
                    return "../../statics/images/电桩红.png"
                    break;
                case 2:
                    return "../../statics/images/电桩蓝.png" //正在充电
                    break;
                case 3:
                    return "../../statics/images/电桩禁用.png"
                    break;
                case 4:
                    return "../../statics/images/电桩故障.png"
                    break;
                case 5:
                    return "../../statics/images/电桩黄.png"
                    break;
                case 6:
                    return "../../statics/images/电桩未连接.png"
                    break;
            }
        },
        returnFloat: function (value) {
            var value = Math.round(parseFloat(value) * 100) / 100;
            var xsd = value.toString().split(".");
            if (xsd.length == 1) {
                value = value.toString() + ".00";
                return value;
            }
            if (xsd.length > 1) {
                if (xsd[1].length < 2) {
                    value = value.toString() + "0";
                }
                return value;
            }
        },
        ifUsing: function (value) {
            if (value == 1) {
                return "启用"
            } else if (value == 2) {
                return "停用"
            }
        }
    }
})
