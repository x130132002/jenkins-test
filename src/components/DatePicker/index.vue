<template>
  <div>
    <el-date-picker
      v-model="dateValue"
      type="daterange"
      align="right"
      unlink-panels
      start-placeholder="開始日期"
      end-placeholder="結束日期"
      :picker-options="pickerOptions"
      value-format="timestamp"
      @change="valueOut"
    />
  </div>
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
    value: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一個月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三個月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      dateValue: this.value
    }
  },
  methods: {
    valueOut() {
      this.$emit('input', this.dateValue)
    }
  }
}
</script>
