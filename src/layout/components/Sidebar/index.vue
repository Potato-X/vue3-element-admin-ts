<template>
  <div class="sidebar-container">
    <div class="logo" @click="$router.push('/')">
      <img class="logo-img" :src="baseConfig?.productLogo" alt="logo" />
      <transition name="fade-transform" mode="out-in">
        <h1 v-show="opened" class="logo-text">{{ baseConfig?.systemName }}</h1>
      </transition>
    </div>
    <el-scrollbar class="scrollbar-wrapper">
      <el-menu :router="true" class="v-enter-to" :default-active="$route.path" :collapse="isCollapse"
        :show-timeout="200" text-color="#fff" background-color="#4a5a74" active-text-color="#409EFF">
        <SidebarItem v-for="item in routerList" :key="item.path" :index="item.path" :nav="item" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { IBaseConfig } from '@/@types/store'
import store from '@/store'
import { getMenus } from '@/utils/auth'
import { computed, inject, onMounted, ref, Ref } from 'vue'
import SidebarItem from './SidebarItem.vue'

const baseConfig = inject<Ref<IBaseConfig>>("baseconfig")
// const roles = getRoles()
// const flatMenus = getFlatMenus()
const menus = getMenus()
const routerList = ref<any[]>([])
const opened = computed(() => store.state.app.sidebar.opened)
const isCollapse = computed(() => !opened.value)

onMounted(() => {
  routerList.value = menus
  console.log("routerList====>", routerList.value)
})


</script>

<style lang="scss" scoped="scoped">
.logo {
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  overflow: hidden;
  text-align: center;
  cursor: pointer;
  background-color: #2b2f3a;

  .logo-img {
    width: 32px;
    height: 32px;
  }

  .logo-text {
    display: inline-block;
    height: 50px;
    margin-left: 12px;
    font-size: 14px;
    line-height: 50px;
    color: #fff;
  }
}
</style>
