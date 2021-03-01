<template>
  <div class="lit">
    <ee-titlebar :ease-in="350"
                 :ease-out="350"
                 :text="titleRef"
    />
    <transition name="fade" mode="out-in">
      <div v-if="getLiterature.isRunning" class="preloader page" />
      <div v-else-if="articles.length && !activeArticle" class="lit__cards">
        <div v-for="(article, i) of articles"
             :key="i"
             class="lit__card"
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
            <span :class="['lit-card__author', { '--is-ethan': isEthan(article.author) }]">
              {{ article.author }}
            </span>
            <span class="lit-card__timestamp">
              &#x2022; {{ useDate(article.date).toRelativeTime() }}
            </span>
          </footer>
        </div>
      </div>
      <div v-else>
        <article class="md" v-html="activeArticle.content" />
      </div>
    </transition>
  </div>
</template>


<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { useStore }   from "vuex";
import { VuexStore }  from "@/vuex/vuex-store";
import { useTask }    from "vue-concurrency";
import { useDataAPI } from "@/services/api_internal";
import { useDate }    from "@/composeables/date";
import { useRoute }   from "vue-router";
import router         from "@/router"
;
import eeIconVue      from "@/components/ui/ee-icon.vue";
import eeTitlebarVue  from "@/components/layout/ee-titlebar.vue";



export default defineComponent({
  components: {
    'ee-titlebar': eeTitlebarVue,
    'ee-icon': eeIconVue,
  },
  props: {
    url:   { type: String, default: ''              },
    title: { type: String, default: 'Default Title' }
  },
  setup(props) {
    if (!props.url) throw Error('literature::Missing URL')
    ;
    const titleRef      = ref(props.title);
    const activeArticle = ref<any|null>(null);
    const route         = useRoute();
    const articleURI    = route.params.article as string|undefined;
    const store         = useStore<VuexStore>()
    ;
    const articles = computed(() => store.state.dataCache[props.url]);
    function displayArticle(uri: string) {
      console.log(articles);
      const article = articles.value.find(a => a.uri == uri);
      if (!article) { router.push('/404'); return; }
      titleRef.value = article.title;
      activeArticle.value = article;
    }

    const api = useDataAPI();
    const getLiterature = useTask(function*() {
      const data = yield api.get(props.url, console.error);
      store.commit('data-cache-add', { name: props.url, data });
      // The URL points to a specific article on page load
      if (articleURI) displayArticle(articleURI);
    });

    function isEthan(author: string) {
      return author.toLowerCase().includes('ethan');
    }

    function goTo(uri: string) {
      router.push(`${props.url}/${uri}`);
    }

    watch(() => route.params,
      async (params) => {
        if (!route.path.includes(props.url)) return;
        if (!params.article) {
          activeArticle.value = null;
          titleRef.value = props.title;
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
      titleRef,
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