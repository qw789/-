<template>
  <div id="app">
  	     <loading v-model="isLoading" :text="text1"></loading>
    <router-view></router-view>
  </div>
</template>

<script>
import { Loading } from 'vux'
import { mapState } from 'vuex'

export default {
  name: 'app',
  components: {
    Loading
  },
  computed: {
    ...mapState({
      isLoading: state => state.vux.isLoading
    })
	},
	 data() {
    return {
     text1:" "
    };
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
	background-color: #fff;
	.weui-toast{
		width: 3em;
		min-height: 3em;
		transform: translateX(-50%);
    margin-left: 0!important;
	}
}
</style>
