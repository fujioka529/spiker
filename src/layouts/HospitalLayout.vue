<script setup lang="ts">
import HeaderComp from "../components/HeaderComp.vue";
</script>

<template>
  <main class="main">
    <div class="sidebar">
      <div class="sidebar__logo">
        <a href="" class="logo"><img src="../assets/images/logo.png" alt="SPIKER" /></a>
      </div>
    </div>
    <div class="content">
      <header-comp />
      <router-view />
    </div>
  </main>
</template>
