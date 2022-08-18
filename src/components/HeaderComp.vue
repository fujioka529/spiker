<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useAccessToken } from "../store/access_token";
const store = useAccessToken();
const router = useRouter();

const logout = () => {
  const { logout } = store;
  logout();
  router.push({
    name: "login",
  });
};
</script>

<template>
  <header>
    <a class="header__logo">
      <img src="../assets/images/logotype.png" alt="SPIKER" />
      <div class="header__name">ALERT Monitor</div>
    </a>

    <div class="header__login">
      <div class="logout__wrap">
        <button @click="logout">ログアウト</button>
      </div>
    </div>
  </header>
</template>
