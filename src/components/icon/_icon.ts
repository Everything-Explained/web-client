import { computed, defineComponent, onMounted, ref, Ref, toRef, toRefs } from "vue";


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
  props: { type: String },

  setup(props) {
    const type = toRef(props, 'type');
    if (!type.value)
      throw Error('<icon>::missing "type" prop')
    ;
    if (!iconMap[type.value])
      throw Error(`<icon>::invalid icon type: ${type.value}`)
    ;
    const icon = computed(() => iconMap[type.value!]);
    return { icon, type };
  }
});