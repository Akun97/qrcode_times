<template>
  <div>
    <el-row>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-col :span="4">
          <el-form-item label="设备号：">
            <el-input v-model="formInline.equipmentNumber" placeholder="设备号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="时间：">
            <el-date-picker type="date" placeholder="选择日期" v-model="formInline.createTimeBegin"></el-date-picker>
          </el-form-item>
          <el-form-item label="至">
            <el-date-picker type="date" placeholder="选择日期" v-model="formInline.createTimeEnd"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="width-50 float-right" style="width: auto;float: right">
          <el-form-item>
            <el-button type="primary" @click="getEquipmentInfoList">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addDiver">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="deleteDiver">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="exportDiver">导出二维码</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        ref="diverList"
        :data="diverList"
        type="selection"
        border
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="equipmentNumber"
          label="设备号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="scanCount"
          label="访问次数">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="录入时间">
          <template slot-scope="scope">
            <span>{{dateFormat(scope.row.createTime)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="option"
          label="操作">
          <template slot-scope="scope">
            <a @click="handleDelete(scope.$index, scope.row)"
               style="color: #2440B3;text-decoration: none;cursor: pointer;">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="display: flex;justify-content: flex-end">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="this.pageInfo.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="this.pageInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.pageInfo.total">
        </el-pagination>
      </div>

    </el-row>
  </div>
</template>
<script>
import axios from "axios";
import JsZip from 'jszip';

export default {

  data() {
    return {
      axios:axios,
      JsZip:JsZip,
      formInline: {
        equipmentNumber: null,
        createTimeBegin: null,
        createTimeEnd: null
      },
      diverList: [
        {
          'equipmentNumber': '123',
          'scanCount': '2',
          'createTime': '2021/10/19'
        }
      ],
      pageInfo: {
        pageNum:1,
        pageSize:10,
        total: 100
      }
    }
  },
  mounted() {
  this.getEquipmentInfoList()
  },
  components: {},
  computed: {},
  methods: {
    addDiver() {
      this.$prompt( '请输入插入个数', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[0-9]*$/,
        inputErrorMessage: '请输入数字'
      }).then(({ value }) => {
        this.$post('/renren-api/api/autoInsertEquipment',value).then(res=>{
          debugger
          if (res.code == '0'){
            this.$message({
              type: 'success',
              message: '成功插入' + value + '条数据'
            });
            this.getEquipmentInfoList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    deleteDiver() {
      debugger
      const rows = this.$refs['diverList'].selection
      const idList = []
      for (let i =0;i<rows.length;i++){
        idList.push(rows[i].id)
      }
      this.$post('/renren-api/api/deleteEquipment', idList).then(resp => {
        this.pageInfo.pageNum = 1
        this.pageInfo.pageSize = 10
        this.getEquipmentInfoList()
      })
    },
    exportDiver() {
      const rows = this.$refs['diverList'].selection
      let fileName = '';
      const idList = []
      for (let i =0;i<rows.length;i++){
        idList.push(rows[i].id)
        fileName = fileName + rows[i].equipmentNumber + '+'
      }
      /*debugger
      const headers = {
        'Content-Type': 'application/json; application/octet-stream',
        "responseType": "blob"
      }
      const blob = {
          "responseType": "blob"
      }
      this.$postResponseType('/renren-api/api/createQRCode', idList,headers,blob).then(resp => {
        debugger
        this.downloadFile(resp)
      })*/
      this.$axios({ // 用axios发送post请求
        method: 'post',
        // 请求地址
        url: '/renren-api/api/createQRCode',
        // 参数
        data: idList,
        // 表明返回服务器返回的数据类型
        responseType: 'blob'
      })
          .then((res) => { // 处理返回的文件流
            debugger;
            const content = res
            const blob = new Blob([content])
            if ('download' in document.createElement('a')) { // 非IE下载
              const elink = document.createElement('a')
              elink.download = fileName + '.zip'
              elink.style.display = 'none'
              elink.href = URL.createObjectURL(blob)
              document.body.appendChild(elink)
              elink.click()
              URL.revokeObjectURL(elink.href) // 释放URL 对象
              document.body.removeChild(elink)
            } else { // IE10+下载
              navigator.msSaveBlob(blob, fileName)
            }
          })
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该设备, 是否继续?',  {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idList = []
        idList.push(row.id)
        this.$post('/renren-api/api/deleteEquipment', idList).then(resp => {
          if (resp.code == '0'){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.pageInfo.pageNum = 1
            this.pageInfo.pageSize = 10
            this.getEquipmentInfoList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    getEquipmentInfoList(){
      const request = this.formInline
      request.pageNum = 1
      request.pageSize = this.pageInfo.pageSize
      this.$post('/renren-api/api/getEquipmentInfoList', request).then(resp => {
        this.diverList = resp.info.list
        this.pageInfo.total = resp.info.total
      })
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getEquipmentInfoList()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNum = val
      this.getEquipmentInfoList()
    },
    // 导出
    downloadFile(data) {
      let blob = new Blob([data], {type: 'application/zip'})
      let url = window.URL.createObjectURL(blob)
      const link = document.createElement('a') // 创建a标签
      link.href = url
      link.download = `导出` // 重命名文件
      link.click()
      URL.revokeObjectURL(url) // 释放内存
    },
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
    add0(m){return m<10?'0'+m:m }
  }
}
</script>
<style lang="scss" scoped>
</style>
