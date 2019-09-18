<template>
  <div>
    <h3>動態消息</h3>
    <el-table :data="list" style="width: 100%; padding: 8px 0;" class="thead-adj">
      <el-table-column>
        <template slot-scope="{row}">
          <router-link :to="'/orders/detail/'+row.id" class="link-type">
            {{ row.number }}
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchList } from '@/api/orders'

export default {
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
    color: #464646
</style>
