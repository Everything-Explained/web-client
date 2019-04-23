
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';


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

type sorting = 'alphabet'|'dateLast'|'dateFirst';

@Component
export default class MarkdownPaging extends Vue {

  @Prop() public pages!: IPage[];
  @Prop() public selectedPage!: string|undefined

  @Prop({default: '#### this is placeholder text'})
    public placeholder!: string;

  @Prop() public mdClass!: string;
  @Prop() public displayType!: string;
  @Prop() public sortBy!: sorting;
  @Prop() public redirect!: boolean;

  public header = '';
  public subheader = '';
  public content = '';
  public inTransit = false;
  public invalidPage = false;

  private path = '';


  created() {
    if (this.pages && !this.pages!.length) return;

    this.renderDefault();

    this._sortPages(this.sortBy || 'alphabet');
    let page = this.selectedPage
    this.path =
      (page)
        ? this.$route.path.replace(`/${page}`, '')
        : this.$route.path
    ;

    // Render page on first load
    if (page) {
      this.selectedPage = page;
      this.renderLog();
    }

    else if (this.redirect) {
      this.goTo(this.pages[0].title);
    }

  }

  updated() {
    // Allows strikethrough to separate definition
    // lists. Check the RULES page for an example
    let nodes = document.querySelectorAll('p > s');
    nodes.forEach(n => {
      n.parentElement!.remove();
    })
  }

  get renderedContent() {
    return this.$markdown.render(this.content);
  }

  get displayClass() {
    if (!this.displayType) return ''
    return this.displayType;
  }


  public getPage() {
    let selPage = this.selectedPage
      , page: IPage|undefined
    ;

    if (selPage) {
      if (this.pages[0].title.length > 1) {
        page = this.pages.find(v => v.title[1] == selPage)
      }
      else {
        selPage = selPage.replace(/-/g, ' ');
        page = this.pages.find(v => v.title[0] == selPage);
      }
    }

    return page;
  }


  public goTo(title: string[]) {

    let link =
      (title.length > 1)
        ? this._sanitize(title[1])
        : this._sanitize(title[0])
    ;

    this.$router.push(`${this.path}/${link}`);
  }


  // TODO: Reset scroll position when selecting pages
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
      if (!this.redirect)
        this.content = this.placeholder;
    }
  }


  private _sanitize(title: string) {
    return title.replace(/\s/g, '-');
  }


  private _sortPages(type: sorting) {
    if (type == 'alphabet') {
      const sort =
        (this.pages[0].title.length == 1)
          ? (p1: IPage, p2: IPage) => p1.title[0] > p2.title[0] ? 1 : -1
          : (p1: IPage, p2: IPage) => p1.title[1] > p2.title[1] ? 1 : -1
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
