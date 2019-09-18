<template>
  <div class="dashboard-editor-container">
    <panel-group @handleShowDetail="handleShowDetail" />
    <el-row :gutter="30">
      <el-col :lg="12" class="card-panel-col">
        <new-orders />
      </el-col>
      <el-col :lg="12" class="card-panel-col">
        <news-feed />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import NewOrders from './components/NewOrders'
import NewsFeed from './components/NewsFeed'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    NewOrders,
    NewsFeed
  },
  data() {
    return {
    }
  },
  methods: {
    handleShowDetail(type) {
      if (type === 'shoppings') {
        this.$router.push('/orders/index')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
    .card-panel-col {
      margin-bottom: 32px
    }
  }
  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
  @media (max-width: 575px) {
    .dashboard-editor-container {
      padding: 20px 4vw;
    }
  }
</style>
