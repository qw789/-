<template>
  <div>
    <div class="flex-center">
      <div class="flex-item">
        <img :src="aboutData.logoPath" height="118" width="118" alt="" class="icons-img">
        <div class="charging-success">{{aboutData.name}}</div>
        <div class="phone">{{aboutData.phone}}</div>
      </div>
    </div>
    <div class="bottoms">
      <div class="charging">
        <div class="flex-le">
          <div class="wrap-img" style="display:flex;align-items: center;"><img src="../assets/钱包.png" class="wallet"></div>
          <div class="wrap-img">
            <div class="color-3">{{aboutData.balance|returnFloat}}</div>
            <div class="color-9">余额(元)</div>
          </div>
        </div>
        <div>
          <x-button plain style="border-radius:99px;color:#4582ff;border:1px solid #4582ff;width:120px;font-size:16px;" @click.native="goCharging">立即充值</x-button>
        </div>
      </div>
      <div class="charging">
        <div class="flex-le">
          <div class="wrap-img" style="display:flex;align-items: center;"><img src="../assets/次数.png" class="wallet"></div>
          <div class="wrap-img">
            <div class="color-3">{{aboutData.rechargeCount}}</div>
            <div class="color-9">充电次数</div>
          </div>
        </div>
        <div class="flex-le">
          <div class="wrap-img" style="display:flex;align-items: center;"><img src="../assets/累计.png" class="wallet"></div>
          <div class="wrap-img">
            <div class="color-3">{{aboutData.consume|returnFloat}}</div>
            <div class="color-9">累计充电(度)</div>
          </div>
        </div>
      </div>
      <div class="charging" style="margin:0;border-bottom:1px solid #eee;" @click="gochargeMoney()">
        <div class="flex-le xx">
          <div class="wrap-img" style="display:flex;align-items: center;margin-right:10px;">
            <img src="../assets/充值记录.png" class="wallet">
          </div>
          <div>
            <div class="color-3 font-28">充值记录</div>
          </div>
        </div>
        <div class="flex-le">
          <i><img src="../assets/right.png" alt="" class="wallet"></i>
        </div>
      </div>
      <!-- <div class="charging">
        <div class="flex-le xx">
          <div style="margin-right:10px;"><img src="../assets/love.png" class="wallet"></div>
          <div>
            <div class="color-3 font-28">我的收藏</div>
          </div>
        </div>
        <div class="flex-le">
          <i><img src="../assets/right.png" alt="" class="wallet"></i>
        </div>
      </div> -->
      <div class="exit" @click="exit=true">
        退出登录
      </div>
    </div>
    <div class="popup" v-show="exit">
      <div class="content">
        <div style="padding:30px;">
          <div style="text-align:right" @click="exit=false"> <img src="../assets/Close.png" height="34" width="34" alt="" class="wallet dispear"></div>
          <div class="confirm">退出登录确认</div>
          <div style="text-align:center;" class="color-9"> 确定解绑微信？</div>
          <div @click="exit=false" style="padding:0 50px;">
            <x-button plain style="border-radius:99px;color:#02BD84;border:1px solid #02BD84;margin-top:30px;font-size:18px;" @click.native="logout()">确定</x-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XButton, Flexbox, FlexboxItem } from "vux";

export default {
  components: {
    XButton,
    Flexbox,
    FlexboxItem
  },
  data() {
    return {
      aboutData: {
        balance:0,
        consume:0
      },
      exit: false
    };
  },
  methods: {
    logout() {
      //登出
      this.$http
        .post("/api/user/logout")
        .then(
          function(res) {
            if (res.data.code == 0) {
              location.href = "/api/login";
            }
          }.bind(this)
        )
        .catch(function(err) {
          console.log(err);
        });
    },
    goCharging() {
      //充值
      
      this.$router.push({
        name: "charging" 
      });
    },
    gochargeMoney() {
      //充值记录
      this.$router.push({
        name: "chargeMoney"
      });
    },
    getApi() {
      var addr = this.$route.query.addr;
      this.$http
        .post("/api/user/info", {
          addr: addr
        })
        .then(
          function(res) {
            if (res.data.code == 0) {
              this.aboutData = res.data.info;
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
    document.title="个人中心"
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
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../assets/my_bg.png");
  background-size: 100% 100%;
  height: 376/75rem;
  color: #fff;
  text-align: center;
}
.phone {
  font-size: 24/75rem;
}
img {
  width: 118/75rem;
  height: 118/75rem;
}
.flex-item {
  width: 130/75rem;
  height: 100px;
}
.charging-success {
  font-size: 32/75rem;
}
.flex-group {
  padding: 0 30px;
}
.color-9 {
  color: #999;
  font-size: 28/75rem;
  text-align: center;
}
.color-3 {
  color: #333;
  font-size: 34/75rem;
  text-align: center;
}
.charging {
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  margin-bottom: 20px;
}
.flex-le {
  display: flex;
  justify-content: flex-start;
}
.wallet {
  width: 40/75rem;
  height: 40/75rem;
}
.wrap-img {
  padding: 30/75rem 10/75rem;
}
.bottoms {
  height: 100%;
  background: #f2f2f2;
}
.xx {
  align-items: center;
}
.font-28 {
  font-size: 28/75rem;
}
.exit {
  background: #fff;
  text-align: center;
  color: #02ba8c;
  font-size: 32/75rem;
  height: 88/75rem;
  line-height: 88/75rem;
}
.popup {
  width: 10rem;
  height:100%;
  background: rgba(0, 0, 0, .5);
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  width: 700/75rem;
  height: 400/75rem;
  background: #fff;
  border-radius: 10px;
  position: relative;
}
.dispear{
  position: absolute;
  top:20px;
  right: 20px;
}
.confirm{
  text-align: center;
  font-size: 18px;
  margin-bottom: 10px;
}
.icons-img{
  border-radius: 59px;
}
</style>
