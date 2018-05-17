var vm = new Vue({
    el: '#rrapp',
    data: {
        records: {
            beginTime: "",
            customerPhone: "",
            endTime: "",
            limit: 10,
            number: "",
            page: 1,
            pileNumber: "",
            stationId: 40,
            tenantId: null
        },
        lists: []
    },
    methods: {
        goBack() {
            history.go(-1);
        },
        recordList() {
            var url = "charge/record/list"
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.records),
                success: function (r) {
                    if (r.code === 0) {
                        vm.lists = r.page.list;
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
    },
    created() {
        // this.recordList();
    }
})