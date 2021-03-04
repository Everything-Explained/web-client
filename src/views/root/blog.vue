<template>
  <div class="blog">
    <ee-literature title="Blog Entires"
                   size="expanded"
                   url="/blog"
    />
    <ee-footer />
  </div>
</template>



<script lang='ts'>
import { computed, defineComponent } from "vue";
import eeFooterVue   from '@/components/layout/ee-footer.vue';
import { StaticPage, useStaticPager } from "@/composeables/staticPager";
import eeLiteratureVue from "@/components/layout/ee-literature.vue";



interface BlogPost extends StaticPage {
  image_header?: string;
  summary: string;
}


export default defineComponent({
  components: { 'ee-footer': eeFooterVue, 'ee-literature': eeLiteratureVue, },
  setup() {
    const pager    = useStaticPager<BlogPost>('/blog');
    const titleRef = computed(
      () => pager.pageTitle.value || 'Blog Entries'
    );
    return { ...pager, titleRef, };
  },
});
</script>