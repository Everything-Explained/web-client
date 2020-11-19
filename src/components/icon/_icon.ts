import { defineComponent, onMounted, ref } from "vue";


type StringMap = { [key: string]: string };

const iconMap: StringMap = {
  'calendar': 'M',
  'clock': 'Y',
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