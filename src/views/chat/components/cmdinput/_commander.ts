import { Vue, Provide } from 'vue-property-decorator';
import Component from 'vue-class-component';
import InputCommander from './_cmd-input';


@Component
export default class Commander extends Vue {

  inputHandler = new InputCommander();

  created() {
    console.log('Commander Created');
  }




}