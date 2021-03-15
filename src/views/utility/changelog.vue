<template>
  <div class='changelog'>
    <ee-literature url="/changelog"
                   size="expanded"
                   :show-date-time="true"
                   :show-author="false"
                   content-class="chglog"
                   title="Changelog"
    />
    <ee-footer />
  </div>
</template>

<script lang='ts'>
import eeFooterVue from "@/components/layout/ee-footer.vue";
import eeLiteratureVue from "@/components/layout/ee-literature.vue";
import { defineComponent } from "vue";
import logs from './changelog.json';

export default defineComponent({
  components: {
    'ee-literature': eeLiteratureVue,
    'ee-footer': eeFooterVue,
  },
  setup() {
    return { logs };
  }
});
</script>