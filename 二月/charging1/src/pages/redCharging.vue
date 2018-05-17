<template>
  <div class="demo" >
      <div class="flex-two-red">
        <div>
          <i style="margin-right:10px;"><img :src="aboutData.tenantLogo" alt="" class="wallet"></i>{{aboutData.tenantName}}
        </div>
        <div>
          <a :href="'tel:'+aboutData.tenantPhone">
            <img src="../assets/phone.png" alt="" class="wallet">
          </a>
        </div>
      </div>
      <div class="flex-center">
        <div>
          <div class="font-32" style="padding-top:10px;">{{aboutData.name}}</div>
          <water v-if="aboutData.carElectricity!=null" :cardata="aboutData.carElectricity"></water>
          <div class="font-24">{{aboutData.currTime}}更新</div>
        </div>
      </div>
      <div class="flex-group">
        <div class="flex-item">
          <div class="font-38 color-blue">{{aboutData.electricity|returnFloat}}</div>
          <div>
            <i class="icon"><img src="../assets/battary.png" alt=""></i>用电量</div>
        </div>
        <div class="flex-item">
          <div class="font-38 color-blue">{{aboutData.duration}}</div>
          <div>
            <i class="icon"><img src="../assets/时间.png" alt=""></i>充电时间</div>
        </div>
        <div class="flex-item">
          <div class="font-38 color-blue">{{aboutData.consume|returnFloat}}</div>
          <div>
            <i class="icon"><img src="../assets/金额.png" alt=""></i>消费金额</div>
        </div>
      </div>
      <div class="flex-group" style="margin-bottom:1px;">
        <div class="flex-item" style="border-bottom:0;">
          <div class="font-32">{{aboutData.feeType|returnFeeType}}</div>
          <div>
            <i class="icon"><img src="../assets/shiduan.png" alt=""></i>当前时段</div>
        </div>
        <div class="flex-item" style="border-bottom:0;">
          <div class="font-32">{{aboutData.fee|returnFloat}}</div>
          <div>
            <i class="icon"><img src="../assets/dianjia.png" alt=""></i>电价(元/度)</div>
        </div>
        <div class="flex-item" style="border-bottom:0;">
          <div class="font-32">{{aboutData.available|returnFloat}}</div>
          <div>
            <i class="icon"><img src="../assets/zhanghuyue .png" alt=""></i>账户余额</div>
        </div>
      </div>
      <div class="bottom-radius">
        <div id="bottom-red" ref="endButton">
          <x-button type="primary"  action-type="button" :disabled="end" style="border-radius:99px;background:#4582ff;" @click.native="endCharge()">{{endChargeText}}</x-button>
        </div>
      </div>

    <div class="popup" v-show="exit">
      <div class="content">
        <div style="padding:30px;">
          <div class="flex-center" style="padding-top:150px;">
            <img src="../assets/chongzhishibai.png" height="118" width="118" alt="">
          </div>
          <div style="text-align:center;padding-top:30px;">
            您没有正在充电的订单
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Group, Cell, CellBox, XButton } from "vux";
import water from "@/components/water";
export default {
  components: {
    Group,
    Cell,
    XButton,
    water
  },
  data() {
    return {
      aboutData: {
        carElectricity: 0,
        electricity: 0,
        duration: 0,
        consume: 0,
        feeType: 0,
        fee: 0,
        available: 0,
        name:"",
        tenantName:""
      },
      addr: "",
      exit: false,
      isNotNull: false,
      number: null,
      noCharge: true,
      flag:null,
      endChargeText:"结束充电",
      end:false
    };
  },
  methods: {
    getApi() {
      this.$http
        .post("/api/charging/charging")
        .then(
          function(res) {
            if (res.data.code == 0) {
              if (res.data.info != null) {
                this.isNotNull = true;
                this.aboutData = res.data.info;
                this.addr = res.data.info.addr;
                this.number = res.data.info.number;
                if (
                  this.aboutData.tenantLogo == "" ||
                  this.aboutData.tenantLogo == null
                ) {
                  this.aboutData.tenantLogo = "../static/recharge_logo.png";
                }
              }
              if (res.data.info == null && this.isNotNull == true) {
                var number = this.number;
                this.$router.push({
                  name: "chargingFinish",
                  query: { orderId: number }
                });
              }
              if (res.data.info == null) {
                this.exit = true;
              }else{
                  this.exit = false;
              }
            } else {
              this.$msgbox res.data.msg);
            }
          }.bind(this)
        )
        .catch(function(err) {
          console.log(err);
        });
    },
    endCharge() {
     if(this.flag == "true"){
        clearInterval(intervalid1);
      }else{
        clearInterval(intervalid2);
      }
      this.endChargeText="结束中..."
      this.end=true
      console.log(this.$refs.endButton.children)
      this.$refs.endButton.children[0].style.background="gray"
      var addr = this.addr;
      this.$http
        .post("/api/charging/end", {
          addr: addr
        })
        .then(
          function(res) {
            if (res.data.code == 0) {
              var number = res.data.number;
              this.$router.push({
                name: "chargingFinish",
                query: { orderId: number }
              });
            } else {
              this.$msgbox(res.data.msg);
            }
          }.bind(this)
        )
        .catch(function(err) {
          console.log(err);
        });
    },
    start() {
      this.flag = this.$route.query.flag;
      if (this.flag == "true") {
        setTimeout(() => {
          this.getApi();
        }, 2000);
        window.intervalid1 = setInterval(this.getApi, 10000);
      } else {
        this.getApi();
        window.intervalid2 = setInterval(this.getApi, 10000);
      }
    }
  },
  created() {
    document.title = "正在充电";
    this.start();
  },
  beforeDestroy() {
    if(this.flag == "true"){
       clearInterval(intervalid1);
    }else{
      clearInterval(intervalid2);
    }
  },
  filters: {
    returnFloat(value) {
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
    returnFeeType(value) {
      switch (value) {
        case 0:
          return "未知";
          break;
        case 1:
          return "峰时";
          break;
        case 2:
          return "平时";
          break;
        case 3:
          return "谷时";
          break;
      }
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
#myCanvas {
  width: 10rem;
  height: 300px;
}
ul,
li {
  list-style: none;
}
input[type="range"]::before {
  content: attr(min);
  color: #000;
  padding-right: 5px;
}
input[type="range"]::after {
  content: attr(max);
  color: #000;
  padding-left: 5px;
}
.demo {
  background: #f2f2f2;
}
.bottom-radius {
  background-image: url("../assets/bottom.png");
  background-size: 100% 100%;
}
.flex-two-red {
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  font-size: 0.37rem;
  height: 1.33rem;
  line-height: 1.33rem;
  background: #fff;
  margin-bottom: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
.flex-group {
  display: flex;
  // flex-wrap: wrap;
  // justify-content: space-between;
  padding: 0 40px;
  font-size: 0.37rem;
  background: #fff;
}
.flex-item {
  width: 200/75rem;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
  text-align: center;
  color: #999;
}
.flex-item:not(:last-child) {
  border-right: 1px solid #eee;
}
.date {
  line-height: 1.86rem;
}
.kwh {
  font-size: 24/75rem;
  color: #999;
}
.color-green {
  color: #02bd84;
  font-size: 32/75rem;
}
.flex-middel {
  padding: 20px 0;
}
.font-w {
  font-weight: 600;
}
.wallet {
  width: 60/75rem;
  height: 60/75rem;
  display: inline-block;
  vertical-align: middle;
}
.chongdian {
  display: inline-block;
  width: 180/75rem;
  height: 180/75rem;
}
.flex-start {
  display: flex;
  justify-content: flex-start;
  background: #fff;
  padding: 10px 0 20px 10px;
  border-bottom: 1px solid #eee;
}
.font-38 {
  font-size: 38/75rem;
  font-weight: 600;
  color: #666;
}
.font-32 {
  font-size: 32/75rem;
}
.font-24 {
  font-size: 24/75rem;
  color: #999;
}
.font-26 {
  font-size: 26/75rem;
  color: #f8a631;
}
.font-w {
  font-weight: 600;
}
.tips {
  display: inline-block;
  width: 80/75rem;
  height: 35/75rem;
  line-height: 35/75rem;
  background: #5b9eff;
  vertical-align: middle;
  font-size: 20/75rem;
  color: #fff;
  text-align: center;
  font-weight: normal;
  border-radius: 2px;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #fff;
}
.circle {
  width: 250/75rem;
  height: 250/75rem;
  line-height: 250/75rem;
  background: #5b9eff;
  border-radius: 125/75rem;
  color: #fff;
  font-size: 32/75rem;
  margin: 20px 0;
}
.bottom {
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  font-size: 0.37rem;
  height: 1.33rem;
  line-height: 90/75rem;
  height: 90/75rem;
  background: #4582ff;
  color: #fff;
}
.color-red {
  font-size: 28/75rem;
  color: #e01a1a;
  margin: 5px 0;
}
.color-blue {
  color: #4582ff;
}
.icon {
  display: inline-block;
  width: 24/75rem;
  height: 24/75rem;
  margin-right: 5px;
}
.icon img {
  width: 100%;
  height: 100%;
}
#bottom-red {
  padding: 0.5rem 220/75rem;
}
.popup {
  width: 10rem;
  height: 100%;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.content {
  width: 700/75rem;
  // height: 500/75rem;
  background: #fff;
  border-radius: 10px;
}
.content div {
  font-size: 30/75rem;
}
</style>