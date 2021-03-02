<template>
  <div class="lib-lit">
    <ee-literature title="Library Literature"
                   url="/library/literature"
    />
    <ee-footer />
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
;
import eeLiteratureVue from "@/components/layout/ee-literature.vue";
import eeFooterVue     from "@/components/layout/ee-footer.vue";


export default defineComponent({
  components: { 'ee-footer': eeFooterVue, 'ee-literature': eeLiteratureVue, }
});
</script>