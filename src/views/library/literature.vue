<template>
  <div class="lib-lit">
    <ee-titlebar :ease-in="350" :ease-out="350">
      Library Literature
    </ee-titlebar>
    <div class="lib-lit__cards">
      <div v-for="(article, i) of articles"
           :key="i"
           class="card"
      >
        <header>{{ article.title }}</header>
        <article class="--subtle-scrollbar">
          {{ article.summary }}
        </article>
        <footer>
          by {{ article.author }}
          &#x2022;
          {{ useDate(article.date).toRelativeTime() }}
        </footer>
      </div>
    </div>
    <!-- <ee-footer /> -->
  </div>
</template>


<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { VuexStore } from "@/vuex/vuex-store";
import eeTitlebarVue from "@/components/layout/ee-titlebar.vue";
import { useTask } from "vue-concurrency";
import { useDataAPI } from "@/services/api_internal";
import eeFooterVue from "@/components/layout/ee-footer.vue";
import { useDate } from "@/composeables/date";

export default defineComponent({
  components: {
    'ee-titlebar': eeTitlebarVue,
    'ee-footer': eeFooterVue,
  },
  setup() {
    const store = useStore<VuexStore>();
    const api = useDataAPI();
    const articles = computed(() => store.state.dataCache['red33m/literature']);

    const getLiterature = useTask(function*() {
      const data = yield api.get('/red33m/literature', console.error);
      store.commit('data-cache-add', { name: 'red33m/literature', data });
    });


    getLiterature.perform();

    return { articles, useDate };
  }
});
</script>