<template>
  <router-view />
</template>

<script lang="ts" setup>
import { mergeObjects } from '@/utils/util';
import { provide, Ref, ref } from 'vue';
import { IBaseConfig } from './@types/store';
import { getConfig } from './api/common';
const baseConfig = ref<IBaseConfig>({
  loginBgImage: '/img/login_bg.jpg',
  systemName: "后台管理系统",
  productLogo: '/img/logo.png'
})
const getConfigAction = async () => {
  const config = await getConfig() as unknown as IBaseConfig
  baseConfig.value = mergeObjects(baseConfig.value, config)
  console.log(config, baseConfig.value)
}

getConfigAction()
provide<Ref<IBaseConfig | undefined>>("baseconfig", baseConfig)
</script>
