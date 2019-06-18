
import { Prop, Vue, Component } from 'vue-property-decorator';
import MarkdownPaging from '@/components/md-paging/MdPaging.vue';
import { IPage } from '@/components/md-paging/md-paging.js';
import Utils from '@/libs/utils';



@Component({
  components: {
    MarkdownPaging
  }
})
export default class Blog extends Vue {

  // From route property /blog/:page
  @Prop() public page!: string;

  public blog: IPage[] = [];



  async created() {
    let client = contentful.createClient({
      accessToken: '87e615a6111bb8d7e772187bdf84f7fcd649c086da0043beac321cf52754556a',
      space: 's2rp7j0ifide'
    })
    let blogdata = await client.getEntries({ order: '-sys.createdAt' });

    let blogItems = blogdata.items.map(item => {
      return {
        title: item.fields.title.split(':'),
        content: item.fields.body,
        date: new Date(item.sys.createdAt)
      }
    })
    this.blog.push(...blogItems);
  }

  async beforeRouteEnter(to, from, next) {
    await Utils.loadScript(
      'contentfulLoaded',
      '//cdn.jsdelivr.net/npm/contentful@latest/dist/contentful.browser.min.js'
    )
    next();
  }




}