
import { Component, Vue, Prop } from 'vue-property-decorator';
import MarkdownPaging from '@/components/md-paging/MdPaging.vue';
import { IPage } from '@/components/md-paging/md-paging.js';



@Component({
  components: {
    MarkdownPaging
  }
})
export default class Faq extends Vue {

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
        title: item.fields.title.split(':').map(v => v.trim()),
        content: item.fields.body,
        date: new Date(item.sys.createdAt)
      }
    })
    this.blog.push(...blogItems);
  }

  

}