<template>
  <div class="water">
    <canvas id="c" ref="cc">当前浏览器不支持canvas 请升级！</canvas>
    <input style="display:none" ref="dd" type="range" name="range" min="0" max="100">
    <div class="circles"></div>
  </div>
</template>

<script>

export default {
  methods:{
    draw(){
      var that=this;      
      var canvas = this.$refs.cc;
      var ctx  = canvas.getContext("2d");
      var oRange = this.$refs.dd
      var M = Math;
      var Sin = M.sin;
      var Cos = M.cos;
      var Sqrt = M.sqrt;
      var Pow = M.pow;
      var PI = M.PI;
      var Round = M.round;
      var oW = canvas.width = 230;
      var oH = canvas.height = 230;
      // 线宽
      var lineWidth = 2;
      // 大半径
      var r = (oW / 2);
      var cR = r - 10*lineWidth;
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      // 水波动画初始参数
      var axisLength = 2*r - 16*lineWidth;  // Sin 图形长度
      var unit = axisLength / 9; // 波浪宽
      var range = .4 // 浪幅
      var nowrange = range;  
      var xoffset = 8*lineWidth; // x 轴偏移量
      var data = ~~(oRange.value) / 100;   // 数据量
      var sp = 0; // 周期偏移量
      var nowdata = 0;
      var waveupsp = 0.006; // 水波上涨速度
      // 圆动画初始参数
      var arcStack = [];  // 圆栈
      var bR = r-8*lineWidth;
      var soffset = -(PI/2); // 圆动画起始位置
      var circleLock = true; // 起始动画锁
      // 获取圆动画轨迹点集
      for(var i = soffset; i< soffset + 2*PI; i+=1/(8*PI)) {
        arcStack.push([
          r + bR * Cos(i),
          r + bR * Sin(i)
        ])
      }
      // 圆起始点
      var cStartPoint = arcStack.shift();  
      ctx.strokeStyle = "#ccc";
      ctx.moveTo(cStartPoint[0],cStartPoint[1]);
      // 开始渲染
      render();  
      function drawSine () {
        ctx.beginPath();
        ctx.save();
        var Stack = []; // 记录起始点和终点坐标
        for (var i = xoffset; i<=xoffset + axisLength; i+=20/axisLength) {
          var x = sp + (xoffset + i) / unit;
          var y = Sin(x) * nowrange;
          var dx = i;
          var dy = 2*cR*(1-nowdata) + (r - cR) - (unit * y);
          ctx.lineTo(dx, dy);
          Stack.push([dx,dy])
        }
        // 获取初始点和结束点
        var startP = Stack[0]
        var endP = Stack[Stack.length - 1]
        ctx.lineTo(xoffset + axisLength,oW);
        ctx.lineTo(xoffset,oW);
        ctx.lineTo(startP[0], startP[1])
        ctx.fillStyle = "#fea78a";
        if(data>0.85){
          ctx.fillStyle = "#83acff";
        }
        ctx.fill();
        ctx.restore();
      }
      function drawText (ele) {
        ctx.globalCompositeOperation = 'source-over';
        var size = 0.4*cR;
        ctx.font =  size + 'px Microsoft Yahei';
        if(ele){
          var txt = ele;
        }else{
          var txt = (nowdata.toFixed(2)*100).toFixed(0) + '%';
        }
        var fonty = r + size/2;
        var fontx = r - size * 0.8;
        ctx.fillStyle = "#fff";
        ctx.textAlign = 'center';
        ctx.fillText(txt, r+5, r+20)
      }
      //背景色
      function grayCircle(){
        ctx.beginPath();
        ctx.arc(r, r, cR-5, 0, 2 * Math.PI);
        ctx.fillStyle = '#fe6432';
        if(data>0.85){
          ctx.fillStyle = '#4582FF ';
        }      
        ctx.fill();
        ctx.restore();
        ctx.beginPath();
      }
      
      //橘黄色进度圈
      function orangeCircle(){
        ctx.beginPath();
        ctx.strokeStyle = '#FF6432';
        //使用这个使圆环两端是圆弧形状
        ctx.lineCap = 'round';
        ctx.arc(r, r, cR-5,0 * (Math.PI / 180.0) - (Math.PI / 2),(nowdata * 360) * (Math.PI / 180.0) - (Math.PI / 2));
        ctx.stroke();
        ctx.save()
      }
      //裁剪中间水圈
      function clipCircle(){
        ctx.beginPath();
        ctx.arc(r, r, cR-10, 0, 2 * Math.PI,false);
        ctx.clip();
      }
      //渲染canvas
      function render () {
        ctx.clearRect(0,0,oW,oH);
        //裁剪中间水圈  
        clipCircle();
        //背景色
        grayCircle();
        //这里加上是为了去除毛边
        orangeCircle();
         data=that.cardata;

        if (data >= 0.85) {
          if (nowrange > range/4) {
            var t = range * 0.01;
            nowrange -= t;   
          }
        } else if (data <= 0.1) {
          if (nowrange < range*1.5) {
            var t = range * 0.01;
            nowrange += t;   
          }
        } else {
          if (nowrange <= range) {
            var t = range * 0.01;
            nowrange += t;   
          }      
          if (nowrange >= range) {
            var t = range * 0.01;
            nowrange -= t;
          }
        }
        if((data - nowdata) > 0) {
          nowdata += waveupsp;      
        }
        if((data - nowdata) < 0){
          nowdata -= waveupsp
        }
        if(data==0){
          nowdata=0.5
           // 开始水波动画
           sp += 0.07;
          drawSine();
          drawText("充电中");  
          requestAnimationFrame(render)
        }else{
           sp += 0.07;
        // 开始水波动画
          drawSine();
          // 写字
          drawText();  
          requestAnimationFrame(render)
        }
      }
    }
  },
  mounted(){
    this.draw();
  },
  props:['cardata']
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
   .water{
    background:#fff;
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
    position: relative;
   }
   .circles{
    width: 180px;
    height: 180px;
    border-radius: 130px;
    border: 2px solid #fff;
    border-left-color: #fe6432;
    position: absolute;
    animation: circle 1s infinite linear;
   }
   @keyframes circle
    {
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
    }
</style>