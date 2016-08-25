
import {bindable, inject} from 'aurelia-framework';
import * as moment from 'moment';
import {PageElement} from '../../../helpers/page';
import {Message, IMessage, MessageType} from '../../../views/chat/message';
import {Chat} from '../../../views/chat/chat';
import {ClientIO} from '../../../services/clientio';
import {BibleVerseFilter} from '../../elements/message/bible-verse-filter';


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
export class MessageView {

  @bindable cfg: Message;
  @bindable io: ClientIO;

  content: string;
  realTime: string;
  realTimeFixed: number;
  relativeTime: string;
  username: string;
  scale: string;
  words = new Array<IWord>();

  defClass = '';
  modClass = '';
  avatar = '';
  isDefault = false;


  private _relativeTime = Date.now();
  private _verseFilter: BibleVerseFilter;

  constructor(private el: Element) {
    this._verseFilter = new BibleVerseFilter();
  }


  /** Executed on DOM ready */
  attached() {


    // Only poll messages for normal type
    if (this.cfg.type === MessageType.NORMAL) {
      this.pollRelativeTime();
    }
    this.realTime = moment(this.cfg.realTimeFixed).format('h:mm A');


    if (this.cfg.type === MessageType.NORMAL) {

      let words = this._verseFilter.filter(this.cfg.message);

      for (let word of words) {

        if (typeof word !== 'string') {
          this.words.push(word);
          continue;
        }

        let filteredWord = null;

        filteredWord = this._filterWord(word);

        if (filteredWord) {
          this.words.push(filteredWord);
        } else {
          this.words.push({
            type: WordType.NONE,
            text: word
          });
        }
      }

    }

  }

  private _filterWord(word: string) {

    let result = null;

    if (typeof (result = this._filterImages(word)) !== 'string') {
      return result;
    }

    if (typeof (result = this._filterLinks(word)) !== 'string') {
      return result;
    }

    return null;

  }

  bind() {
    this.isDefault = !this.cfg.avatar;

    if (this.cfg.avatar)
      this.avatar = this.normalizeImage(this.cfg.avatar);


    let el = <HTMLElement> this.el;
    // this.cfg.setTypeClass(el);
    this.modClass = this.cfg.messageType;

    if (this.cfg.type === MessageType.INLINE) {
      this.cfg.username = this.cfg.username + ' Says: ';
    }

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

  private _filterLinks(input: string) {

    // Prevent unnecessary filtering
    if (input.indexOf('http://') == -1 &&
        input.indexOf('https://') == -1) return input;

    let msg = input.split(' ')
      , match = null
      , result = {
        text: null,
          type: WordType.LINK,
          data: {
            link: null,
            invalid: false
          }
        };

    for (let p of msg) {
      if (match = (/http[s]?:\/\/([a-zA-Z0-9/+-_]\.?)+(\.[a-z]{2,3})?$/g).exec(p)) {
        if (match[0] == p) {
          let link = p.replace(/^http[s]?:\/\/[w]{3}?\.?/, '');
          input = input.replace(p,
            `<a target="_blank" title="${p}" ` +
            `href="${p}">${(link.length > 40) ? link.substr(0, 40) + '...' : link}</a>`
          );
          result.text = (link.length > 40) ? link.substr(0, 40) + '...' : link;
          result.data.link = p;
        } else {
          result.text = 'Invalid Link';
          result.data.invalid = true;
        }
      }
    }

    return result.text ? result : input;
  }


  private _filterImages(input: string) {

    // Prevent unnecessary filtering
    if (input.indexOf('http://') == -1 &&
        input.indexOf('https://') == -1) return input;

    let msg = input.split(' ')
      , match = null
      , result = {
          text: null,
          type: WordType.IMAGE,
          data: {
            invalid: false
          }
        };


    for (let p of msg) {
      if (match = (/http[s]?:\/\/([a-zA-Z0-9/+-_]\.?)+\.(png|jpg|jpeg|gif)$/g.exec(p))) {
        if (match[0] == p) {
          result.text = p;
        } else {
          result.text = 'Invalid Link';
          result.data.invalid = true;
        }
      }
    }

    return result.text ? result : input;

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
