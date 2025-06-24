<template>
  <div
    class="chart"
    :id="props.chartId"
    :style="{ width: props.width, height: props.height }"
  ></div>
</template>

<script setup>
import * as echarts from "echarts";
import { defineProps, onMounted, reactive, watch } from "vue";

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
