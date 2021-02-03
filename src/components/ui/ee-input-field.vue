<template>
  <div class="ee-input__container">
    <input class="ee-input__text"
      :id='id'
      :type="type"
      :maxlength="maxLength"
      :value='modelValue'
      @input="$emit('update:modelValue', getVal($event))"
      placeholder="placeholder"
    >
    <label class="ee-input__label" :for='id'><slot></slot></label>
    <span class="ee-input__bar"></span>
  </div>
</template>


<script lang='ts'>
import { defineComponent } from "vue";


const _inputTypes = ['text', 'area', 'email', 'password'];


export default defineComponent({
  props: {
    'modelValue': String,
    name: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: 'text',
      validator: (val: string) => _inputTypes.includes(val),
    },
    maxlength: {
      type: Number,
      default: 255,
    }
  },
  emits: ['update:modelValue'],
  setup(props) {
    const base36RndNum = Math.floor(Math.random() * 10000).toString(36);
    const base36Time = Date.now().toString(36);
    const id = `i${base36Time}${base36RndNum}`;
    if (props.maxlength > 255) throw Error('ee-input-field:: maxLength should be less than 255.');

    return {
      id,
      type: props.type,
      maxLength: props.maxlength,
      getVal: (e: Event) => (e.target as HTMLInputElement).value
    };
  }
});
</script>