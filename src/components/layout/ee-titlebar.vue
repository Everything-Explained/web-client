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
import { defineComponent } from "vue";
import eeIconVue from '@/components/ui/ee-icon.vue';
import { useDateCache } from "@/state/cache-state";


export default defineComponent({
  components : { 'ee-icon': eeIconVue, },
  props      : {
    easeIn:  { type: Number, default: 400 },
    easeOut: { type: Number, default: 400 },
    text:    { type: String, default: '' }
  },
  setup(props) {
    const stateStr   = 'titlebar-menu-open';
    const dataCache = useDateCache();
    const isMenuOpen = dataCache.getData<boolean>(stateStr);
    const duration = {
      enter: props.easeIn ?? 400,
      leave: props.easeOut ?? 400
    };

    const openMenu = () => dataCache.setData(stateStr, true);

    return { openMenu, isMenuOpen, ...duration };
  }
});
</script>