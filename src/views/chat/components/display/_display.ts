import { Vue, Provide } from 'vue-property-decorator';
import Component from 'vue-class-component';


@Component
export default class Display extends Vue {


  created() {
    console.log('Display Created');
  }




}