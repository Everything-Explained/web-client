import { computed, defineComponent } from "vue";


const _buttonTypes = ['standard', 'dangerous'];


export default defineComponent({
  props: {
    type:     { type: String,  default: 'standard' },
    loading:  { type: Boolean, default: false,     },
    disabled: { type: Boolean, default: false,     },
  },
  setup(props) {
    if (!_buttonTypes.includes(props.type))
      throw Error(`ee-button:: invalid button type ${props.type}`)
    ;

    const loading  = computed(() => props.loading);

    const disabled = computed(() => {
      // Prevent clicks when loading
      if (loading.value) return true;
      return props.disabled;
    });

    return {
      disabled, loading, type: props.type
    };
   }
});

