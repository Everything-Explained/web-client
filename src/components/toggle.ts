import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    callback: Function,
    state: Boolean,
    legend: String,
    leftText: String,
    rightText: String,
  },
  setup(props) {
    const callback = props.callback;
    if (!callback)
      throw Error('toggle::missing callback function.')
    ;
    const state = ref(props.state ?? false);
    const leftText = props.leftText ?? 'Left';
    const rightText = props.rightText ?? 'Right';
    const legend = props.legend ?? 'Legend';

    const toggle = (val: boolean) => {
      if (val == state.value) return;
      state.value = val;
      callback(state.value);
    };

    return { leftText, rightText, state, legend, toggle };
  }
});