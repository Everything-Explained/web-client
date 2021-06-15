<template>
  <div class="icon" v-html="icon" />
</template>



<script lang='ts'>
import { computed, defineComponent, PropType, toRef } from "vue";

type StringMap = { [key: string]: string };

const iconMap: StringMap = {
  'clock'      : 'Y',
  'calendar'   : 'M',
  'checkmark'  : 'S',
  'cross'      : '9',
  'gear'       : '~',
  'chev-up'    : 'W',
  'chev-down'  : 'T',
  'chev-right' : 'V',
  'chev-left'  : 'U',
  'log-in'     : '<',
  'log-out'    : '=',
  'doc'        : 'y',
  'dots'       : '/',
  'export'     : '[',
  'info'       : '&#xe009',
  'heart'      : '&#xe004',
  'home'       : '&#xe006',
  'mail'       : '&#xe015',
  'menu'       : '&#xe020',
  'star'       : '&#xe045',
  'thumb-up'   : '&#xe04e',
  'thumb-down' : '&#xe04d',
  'trash'      : '&#xe053',
  'user'       : '&#xe056',
};


export default defineComponent({
  props: {
    type: { type: String as PropType<keyof typeof iconMap>, default: '' }
  },
  setup(props) {
    const type = toRef(props, 'type');
    if (!type.value)
      throw Error('<icon>::missing "type" prop')
    ;
    if (!iconMap[type.value])
      throw Error(`<icon>::invalid icon type: ${type.value}`)
    ;
    return {
      icon: computed(() => iconMap[type.value])
    };
  }
});

</script>