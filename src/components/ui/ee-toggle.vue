<template>
  <fieldset>
    <legend>{{ legend }}</legend>
    <div class="toggle">
      <input
        id="toggleLeft"
        type="radio"
        name="toggle"
        :checked="true"
        :disabled="props.prevent"
      >
      <label
        :class="{ '--wait': props.prevent }"
        for="toggleLeft"
        @click="toggle(false)"
      >{{ leftText }}</label>
      <input
        id="toggleRight"
        type="radio"
        name="toggle"
        :disabled="props.prevent"
      >
      <label
        :class="{ '--wait': props.prevent }"
        for="toggleRight"
        @click="toggle(true)"
      >{{ rightText }}</label>
    </div>
  </fieldset>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    callback  : { type: Function, default: () => void(0) },
    initState : { type: Boolean,  default: false         },
    legend    : { type: String,   default: 'Legend'      },
    leftText  : { type: String,   default: 'Left'        },
    rightText : { type: String,   default: 'Right'       },
    prevent   : { type: Boolean,  default: false         },
  },
  setup(props) {
    const callback = props.callback;
    if (!callback)
      throw Error('toggle::missing callback function.')
    ;
    const state = ref(props.initState);

    const toggle = (val: boolean) => {
      if (props.prevent) return;
      if (val == state.value) return;
      state.value = val;
      callback(state.value);
    };

    return { state, toggle, props };
  }
});
</script>