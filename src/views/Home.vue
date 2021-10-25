<template>
  <div class="home">
    <router-view></router-view>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
export default {
  name: 'Home',
  computed: {
    ...mapGetters(['test'])
  },
  created() {
    if (this.$route.name === 'Home') {
      this.$router.replace({name: 'Home.index'});
    }
    this.textFunc();
  },
  methods: {
    ...mapActions('user', [
      'textFunc'
    ])
  }
}
</script>
