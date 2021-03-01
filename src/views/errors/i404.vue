<template>
  <div class="i404__error-container">
    <!-- <img :src="$dataImages.lambBlush" /> -->
    <title-bar>Page Not Found</title-bar>
    <h1 class="i404__h1">
      <span class="i404__fail-text">Oops</span>, is there
      <span class="i404__info-text">supposed</span> to be a page here?
    </h1>
  </div>
</template>


<script lang='ts'>
import { defineComponent } from "vue";
import titlebar from '@/components/layout/ee-titlebar.vue';

export default defineComponent({
  components: { 'title-bar': titlebar },
});
</script>

