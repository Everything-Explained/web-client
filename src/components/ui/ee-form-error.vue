<template>
  <div :class="['eeform-error',{ '--show': showError}, customClass]">
    {{ text }}
  </div>
</template>



<script lang='ts'>
import { defineComponent, ref, watch } from "@vue/runtime-core";

export default defineComponent({
  props: {
    update:      { type: Number,  default: 0              },
    text:        { type: String,  default: 'Default Text' },
    customClass: { type: String,  default: ''             },
  },
  setup(props) {
    const showError = ref(false);

    let timeout = 0;
    function toggleError() {
      clearTimeout(timeout);
      showError.value = true;
      timeout = setTimeout(() => { showError.value = false; }, 2000);
    }

    watch(() => props.update, toggleError);
    return { showError };
  }
});



</script>