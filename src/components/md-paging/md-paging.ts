
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import Markdown from 'markdown-it';


export interface IPagingConfig {
  timeSort: 'latest'|'oldest';
  mdclass: string;
  placeholder?: string;
  pages: IPage[];
}

export interface IPage {
  title: string[];
  date?: Date;
  content: string;
}

export interface IPageData {
  title: string;
  date: string;
  content: string;
}


@Component
export default class MarkdownPaging extends Vue {
  @Prop() public pages!: IPage[];
  // @Prop() public path!: string;
  @Prop() public selectedPage!: string;
  @Prop() public placeholder!: string;
  @Prop() public mdClass!: string;

  public header = '';
  public subheader = '';
  public content = '';
  public inTransit = false;
  public invalidPage = false;

  private _path = '';
  private _tempText = '#### this is a temporary placeholder'


  created() {

    this.renderDefault();

    this._sortPages('dateLast');
    let page = this.selectedPage
    this._path =
      (page)
        ? this.$route.path.replace(`/${page}`, '')
        : this.$route.path
    ;

    // Render page on first load
    if (page) {
      this.selectedPage = page;
      this.renderLog();
    }

  }

  get renderedContent() {
    return new Markdown().render(this.content);
  }

  getPage() {
    let selPage = this.selectedPage
      , page: IPage|undefined
    ;

    if (this.pages[0].title.length > 1) {
      page = this.pages.find(v => v.title[1] == selPage)
    }
    else {
      selPage = selPage.replace(/-/g, ' ');
      page = this.pages.find(v => v.title[0] == selPage);
    }

    if (page) return page;
  }


  public goTo(title: string[]) {

    let link =
      (title.length > 1)
        ? this._sanitize(title[1])
        : this._sanitize(title[0])
    ;

    this.$router.push(`${this._path}/${link}`);
  }


  // TODO - Reset scroll position when selecting pages
  @Watch('selectedPage')
  public renderLog() {
    if (this.inTransit) return;
    this.inTransit = true;
    let page = this.getPage();

    if (!page) {
      this.renderDefault();
      this.inTransit = false;
      return;
    }

    setTimeout(() => {
      if (page) {
        this.invalidPage = false;
        this.header = page.title.length > 1 ? page.title[1] : page.title[0]
        this.subheader = page.date!.toISOString();
        this.content = page.content
        this.inTransit = false;
      }

    }, 250);
  }


  private renderDefault() {
    this.header = '';
    this.subheader = '';
    if (this.selectedPage) {
      this.content = '##### oops, that page doesn\'t exist'
      this.invalidPage = true;
    }
    else {
      this.content = this.placeholder || this._tempText
    }
  }


  private _sanitize(title: string) {
    return title.replace(/\s/g, '-');
  }


  private _sortPages(type: 'alphabet'|'dateLast'|'dateFirst') {
    if (type == 'alphabet') {
      const sort =
        // (this._isSingleTitle)
        //   ? (p1: IPage, p2: IPage) => p1.title[0] > p2.title[0] ? 1 : -1
        //   :
          (p1: IPage, p2: IPage) => p1.title[1] > p2.title[1] ? 1 : -1
      ;
      this.pages.sort(sort);
    }
    else if (type == 'dateLast') {
      this.pages.sort(
        (p1, p2) =>
          p2.date!.getTime() - p1.date!.getTime()
      );
    }
    else {
      this.pages.sort(
        (p1, p2) =>
          p1.date!.getTime() - p2.date!.getTime()
      );
    }
  }

}
