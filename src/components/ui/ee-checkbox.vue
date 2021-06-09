<template>
  <div class="ee-chkbx__container">
    <input
      :id="chkbxID"
      class="ee-chkbx"
      type="checkbox"
      :checked="checked"
      @change="$emit('changed', getVal($event)), $emit('update:modelValue', getVal($event))"
    >
    <label :for="chkbxID" class="ee-chkbx__label">
      <div>
        <svg class="ee-chkbx__checkmark" viewbox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1" />
        </svg>
      </div>
      <div>{{ value }}</div>
    </label>
  </div>
</template>



<script lang="ts">
import useUniqueIDGen from "@/composeables/useUniqueID";
import { defineComponent, PropType } from "@vue/runtime-core";


export default defineComponent({
  props: {
    value:   { type: String as PropType<string>, required: true },
    checked: { type: Boolean as PropType<boolean>, default: false }
  },
  emits: ['update:modelValue', 'changed'],
  setup() {
    const genID  = useUniqueIDGen().genID;
    const getVal = (e: Event) => (e.target as HTMLInputElement).checked;

    return {
      svgID  : genID(),
      chkbxID: genID(),
      getVal,
    };
  }
});

</script>




