<template>
  <div class="ee-input__container">
    <input class="ee-input__text"
      v-if="type != 'area'"
      @input="$emit('update:modelValue', getVal($event))"
      :id='id'
      :type="type"
      :maxlength="maxLength"
      :value='modelValue'
      placeholder="placeholder"
    >
    <label v-if="type != 'area'" class="ee-input__label" :for='id'><slot></slot></label>
    <textarea class="ee-input__area"
      v-if="type == 'area'"
      @input="autoHeight($event), $emit('update:modelValue', getVal($event))"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxLength"
    ></textarea>
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
    },
    placeholder: String,
  },
  emits: ['update:modelValue'],
  setup(props) {
    const base36RndNum = Math.floor(Math.random() * 10000).toString(36);
    const base36Time = Date.now().toString(36);
    const id = `i${base36Time}${base36RndNum}`;
    if (props.maxlength > 255) throw Error('ee-input-field:: maxLength should be less than 255.');

    function autoHeight(e: Event) {
      const el = e.target as HTMLTextAreaElement;
      el.style.height = '44px';
      el.style.height = `${el.scrollHeight}px`;
    }

    return {
      id,
      type: props.type,
      maxLength: props.maxlength,
      getVal: (e: Event) => (e.target as HTMLInputElement).value,
      autoHeight,
      placeholder: props.placeholder,
    };
  }
});
</script>