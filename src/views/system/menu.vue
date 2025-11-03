<template>
    <div class="">
        <el-table v-loading="loading" :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" border
            default-expand-all>
            <el-table-column header-align="center" prop="menuName" label="菜单名称" />
            <el-table-column header-align="center" prop="isEnabled" label="是否启用" />
            <el-table-column header-align="center" prop="path" label="菜单路径" />
            <el-table-column header-align="center" label="操作" width="150px">
                <template #default="scope">
                    <el-button type="primary" link @click="addHandler(scope.row, true)">
                        新增菜单
                    </el-button>
                    <el-button type="primary" link @click="addHandler(scope.row)">
                        新增子菜单
                    </el-button>
                    <el-button type="primary" link @click="editHandler(scope.row)">
                        编辑
                    </el-button>
                    <el-button link type="danger" @click="deleteHandler(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <el-drawer v-model="open" direction="rtl">
        <template #header>
            <h4>{{ menuaction.isedit ? `编辑菜单` : "新增菜单" }}</h4>
        </template>
        <template #default>
            <el-form :model="form" label-width="auto" style="max-width: 600px">
                <el-form-item prop="menuCode" label="菜单编码">
                    <el-input v-model="form?.menuCode" />
                </el-form-item>
                <el-form-item prop="menuName" label="菜单名称">
                    <el-input v-model="form?.menuName" />
                </el-form-item>
                <el-form-item prop="path" label="菜单路径">
                    <el-input v-model="form?.path" />
                </el-form-item>
                <el-form-item prop="path" label="菜单路径">
                    <el-switch v-model="form?.isEnabled" :active-value="0" :inactive-value="1" :active-text="'启用'"
                        :inactive-text="'禁用'"></el-switch>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancelClick">取消</el-button>
                <el-button type="primary" @click="confirmClick">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { AddMenuWithButtons, GetMenuTree } from '@/api/menu'
import store from '@/store'
import { ElSwitch } from 'element-plus/es'
import { computed, onMounted, reactive, ref } from 'vue'

interface IMenuItem {
    "factoryCode": string,
    "menuCode": string,
    "menuName": string,
    "path": string,
    "icon": string,
    "typeOfUse": string,
    "sort": number,
    "parentId": string,
    "isEnabled": number,
    "buttons": {
        "btnCode": string,
        "btnName": string
    }[],
    "children": IMenuItem[],
    "id": string,
    "createCode": string,
    "createTime": string,
    "updateCode": string,
    "updateTime": string
}
interface IMenuForm {
    "id"?: number,
    "menuCode": string,
    "menuName": string,
    "path": string,
    "icon"?: string,
    "typeOfUse"?: string,
    "sort"?: number,
    "parentId"?: string,
    "isEnabled": number,
    "buttons": {
        "btnCode": string,
        "btnName": string
    }[]
}
const loading = ref(false)
const tableData = ref<IMenuItem[]>([])
const open = ref(false)
const menuaction = reactive<{ isedit: boolean, actionrow: IMenuItem | null, sub: boolean }>({
    isedit: false,
    actionrow: null,
    sub: false
})
const form = ref<IMenuForm>({
    menuCode: "",
    menuName: "",
    path: "",
    isEnabled: 1,
    buttons: []
})


const factoryCode = computed(() => store.state.user.userInfo.factoryCode)
const flatMenus = computed(() => store.state.user.flatmenus)
const addHandler = (row: IMenuItem, sub?: boolean) => {
    open.value = true
    menuaction.isedit = false
    menuaction.actionrow = row
    menuaction.sub = !!sub
}
const editHandler = (row: IMenuItem) => {
    open.value = true
    menuaction.isedit = true
    menuaction.actionrow = row
}
const deleteHandler = (row: IMenuItem) => { }
const cancelClick = () => {
    open.value = false
}
const confirmClick = async () => {
    const requestBody: any = {

    }
    if (menuaction.isedit) {
        requestBody.id = menuaction.actionrow?.id
    }
    if (!menuaction.isedit && menuaction.sub) {
        requestBody.parentId = menuaction.actionrow?.id
    }
    const res = await AddMenuWithButtons(requestBody)
    cancelClick()
}
onMounted(async () => {
    loading.value = true
    const res = await GetMenuTree({
        FactoryCode: factoryCode.value
    })
    if (res.data) {
        tableData.value = res.data
    }
    loading.value = false
})
</script>

<style scoped lang="scss"></style>