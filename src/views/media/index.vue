<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <div class="searchBox">
        <el-input v-model="listQuery.title" placeholder="請輸入關鍵字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <date-picker v-model="dateRange" class="filter-item" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          篩選
        </el-button>
      </div>
    </div>

    <el-table
      ref="dragTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%"
      cell-class-name="products"
    >
      <el-table-column label="ID" prop="id" align="center" width="80" height="250">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上傳日期" width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="圖片預覽" width="220px" align="center" class-name="img-wrapper">
        <template slot-scope="scope">
          <img :src="scope.row.images.url" :alt="scope.row.title" style="width: 100%">
        </template>
      </el-table-column>
      <el-table-column label="標題" min-width="300px">
        <template slot-scope="{row}">
          <p class="link-type" @click="handleUpdate(row)">{{ row.title }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            編輯
          </el-button>
          <el-button v-if="scope.row.status!='啟用'" size="mini" type="success" @click="handleModifyStatus(scope.row,'啟用')">
            啟用
          </el-button>
          <el-button v-if="scope.row.status!='停用'" size="mini" @click="handleModifyStatus(scope.row,'停用')">
            停用
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
            刪除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="resetTemp()">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: auto">
        <div>
          <el-form-item label="狀態" prop="status">
            <el-select v-model="temp.status" class="filter-item" placeholder="請選擇">
              <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item ref="uploadForm" label="圖片預覽" prop="file">
            <el-upload
              class="el-update"
              action="https://jsonplaceholder.typicode.com/posts/"
              :limit="1"
              :on-success="handleImgSuccess"
              :on-remove="handleImgRemove"
              :file-list="fileList"
              list-type="picture"
            >
              <el-button size="small" type="primary">點擊上傳</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="標題" prop="title">
            <el-input v-model="temp.title" />
          </el-form-item>
          <el-form-item label="內容說明" prop="description">
            <tinymce ref="editTinymce" v-model="temp.description" :height="300" />
            {{ temp.description }}
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          送出
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import { fetchList, createMedia, updateMedia, deleteMedia } from '@/api/media'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import DatePicker from '@/components/DatePicker'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'MediaList',
  components: { Pagination, Tinymce, DatePicker },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '啟用': 'success',
        '停用': 'info'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        title: undefined,
        cate: undefined,
        dateStart: '',
        dateEnd: ''
      },
      dateRange: [],
      oldList: [],
      newList: [],
      statusOptions: ['啟用', '停用'],
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '編輯項目',
        create: '新增項目'
      },
      rules: {
        status: [{ required: true, message: '尚未選擇狀態！', trigger: 'blur' }],
        file: [{ required: false, message: '尚未上傳圖片！' }],
        title: [{ required: true, message: '此項為必填！', trigger: 'blur' }]
      },
      fileList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await fetchList(this.listQuery)
      this.list = data.items
      this.total = data.total
      this.oldList = this.list.map(v => v.id)
      this.newList = this.oldList.slice()
      this.$nextTick(() => {
        this.setSort()
      })
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        animation: 250,
        // forceFallback: true,
        setData: function(dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          this.list.splice(evt.newIndex, 0, targetRow)

          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    },
    handleFilter() {
      this.listQuery.dateStart = this.dateRange[0]
      this.listQuery.dateEnd = this.dateRange[1]
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        timestamp: new Date(),
        image_url: '',
        title: '',
        spec: '',
        price: '',
        description: ''
      }
      this.fileList = []
      this.rules.file[0].required = false
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.rules.file[0].required = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.fileList = [this.temp.images]
      // this.$refs['editTinymce'].setContent(this.temp.description)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(index, row) {
      this.$confirm('此操作將永久刪除該文件，是否繼續？', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteMedia(index)
        this.list.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createMedia(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          setTimeout(() => {
            var isError = document.getElementsByClassName('is-error')
            isError[0].querySelector('input').focus()
          }, 100)
          return false
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (!this.fileList) this.rules.file[0].required = true
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateMedia(tempData).then(() => {
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
        } else {
          setTimeout(() => {
            var isError = document.getElementsByClassName('is-error')
            $(isError[0]).closest('.el-dialog__wrapper').animate({
              scrollTop: $(window).scrollTop() - $(isError[0]).offset().top + 350
            }, 100)
          }, 100)
          return false
        }
      })
    },
    handleImgSuccess(res, file) {
      this.$refs.uploadForm.clearValidate()
      this.rules.file[0].required = false
      this.fileList.push({ name: file.name, url: file.url })
      this.temp.images = this.fileList[0]
    },
    handleImgRemove(file, fileList) {
      if (fileList.length === 0) this.rules.file[0].required = true
      this.temp.images = fileList[0]
      this.fileList = fileList
    }
  }
}
</script>

<style lang="sass">
  .sortable-ghost
    opacity: .8
    color: #fff !important
    background: #42b983 !important
    *
      color: #fff !important
  .el-dialog__body
    padding: 50px
  .sortable-fallback.sortable-drag td
    &:first-child
      width: 80px
    &:nth-child(2)
      width: 180px
    &:nth-child(3)
      width: 220px
    &:nth-child(4)
      width: calc(100vw - 1200px)
      min-width: 300px
    &:nth-child(5)
      width: 120px
    &:nth-child(6)
      width: 120px
    &:nth-child(7)
      width: 240px
  .el-upload-list--picture .el-upload-list__item
    display: inline-block
    width: 46%
    margin-right: 15px
  .el-upload-list--picture .el-upload-list__item-thumbnail
    width: 92px
  .el-upload-list__item-name
    padding-left: 15px
  @media (max-width: 767px)
    .el-upload-list--picture .el-upload-list__item
      display: inline-block
      width: 100%
      margin-right: 0
  @media (max-width: 575px)
    .el-dialog__body
      padding: 30px 6vw
</style>

<style lang="sass" scoped>
  .el-form
    overflow: auto
  .tinymce-container
    width: 99.8% !important
    min-width: 600px
  .editor-content
    margin-top: 20px
  .searchBox
    display: flex
    justify-content: flex-end
    flex-wrap: wrap
    .filter-item
      margin-left: 5px
</style>
