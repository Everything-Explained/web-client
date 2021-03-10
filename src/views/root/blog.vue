<template>
  <div class="blog">
    <ee-literature title="Blog Entires"
                   size="expanded"
                   :show-date-time="true"
                   url="/blog"
    />
    <ee-footer />
  </div>
</template>



<script lang='ts'>
import { defineComponent } from "vue"
;
import eeFooterVue   from '@/components/layout/ee-footer.vue';
import eeLiteratureVue from "@/components/layout/ee-literature.vue";


export default defineComponent({
  components: { 'ee-footer': eeFooterVue, 'ee-literature': eeLiteratureVue, },
});
</script>