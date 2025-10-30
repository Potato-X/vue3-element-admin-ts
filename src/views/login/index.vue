<template>
  <div class="login-wrap" :style="style">
    <div class="login-content">
      <div class="login-title">系统登录</div>
      <el-form ref="loginFormRef" class="login-form" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="FactoryCode">
          <MySelect size="large" placeholder="请选择单位" :options="factoryoptions" v-model="loginForm.FactoryCode"
            clearable></MySelect>
        </el-form-item>
        <el-form-item prop="userCode">
          <el-input v-model="loginForm.userCode" clearable placeholder="用户名:superadmin" size="large">
            <template #prepend>
              <I name="UserFilled" size="14" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="密码:123456" size="large" :type="passwordType"
            @keyup.enter="submitForm">
            <template #prepend>
              <I v-if="passwordLock" name="Lock" size="14" @click="switchPass" />
              <I v-else name="Unlock" size="14" @click="switchPass" />
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" :loading="btnLoading" @click="submitForm">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IBaseConfig } from '@/@types/store'
import { GetFactory } from '@/api/factory'
import MySelect from '@/components/MySelect/index.vue'
import store from '@/store'
import { ElMessage, FormInstance } from 'element-plus'
import type { CSSProperties, Ref } from 'vue'
import { computed, inject, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
const baseConfig = inject<Ref<IBaseConfig>>("baseconfig")
const factoryoptions = ref<{
  value: any,
  label: string
}[]>([])
const style = computed(() => {
  if (baseConfig?.value && baseConfig.value.loginBgImage) {
    return {
      '--login-bg': `url(${baseConfig.value.loginBgImage})`
    } as CSSProperties
  } else {
    return {
      '--login-bg': 'url("/img/login_bg.jpg")'
    } as CSSProperties
  }
})

const router = useRouter()

const btnLoading = ref(false)
const passwordLock = ref(true)
const passwordType = ref('password')

const loginFormRef = ref<FormInstance>()
const loginForm = reactive({
  userCode: '',
  password: '',
  FactoryCode: "",
})

const loginFormRules = reactive({
  FactoryCode: [{ required: true, message: '请选择工厂', trigger: 'change' }],
  userCode: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})
onMounted(async () => {
  const res = await GetFactory({
    pageIndex: 1,
    pageSize: 50
  })

  if (res.data && res.data.data) {
    console.log("res==>", res)
    factoryoptions.value = res.data.data.map((item: any) => {
      return {
        value: item.factoryCode,
        label: item.factoryName
      }
    })
    console.log("factoryoptions.value===>", factoryoptions.value)
  }
})
const switchPass = () => {
  if (passwordLock.value) {
    passwordType.value = 'text'
  } else {
    passwordType.value = 'password'
  }
  passwordLock.value = !passwordLock.value
}

const submitForm = async () => {

  loginFormRef.value?.validate(async (valid) => {
    if (valid) {
      btnLoading.value = true
      // 访问登录接口
      store
        .dispatch('user/login', loginForm)
        .then(() => {
          router.push('/')
        })
        .finally(() => {
          btnLoading.value = false
        })
    } else {
      ElMessage.error('请输入用户名和密码')
    }
  })
}
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #235bae;
  background-image: var(--login-bg);
  background-size: cover;
}

.login-title {
  width: 100%;
  font-size: 20px;
  line-height: 50px;
  color: #fff;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.login-content {
  position: absolute;
  top: 50%;
  right: 5%;
  width: 350px;
  margin: -190px 0 0 -175px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
}

.login-form {
  padding: 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #85155c;
}
</style>
