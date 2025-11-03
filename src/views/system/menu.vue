<template>
    <div class="">
        <el-button type="primary" @click="addMenuHandler()">新增菜单</el-button>
        <el-table v-loading="loading" :data="tableData" style="width: 100%; margin: 8px 0 10px 0" row-key="id" border
            default-expand-all>
            <el-table-column header-align="center" prop="menuName" label="菜单名称" />
            <el-table-column align="center" prop="isEnabled" label="是否启用" width="100px">
                <template #default="{ row }">
                    <span>{{ row.isEnabled === 0 ? '启用' : "禁用" }}</span>
                </template>
            </el-table-column>

            <el-table-column header-align="center" prop="path" label="菜单路径" />
            <el-table-column align="center" label="操作" width="120px">
                <template #default="scope">
                    <!-- <el-button type="primary" link @click="addHandler(scope.row, true)">
                        新增菜单
                    </el-button>
                    <el-button type="primary" link @click="addHandler(scope.row)">
                        新增子菜单
                    </el-button> -->
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
    <el-drawer v-model="open" direction="rtl" size="520px">
        <template #header>
            <h4>{{ menuaction.isedit ? `编辑菜单` : "新增菜单" }}</h4>
        </template>
        <template #default>
            <el-form :model="form" ref="formRef" label-width="auto" :rules="rules" style="max-width: 600px">
                <el-form-item prop="isTop" label="是否顶级菜单">
                    <el-radio-group v-model="form.isTop">
                        <el-radio :value="false">否</el-radio>
                        <el-radio :value="true">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="!form.isTop" prop="parentId" label="上级菜单">
                    <el-tree-select v-model="form.parentId" :data="treeData" check-strictly
                        :props="{ label: 'menuName', value: 'id' }" :render-after-expand="false"
                        placeholder="请选择上级菜单" />
                </el-form-item>
                <el-form-item prop="typeOfUse" label="使用类型">
                    <MySelect placeholder="请选择使用类型" v-model="form.typeOfUse" :options="typeOfUseList"></MySelect>
                </el-form-item>
                <el-form-item prop="menuName" label="菜单名称">
                    <el-input clearable placeholder="请填写菜单名称" v-model="form.menuName" />
                </el-form-item>
                <el-form-item prop="menuCode" label="菜单编码">
                    <el-input clearable placeholder="请填写菜单编码" v-model="form.menuCode" />
                </el-form-item>
                <el-form-item prop="path" label="菜单路径">
                    <el-input clearable placeholder="请填写菜单路径" v-model="form.path" />
                </el-form-item>
                <el-form-item prop="isEnabled" label="是否启用菜单">
                    <el-switch v-model="form.isEnabled" :active-value="0" :inactive-value="1" :active-text="'启用'"
                        :inactive-text="'禁用'"></el-switch>
                </el-form-item>
                <el-form-item prop="buttons" label="按钮列表" class="form-buttions" label-position="top" v-if="!form.isTop">
                    <div class="btn-groups">
                        <template v-for="(button, index) in form.buttons" :key="index">
                            <div class="btn-list">
                                <div class="btn-item btn-name">
                                    <div class="btn-label">按钮名称</div>
                                    <el-input class="btn-input" clearable placeholder="请填写按钮名称"
                                        v-model="form.buttons[index].btnName" />
                                </div>
                                <div class="btn-item btn-code">
                                    <div class="btn-label">按钮编码</div>
                                    <el-input class="btn-input" clearable placeholder="请填写按钮编码"
                                        v-model="form.buttons[index].btnCode" />
                                </div>
                                <div class="icons">
                                    <!-- <CirclePlus class="icon primary" /> -->
                                    <el-button title="添加" type="primary" :icon="CirclePlus" link
                                        @click="addBtnItem(index)">
                                    </el-button>
                                    <el-button v-if="index !== 0" title="删除" :icon="Delete" type="danger" link
                                        @click="delBtnItem(index)">
                                    </el-button>
                                </div>
                            </div>
                        </template>
                    </div>

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
import MySelect from '@/components/MySelect/index.vue'
import store from '@/store'
import { filterTreeByLevel } from '@/utils/util'
import { CirclePlus, Delete } from '@element-plus/icons-vue'
import { ElSwitch, FormInstance, FormRules } from 'element-plus/es'
import { computed, onMounted, reactive, ref } from 'vue'

