<template>
    <div class="pagination-box">
        <span>总数：{{ $attrs.total }}</span>
        <el-pagination v-bind="$attrs" />
    </div>
</template>

<script setup lang="ts">
import { PaginationProps } from 'element-plus';
interface IProps extends PaginationProps { }
const props = defineProps<IProps>()

</script>

<style scoped lang="scss">
.pagination-box {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    width: 100%;
}
</style>