<template>
  <div class="title-bar">
    <icon
      class="title-bar__menu-icon"
      @mousedown="openMenu"
      :class="{ '--menu-open': isMenuOpen }" :type='"menu"'
    ></icon>
    <div class="title-bar__text" :key="title">{{title}}</div>
  </div>
</template>



<script lang='ts'>
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { VuexStore } from "../vuex/vuex-store";
import icon from './icon.vue';

export default defineComponent({
  components: {
    icon,
  },
  setup() {
    const store = useStore<VuexStore>();

    const openMenu   = () => store.commit('open-menu');
    const isMenuOpen = computed(() => store.state.isMenuOpen);
    const title      = computed(() => store.state.pageTitle);

    return { openMenu, isMenuOpen, title };
  }
})
</script>