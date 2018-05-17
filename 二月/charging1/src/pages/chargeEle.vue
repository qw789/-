<template>
  <div>
    <scroller use-pullup :pullup-config="pullupDefaultConfig" @on-pullup-loading="loadMore" use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-loading="refresh" lock-x ref="scrollerBottom" height="-48">
      <div>
        <div class="flex-two-e">
          <div class="flex-item ">
            本月
          </div>
          <div class="flex-item font-w">
            ￥{{monthlyConsume|returnFloat}}
          </div>
        </div>
        <ul class="flex-group-el" v-for="item in list" :key="item.number" @click="goDetail(item)">
          <li class="flex-item date font-w">
            {{moments(item)}}
          </li>
          <li class="flex-item flex-middel">
            <div class="pad-top">{{item.stationName}}-{{item.pileName}}</div>
            <div class="kwh">{{item.electricity|returnFloat}}度</div>
          </li>
          <li class="flex-item color-green font-w date">
            <span>￥{{item.consume|returnFloat}}</span>
            <i class="right"><img src="../assets/right.png" alt=""></i>
          </li>
        </ul>
         <div v-if="list === undefined || list.length == 0" class="text-center">
          您还没有充电记录哦
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
import { Scroller } from "vux";
const pulldownDefaultConfig = {
  content: "",
  height: 40,
  autoRefresh: false,
  downContent: "",
  upContent: "",
  loadingContent: "",
  clsPrefix: "xs-plugin-pulldown-"
};
const pullupDefaultConfig = {
  content: "",
  pullUpHeight: 60,
  height: 40,
  autoRefresh: false,
  downContent: "",
  upContent: "",
  loadingContent: "",
  clsPrefix: "xs-plugin-pullup-"
};
export default {
  components: {
    Scroller
  },
  data() {
    return {
      list: [],
      pullupDefaultConfig: pullupDefaultConfig,
      pulldownDefaultConfig: pulldownDefaultConfig,
      page: 1,
      monthlyConsume: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.scrollerBottom.reset({ top: 0 });
      document.querySelector(".xs-container").parentElement.style.height=window.innerHeight+"px"
    });
    this.loadMore();
  },
  methods: {
    fetchData(cb) {
      var d = new Date();
      var str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      this.$http
        .post("/api/charging/list", {
          page: this.page,
          limit: 10,
          month: str
        })
        .then(response => {
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset();
            document.querySelector(".xs-plugin-pullup-container").innerHTML =
              " ";
          });
          cb(response.data);
        });
    },
    refresh() {
      this.page = 1;
      this.fetchData(data => {
        this.list = data.page.pages.list;
        this.monthlyConsume = data.page.monthlyConsume;
        this.$refs.scrollerBottom.enablePullup();
        this.$refs.scrollerBottom.donePulldown();
        this.page = 2;
      });
    },
    loadMore() {
      this.fetchData(data => {
        if (this.list.length >= 10) {
          this.$refs.scrollerBottom.disablePullup();
        }
        this.monthlyConsume = data.page.monthlyConsume;
        this.list = this.list.concat(data.page.pages.list);
        this.$refs.scrollerBottom.donePullup();
      });
      this.page++;
    },
    goDetail(ele) {
      var orderId = ele.number;
      this.$router.push({
        name: "chargingFinish",
        query: { orderId: orderId }
      });
    },
    moments(item) {
      return this.$moment(item.end).format("M月D日");
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
    }
  },
 created() {
    document.title="充电记录";
  }
};
</script>

<style lang="less" rel="stylesheet/less">
ul,
li {
  list-style: none;
}
.vux-demo {
  text-align: center;
  background: #fff;
}
.flex-two-e {
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  font-size: 0.37rem;
  height: 1.33rem;
  line-height: 1.33rem;
  background: #f2f2f2;
}
.flex-group-el {
  display: flex;
  justify-content: space-between;
  // padding: 0 30px;
  font-size: 0.37rem;
  margin: 0 0.2rem 0 30px;
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
  color: #4582ff;
  font-size: 32/75rem;
}
.flex-middel {
  padding: 20px 0;
  width: 5rem;
}
.font-w {
  font-weight: 600;
}

.right {
  width: 30/75rem;
  height: 30/75rem;
  display: inline-block;
}
.right img {
  width: 100%;
  height: 100%;
}
.text-center{
  text-align: center;
  font-size: 18px;
  margin-top: 50px;
}
</style>
