import Vue from 'vue'
import Router from 'vue-router'
import chargeMoney from '@/pages/chargeMoney'
import chargeEle from '@/pages/chargeEle'
import login from '@/pages/login'
import charging from '@/pages/charging'
import chargingResult from '@/pages/chargingResult'
import chargingFail from '@/pages/chargingFail'
import selfCenter from '@/pages/selfCenter'
// import canotStart from '@/pages/canotStart'
// import nologin from '@/pages/nologin'
// import nofree from '@/pages/nofree'
import haslogin from '@/pages/haslogin'
import redCharging from '@/pages/redCharging'
import chargingFinish from '@/pages/chargingFinish'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/chargeMoney',
      name: 'chargeMoney',
      component: chargeMoney,
      meta:{title:"充值记录"}
    },
    {
     path: '/chargeEle',
      name: 'chargeEle',
      component: chargeEle,
      meta: {title: "充电记录"}
    },
    {
     path: '/login',
      name: 'login',
      component: login,
      meta: { title: "登录"}
    },
    {
     path: '/charging',
      name: 'charging',
      component: charging,
      meta: {title: "充值"}
    },
    {
     path: '/chargingResult',
      name: 'chargingResult',
      component: chargingResult,
      meta: {title: "充值结果"}
    },
    {
     path: '/chargingFail',
      name: 'chargingFail',
      component: chargingFail,
      meta: {title: "充值结果"}
    },
    {
     path: '/selfCenter',
      name: 'selfCenter',
      component: selfCenter,
      meta: {title: "个人中心"}
    },
    //  {
    //  path: '/canotStart',
    //   name: 'canotStart',
    //   component: canotStart
    // },
    // {
    //  path: '/nologin',
    //   name: 'nologin',
    //   component: nologin
    // },
    // {
    //  path: '/nofree',
    //   name: 'nofree',
    //   component: nofree
    // },
    {
     path: '/haslogin',
      name: 'haslogin',
      component: haslogin,
      meta: {title: "扫码充电"}
    },
    {
     path: '/redCharging',
      name: 'redCharging',
      component:redCharging,
      meta: {title: "正在充电"}
    },
    {
      path: '/chargingFinish',
      name: 'chargingFinish',
      component: chargingFinish,
      meta: {title: "充电详情"}
    }
  ]
})
