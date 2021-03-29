<template>
  <div class="r3d-lit">
    <ee-literature title="RED33M Literature"
                   uri="red33m/literature"
    />
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue"
;
import eeLiteratureVue from "@/components/layout/ee-literature.vue";


export default defineComponent({
  components: { 'ee-literature': eeLiteratureVue, }
});
</script>