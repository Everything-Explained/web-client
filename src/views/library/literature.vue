<template>
  <div class="lib-lit">
    <ee-titlebar :ease-in="350"
                 :ease-out="350"
                 :text="title"
    />
    <transition name="fade" mode="out-in">
      <div v-if="getLiterature.isRunning" class="preloader page" />
      <div v-else-if="articles.length && !activeArticle" class="lib-lit__cards">
        <div v-for="(article, i) of articles"
             :key="i"
             class="lib-lit__card"
        >
          <header @click="goTo(article.uri)">
            {{ article.title }}
          </header>
          <article class="--subtle-scrollbar">
            {{ article.summary }}
          </article>
          <footer>
            <ee-icon type="user" />
            <!-- by -->
            <span :class="['lib-lit-card__author', { '--is-ethan': isEthan(article.author) }]">
              {{ article.author }}
            </span>
            <span class="lib-lit-card__timestamp">
              &#x2022; {{ useDate(article.date).toRelativeTime() }}
            </span>
          </footer>
        </div>
      </div>
      <div v-else>
        <article class="md" v-html="activeArticle.content" />
      </div>
    </transition>
    <ee-footer />
  </div>
</template>


<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";
import { VuexStore } from "@/vuex/vuex-store";
import eeTitlebarVue from "@/components/layout/ee-titlebar.vue";
import { useTask } from "vue-concurrency";
import { useDataAPI } from "@/services/api_internal";
import eeFooterVue from "@/components/layout/ee-footer.vue";
import { useDate } from "@/composeables/date";
import eeIconVue from "@/components/ui/ee-icon.vue";
import { useRoute } from "vue-router";
import router from "@/router";

export default defineComponent({
  components: {
    'ee-titlebar': eeTitlebarVue,
    'ee-footer': eeFooterVue,
    'ee-icon': eeIconVue,
  },
  setup() {
    const title = ref('Default Title');
    const activeArticle = ref<any|null>(null);
    const route = useRoute();
    const articleURI = route.params.article as string|undefined;
    const store = useStore<VuexStore>()
    ;
    const articles = computed(() => store.state.dataCache['red33m/literature']);
    function displayArticle(uri: string) {
      const article = articles.value.find(a => a.uri == uri);
      if (!article) { router.push('/404'); return; }
      title.value = article.title;
      activeArticle.value = article;
    }

    const api = useDataAPI();
    const getLiterature = useTask(function*() {
      const data = yield api.get('/library/literature', console.error);
      store.commit('data-cache-add', { name: 'red33m/literature', data });
      // The URL points to a specific article on page load
      if (articleURI) displayArticle(articleURI);
    });

    const isEthan = (author: string) => {
      return author.toLowerCase().includes('ethan');
    };

    const goTo = (uri: string) => {
      router.push(`/library/literature/${uri}`);
    };

    watch(() => route.params,
      async (params) => {
        if (!route.path.includes('/library/literature')) return;
        if (!params.article) {
          activeArticle.value = null;
          title.value = 'Default Title';
          return;
        }
        displayArticle(params.article as string);
      }
    );

    if (!articles.value) getLiterature.perform();
    // An edge case when navigating away from an article to a
    // non-article page, then backing the history to that article.
    if (articles.value && articleURI) displayArticle(articleURI);


    return {
      title,
      articles,
      activeArticle,
      getLiterature,
      useDate,
      isEthan,
      goTo
    };
  }
});
</script>