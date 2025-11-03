<template>
    <div class="page">
        <div>
            <el-button :icon="RefreshRight" @click="refresh()"></el-button>
            <el-button type="primary" @click="addMenuHandler()">新增角色</el-button>
        </div>
        <el-table :data="tableData" class="auto-height" style="width: 100%; margin: 8px 0 10px 0" row-key="id" border
            default-expand-all>
            <el-table-column header-align="center" prop="roleName" label="角色名称" width="180px" />
            <el-table-column header-align="center" prop="roleCode" label="角色编码" width="200px" />
            <el-table-column align="center" prop="isEnabled" label="是否启用" width="100px">
                <template #default="{ row }">
                    <span>{{ row.isEnabled === 0 ? '启用' : "禁用" }}</span>
                </template>
            </el-table-column>
            <el-table-column header-align="center" prop="remarks" label="备注" min-width="100px" />
            <el-table-column align="center" label="操作" width="120px">
                <template #default="scope">
                    <el-button type="primary" link @click="editHandler(scope.row)">
                        编辑
                    </el-button>
                    <el-button link type="danger" @click="deleteHandler(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <MyPagination v-model:current-page="pagination.pageIndex" v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]" layout="prev, pager, next,sizes, jumper" background
            :total="pagination.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </MyPagination>
    </div>
    <el-drawer v-model="open" direction="rtl" size="520px" :close-on-click-modal="false">
        <template #header>
            <h4>{{ menuaction.isedit ? `编辑菜单` : "新增菜单" }}</h4>
        </template>
        <template #default>
            <el-form :model="form" ref="formRef" label-width="auto" :rules="rules" style="max-width: 600px">

                <el-form-item prop="departmentCode" label="所属部门">
                    <MySelect placeholder="请选择所属部门" v-model="form.departmentCode" :options="departmentList"></MySelect>
                </el-form-item>
                <el-form-item prop="roleName" label="角色名称">
                    <el-input clearable placeholder="请填写角色名称" v-model="form.roleName" />
                </el-form-item>
                <el-form-item prop="roleCode" label="角色编码">
                    <el-input clearable placeholder="请填写角色编码" v-model="form.roleCode" />
                </el-form-item>
                <el-form-item prop="remarks" label="备注">
                    <el-input type="textarea" :rows="3" maxlength="150" clearable placeholder="请填写备注"
                        v-model="form.remarks" />
                </el-form-item>
                <el-form-item prop="isEnabled" label="是否启用角色">
                    <el-switch v-model="form.isEnabled" :active-value="0" :inactive-value="1" :active-text="'启用'"
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
import { AddOrEditRole, BatchDeleteRole, GetRole } from '@/api/role'
import MyPagination from '@/components/MyPagination/index.vue'
import store from '@/store'
import { filterTreeByLevel } from '@/utils/util'
import { CirclePlus, Delete, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElSwitch, FormInstance, FormRules } from 'element-plus/es'
import { computed, onMounted, reactive, ref } from 'vue'

interface IPageTable {
    data: IRole[],
    pageIndex: number,
    pageSize: number,
    totalCount: number,
    totalPages: number
}
interface IRole extends IRoleForm {
    "factoryCode": string,
    "createCode": string,
    "createTime": string,
    "updateCode": string,
    "updateTime": string
}

interface IRoleForm {
    "id": number | string,
    "departmentCode": string,
    "roleCode": string,
    "roleName": string,
    "remarks": string,
    "isEnabled": number,
    [key:string]:any
}
const open = ref(false)
const form = ref<IRoleForm>({
    id: "",
    departmentCode: "",
    roleCode: "",
    isEnabled: 0,
    roleName: "",
    remarks: "",
})
const departmentList = ref<any[]>([])
const rules = reactive<FormRules<IRoleForm>>({
    departmentCode: [
        { required: true, message: '请选择所属部门', trigger: 'change' },
    ],
    roleCode: [
        { required: true, message: '请填写角色编码', trigger: 'change' },
    ],
    roleName: [
        {
            required: true,
            message: '请填写角色名称',
            trigger: 'blur',
        },
    ],
})

const menuaction = reactive<{ isedit: boolean, actionrow: IRole | null }>({
    isedit: false,
    actionrow: null,
})
const formRef = ref<FormInstance>()
const tableData = ref<IRole[]>()
const pagination = reactive<{
    pageIndex: number,
    pageSize: number,
    totalCount: number,
    totalPages: number
}>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 1
})
const refresh = async () => {
    const res = await GetRole<IPageTable>({
        pageSize: 100,
        pageIndex: 1
    })
    if (res.success) {
        const pageData = res.data
        tableData.value = pageData.data
        pagination.pageIndex = pageData.pageIndex
        pagination.pageSize = pageData.pageSize
        pagination.totalCount = pageData.totalCount
        pagination.totalPages = pageData.totalPages
    }
    console.log(res)
}
const editHandler = (row: IRole) => {
    open.value = true
    menuaction.isedit = true
    menuaction.actionrow = row
    for (const key in form.value) {
        console.log(key)
        if (!Object.hasOwn(form.value, key)) continue;
        form.value[key ] = menuaction.actionrow[key as keyof typeof form.value];
    }
}
const deleteHandler = async (row: IRole) => {
    ElMessageBox.confirm(`确定要删除“${row.roleName}”角色？该操作不可恢复`, "警告", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
    }).then(async () => {
        const res = await BatchDeleteRole([row.id])
        if (res.success) {
            return ElMessage.success(res.message)
        }
        return ElMessage.error(res.message)
    })

}
const addMenuHandler = () => {
    open.value = true
    menuaction.isedit = false
    menuaction.actionrow = null
}
const handleSizeChange = () => { }
const handleCurrentChange = () => { }
const cancelClick = () => {
    if (formRef.value) {
        formRef.value?.resetFields()
    }
    open.value = false
}
const confirmClick = () => {
    console.log("form====>", form)
    if (formRef.value) {
        formRef.value?.validate(async (flag: boolean) => {
            if (flag) {
                const requestBody: any = {
                    ...form.value
                }
                if (menuaction.isedit) {
                    requestBody.id = menuaction.actionrow?.id
                }

                console.log("requestBody==>", requestBody)
                const res = await AddOrEditRole(requestBody)
                if (res.data) {
                    ElMessage.success(res.message)
                    refresh()
                }
                console.log("res====>", res)
                cancelClick()
            }
        })
    }

}
onMounted(() => {
    refresh()
})
</script>

<style scoped lang="scss">
.page {
    height: 100%;
    display: flex;
    flex-direction: column;

    .auto-height {
        flex: 1;
    }
}
</style>