import { Vue, Component, Provide } from 'vue-property-decorator';

@Component
export default class Chat extends Vue {
  created() {
    const sio = io();
    sio.on('connect', () => {
      console.log('Socket Connected');
      sio.emit('hand-shake', this.$api.rid);
    })
  }
}