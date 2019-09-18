<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
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
      cell-class-name="cate"
    >
      <el-table-column label="ID" prop="id" align="center" width="80" height="250">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="類別名稱" min-width="300px">
        <template slot-scope="{row}">
          <p class="link-type" @click="handleUpdate(row)">{{ row.name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="狀態" align="center" width="120px">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="90px" style="width: auto">
        <div>
          <el-form-item label="狀態" prop="status">
            <el-select v-model="temp.status" class="filter-item" placeholder="請選擇">
              <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="類別名稱" prop="name">
            <el-input v-model="temp.name" />
          </el-form-item>
          <el-form-item label="網頁標題" prop="title">
            <el-input v-model="temp.title" />
          </el-form-item>
          <el-form-item label="網頁描述" prop="description">
            <el-input v-model="temp.description" />
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
import { fetchCate, createCate, updateCate, deleteCate } from '@/api/products'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'

const cate = [
  { key: '01', display_name: '類別一' },
  { key: '02', display_name: '類別二' },
  { key: '03', display_name: '類別三' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = cate.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ProductsCate',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '啟用': 'success',
        '停用': 'info'
      }
      return statusMap[status]
    },
    cateFilter(type) {
      return calendarTypeKeyValue[type]
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
        limit: 20
      },
      dateRange: [],
      oldList: [],
      newList: [],
      cate,
      statusOptions: ['啟用', '停用'],
      showReviewer: false,
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '編輯分類',
        create: '新增分類'
      },
      rules: {
        name: [{ required: true, message: '此項為必填！', trigger: 'blur' }],
        status: [{ required: true, message: '此項為必填！', trigger: 'blur' }]
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
      const { data } = await fetchCate(this.listQuery)
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
      new Sortable(el, {
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
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        cate: '',
        title: '',
        description: '',
        status: ''
      }
      this.fileList = []
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
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
        await deleteCate(index)
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
          createCate(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            console.log(this.temp)
            this.$notify({
              title: 'Success',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateCate(tempData).then(() => {
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

<style lang="sass">
  .sortable-ghost
    opacity: .8
    color: #fff !important
    background: #42b983 !important
    *
      color: #fff !important
  .el-dialog__body
    padding: 50px
  table .sortable-fallback.sortable-drag td.cate
    &:first-child
      width: 80px
    &:nth-child(2)
      width: calc(100vw - 650px)
      min-width: 300px
    &:nth-child(3)
      width: 120px
    &:nth-child(4)
      width: 240px
  @media (max-width: 575px)
    .el-dialog__body
      padding: 30px 6vw
</style>

<style lang="sass" scoped>
  .el-form
    overflow: auto
</style>
