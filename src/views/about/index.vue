<template>
  <div class="app-container">
    <h3>公司簡介</h3>
    <div class="content-wrapper">
      <tinymce ref="editTinymce" v-model="temp.content" :height="400" />
      {{ temp.content }}
    </div>
    <div slot="footer" class="dialog-footer flex-jcc">
      <el-button type="primary" @click="updateData()">
        送出
      </el-button>
    </div>
  </div>
</template>

<script>
import { fetchAbout, updateAbout } from '@/api/about'
import { deepClone } from '@/utils'
import waves from '@/directive/waves' // waves directive
import Tinymce from '@/components/Tinymce'

export default {
  name: 'About',
  components: { Tinymce },
  directives: { waves },
  data() {
    return {
      list: null,
      listLoading: true,
      temp: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchAbout().then((res) => {
        this.list = res.data
        this.temp = deepClone(this.list)
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (!this.fileList) this.rules.file[0].required = true
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateAbout(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '編輯成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
  .flex-jcc
    display: flex
    justify-content: center
  h3
    padding: 20px 16px
    margin-bottom: 20px
    border-bottom: 1px solid #b9b9b9
    color: #464646
  .content-wrapper
    overflow: auto
    margin-bottom: 30px
  .tinymce-container
    width: 99.8% !important
    min-width: 600px
</style>
