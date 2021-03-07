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
            <span v-if="showAuthor" class="lit-card__author">
              <ee-icon type="user" />
              <span :class="['lit-card__author-text', { '--is-ethan': isEthan(article.author) }]">
                {{ article.author }}
              </span>
            </span>
            <span class="lit-card__timestamp">
              <span v-if="showFullDate" class="lit-card__full-datetime">
                <span class="lit-card__date"> <ee-bullet /> {{ useDate(article.date).toShortDate() }}</span>
                <span class="lit-card__time"> <ee-bullet /> {{ useDate(article.date).to12HourTime() }}</span>
              </span>
              <span v-else class="lit-card__relative-time">{{ useDate(article.date).toRelativeTime() }}</span>
            </span>
          </footer>
        </div>
      </div>
      <div v-else-if="activePage">
        <article :class="['md', contentClass]" v-html="activePage.content" />
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
import eeBulletVue from "../ui/ee-bullet.vue";



interface Article extends StaticPage {
  summary: string;
}

const _sizes = ['compact', 'expanded'];


export default defineComponent({
  components: {
    'ee-titlebar': eeTitlebarVue,
    'ee-icon': eeIconVue,
    'ee-bullet': eeBulletVue,
  },
  props: {
    size         : { type: String,  default: 'compact'       },
    url          : { type: String,  default: ''              },
    title        : { type: String,  default: 'Default Title' },
    contentClass : { type: String,  default: ''              },
    showAuthor   : { type: Boolean, default: true            },
    showFullDate : { type: Boolean, default: false           },
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