import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    toggle: Function,
  },
  setup(props) {
    const toggleCallback = props.toggle;
    if (!toggleCallback)
      throw Error('toggle::you need to provide a toggle method.')
    ;
    const state   = ref(false);

    const toggle = () => {
      state.value = !state.value;
      toggleCallback(state.value);
    };

    return { toggle, state };
  }
});