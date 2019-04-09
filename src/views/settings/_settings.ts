import { Vue, Component } from 'vue-property-decorator';
import AuthInput from '@/components/auth-input/AuthInput.vue';


@Component({
  components: {
    AuthInput
  }
})
export default class Settings extends Vue {

  public alias!: string;
  public email!: string;
  public picture!: string;

  public newAlias = '';

  public changeAlias = false;


  public created() {
    const settings = this.$route.meta.data;
    this.alias = settings.alias;
    this.email = settings.email;
    this.picture = settings.picture;
  }

  public toggleEditAlias() {
    this.changeAlias = !this.changeAlias;
  }

  public async updateAlias() {
    this.newAlias = '';
    const aliasResp = await this.$api.updateAlias();
    if (aliasResp.status == 200 && aliasResp.data) {
      this.toggleEditAlias();
      this.alias = aliasResp.data;
    }
    else {
      console.error(aliasResp);
    }
  }


  public async validateAlias(alias) {
    return await this.$api.validateAlias(alias)
  }

  public logout() {
    this.$api.logout();
  }
}