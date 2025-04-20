<template>
  <div class="total-chart">
    <bar
      :options="options"
      chartId="Chart-Total"
      v-if="data.showBar"
      height="350px"
      width="100%"
    ></bar>
  </div>
</template>
<script setup>
import bar from "../../../../components/bar.vue";
import { reactive, onMounted } from "vue";
import { post_process_output_type } from "../../../../api/api";

import { useRouter } from "vue-router";
const router = useRouter();

import { useStore } from "vuex";
const store = useStore();

const data = reactive({
  showBar: false,
});
const options = reactive({
  series: [
    {
      name: "Channel promotion contribution",
      data: [],
      type: "pie",
      radius: ["40%", "70%"],
      center: ["50%", "55%"],
      minAngle: 15, //最小角度
      startAngle: 270, //起始角度
      label: {
        show: true,
        formatter: (item) => {
          return item.data.percent + "%";
        },
      },
    },
  ],
  legend: {
    type: 'scroll',
    data: [],
    top: "2%",
  },
  tooltip: {
    trigger: "item",
  },
});

const getData = async () => {
  let param = {
    group_name: router.currentRoute._value.query.groupName,
    project_name: router.currentRoute._value.query.projectName,
    type: "total_promotion_contribution",
  };
  let res = await post_process_output_type(param);
  if (res && res.status === 1) {
    let resData = JSON.parse(res.output);
    options.series[0].data = [];
    for (let key in resData.data) {
      let item = {
        name: key,
        value: resData.data[key],
        percent: resData.percent[key],
        unit: resData.danwei,
      };
      options.series[0].data.push(item);
      options.legend.data.push(key);
    }

    options.tooltip.formatter = (item) => {
      let str = item.marker + item.name + " : " + item.value + resData.danwei;
      return str;
    };

    data.showBar = true;
  }
};
onMounted(() => {
  getData();
});
</script>

<style lang="less" scoped>
.total-chart {
}
</style>
