<template>
  <div class="wrap-detail">
    <div class="demo">
      <div class="flex-start bottom-dashed">
        <span style="margin-right:10px;">
          <img :src="aboutData.tenantLogo" alt="" class="chongdian">
        </span>
        <span>
          <div class="font-32">
           {{ aboutData.tenantName}}
          </div>
          <div class="kwh">
            订单号：{{aboutData.number}}
          </div>
          <div class="kwh">
            时间:{{aboutData.created}}
          </div>
        </span>
      </div>
      <div class="flex-twos">
        <div class="flex-item ">
          <i class="icons"><img src="../assets/charging.png" alt=""></i>
          <span class="font-28">电桩</span>
        </div>
        <div class="flex-item font-28 color-3 font-w">
          {{aboutData.stationName}}-{{aboutData.pileName}}
        </div>
      </div>
      <div class="flex-twos">
        <div class="flex-item ">
          <i class="icons speci"><img src="../assets/battarying.png" alt=""></i>
          <span class="font-28">用电量</span>
        </div>
        <div class="flex-item font-28 color-3 font-w">
          {{ aboutData.electricity|returnFloat}}度
        </div>
      </div>
      <div class="flex-twos">
        <div class="flex-item ">
          <i class="icons"><img src="../assets/timing.png" alt=""></i>
          <span class="font-28">充电时长</span>
        </div>
        <div class="flex-item font-28 color-3 font-w">
          {{ aboutData.duration}}分钟
        </div>
      </div>
      <div class="flex-twos">
        <div class="flex-item ">
          <i class="icons"><img src="../assets/moneying.png" alt=""></i>
          <span class="font-28">消费金额</span>
        </div>
        <div class="flex-item font-28 color-blue">
          ￥{{aboutData.consume|returnFloat}}
        </div>
      </div>
      <div class="flex-center" style="padding-bottom:20px;">
        <div class="line">
          <div class="font-24 text">
            明细
          </div>
        </div>
      </div>
      <div style="background:#fff;padding:15px;">
        <div class="flex-two-f back-f9">
        
           <div class="font-24">
            峰电量：{{aboutData.peakEle|returnFloat}}
          </div>
          <div>
            <div class="font-24">
              结束电池电量：{{aboutData.carElectricity}}%
            </div>
          </div>
        </div>
        <div class="flex-two-f back-f9">
          <div class="font-24">
            平电量：{{aboutData.usuallyEle|returnFloat}}
          </div>
            <div class="font-24">
            开始电池电量：{{aboutData.startElectricity}}%
          </div>
        </div>
        <div class="flex-two-f back-f9">
          <div class="font-24">
            谷电量：{{aboutData.valleyEle|returnFloat}}
          </div>
        </div>
      </div>

      <div class="flex-two-f">
        <div>
          <div class="font-24 color-3">
            电费
          </div>
          <div class="font-24">
            峰电费
          </div>
          <div class="font-24">
            平电费
          </div>
          <div class="font-24">
            谷电费
          </div>
          <div class="font-24 color-3">
            服务费
          </div>
        </div>
        <div>
          <div class="font-24 color-3">￥{{aboutData.totalPrice|returnFloat}}</div>
          <div class="font-24">￥{{aboutData.peakPrice|returnFloat}}</div>
          <div class="font-24">￥{{aboutData.usuallyPrice|returnFloat}}</div>
          <div class="font-24">￥{{aboutData.valleyPrice|returnFloat}}</div>
          <div class="font-24 color-3">￥{{aboutData.service|returnFloat}}</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div>
        余额：{{aboutData.available|returnFloat}}元
      </div>
      <div class="flex-align">
        <x-button type="primary" action-type="button" style="border-radius:99px;background:#fff;color:#4582FF;font-size:0.32rem;" @click.native="login()">立即充值</x-button>
      </div>
    </div>
  </div>

</template>

<script>
import { Group, Cell, CellBox, XButton } from "vux";

export default {
  components: {
    Group,
    Cell,
    XButton
  },
  data() {
    return {
      aboutData: {
        electricity:0,
        peakEle:0,
        usuallyEle:0,
        valleyEle:0,
        totalPrice:0,
        peakPrice:0,
        usuallyPrice:0,
        valleyPrice:0,
        service:0,
        available:0,
        consume:0
      }
    };
  },
  methods: {
    login() {
      this.$router.push({
        name: "charging"
      });
    },
    getApi() {
      var orderId = this.$route.query.orderId;
      this.$http
        .post("/api/charging/detail", {
          orderId: orderId
        })
        .then(
          function(res) {
            if (res.data.code == 0) {
              this.aboutData = res.data.info;
              if (
                this.aboutData.tenantLogo == "" ||
                this.aboutData.tenantLogo == null
              ) {
                this.aboutData.tenantLogo = "../static/recharge_logo.png";
              }
            } else {
              this.$msgbox(res.data.msg);
            }
          }.bind(this)
        )
        .catch(function(err) {
          console.log(err);
        });
    }
  },
  created() {
    this.getApi();
    document.title="充电详情";
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
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
ul,
li {
  list-style: none;
}
.demo {
  background: #f2f2f2;
  padding: 30/75rem;
}
.flex-align {
  display: flex;
  align-items: center;
}
.flex-two-f {
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  font-size: 0.37rem;
  background: #fff;
}
.flex-twos {
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  font-size: 0.37rem;
  height: 1rem;
  line-height: 1rem;
  background: #fff;
}
.flex-group {
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  font-size: 0.37rem;
  // height: 1.86rem;
  border-bottom: 1px solid #eee;
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
  width: 128/75rem;
  height: 128/75rem;
}
.font-32 {
  font-size: 32/75rem;
}
.font-28 {
  font-size: 28/75rem;
}
.font-24 {
  font-size: 24/75rem;
  color: #999;
  margin-bottom: 5px;
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
  position: absolute;
  display: flex;
  justify-content: space-between;
  // width: calc(100% - 60px);
  padding: 0 30px;
  width: 100%;
  font-size: 0.37rem;
  line-height: 90/75rem;
  height: 90/75rem;
  background: #4582ff;
  color: #fff;
  bottom: 0;
  box-sizing: border-box;
}
.color-red {
  font-size: 28/75rem;
  color: #e01a1a;
  margin: 5px 0;
}
.color-6 {
  color: #666;
}
.color-3 {
  color: #333;
}
.color-blue {
  color: #4582ff;
}
.bottom-dashed {
  border-bottom: 1px dashed #ccc;
}
.icons {
  display: inline-block;
  width: 28/75rem;
  height: 28/75rem;
  margin-right: 4px;
}
.icons img {
  width: 100%;
  height: 100%;
}
.line {
  width: 400/75rem;
  height: 1px;
  background: #aaa;
  position: relative;
  top: 10px;
}
.text {
  position: absolute;
  display: inline-block;
  width: 60/75rem;
  height: 30/75rem;
  background: #fff;
  top: -15/75rem;
  left: 175/75rem;
}
.back-f9 {
  background: #f9f9f9;
  padding: 0 5px;
}
.speci {
  height: 16.5/75rem;
}
.flex-start {
  display: flex;
  justify-content: flex-start;
  background: #fff;
  padding: 10px 0 10px 10px;
}
</style>
