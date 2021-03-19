<template>
  <ee-literature title="Library Literature"
                 url="/library/literature"
  />
</template>


<script lang="ts">
import { defineComponent } from "vue"
;
import eeLiteratureVue from "@/components/layout/ee-literature.vue";


export default defineComponent({
  components: { 'ee-literature': eeLiteratureVue, }
});
</script>