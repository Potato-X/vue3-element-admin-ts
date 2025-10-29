<template>
  <div class="login-wrap" :style="style">
    <div class="login-content">
      <div class="login-title">系统登录</div>
      <el-form ref="loginFormRef" class="login-form" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" clearable placeholder="用户名:superadmin" size="large">
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
import { ElMessage, FormInstance } from 'element-plus'
import type { CSSProperties, Ref } from 'vue'
import { computed, inject, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const baseConfig = inject<Ref<IBaseConfig>>("baseconfig")

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
  username: '',
  password: ''
})

const loginFormRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
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

  loginFormRef.value?.validate((valid) => {
    if (valid) {
      GetFactory({
        pageIndex: 1,
        pageSize: 50
      })
      // btnLoading.value = true
      // // 访问登录接口
      // store
      //   .dispatch('user/login', loginForm)
      //   .then(() => {
      //     router.push('/')
      //   })
      //   .finally(() => {
      //     btnLoading.value = false
      //   })
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
