<template>
  <div class="demo">
    <div class="flex-two">
      <div class="flex-item ">
        <i style="margin-right:10px;"><img :src="aboutData.tenantLogo" alt="" class="wallet"></i>{{aboutData.tenantName}}
      </div>
      <div class="flex-item">
        <a :href="'tel:'+aboutData.tenantPhone">
          <img src="../assets/phone.png" alt="" class="wallet">
        </a>
      </div>
    </div>
    <div class="flex-start" style="border:1px solid #eee;">
      <span style="margin-right:10px;">
        <img src="../assets/chongdianz.png" alt="" class="chongdian">
      </span>
      <span>
        <div class="font-32 font-w">
          {{aboutData.name}}
        </div>
        <div class="font-26 tips" style="margin:5px 0">
          {{ifBusy}}
        </div>
        <div class="font-26" v-if="aboutData.pileType==1">
          · 直流桩
        </div>
        <div class="font-26" v-else>
          · 交流桩
        </div>
        <div class="font-26">
          · 最大功率 {{aboutData.power}}kw
        </div>
      </span>
    </div>
    <div class="flex-g">
      <div class="font-28">峰时</div>
      <div class="font-24 middle-wi">{{aboutData.peakTime}}</div>
      <div class="flex-item font-24">
        {{aboutData.peakPrice|returnFloat}}元/度
      </div>
    </div>
    <div class="flex-g">
      <div class="font-28">平时</div>
      <div class="font-24 middle-wi">{{aboutData.usuallyTime}}</div>
      <div class="flex-item font-24">
        {{aboutData.usuallyPrice|returnFloat}}元/度
      </div>
    </div>
    <div class="flex-g">
      <div class="font-28">谷时</div>
      <div class="font-24 middle-wi">{{aboutData.valleyTime}}</div>
      <div class="flex-item font-24">
        {{aboutData.valleyPrice|returnFloat}}元/度
      </div>
    </div>
    <div class="flex-twos" style="margin-bottom:10px;">
      <div class="flex-item ">
        <div class="font-28">服务费</div>
      </div>
      <div class="flex-item font-24">
        {{aboutData.service|returnFloat}}元/度
      </div>
    </div>
    <!-- 底部 -->
    <div class="flex-center">
      <div>
        <div class="circle" :class="{ grayBack: grayBack }" @click="gologin()">
          <div :class="{status1:status1}">{{text}}</div>
          <img src="../assets/chatou.png" alt="" class="chatou" v-if="aboutData.hasLogin==true && aboutData.chargingCount==0 && aboutData.status==0">
        </div>
        <div class="font-24" v-show="aboutData.hasLogin==true">余额
          <span>{{aboutData.available|returnFloat}}</span>
        </div>
        <div class="color-red" v-show="aboutData.hasLogin==true" @click="goCharging()">立即充值></div>
      </div>
    </div>
    <div class="bottom2" v-if="aboutData.hasLogin==true && aboutData.chargingCount!=0">
      <div>
        您已有一个正在充电的订单
      </div>
      <div @click="checkOrder()">
        查看
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      aboutData: {
        peakPrice:0,
        usuallyPrice:0,
        valleyPrice:0,
        service:0
      },
      grayBack: false,
      status1: "",
      text: "开始充电",
      ifBusy: "空闲",
      status1: false
    };
  },
  methods: {
    getApi() {
      var addr = this.$route.query.addr;
      this.$http
        .post("/api/charging/info", {
          addr: addr
        })
        .then(
          function(res) {
            if (res.data.code == 0) {
              this.aboutData = res.data.info;
              //  业务逻辑
              if (
                this.aboutData.tenantLogo == "" ||
                this.aboutData.tenantLogo == null
              ) {
                this.aboutData.tenantLogo = "../static/recharge_logo.png";
              }
              switch (this.aboutData.status) {
                case 0:
                  this.ifBusy = "空闲";
                  window.intervalid2 = setInterval(this.getApi, 1000);
                  break;
                case 1:
                  this.ifBusy = "已插枪"; //已经插枪
                  break;
                case 2:
                  this.ifBusy = "充电中";
                  break;
                case 3:
                  this.ifBusy = "禁用";
                  break;
                case 4:
                  this.ifBusy = "故障";
                  break;
                case 5:
                  this.ifBusy = "锁定";
                  break;
                case 6:
                  this.ifBusy = "未连接";
                  break;
              }
              //开始判断
              if (this.aboutData.hasAuthorize == false) {
                this.text = "请先授权登陆";
                return false;
              } else {
                if (this.aboutData.chargingCount != 0) {
                  if(this.aboutData.chargingAddr==addr){
                     location.href = "/api/chargingView";
                  }
                  this.grayBack = true;
                } else {
                  if (this.aboutData.status == 0) {
                    this.text = "请插枪"; //已经登录却没插枪
                    this.status1 = true;
                  }
                  if (this.aboutData.status == 1) {
                    if (this.aboutData.hasLogin == false) {
                      this.text = "登录后充电";
                    } else {
                      this.text = "开始充电"; //已经登录也插枪了
                    }
                  }
                  if (
                    this.aboutData.status == 2 ||
                    this.aboutData.status == 3 ||
                    this.aboutData.status == 4 ||
                    this.aboutData.status == 5 ||
                    this.aboutData.status == 6
                  ) {
                    this.grayBack = true;
                  }
                }
              }
            } else {
              this.$msgbox(res.data.msg);
            }
          }.bind(this)
        )
        .catch(function(err) {
          console.log(err);
        });
    },
    gologin() {
      var addr = this.$route.query.addr;
      if (this.aboutData.chargingCount == 0) {
        if (this.aboutData.status == 1) {
          if (this.aboutData.hasLogin == false) {
            location.href =
              "/api/login?state=http://cp.gtcx-tech.com/api/scanCharge?addr=" +
              addr;
          } else {
            var addr = this.$route.query.addr;
            this.$http
              .post("api/charging/start", {
                addr: addr
              })
              .then(
                function(res) {
                  if (res.data.code == 0) {
                    location.href = "/api/chargingView?flag=true";
                  } else {
                    this.$msgbox(res.data.msg);
                  }
                }.bind(this)
              )
              .catch(function(err) {
                console.log(err);
              });
          }
        }
      }
    },
    goCharging(){
       this.$router.push({
        name: "charging" 
      });
    },
    checkOrder(){
      this.$router.push({
        name: "redCharging" 
      });
    }
  },
  created() {
    document.title = "扫码充电";
    this.getApi();
  },
  beforeDestroy() {
    clearInterval(intervalid2);
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

<style lang="less" rel="stylesheet/less">
ul,
li {
  list-style: none;
}
.demo {
  background: #f2f2f2;
}
.flex-two {
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  font-size: 0.37rem;
  margin-bottom: 10px;
  background: #fff;
  height: 1.33rem;
  line-height: 1.33rem;
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
.date {
  line-height: 1.86rem;
}
.kwh {
  font-size: 24/75rem;
  color: #999;
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
  padding: 10px 0 10px 10px;
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
}
.font-26 {
  font-size: 26/75rem;
  color: #f8a631;
}
.font-w {
  font-weight: 600;
}
.tips {
  width: 80/75rem;
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

.bottom2 {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  font-size: 0.37rem;
  height: 1.33rem;
  line-height: 90/75rem;
  height: 90/75rem;
  background: #4582ff;
  color: #fff;
  box-sizing: border-box;
}
.color-red {
  font-size: 28/75rem;
  color: #e01a1a;
  margin: 5px 0;
}
.circle {
  width: 250/75rem;
  height: 250/75rem;
  line-height: 250/75rem;
  background: #5b9eff;
  border-radius: 125/75rem;
  color: #fff;
  font-size: 32/75rem;
  font-weight: 600;
  margin: 20px 0;
  position: relative;
  text-align: center;
}
.grayBack {
  background: #d6d6d6;
}
.chatou {
  position: absolute;
  left: 70/75rem;
  width: 108/75rem;
  animation: updown 1s infinite linear;
}
@keyframes updown {
  0% {
    top: 50px;
  }
  50% {
    top: 70px;
  }
  100% {
    top: 50px;
  }
}

.status1 {
  position: absolute;
  top: -30px;
  width: 100%;
}
.speci-w {
  height: auto;
  line-height: 0.7rem;
}
.speic-inner {
  display: inline-block;
  width: 70/75rem;
}
.speic-inner2 {
  display: inline-block;
  width: 78/75rem;
}
.flex-starts {
  display: flex;
  justify-content: flex-start;
}
.flex-g {
  display: flex;
  justify-content: space-between;
  padding: 2px 30px;
  font-size: 0.37rem;
  background: #fff;
}
.middle-wi {
  width: 6rem;
}
</style>
