var vm = new Vue({
    el: '#rrapp',
    data: {
        chargeDetail: {
            addr: "",
            createId: 0,
            created: "",
            current: "",
            deleteState: 0,
            groups: "",
            id: 0,
            machineCode: "",
            modelId: 0,
            modelNumber: "",
            name: "",
            number: "",
            pileType: 0,
            position: "",
            power: "",
            remark: "",
            state: 0,
            stationId: 0,
            stationNumber: "",
            status: 0,
            tenantId: 0,
            totalElectricity: 0,
            totalUse: 0,
            updated: "",
            voltage: "",
            peak: '',
            usually: "",
            valley: "",
            parking: "",
            extraCharge: ""
        },
        onChargeInfo: {

        }
    },
    methods: {
        goBack() {
            history.go(-1);
        },
        chargeDetails() {
            var url = "charge/pile/infoDetail"
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(16),
                success: function (r) {
                    if (r.code === 0) {
                        vm.chargeDetail = r.info;
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        onchargeInfos() {
            var url = "charge/pile/onChargeInfo";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(16),
                success: function (r) {
                    if (r.code === 0) {
                        console.log(r)
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        wechatStart(){
            var url = "charge/pile/wechatStart";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(16),
                success: function (r) {
                    if (r.code === 0) {
                        console.log(r)
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        wechatStop(){
            var url = "charge/pile/wechatStop";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(16),
                success: function (r) {
                    if (r.code === 0) {
                        console.log(r)
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        enable(){
            var url = "charge/pile/enable";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(16),
                success: function (r) {
                    if (r.code === 0) {
                        console.log(r)
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        disable(){
            var url = "charge/pile/disable";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(16),
                success: function (r) {
                    if (r.code === 0) {
                        console.log(r)
                    } else {
                        alert(r.msg);
                    }
                }
            }); 
        },
        update(){
            var url = "charge/pile/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(16),
                success: function (r) {
                    if (r.code === 0) {
                        console.log(r)
                    } else {
                        alert(r.msg);
                    }
                }
            }); 
        },
        test(){
            var url = "charge/pile/test";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(16),
                success: function (r) {
                    if (r.code === 0) {
                        console.log(r)
                    } else {
                        alert(r.msg);
                    }
                }
            }); 
        },
        delete(){
            var url = "charge/pile/delete";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(16),
                success: function (r) {
                    if (r.code === 0) {
                        console.log(r)
                    } else {
                        alert(r.msg);
                    }
                }
            });  
        }
    },
    created() {
        this.chargeDetails();
        setInterval(() => {
            this.onchargeInfos();
        }, 1000);
    }
})