<template>
  <ee-literature title="Blog Entires"
                 size="expanded"
                 :show-date-time="true"
                 url="/blog"
  />
</template>



<script lang='ts'>
import { defineComponent } from "vue"
;
import eeLiteratureVue from "@/components/layout/ee-literature.vue";


export default defineComponent({
  components: { 'ee-literature': eeLiteratureVue, },
});
</script>