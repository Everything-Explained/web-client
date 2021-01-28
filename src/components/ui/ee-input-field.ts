import { defineComponent } from "vue";


const _inputTypes = ['text', 'email', 'password'];


export default defineComponent({
  props: {
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
      validator: (val: number) => val < 255
    }
  },
  setup(props) {
    const base36RndNum = Math.floor(Math.random() * 10000).toString(36);
    const base36Time = Date.now().toString(36);
    const id = `i${base36Time}${base36RndNum}`;

    return { id, type: props.type, maxLength: props.maxlength };
  }
});