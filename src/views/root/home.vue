<template>
  <div class="container">
    <title-bar>Home</title-bar>
    <div class="home md" v-html="content"></div>
    <ee-footer></ee-footer>
  </div>
</template>



<script lang='ts'>
import mdHomePages from './home.json';
import { defineComponent } from "vue";
import titlebar from '@/components/layout/ee-titlebar.vue';
import eeFooterVue from '@/components/layout/ee-footer.vue';


export default defineComponent({
  components: { 'title-bar': titlebar, 'ee-footer': eeFooterVue },
  setup() { return { content: mdHomePages[0].content }; }
});
</script>