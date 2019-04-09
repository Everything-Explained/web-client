import { Vue, Component, Provide } from 'vue-property-decorator';

@Component
export default class Chat extends Vue {
  created() {
    console.log('connecting to socket io');
    const sock = io();
  }
}