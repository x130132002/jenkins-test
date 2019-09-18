<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="searchBox">
        <el-input v-model="listQuery.keyword" placeholder="請輸入關鍵字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-select v-model="listQuery.status" placeholder="訂單狀態" clearable class="filter-item" style="width: 130px">
          <el-option v-for="item in status" :key="item.id" class="filter-item" :label="item.name" :value="item.name" />
        </el-select>
        <date-picker v-model="dateRange" class="filter-item" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          篩選
        </el-button>
      </div>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%"
      cell-class-name="orders"
    >
      <el-table-column label="訂單編號" prop="number" align="center" width="130" height="250">
        <template slot-scope="{row}">
          <router-link :to="'/orders/detail/'+row.number" class="link-type">
            {{ row.number }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="訂單日期" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客戶名稱" min-width="200px">
        <template slot-scope="{row}">
          <router-link :to="'/orders/detail/'+row.number" class="link-type">
            {{ row.customer.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="訂單金額" width="140px" align="center">
        <template slot-scope="{row}">
          <span>${{ row.products.totalPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="狀態" align="center" width="140px">
        <template slot-scope="{row}">
          <el-tag :type="row.status.name | statusFilter">
            {{ row.status.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="修改日期" width="180px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.editDate | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="280px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-waves type="primary" size="mini">
            <router-link :to="'/orders/detail/'+scope.row.number">
              訂單明細
            </router-link>
          </el-button>
          <el-button v-waves size="mini" @click="handleUpdate(scope.row)">
            狀態
          </el-button>
          <el-button v-waves size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
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
            <el-select v-model="temp.status.name" class="filter-item" placeholder="請選擇">
              <el-option v-for="(item, idx) in status" :key="idx" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-waves @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-waves type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          送出
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, updateOrder, fetchStatus, deleteOrder } from '@/api/orders'
import { deepClone } from '@/utils'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import DatePicker from '@/components/DatePicker'

export default {
  name: 'ProductsList',
  components: { Pagination, DatePicker },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '新訂單': 'primary',
        '處理中': 'default',
        '已寄出': 'success',
        '等貨中': 'info',
        '未付款': 'warning',
        '款項不符': 'danger',
        '查無帳款': 'danger',
        '資料錯誤': 'danger'
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
        keyword: undefined,
        status: undefined,
        dateStart: '',
        dateEnd: ''
      },
      dateRange: [],
      status: [],
      newCate: '',
      showReviewer: false,
      temp: {
        status: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '編輯狀態',
        create: '新增項目'
      },
      rules: {
        status: [{ required: true, message: '尚未選擇狀態！', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      await fetchList()
      fetchStatus().then(res => {
        this.status = res.data.items
      })
    },
    handleFilter() {
      this.listQuery.dateStart = this.dateRange[0]
      this.listQuery.dateEnd = this.dateRange[1]
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        timestamp: new Date(),
        status: {}
      }
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
      this.temp = deepClone(row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
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
        await deleteOrder(index)
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = deepClone(this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateOrder(tempData).then((res) => {
            this.temp.editDate = res.data.editDate
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
  .sortable-fallback.sortable-drag td.orders
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
  .el-tag.el-tag--default
    margin-right: 0px
    border: 1px solid #dcdfe6
    background-color: #fff
    color: #606266
  @media (max-width: 575px)
    .el-dialog__body
      padding: 30px 6vw
</style>

<style lang="sass" scoped>
  .el-form
    overflow: auto
  .el-form-item
    margin-bottom: 0
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
