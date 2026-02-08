<template>
  <div
    class="chart"
    :id="props.chartId"
    :style="{ width: props.width, height: props.height }"
  ></div>
</template>

<script setup>
import * as echarts from "echarts";
import { defineProps, onMounted, reactive, watch, defineEmits } from "vue";

const emit = defineEmits(["click"]);

const props = defineProps({
  chartId: {
    type: String,
    default: "chart",
    required: false,
  },
  options: {
    type: Object,
    default: null,
  },
  height: {
    type: String,
    default: "400px",
  },
  width: {
    type: String,
    default: "100%",
  },
  resize: {
    type: Boolean,
    default: false
  }
});

const data = reactive({
  chart: null
})
const initEcharts = () => {
  data.chart = echarts.init(document.getElementById(props.chartId));
  data.chart.setOption(props.options);
  
  // 添加点击事件监听器
  data.chart.on('click', (params) => {
    emit('click', params);
  });
};
onMounted(() => {
  initEcharts();
});

watch(
  () => props.resize,
  (value) => {
   if (value) {
    data.chart.resize()
   }
  },
  // { deep: false, immediate: true },
)

// 监听 options 变化，重新渲染图表
watch(
  () => props.options,
  (newOptions) => {
    if (data.chart && newOptions) {
      data.chart.setOption(newOptions)
    }
  },
  { deep: true }
)

</script>

<style lang="less" scoped>
// @import "@/assets/css/common.scss";
.chart {
  width: 100%;
  height: 400px;
}
#chartHeap {
  padding: 10px 20px;
}
</style>
