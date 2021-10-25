<template>
  <div>
    <div class="header">
      <div class="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
        <a class="pure-menu-heading" href="http://www.icom.co.jp/world/"><img src="../../assets/logo1.png"
                                                                              style="padding:6px 0px 0 1px;"
                                                                              class="logo"></a>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="ribbon l-box-lrg pure-g">
        <div class="l-box-lrg is-center pure-u-1 pure-u-md-1-3 ">
          <img src="../../assets/check.png" style="" class="audit">
        </div>
        <div class="pure-u-1 pure-u-md-2-3"
             style="padding-left:15px;text-align:center;/*border: 1px solid #FFF !important;*/border-radius: .25rem;">
          <center><h2 class="content-head content-head-ribbon audit-text">Genuine Product! </h2></center>
        </div>
      </div>
      <div>

      </div>

      <div>
        <table class="pure-table table-center pure-table-bordered pure-table-top" width="80%;">
          <tbody ontouchend="">
          <!--
          <tr>
              <td class="table-th">Serial Number</td>
              <td class="table-td">1234567890123456</td>
          </tr>
          -->
          <tr>
            <td colspan="2">
              <h3 class="information-head time is-center">Serial Number: <br><span class="times">{{baseData.serialNumber}}</span></h3>

              <h3 class="information-head time is-center">Accessed: <br><span class="times">{{baseData.accessed}}</span> times</h3>
              <h3 class="information-head time is-center">Last accessed: <br><span
                class="times">{{baseData.lastAccessed}}</span></h3>
            </td>
          </tr>
          <!--
          <tr>
              <td class="table-th">Last time accessed</td>
              <td class="table-td"></td>
          </tr>
          -->
          </tbody>
        </table>
        <br>
        <div class="content">
          <div class="l-content">
            <div>
              <div class="information pure-g is-center">
                <div class="pure-u-1">
                  <div class="pure-table-top">
                    <a href="http://www.icom.co.jp/world/genuine-info/" target="_blank">
                      <button class="button">About Genuine Icom Products</button>
                    </a>
                  </div>
                  <div>
                    <a href="http://www.icom.co.jp/world/support/contact/" target="_blank">
                      <button class="button">Contact Icom</button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="footer l-box is-center">
        Copyright &copy; Icom Inc.
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      baseData:{
        serialNumber: 'undefined',
        accessed: 'undefined',
        lastAccessed: 'undefined'
      }
    }
  },
  mounted() {
    this.$post('/renren-api/api/scanEquipment/' + this.$route.query.id).then(res => {
      if(res.code == '0'){
        this.$post('/renren-api/api/detail/' + this.$route.query.id).then(res => {
          this.baseData.serialNumber = res.msg.equipmentNumber
          this.baseData.accessed = res.msg.scanCount
          this.baseData.lastAccessed = this.dateFormat(new Date())
        })
      }
    })
  },
  components: {},
  computed: {

  },
  methods: {
    dateFormat(date) {
      var time = new Date(date);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
    },
    add0(m) {
      return m < 10 ? '0' + m : m
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('../../css/layouts/marketing.css');
@import url('../../css/layouts/pure-min.css');
</style>
