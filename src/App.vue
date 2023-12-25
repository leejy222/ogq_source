<script setup lang="ts">
import { RouterView } from 'vue-router'
import { DotLoader } from "vue3-spinner"
import { spinnerStore } from './stores/SpinnerStore';

const spinner = spinnerStore();
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">
          <p class="text-3xl font-bold text-center">Home</p>
        </RouterLink>
        <RouterLink to="/local-info">
          <p class="text-3xl font-bold text-center">
            지역정보
          </p>
        </RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
  <DotLoader v-if="spinner.getStatus" />
</template>

<style lang="scss">
@import "@/assets/css/style.scss";
</style>