import { defineComponent, onMounted, ref } from "vue";


type StringMap = { [key: string]: string };

const iconMap: StringMap = {
  'clock'      : 'Y',
  'calendar'   : 'M',
  'cross'      : '9',
  'gear'       : '~',
  'right-chev' : 'V',
  'left-chev'  : 'U',
  'log-in'     : '<',
  'log-out'    : '=',
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
  name: 'icon',

  props: {
    type: String
  },

  setup(props) {
    const icon = ref<HTMLElement>();

    onMounted(() => {
      if (!props.type)
        throw Error('<icon>::missing "type" prop')
      ;
      const iconValue = iconMap[props.type];
      if (!iconValue)
        throw Error(`<icon>::invalid icon type: "${props.type}"`)
      ;
      icon.value!.dataset.icon = iconValue;
    });

    return { icon };
  }
});