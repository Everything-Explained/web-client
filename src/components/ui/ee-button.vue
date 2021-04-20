<template>
  <button
    :class="['ee-btn', theme, { '--loading': loading }]"
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
    loading:  { type: Boolean, default: false,    },
    disabled: { type: Boolean, default: false,    },
  },
  setup(props) {
    if (!_buttonThemes.includes(props.theme))
      throw Error(`ee-button:: invalid button type ${props.theme}`)
    ;
    const isDisabled = computed(() => {
      // Prevent clicks when loading
      return props.loading || props.disabled;
    });

    return { isDisabled };
   }
});
</script>