type typeOfUseType = "pc" | "app"
interface IMenuItem {
    "factoryCode": string,
    "menuCode": string,
    "menuName": string,
    "path": string,
    "icon": string,
    "typeOfUse": typeOfUseType,
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
    "typeOfUse"?: typeOfUseType,
    "sort"?: number,
    "parentId"?: string,
    "isEnabled": number,
    isTop: boolean
    "buttons": {
        "btnCode": string,
        "btnName": string
    }[]
}
const loading = ref(false)
const tableData = ref<IMenuItem[]>([])

const formRef = ref<FormInstance>()
const typeOfUseList = reactive<{ value: string, label: string }[]>([
    { value: "app", label: "app" },
    { value: "pc", label: "pc" }
])
const open = ref(false)
const menuaction = reactive<{ isedit: boolean, actionrow: IMenuItem | null, sub: boolean }>({
    isedit: false,
    actionrow: null,
    sub: false
})

const rules = reactive<FormRules<IMenuForm>>({
    parentId: [
        { required: true, message: '请选择上级菜单', trigger: 'change' },
    ],
    typeOfUse: [
        { required: true, message: '请选择使用类型', trigger: 'change' },
    ],
    menuCode: [
        {
            required: true,
            message: '请填写菜单编码',
            trigger: 'blur',
        },
    ],
    menuName: [
        {
            required: true,
            message: '请填写菜单名称',
            trigger: 'blur',
        },
    ],
    path: [
        {
            required: true,
            message: '请填写菜单路径',
            trigger: 'blur',
        },
    ],
})

const form = ref<IMenuForm>({
    menuCode: "",
    menuName: "",
    path: "",
    isEnabled: 0,
    buttons: [
        { btnCode: "", btnName: "" }
    ],
    isTop: false
})

const treeData = computed(() => {
    return filterTreeByLevel(tableData.value, 2)
})
const factoryCode = computed(() => store.state.user.userInfo.factoryCode)
const flatMenus = computed(() => store.state.user.flatmenus)

const addMenuHandler = () => {
    open.value = true
}
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
    if (formRef.value) {
        formRef.value?.resetFields()
    }
    open.value = false
}
const addBtnItem = (index: number) => {
    form.value.buttons.splice(index + 1, 0, { btnCode: "", btnName: "" })
}
const delBtnItem = (index: number) => {
    form.value.buttons.splice(index, 1)
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
                if (requestBody.isTop) {
                    delete requestBody.buttons
                    requestBody.parentId = ""
                }
                delete requestBody.isTop

                console.log("requestBody==>", requestBody)
                const res = await AddMenuWithButtons(requestBody)
                console.log("res====>", res)
                // cancelClick()
            }
        })
    }

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

<style scoped lang="scss">
.form-buttions {
    &::v-deep(.el-form-item__label) {
        font-weight: 700;
        margin-left: 26px;
    }

    &::v-deep(.el-button) {
        margin: 0 !important;
    }
}

.btn-groups {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.btn-list {
    display: flex;

    .btn-label {
        width: 80px;
        text-align: right;
        padding-right: 8px;
        box-sizing: border-box;
    }

    .btn-item {
        display: flex;
        align-items: center;

        .btn-input {
            width: 120px;
        }
    }

    .icons {

        display: flex;
        align-items: center;
        margin-left: 4px;
        gap: 0 4px;

        &::v-deep(.el-icon) {
            font-size: 20px;
        }

        .primary {
            color: #007aff;
        }
    }
}
</style>