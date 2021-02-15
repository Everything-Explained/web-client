
<template>
  <a v-if="type == 'link'" :href='href'><slot /></a>
  <div v-else-if="type == 'block'" :class="['md', customClass]">
    <p><slot /></p>
  </div>
  <span v-else :class="['md', 'ee-text', customClass, { '--block': isSpanBlock}]">
    <p v-if="isSpanBlock"><slot /></p>
    <slot v-else />
  </span>
</template>


<script lang='ts'>
import { defineComponent } from "vue";

const _textType = ['text', 'block', 'span-block', 'link'];

export default defineComponent({
  props: {
    href: String,
    type: {
      type: String,
      default: 'text',
      required: true,
    },
    class: String,
  },
  setup(props) {
    if (!_textType.includes(props.type))
      throw Error(`ee-text:: Invalid type ${props.type} `)
    ;

    const isSpanBlock = props.type == 'span-block';

    return {
      href: props.href || '',
      customClass: props.class || '',
      isSpanBlock,
    }
  }
})

</script>