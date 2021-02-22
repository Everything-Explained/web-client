<template>
  <div class="onoff-switch input-switch" @click="callback()">
    <input type="checkbox" :checked="state">
    <span class="switch-text-off">OFF</span>
    <span class="slider" />
    <span class="switch-text-on">ON</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    callback: { type: Function, default: null },
  },
  setup(props) {
    if (!props.callback)
      throw Error('toggle::you need to provide a toggle method.')
    ;
    const state   = ref(false);

    function toggle() {
      state.value = !state.value;
      props.callback(state.value);
    }

    return { toggle, state };
  }
});
</script>