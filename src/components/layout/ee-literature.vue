<template>
  <div :class="['lit', sizeClass]">
    <ee-titlebar :ease-in="350"
                 :ease-out="350"
                 :text="titleRef"
    />
    <transition name="fade" mode="out-in">
      <div v-if="isRunning" class="preloader page" />
      <div v-else-if="pages.length && !activePage" class="lit__cards">
        <div v-for="(article, i) of pages"
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
      <div v-else-if="activePage">
        <article class="md" v-html="activePage.content" />
      </div>
    </transition>
  </div>
</template>


<script lang="ts">
import { computed, defineComponent } from "vue";
import { useDate }    from "@/composeables/date"
;
import eeIconVue      from "@/components/ui/ee-icon.vue";
import eeTitlebarVue  from "@/components/layout/ee-titlebar.vue";
import { StaticPage, useStaticPager } from "@/composeables/staticPager";



interface Article extends StaticPage {
  summary: string;
}

const _sizes = ['compact', 'expanded'];


export default defineComponent({
  components: {
    'ee-titlebar': eeTitlebarVue,
    'ee-icon': eeIconVue,
  },
  props: {
    size:  { type: String, default: 'compact'       },
    url:   { type: String, default: ''              },
    title: { type: String, default: 'Default Title' }
  },
  setup(props) {
    const { size, url } = props;
    const sizeClass = {
      'lit-expanded': size == 'expanded'
    };
    if (!url) throw Error('literature::Missing URL');
    if (!_sizes.includes(size)) throw Error('literature::Invalid Size')
    ;
    const pager    = useStaticPager<Article>(url);
    const titleRef = computed(
      () => pager.pageTitle.value || props.title
    );

    function isEthan(author: string) {
      return author.toLowerCase().includes('ethan');
    }

    return {
      titleRef,
      ...pager,
      useDate,
      isEthan,
      sizeClass,
    };
  }
});
</script>