<script setup lang="ts"></script>

<template>
  <main class="main">
    <div class="sidebar">
      <div class="sidebar__logo">
        <a href="" class="logo" @click.stop.prevent=""
          ><img src="../assets/images/logo.png" alt="SPIKER"
        /></a>
      </div>
      <nav class="side-nav">
        <ul>
          <li>
            <router-link
              :to="{
                name: 'monitor',
              }"
            >
              <i class="fa-solid fa-chart-line"></i>
            </router-link>
          </li>
          <li>
            <router-link
              :to="{
                name: 'measurement',
              }"
            >
              <i class="fa-solid fa-person-pregnant"></i>
            </router-link>
          </li>

          <li>
            <a href="" class=""><i class="fa-solid fa-circle-info"></i></a>
          </li>
        </ul>
      </nav>
    </div>
    <div class="content">
      <router-view />
    </div>
  </main>
  <footer>
    <div class="footer__inner"></div>
    <!-- /.footer__inner -->
  </footer>
</template>
