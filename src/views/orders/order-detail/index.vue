<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px">
      <el-row v-if="list" :gutter="30">

        <el-col :md="12" :xs="24">
          <div class="content-wrapper">
            <h3>訂單明細</h3>
            <div class="info-area">
              <el-form-item label="訂單日期：">
                <p>{{ list.timestamp | parseTime('{y}-{m}-{d}') }}</p>
              </el-form-item>
              <el-form-item label="付款方式：">
                <p v-if="!isEdit">{{ list.method }}</p>
                <el-select v-else v-model="temp.method" placeholder="選擇付款方式">
                  <el-option
                    v-for="item in method"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="開立發票：">
                <p v-if="!isEdit">{{ list.receipt.name }}</p>
                <el-select v-else v-model="temp.receipt.name" placeholder="選擇付款方式">
                  <el-option
                    v-for="item in receipt"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="temp.receipt.name === '三聯式'" label="發票抬頭：" prop="receipt.title">
                <p v-if="!isEdit">{{ list.receipt.title }}</p>
                <el-input v-else v-model="temp.receipt.title" />
              </el-form-item>
              <el-form-item v-if="temp.receipt.name === '三聯式'" label="發票統編：" prop="receipt.taxID">
                <p v-if="!isEdit">{{ list.receipt.taxID }}</p>
                <el-input v-else v-model="temp.receipt.taxID" />
              </el-form-item>
              <el-form-item label="運送地址：" prop="customer.shippingAdd">
                <p v-if="!isEdit">{{ list.customer.shippingAdd }}</p>
                <el-input v-else v-model="temp.customer.shippingAdd" />
              </el-form-item>
            </div>
          </div>
        </el-col>

        <el-col :md="12" :xs="24">
          <div class="content-wrapper">
            <h3>客戶資料</h3>
            <div class="info-area">
              <el-form-item label="客戶名稱：" prop="customer.name">
                <p v-if="!isEdit">{{ list.customer.name }}</p>
                <el-input v-else v-model="temp.customer.name" />
              </el-form-item>
              <el-form-item label="電子郵件：" prop="customer.email">
                <p v-if="!isEdit">{{ list.customer.email }}</p>
                <el-input v-else v-model="temp.customer.email" />
              </el-form-item>
              <el-form-item label="手機號碼：" prop="customer.cell">
                <p v-if="!isEdit">{{ list.customer.cell }}</p>
                <el-input v-else v-model="temp.customer.cell" />
              </el-form-item>
              <el-form-item label="市話號碼：">
                <p v-if="!isEdit">{{ list.customer.tel }}</p>
                <el-input v-else v-model="temp.customer.tel" />
              </el-form-item>
              <el-form-item label="通訊地址：" prop="customer.address" style="margin-bottom: 0">
                <p v-if="!isEdit">{{ list.customer.address }}</p>
                <el-input v-else v-model="temp.customer.address" />
              </el-form-item>
            </div>
          </div>
        </el-col>

        <el-col>
          <div class="content-wrapper">
            <h3>商品清單</h3>
            <div class="info-area">
              <el-table
                v-if="list"
                :key="tableKey"
                v-loading="listLoading"
                :data="productsList"
                row-key="id"
                border
                fit
                highlight-current-row
                style="width: 100%"
                cell-class-name="orders"
              >
                <el-table-column label="ID" align="center" width="80" height="250">
                  <template slot-scope="scope">
                    <span>{{ scope.$index + 1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="商品名稱" align="center" min-width="240" height="250">
                  <template slot-scope="{row}">
                    <p>{{ row.name }}</p>
                  </template>
                </el-table-column>
                <el-table-column label="單價" width="180px" align="center">
                  <template slot-scope="{row}">
                    <span>$ {{ row.price }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="數量" width="180px" align="center">
                  <template slot-scope="scope">
                    <span v-if="!isEdit">{{ scope.row.qty }}</span>
                    <el-input v-else v-model="temp.products.detail[scope.$index].qty" />
                  </template>
                </el-table-column>
                <el-table-column label="金額" width="180px" align="center">
                  <template slot-scope="{row}">
                    <span>$ {{ row.price * row.qty }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div v-loading="listLoading" class="total-area">
                <el-form-item label="商品小計：">
                  <p>$ {{ productsPrice }}</p>
                </el-form-item>
                <el-form-item label="運費小計：">
                  <p>$ {{ list.products.shipping }}</p>
                </el-form-item>
                <el-form-item label="代收費：">
                  <p>$ {{ list.products.collectionCosts }}</p>
                </el-form-item>
                <el-form-item label="應付總額：" class="total-price">
                  <p class="color-red">$ {{ list.products.totalPrice }}</p>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-col>

        <el-col>
          <div class="content-wrapper">
            <h3>訂單狀態</h3>
            <div class="info-area">
              <el-form-item label="訂單狀態：">
                <el-tag v-if="!isEdit" :type="list.status.name | statusFilter">
                  {{ list.status.name }}
                </el-tag>
                <el-select v-else v-model="temp.status.name" class="filter-item" placeholder="請選擇">
                  <el-option
                    v-for="(item, idx) in status"
                    :key="idx"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="備註：" style="margin-bottom: 0">
                <p v-if="!isEdit">{{ list.status.description }}</p>
                <el-input v-else v-model="temp.status.description" />
              </el-form-item>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="flex-jcc">
        <el-button v-if="!isEdit" type="primary" @click="handleUpdate()">
          編輯
        </el-button>
        <el-button v-else @click="handleCancel()">
          取消
        </el-button>
        <el-button v-if="isEdit" type="primary" @click="updateData()">
          送出
        </el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { fetchList, updateOrder, fetchStatus } from '@/api/orders'
import { deepClone } from '@/utils'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'ProductsDetail',
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
      list: {
        status: {},
        receipt: {},
        customer: {},
        products: {
          detail: []
        }
      },
      productsList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 999999,
        title: undefined,
        status: undefined
      },
      status: [],
      method: ['線上刷卡', 'ATM、銀行、郵局轉帳匯款', '貨到付款'],
      receipt: ['二聯式', '三聯式'],
      temp: {},
      rules: this.rulesCtrl(false),
      isEdit: false
    }
  },
  computed: {
    productsPrice() {
      const pdTotal = this.list.products.detail.reduce((acc, item) => {
        return acc + parseInt(item.price * item.qty)
      }, 0)
      return pdTotal
    }
  },
  watch: {
    'temp.status.name'(newVal, oldVal) {
      if (this.temp) {
        const val = Object.assign({}, this.status.find((item) => {
          return item.name === this.temp.status.name
        }))
        this.temp.status.description = val.description
      }
    }
  },
  created() {
    this.getList()
    this.temp = this.list
  },
  methods: {
    getList() {
      const paramId = this.$route.params && this.$route.params.id
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        const orderDetail = response.data.items.filter((item) => {
          return item.number === paramId
        })
        this.list = orderDetail[0]
        this.temp = deepClone(this.list)
        this.productsList = deepClone(this.list.products.detail)
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      fetchStatus().then(res => {
        this.status = res.data.items
      })
    },
    handleUpdate() {
      this.temp = deepClone(this.list)
      this.isEdit = true
      this.rules = this.rulesCtrl(true)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCancel() {
      this.temp = deepClone(this.list)
      this.isEdit = false
      this.rules = this.rulesCtrl(false)
    },
    updateData() {
      this.$refs['dataForm'].validate((valid, cdscsdc) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          console.log(tempData)
          updateOrder(tempData).then((res) => {
            this.temp.editDate = res.data.editDate
            this.isEdit = false
            this.list = this.temp
            this.productsList = this.temp.products.detail
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
            $('html, body').animate({
              scrollTop: $(isError[0]).offset().top - 80
            }, 100)
          }, 100)
          return false
        }
      })
    },
    rulesCtrl(boolean) {
      return {
        'customer.shippingAdd': [{ required: boolean, message: '此項為必填！', trigger: 'blur' }],
        'receipt.title': [{ required: boolean, message: '此項為必填！', trigger: 'blur' }],
        'receipt.taxID': [{ required: boolean, message: '此項為必填！', trigger: 'blur' }],
        'customer.name': [{ required: boolean, message: '此項為必填！', trigger: 'blur' }],
        'customer.email': [{ required: boolean, message: '此項為必填！', trigger: 'blur' }],
        'customer.cell': [{ required: boolean, message: '此項為必填！', trigger: 'blur' }],
        'customer.address': [{ required: boolean, message: '此項為必填！', trigger: 'blur' }]
      }
    }
  }
}
</script>

<style lang="sass">
  .total-area
    .el-form-item__label, .el-form-item__content
      line-height: 50px
    .el-form-item__content
      margin-left: 10px !important
</style>

<style lang="sass" scoped>
  h3
    padding: 20px 16px
    border-bottom: 1px solid #b9b9b9
    background-color: rgba(#f2f8fc, 0.5)
    color: #464646
  .content-wrapper
    margin-bottom: 30px
    border: 1px solid #EBEEF5
  .flex-jcc
    display: flex
    justify-content: center
  .info-area
    padding: 30px 20px 40px
    p
      color: #666
  .total-area
    border: 1px solid #EBEEF5
    .el-form-item
      display: flex
      justify-content: flex-end
      width: 100%
      margin-bottom: 0
      border-bottom: 1px solid #EBEEF5
    .el-form-item.total-price
      background-color: #fafafa
    p
      width: 180px
      text-align: center
      border-left: 1px solid #EBEEF5
    .color-red
      color: red
</style>
