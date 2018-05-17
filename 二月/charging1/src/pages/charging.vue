<template>
  <div>
    <header class="charging-tip">
      <i class="alarm">
      <img  src="../assets/alarm.png"  alt="">
      </i>
       注：单笔金额须大于50元
    </header>
    <div class="flex-two-c">
      <div>充值金额</div>
      <div><span><input class="no-outline" type="number" v-model="money" @input="shows()" placeholder="请输入充值金额">元</span></div>
    </div>
    <div class="min-money">
        <!-- 单笔金额大于50元 -->
    </div>
    <ul class="flex-groups">
          <li class="flex-item" @click="selected(item)"
       :class="{active: activeName == item}" v-for="item in moneyArray" :key="item">
           充{{item}}
          </li>
    </ul>
     <div id="bottom">
       <button class="weui-btn weui-btn_default bac" @click="charge()" :class="{disabled:die}" :disabled="dis"> 
          立即充值
       </button>
      <x-button :disabled="dis" action-type="button" :class="bac"  @click.native="charge()" style="display:none">立即充值</x-button>
   </div> 
  </div>
</template>

<script>
import { Group,XInput,XButton,Cell,Alert} from 'vux'
export default {
   components: {
    XInput,
    Group,
    XButton,
    Cell,
    Alert
  },
  data () {
    return {
      moneyArray:[
        '100','300', '500','1000', '3000','5000'
      ],
      activeName: '',
      money:'',
      moneyShow:false,
      dis:true,
      bac:"",
      show: false,
      showC:false,
      die:true
    }
  },
  methods:{
    selected: function(item) {
      this.moneyShow=true;
      this.bac="bac";
      this.dis=false;      
      this.activeName = item;
      this.money=item;
      this.die=false;
    },
    shows(){
      this.bac="bac";
      this.dis=false;
      this.die=false;
      // if(this.money>=50){
      //    this.bac="bac";
      //    this.dis=false;    
      // }else{
      //    this.bac="";
      //    this.dis=true;
      // }
    },
    charge(){
       this.$http.post('/api/recharge/pay',{
         money:this.money
       })
      .then(function(res){
        if(res.data.code==0){
           this.weixinPay(res.data.weixin);
        }else{
          this.$msgbox(res.data.msg);
        }
      }.bind(this))
      .catch(function(err){
        console.log(err);
      });
    },
    onBridgeReady(data){
        var that=this;
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId":data.appid,     //公众号名称，由商户传入     
                "timeStamp":data.timeStamp,         //时间戳，自1970年以来的秒数     
                "nonceStr":data.nonceStr, //随机串     
                "package":"prepay_id="+data.prepayId,     
                "signType":data.signType,         //微信签名方式：     
                "paySign":data.paySign //微信签名 
            },
            function(res){     
                if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                    that.$router.push({name:'chargingResult'});
                }else{
                    that.$router.push({name:'chargingFail'});
                }
            }
        ); 
    },
   weixinPay(data){
        var vm= this;
        if (typeof WeixinJSBridge == "undefined"){//微信浏览器内置对象。参考微信官方文档
          if( document.addEventListener ){
            document.addEventListener('WeixinJSBridgeReady', vm.onBridgeReady(data), false);
          }else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', vm.onBridgeReady(data));
            document.attachEvent('onWeixinJSBridgeReady',vm.onBridgeReady(data));
          }
        }else{
          vm.onBridgeReady(data);
        }
      },
  },
   created() {
    document.title="充值";
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
   .charging-tip{
     height:80/75rem;
     line-height:80/75rem;
     background:#FFF5E0;
     font-size:0.4rem;
     color:#EBB24E;
     padding:0 30px;
   }
   .bac{
     background: #4582ff;
     border-radius: 99px;
     color:#fff;
   }
   .disabled{
     background: #ccc;
     border-radius: 99px;
     color:#fff;
   }
   .wrap{
    margin:0 30px;
    border-bottom:1px solid #eee;
   }
   .money-num{
    font-size:64/75rem;
   }
   .min-money{
     height: 20/75rem;
     line-height:20/75rem;
     background: #eee;
     margin-bottom: 16px;
     color: #bbb;
     font-size: 0.2rem;
     padding: 0 30px;
   }
   .color-9{
    color:#999;
    // font-size:/75rem;
    margin:20/75rem 0 50/75rem 0;
   }
   .flex-two-c{
      display: flex;
      justify-content: space-between;
      padding: 0 30px;
      font-size: 0.5rem;
      height: 1.33rem;
      line-height:1.33rem;
  }
  .font-w{
    font-weight:600;
  }
  ul,li{
  list-style:none;
}
  .flex-groups{
    display: flex;
    flex-wrap:wrap;
    justify-content: space-between;
    padding: 0 30px;
    font-size: 0.37rem;
    height: 1.86rem;
 }
 .flex-groups li{
   font-size: 16px;
 }
  .flex-item{
    width:200/75rem;
    height:160/75rem;
    border:1px solid #979797;
    border-radius:0.3rem;
    margin-bottom:10px;
    text-align:center;
    line-height:160/75rem;
  }
  .active{
    background-image:url('../assets/xuanze.png');
    background-size:43% 50%;
    background-repeat:no-repeat;
    background-position:right top;
    border:2px solid #4582ff;
  }
  #bottom{
    margin:200px 0 0 0;
    padding:0 120/75rem;
  }
  .alarm{
    display: inline-block;
    width: 23/75rem;
    margin-right: 5px;
    position: relative;
    top:1px;
  }
  .alarm img{
    width: 100%;
    height: 100%;
  }
  .no-outline{
    outline: none;
    border: 0px;
    height: 50/75rem;
    width: 300/75rem;
    font-size: 0.5rem;
    margin-right: 5px;
    text-align: right;
  }
</style>
