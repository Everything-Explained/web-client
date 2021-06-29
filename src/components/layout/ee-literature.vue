<template>
  <div :class="['lit', sizeClass]">
    <ee-titlebar
      :ease-in="350"
      :ease-out="350"
      :text="titleRef"
    />
    <transition name="fade" mode="out-in">
      <div v-if="isRunning" class="preloader page" />
      <div v-else-if="!activePage" class="lit-cards__container">
        <ee-filter
          v-if="showFilter"
          :pages="pages"
          :reverse-order="reverseOrder"
          @filter="onFilter"
        />
        <div class="lit__cards">
          <div v-for="(article, i) of filteredPages"
               :key="i"
               class="lit__card"
          >
            <header @click="goTo(article.uri)">
              {{ article.title }}
            </header>
            <article class="lit-card__desc --subtle-scrollbar">
              {{ article.summary }}
            </article>
            <footer>
              <span v-if="showAuthor" class="lit-card__author">
                <ee-icon type="user" />
                <span :class="['lit-card__author-text', { '--is-ethan': isEthan(article.author) }]">
                  {{ article.author }}
                </span>
              </span>
              <span class="lit-card__timestamp">
                <span v-if="showDateTime" class="lit-card__full-datetime">
                  <span class="lit-card__date">
                    {{ useDate(article.date).toShortDate() }}
                  </span>
                  <span class="lit-card__time">
                    <ee-bullet />
                    {{ useDate(article.date).to12HourTime() }}
                  </span>
                </span>
                <span v-else class="lit-card__relative-time">
                  <ee-bullet />
                  {{ useDate(article.date).toRelativeTime() }}
                </span>
              </span>
            </footer>
          </div>
        </div>
        <ee-footer />
      </div>
      <div v-else-if="activePage">
        <article :class="['md', contentClass]" v-html="activePage.content" />
        <ee-footer />
      </div>
    </transition>
  </div>
</template>


<script lang="ts">
import { computed, defineComponent, onUnmounted, ref } from "vue";
import { useDate } from '@/composeables/date'
;
import eeIconVue      from "@/components/ui/ee-icon.vue";
import eeTitlebarVue  from "@/components/layout/ee-titlebar.vue";
import { StaticPage, useStaticPager } from "@/composeables/staticPager";
import eeBulletVue from "../ui/ee-bullet.vue";
import eeFooterVue from "./ee-footer.vue";
import eeFilterVue from "./ee-filter.vue";
import { VuexStore } from "@/vuex/vuex-store";
import { useStore } from "vuex";
import { isEthan } from "@/composeables/globals";



export interface Article extends StaticPage {
  summary: string;
}

const _sizes = ['compact', 'expanded'];


export default defineComponent({
  components: {
    'ee-titlebar': eeTitlebarVue,
    'ee-icon': eeIconVue,
    'ee-bullet': eeBulletVue,
    'ee-footer': eeFooterVue,
    'ee-filter': eeFilterVue,
  },
  props: {
    size         : { type: String,  default: 'compact'       },
    uri          : { type: String,  default: ''              },
    title        : { type: String,  default: 'Default Title' },
    contentClass : { type: String,  default: ''              },
    showAuthor   : { type: Boolean, default: true            },
    showDateTime : { type: Boolean, default: false           },
    showFilter   : { type: Boolean, default: true            },
    reverseOrder : { type: Boolean, default: false           },
  },
  setup(props) {
    const { size, uri } = props;
    const sizeClass = { 'lit-expanded': size == 'expanded' };
    const store = useStore<VuexStore>()
    ;
    if (!uri) throw Error('literature::Missing URL');
    if (!_sizes.includes(size)) throw Error('literature::Invalid Size')
    ;
    const pager    = useStaticPager<Article>(uri);
    const titleRef = computed(
      () => pager.pageTitle.value || props.title
    );
    const filteredPages =
      props.showFilter
        ? ref<Article[]>([])
        : pager.pages
    ;

    function onFilter(pages: Article[]) { filteredPages.value = pages; }

    onUnmounted(() => {
      // Reset filter on page navigation
      store.commit('filter-upd-persist', false);
    });

    return {
      titleRef,
      ...pager,
      useDate,
      onFilter,
      filteredPages,
      isEthan,
      sizeClass,
    };
  }
});
</script>