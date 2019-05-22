import Vue from 'vue';
import { MiniModal } from '../libs/minimodal';
import imageData from '@/assets/data-images.json';
import Markdown from 'markdown-it';
import ClientAPI from '../api/mock';
import { Timer } from '@/libs/timer';


export type DebounceObj =
{
  exec: (...args: any) => Promise<any>;
  cancel: () => void;
}

declare module "vue/types/vue" {
  interface Vue {
    readonly $modal: MiniModal;
    readonly $dataImages: typeof imageData;
    readonly $markdown: Markdown;
    readonly $api: ClientAPI;
    readonly $timer: Timer;
    readonly $debounce:
                (fn: (...args: any) => any, delay: number)
                  => DebounceObj
  }
}