<template>
  <div class="i404__error-container">
    <!-- <img :src="$dataImages.lambBlush" /> -->
    <title-bar></title-bar>
    <h1 class="i404__h1">
      <span class="i404__fail-text">Oops</span>, is there
      <span class="i404__info-text">supposed</span> to be a page here?
    </h1>
  </div>
</template>


<script lang='ts'>
import { defineComponent } from "vue";
import { useStore } from "vuex";
import titlebar from '@/components/layout/titlebar.vue';

export default defineComponent({
  components: {
    'title-bar': titlebar
  },
  setup() {
    const store = useStore();
    store.commit('page-title', '404 Not Found')
  }
})
</script>

