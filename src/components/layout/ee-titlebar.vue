<template>
  <div class="title-bar">
    <ee-icon
      :class="['title-bar__menu-icon', { '--menu-open': isMenuOpen }]"
      :type="'menu'"
      @mousedown="openMenu"
    />
    <transition
      name="fade"
      :duration="{ enter, leave }"
      mode="out-in"
    >
      <div :key="text" class="title-bar__text">
        {{ text }} <slot />
      </div>
    </transition>
  </div>
</template>



<script lang='ts'>
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { VuexStore } from "@/vuex/vuex-store";
import eeIconVue from '@/components/ui/ee-icon.vue';


export default defineComponent({
  components : { 'ee-icon': eeIconVue, },
  props      : {
    easeIn:  { type: Number, default: 400 },
    easeOut: { type: Number, default: 400 },
    text:    { type: String, default: '' }
  },
  setup(props) {
    const store      = useStore<VuexStore>();
    const isMenuOpen = computed(() => store.state.isMenuOpening);
    const duration = {
      enter: props.easeIn ?? 400,
      leave: props.easeOut ?? 400
    };

    const openMenu = () => store.commit('open-menu');

    return { openMenu, isMenuOpen, ...duration };
  }
});
</script>