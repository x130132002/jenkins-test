<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="searchBox">
        <el-input v-model="listQuery.keyword" placeholder="請輸入關鍵字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-select v-model="listQuery.status" placeholder="權限狀態" clearable class="filter-item" style="width: 130px">
          <el-option v-for="item in statusOptions" :key="item.id" class="filter-item" :label="item" :value="item" />
        </el-select>
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
      <el-table-column label="會員帳號" width="200px">
        <template slot-scope="{row}">
          <p class="link-type" @click="handleUpdate(row)">{{ row.username }}</p>
        </template>
      </el-table-column>
      <el-table-column label="會員名稱" min-width="180px">
        <template slot-scope="{row}">
          <p class="link-type" @click="handleUpdate(row)">{{ row.name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="電子郵件" width="300px">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="權限狀態" align="center" width="120px">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="加入日期" width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d}') }}</span>
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
          <el-form-item label="會員帳號">
            <span class="color-red">&nbsp;{{ temp.username }}</span>
          </el-form-item>
          <el-form-item label="會員名稱" prop="name">
            <el-input v-model="temp.name" />
          </el-form-item>
          <el-form-item label="電子郵件" prop="email">
            <el-input v-model="temp.email" />
          </el-form-item>
          <el-form-item label="手機號碼" prop="cell">
            <el-input v-model="temp.cell" />
          </el-form-item>
          <el-form-item label="市話號碼" prop="tel">
            <el-input v-model="temp.tel" />
          </el-form-item>
          <el-form-item label="通訊地址" prop="address">
            <el-input v-model="temp.address" />
          </el-form-item>
          <el-form-item label="運送地址" prop="shippingAdd">
            <el-input v-model="temp.shippingAdd" />
          </el-form-item>
          <el-form-item label="狀態" prop="status">
            <el-select v-model="temp.status" class="filter-item" placeholder="請選擇">
              <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
            </el-select>
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
import { fetchList, createMember, updateMember, deleteMember } from '@/api/member'
import waves from '@/directive/waves' // waves directive
import DatePicker from '@/components/DatePicker'
import Pagination from '@/components/Pagination'

export default {
  name: 'ProductsList',
  components: { DatePicker, Pagination },
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
        keyword: undefined,
        status: undefined,
        dateStart: '',
        dateEnd: ''
      },
      dateRange: [],
      statusOptions: ['啟用', '停用'],
      showReviewer: false,
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '編輯項目',
        create: '新增項目'
      },
      rules: {
        status: [{ required: true, message: '尚未選擇狀態！', trigger: 'change' }],
        name: [{ required: true, message: '此項為必填！', trigger: 'blur' }],
        email: [{ required: true, message: '此項為必填！', trigger: 'blur' }],
        cell: [{ required: true, message: '此項為必填！', trigger: 'blur' }],
        tel: [{ required: true, message: '此項為必填！', trigger: 'blur' }],
        address: [{ required: true, message: '此項為必填！', trigger: 'blur' }],
        shippingAdd: [{ required: true, message: '此項為必填！', trigger: 'blur' }]
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
        username: '',
        name: '',
        email: '',
        status: ''
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
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
        await deleteMember(index)
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
          createMember(this.temp).then(() => {
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
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateMember(tempData).then(() => {
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
  .color-red
    color: #F56C6C
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
