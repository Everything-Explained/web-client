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

    return {
      isDisabled, isLoading
    };
   }
});

