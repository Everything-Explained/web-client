import { Component, Vue } from 'vue-property-decorator';


@Component
export default class App extends Vue {

  public version = '36';
  public verType = 'α';
  public verDesc = `
    We shall carry on by 12's until we reach β;
    a shift from the arbitrary past into the ever
    present - a gift to Me, Myself, and I.
  `

  public openWatermark() {
    this.$modal.show('VersionModal');
  }

  public created() {}

  public async test() {}

}