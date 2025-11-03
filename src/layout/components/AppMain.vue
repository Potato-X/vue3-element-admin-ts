<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'AppMain'
})
</script>

<style scoped>
.app-main {
  position: relative;

  /* 84 = navbar + tags-view = 50 +34 */
  height: calc(100vh - 84px);
  padding: 20px;
  overflow-x: hidden;
}
</style>
