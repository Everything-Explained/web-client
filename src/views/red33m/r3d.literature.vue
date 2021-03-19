<template>
  <div class="r3d-lit">
    <ee-literature title="RED33M Literature"
                   url="/red33m/literature"
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