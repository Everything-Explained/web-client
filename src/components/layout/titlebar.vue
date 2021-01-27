<template>
  <div class="title-bar">
    <icon
      class="title-bar__menu-icon"
      @mousedown="openMenu"
      :class="{ '--menu-open': isMenuOpen }" :type='"menu"'
    ></icon>
    <transition
      name="fade" :duration="{ enter, leave }" mode="out-in"
    >
      <div class="title-bar__text" :key="title">{{title}}</div>
    </transition>
  </div>
</template>



<script lang='ts'>
import { computed, defineComponent, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import { VuexStore } from "@/vuex/vuex-store";
import icon from '@/components/ui/icon.vue';


export default defineComponent({
  components : { icon, },
  props      : { easeIn: Number, easeOut: Number, },

  setup(props) {
    const store      = useStore<VuexStore>();
    const isMenuOpen = computed(() => store.state.isMenuOpening);
    const title      = computed(() => store.state.pageTitle);
    const duration = {
      enter: props.easeIn ?? 400,
      leave: props.easeOut ?? 400
    };
    const openMenu = () => store.commit('open-menu');

    return { openMenu, isMenuOpen, title, ...duration };
  }
})


</script>