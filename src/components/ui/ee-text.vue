
<template>
  <a v-if="type == 'link'" :href='href'><slot></slot></a>
  <div v-else-if="type == 'block'" :class="['md', customClass]">
    <p><slot></slot></p>
  </div>
  <span v-else :class="['md', customClass]"><slot></slot></span>
</template>


<script lang='ts'>
import { defineComponent } from "vue";

const _textType = ['text', 'block', 'link']

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

    return {
      href: props.href || '',
      customClass: props.class || '',
    }
  }
})

</script>