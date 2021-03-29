<template>
  <ee-literature uri="changelog"
                 size="expanded"
                 :show-date-time="true"
                 :show-author="false"
                 content-class="chglog"
                 title="Changelog"
  />
</template>

<script lang='ts'>
import eeLiteratureVue from "@/components/layout/ee-literature.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { 'ee-literature': eeLiteratureVue, },
});
</script>

