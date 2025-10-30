<template>
  <div>
    <el-empty description="首页"></el-empty>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const msg = ref(666)
const h2Style = reactive({
  color: '#435448'
})
</script>

<style lang="scss" scoped>
h2 {
  color: v-bind('h2Style.color');
  text-align: center;
}
</style>
