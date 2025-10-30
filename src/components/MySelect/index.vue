<template>
    <el-select v-bind="$attrs" @change="changeHandler">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
</template>

<script setup lang="ts">
import { ElSelect } from 'element-plus';

interface IItem {
    value: any,
    label: string
}
const emit = defineEmits<{
    (event: "update:modelValue", data: any): void
}>()
const props = defineProps<{
    modelValue: any
    options: IItem[]
}>()

const changeHandler = (value: any) => {
    emit("update:modelValue", value)
}
</script>

<style scoped lang="scss"></style>