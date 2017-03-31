
import {bindable, inject, customElement} from 'aurelia-framework';
import * as moment from 'moment';
import {PageElement} from '../../../helpers/page';
import {Message, IMessage, MessageType} from '../../../views/chat/message';
import {Chat} from '../../../views/chat/chat';
import {ClientIO} from '../../../services/clientio';
import {BibleVerseFilter} from './bible-verse-filter';


export enum WordType {
  NONE,
  LINK,
  VERSE,
  IMAGE
}

interface IWord {
  type: WordType;
  text: string;
  data?: any;
}

@inject(Element)
@customElement('message-view')
export class MessageView {

  @bindable cfg: Message;
  @bindable io: ClientIO;

  content:       string;
  realTime:      string;
  realTimeFixed: number;
  relativeTime:  string;
  alias:         string;
  scale:         string;
  words = new Array<IWord>();
  md = window['markdownit']({
    breaks: true,
    linkify: true,
    typographer: true,
    quotes: '“”‘’'
  });

  defClass = '';
  modClass = '';
  avatar = '';
  isDefault = false;

  msgFormatted = '';


  private _relativeTime = Date.now();
  public verseFilter: BibleVerseFilter;

  constructor(private el: Element) {
    this.verseFilter = new BibleVerseFilter();
    this._filterLinks(this.md);
  }


  /*****************************
   * Aurelia DOM Ready Method
   */
  attached() {

    this.pollRelativeTime();

    this.realTime = moment(this.cfg.realTimeFixed).format('h:mm A');

    if (MessageType.NORMAL == this.cfg.type) {
      this.filter();
    }

  }

  /***********************
   * Aurelia Bind Method
   */
  bind() {
    this.isDefault = !this.cfg.avatar;

    if (this.cfg.avatar)
      this.avatar = this.normalizeImage(this.cfg.avatar);


    let el = <HTMLElement> this.el;
    // this.cfg.setTypeClass(el);
    this.modClass = this.cfg.messageType;

    if (this.cfg.type === MessageType.INLINE) {
      this.cfg.alias = this.cfg.alias + ' Says: ';
    }

  }



  public filter() {

    let images = this.getImages(this.cfg.message);

    if (images) {
      images.forEach(img => {
        this.cfg.message = this.cfg.message.replace(
          img,
          `![](${img})`
        );
      });
    }

    let msg = this.md.render(this.cfg.message) as string
      , verses = this.verseFilter.filter(msg)
      , el = this.el.querySelector('.container .content') as HTMLElement
      , div = document.createElement('div')
    ;

    div.innerHTML = msg;

    // TODO - apply the basic HTML then extract the elements and apply the events.
    if (verses.length) {
      this._filterVerses(verses, div);
    }

    el.appendChild(div);

  }


  private _filterVerses(verses: string[], append: HTMLElement) {
    verses.forEach((v, i) => {
      let a = document.createElement('a');
      a.classList.add('verse');
      a.href = 'javascript:void(0);';
      a.title = 'Click to view Scripture';
      a.textContent = v;
      a.id = `v${i}`;
      append.innerHTML = append.innerHTML.replace(v, a.outerHTML);
      a = append.querySelector(`#${a.id}`) as HTMLAnchorElement;
      a.onmousedown = (e) => {
        this.getVerse(e, v);
      };
    });
  }




  getVerse(e: MouseEvent, verse: string) {
    if (e.button == 0) {
      e.preventDefault();
      e.stopPropagation();
      this.io.getBibleVerse(verse);
    }
  }

  normalizeImage(img: string) {

    if (~img.indexOf('google')) {
      return `${img}?sz=64`;
    }

    if (~img.indexOf('facebook')) {
      return `${img}?width=64`;
    }
    console.warn('Avatar was not normalized');
    return img;

  }

  wordType(type: string) {

    switch (type) {
      case 'none': return WordType.NONE;
      case 'link': return WordType.LINK;
      case 'image': return WordType.IMAGE;
      case 'verse': return WordType.VERSE;
      default:
        return null;
    }

  }

  private _filterLinks(md: any) {
    let defaultLinkRenderer =
      md.renderer.rules.link_open ||
      function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      let aIndex = tokens[idx].attrIndex('target');
      tokens[idx].attrPush(['target', '_blank']); // Add new attribute
      return defaultLinkRenderer(tokens, idx, options, env, self);
    };
  }


  public getImages(input: string) {

    // Prevent unnecessary filtering
    if (input.indexOf('http://') == -1 &&
        input.indexOf('https://') == -1) return [];

    let msg = input.split(' ')
      , match = null
      , results = [] as string[]
    ;


    for (let p of msg) {
      if (match = (/http[s]?:\/\/([a-zA-Z0-9/+-_]\.?)+\.(png|jpg|jpeg|gif)$/g.exec(p))) {
        if (match[0] == p) {
          results.push(p);
        } else {
        }
      }
    }

    return results;

  }


  pollRelativeTime() {

    // Only NORMAL messages will poll
    if (this.cfg.type > 0) return;

    let rt = moment(this._relativeTime),
        now = moment(Date.now());

    this.relativeTime = rt.fromNow();

    if (now.diff(rt, 'seconds') < 60) {
      setTimeout(() => this.pollRelativeTime(), 1000);
      return;
    }

    if (now.diff(rt, 'minutes') < 60) {
      setTimeout(() => this.pollRelativeTime(), 60000);
      return;
    }

    // Default to hourly interval
    setTimeout(() => this.pollRelativeTime(), 360000);
  }

}
