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


  public created() {
    const settings = this.$route.meta.settings;
    this.alias = settings.alias;
    this.email = settings.email;
    this.picture = settings.picture;
  }


  public async validateAlias(alias) {
    return await this.$api.validateAlias(alias)
  }

  public logout() {
    this.$api.logout();
  }
}