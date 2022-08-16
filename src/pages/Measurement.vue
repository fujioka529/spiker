<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import HeaderComp from "../components/HeaderComp.vue";
import Loading from "../components/Loading.vue";
import Paginate from "vuejs-paginate-next";

import useMeasurement from "../composables/net/measurement";
import { Measurement } from "../types/response-types";
import dayjs from "dayjs";

const total = ref<number>(0);
const measurements = ref<Measurement[]>([]);
const pageCount = ref<number>(1);
const perPage = ref<number>(30);
const offset = ref<number>(0);

const { listMeasurements } = useMeasurement();

const loading = ref<boolean>(true);
const fetchMeasurements = async () => {
  try {
    [total.value, measurements.value] = await listMeasurements(
      perPage.value,
      offset.value
    );
    pageCount.value = Math.floor(total.value / perPage.value) + 1;
  } finally {
    loading.value = false;
  }
};

const measurementTime = (measurement: Measurement) => {
  let min = dayjs(measurement.lastTime).diff(dayjs(measurement.firstTime), "m", true);
  let sec = (min - Math.floor(min)) * 60.0;
  return (
    String(Math.floor(min)).padStart(2, "0") +
    ":" +
    String(Math.floor(sec)).padStart(2, "0")
  );
};

const onPageClicked = async (page: number) => {
  offset.value = (page - 1) * perPage.value;
  fetchMeasurements();
};

// 計測一覧を取得する

onMounted(() => {
  fetchMeasurements();
});
</script>

<template>
  <loading v-if="loading" />
  <header-comp />
  <div class="content-main status-success">
    <h1 class="page-title">
      <i class="fa-solid fa-person-pregnant"></i>{{ $t("measurementList") }}
    </h1>
    <!--
    <section class="list-search">
      <div class="list-search__input">
        <input type="text" id="" name="" required="" />
        <button type="submit" class="btn list-btn">検索</button>
      </div>
    </section>
    -->
    <section class="list">
      <!--
      <div class="list-filter">
        <div class="list-filter__item">
          <label>Risk :</label>
          <div class="select__wrap">
            <select name="name" id="name">
              <option value="太郎">すべて表示</option>
              <option value="太郎">太郎</option>
              <option value="二郎">二郎</option>
              <option value="三郎">三郎三郎三郎三郎三郎</option>
            </select>
          </div>
        </div>
        <div class="list-filter__item">
          <label>Date:</label>
          <div class="select__wrap">
            <select name="name" id="name">
              <option value="">2022-04-05</option>
            </select>
          </div>
          <label>〜</label>
          <div class="select__wrap">
            <select name="name" id="name">
              <option value="">2022-04-10</option>
            </select>
          </div>
        </div>
      </div>
      -->
      <paginate
        :page-count="pageCount"
        :click-handler="onPageClicked"
        :prev-text="$t('prev')"
        :next-text="$t('next')"
        :container-class="'pagination'"
      >
      </paginate>

      <div class="list__content">
        <div class="list__table">
          <div class="list__row list__title">
            <div class="list__col list__id">ID</div>
            <div class="list__col list__status">{{ $t("isClosed") }}</div>
            <div class="list__col list__code">{{ $t("measurementCode") }}</div>
            <div class="list__col list__update">{{ $t("measurementStartAt") }}</div>
            <div class="list__col list__update">{{ $t("measurementUpdateAt") }}</div>
            <div class="list__col list__update">{{ $t("measurementTime") }}</div>
            <div class="list__col list__oparation">{{ $t("toGraph") }}</div>
          </div>
          <!-- /.list__title -->
          <div
            class="list__row"
            v-for="measurement in measurements"
            :key="measurement.id"
            :class="{
              'status-level3': !measurement.isClosed,
            }"
          >
            <div class="list__col list__id">{{ measurement.id }}</div>
            <div class="list__col list__status">
              <template v-if="measurement.isClosed">{{ $t("isClosed") }} </template>
              <template v-else>{{ $t("isRunning") }}</template>
            </div>
            <div class="list__col list__code">{{ measurement.code }}</div>
            <div class="list__col list__update">
              {{ $dayjs(measurement.firstTime).format("YYYY-MM-DD HH:mm:ss") }}
            </div>
            <div class="list__col list__update">
              {{ $dayjs(measurement.lastTime).format("YYYY-MM-DD HH:mm:ss") }}
            </div>
            <div class="list__col list__update">
              {{ measurementTime(measurement) }}
            </div>
            <div class="list__col list__oparation">
              <a href="#">
                <router-link
                  :to="{
                    name: 'measurementChart',
                    params: {
                      uuid: hospitalUuid,
                      id: measurement.id,
                    },
                  }"
                >
                  <i class="fa-solid fa-chart-bar"></i>
                </router-link>
              </a>
            </div>
          </div>
        </div>
        <paginate
          :page-count="pageCount"
          :click-handler="onPageClicked"
          :prev-text="$t('prev')"
          :next-text="$t('next')"
          :container-class="pagination"
        >
        </paginate>

        <!-- /.list__table -->
      </div>
      <!-- /.list__content -->
    </section>
  </div>
  <!-- /.content-main -->
</template>

<style>
.pagination {
  display: inline-block;
  padding-left: 0;
  margin: 20px 0;
  border-radius: 4px;
}

.pagination > li {
  display: inline;
}

.pagination > li:first-child > a,
.pagination > li:first-child > span {
  margin-left: 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.pagination > .disabled > span,
.pagination > .disabled > span:hover,
.pagination > .disabled > span:focus,
.pagination > .disabled > a,
.pagination > .disabled > a:hover,
.pagination > .disabled > a:focus {
  color: #777;
  cursor: not-allowed;
  background-color: #fff;
  border-color: #ddd;
}

.pagination > li > a,
.pagination > li > span {
  position: relative;
  float: left;
  padding: 6px 12px;
  margin-left: -1px;
  line-height: 1.42857143;
  color: #fe0000;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid #ddd;
  cursor: pointer;
}

.pagination > .active > a,
.pagination > .active > span,
.pagination > .active > a:hover,
.pagination > .active > span:hover,
.pagination > .active > a:focus,
.pagination > .active > span:focus {
  z-index: 2;
  color: #fff;
  cursor: default;
  background-color: #fe0000;
  border-color: #fe0000;
}
</style>
