<template>
  <div>
    <h3>最新訂單</h3>
    <el-table :data="list" style="width: 100%; padding: 8px 0;">
      <el-table-column label="訂單編號" width="120">
        <template slot-scope="{row}">
          <router-link :to="'/orders/detail/'+row.number" class="link-type">
            {{ row.number }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="訂單日期" width="160">
        <template slot-scope="{row}">
          {{ row.timestamp | parseTime('{y}-{m}-{d}') }}
        </template>
      </el-table-column>
      <el-table-column label="客戶名稱" min-width="120">
        <template slot-scope="{row}">
          <router-link :to="'/orders/detail/'+row.number" class="link-type">
            {{ row.customer.name }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="訂單金額" width="120" align="center">
        <template slot-scope="{row}">
          ${{ row.products.totalPrice }}
        </template>
      </el-table-column>
      <el-table-column label="狀態" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status.name | statusFilter">
            {{ row.status.name }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchList } from '@/api/orders'

export default {
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
      list: null,
      listQuery: {
        limit: 6
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
    }
  }
}
</script>

<style lang="sass" scoped>
  h3
    margin: 10px 10px 20px
</style>
