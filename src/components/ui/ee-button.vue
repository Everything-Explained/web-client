<template>
  <button :class="['ee-btn', theme, { '--loading': isLoading }]"
          :type="undefined"
          :disabled="isDisabled"
  >
    <slot />
  </button>
</template>



<script lang='ts'>
import { computed, defineComponent } from "vue";


const _buttonThemes = ['neutral', 'attention', 'dangerous'];


export default defineComponent({
  props: {
    theme:    { type: String,  default: 'neutral' },
    loading:  { type: Boolean, default: false,     },
    disabled: { type: Boolean, default: false,     },
  },
  setup(props) {
    if (!_buttonThemes.includes(props.theme))
      throw Error(`ee-button:: invalid button type ${props.theme}`)
    ;
    const isLoading  = computed(() => props.loading);
    const isDisabled = computed(() => {
      // Prevent clicks when loading
      if (isLoading.value) return true;
      return props.disabled;
    });

    return { isDisabled, isLoading };
   }
});
</script>