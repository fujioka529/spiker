<script setup lang="ts">
import { reactive, ref } from 'vue'
import useAccount from '../composables/net/account'
import router from '../router'

interface loginForm {
  userName: string
  password: string
}

const form = reactive<loginForm>({
  userName: '',
  password: '',
})

const errorFlag = ref<boolean>(false)

//-- Events
const onLoginClicked = async () => {
  try {
    errorFlag.value = false
    await useAccount().login(form.userName, form.password)
    router.replace('/')
  } catch (e) {
    errorFlag.value = true
  }
}
</script>

<template>
  <main class="main">
    <div class="content">
      <header>
        <a class="header__logo">
          <img src="../assets/images/logotype.png" alt="SPIKER" />
          <div class="header__name">CTG Alert Monitor</div>
        </a>
      </header>

      <div class="content-main status-success">
        <h1 class="page-title">
          <i class="fa-solid fa-arrow-right-to-bracket"></i>{{ $t('login') }}
        </h1>

        <div class="login">
          <form class="form">
            <div class="login_main">
              <label class="username"
                ><h2>{{ $t('userName') }}</h2></label
              >
              <input id="username" type="text" tabindex="100" v-model="form.userName" />
              <label class="password"
                ><h2>{{ $t('password') }}</h2></label
              >
              <input
                id="password"
                type="password"
                tabindex="200"
                v-model="form.password"
              />
            </div>
            <p v-if="errorFlag" class="error">{{ $t('Incollect login or password') }}</p>
            <div class="login_btn">
              <button
                class="btn list-btn"
                tabindex="300"
                type="submit"
                id="signin"
                @click.stop.prevent="onLoginClicked"
              >
                {{ $t('btnLogin') }}
              </button>
            </div>
          </form>
        </div>
      </div>
      <!-- /.content-main -->
    </div>
    <!-- /.content -->
  </main>
</template>

<style scoped>
.error {
  text-align: center;
  color: red;
}
</style>
