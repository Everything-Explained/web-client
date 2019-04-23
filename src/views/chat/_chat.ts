import Vue from 'vue';
import Component from 'vue-class-component';
import Display from './components/display/Display.vue';
import Userlist from './components/userlist/Userlist.vue';
import Commander from './components/cmdinput/Commander.vue';
import sock from '@/api/mock/socket.io.js';
import Utils from '@/libs/utils';

@Component({
  components: {
    Display,
    Userlist,
    Commander,
  }
})
export default class Chat extends Vue {

  private sio!: SocketIOClient.Socket;




  created() {
    this.sio = io.connect('https://localhost:3003', { forceNew: true });
    this.sio.on('connect', () => {
      console.log('connected successfully');
      this.sio.on('room-setup', (name: string, d: string, clients: []) => {
        console.log('joined room', name, d, clients);
      })
      this.sio.emit('hand-shake', this.$api.rid);
    })
  }





  async beforeRouteEnter(to, from, next) {
    // await Utils.loadScript(
    //   'socketScriptLoaded',
    //   '/socket.io/socket.io.js'
    // )
    next();
  }


  beforeRouteLeave(to, from, next) {
    this.sio.disconnect();
    next();
  }

}