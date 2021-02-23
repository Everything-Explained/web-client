<template>
  <div class="container">
    <ee-titlebar>About Us</ee-titlebar>
    <div class="home md" v-html="content" />
    <ee-footer />
  </div>
</template>



<script lang='ts'>
import mdHomePages from '../../../release/web_client/_data/pages/home.json';
import { defineComponent } from "vue"
;
import eeTitlebarVue from '@/components/layout/ee-titlebar.vue';
import eeFooterVue from '@/components/layout/ee-footer.vue';



export default defineComponent({
  components: { 'ee-titlebar': eeTitlebarVue, 'ee-footer': eeFooterVue },
  setup() { return { content: mdHomePages[0].content }; }
});
</script>