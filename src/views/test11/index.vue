<template>
    <div class="page">
        这是test11页面
    </div>
</template>

<script setup lang="ts">
import { AddMenuWithButtons, DeleteMenu, GetMenuTree, } from '@/api/menu'
import MySelect from '@/components/MySelect/index.vue'
import store from '@/store'
import { filterTreeByLevel } from '@/utils/util'
import { CirclePlus, Delete, RefreshRight } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, ElSwitch, FormInstance, FormRules } from 'element-plus/es'
import { computed, onMounted, reactive, ref } from 'vue'

type typeOfUseType = "PC" | "APP"

interface IMenuForm {
    "id"?: number,
    "menuCode": string,
    "menuName": string,
    "path": string,
    "icon"?: string,
    "typeOfUse": typeOfUseType,
    "sort"?: number,
    "parentId"?: string,
    "isEnabled": number,
    isTop: boolean
    "buttons": {
        "btnCode": string,
        "btnName": string
    }[],
    [key: string]: any
}
interface IMenuItem extends IMenuForm {
    "factoryCode": string,
    "children": IMenuItem[],
    "createCode": string,
    "createTime": string,
    "updateCode": string,
    "updateTime": string
}
const loading = ref(false)
const tableData = ref<IMenuItem[]>([])

const formRef = ref<FormInstance>()
const typeOfUseList = reactive<{ value: string, label: string }[]>([
    { value: "APP", label: "APP" },
    { value: "PC", label: "PC" }
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
    isTop: false,
    parentId: "",
    typeOfUse: "PC"
})

const treeData = computed(() => {
    return filterTreeByLevel(tableData.value, 2, (node: IMenuItem) => {
        return node.menuCode === menuaction.actionrow?.menuCode
    })
})
const factoryCode = computed(() => store.state.user.userInfo.factoryCode)
const flatMenus = computed(() => store.state.user.flatmenus)

const addMenuHandler = () => {
    open.value = true
    menuaction.isedit = false
    menuaction.actionrow = null
}

const editHandler = (row: IMenuItem) => {
    open.value = true
    menuaction.isedit = true
    menuaction.actionrow = row
    for (const key in form.value) {
        console.log(key)
        if (!Object.hasOwn(form.value, key)) continue;
        form.value[key] = menuaction.actionrow[key as keyof typeof form.value];
    }
    form.value.isTop = !row.parentId;
}
const getTreePropValue = (treeNode: IMenuItem, prop: string, children: string = "children") => {
    const data: any[] = []
    const callback = (treeNode: IMenuItem, prop: string, children: string) => {
        data.push(treeNode[prop])
        if (treeNode.children && treeNode.children.length) {
            for (const child of treeNode.children) {
                callback(child, prop, children)

            }
        }
    }
    callback(treeNode, prop, children)
    return data
}
const deleteHandler = (row: IMenuItem) => {
    let content = `确定要删除“${row.menuName}”菜单？该操作不可恢复`
    let deleteIds = []
    if (row.children && row.children.length) {
        content = `确定要删除“${row.menuName}”菜单？此操作会导致当前菜单及其子菜单一并删除并且该操作不可恢复`
        deleteIds = getTreePropValue(row, "id")
    } else {
        deleteIds.push(row.id)
    }
    console.log(deleteIds)
    ElMessageBox.confirm(content, "警告", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
    }).then(async () => {
        const res = await DeleteMenu({
            Id: deleteIds.join(',')
        })
        if (res.success) {
            refresh()
            return ElMessage.success(res.message)
        }
        return ElMessage.error(res.message)
    })

}
const cancelClick = () => {
    if (formRef.value) {
        form.value = {
            menuCode: "",
            menuName: "",
            path: "",
            isEnabled: 0,
            buttons: [
                { btnCode: "", btnName: "" }
            ],
            isTop: false,
            parentId: "",
            typeOfUse: "PC"
        }
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
const refresh = async () => {
    loading.value = true
    const res = await GetMenuTree<Partial<IMenuItem[]>>({
        FactoryCode: factoryCode.value
    })
    if (res.data) {
        tableData.value = res.data as IMenuItem[]
    }
    loading.value = false
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