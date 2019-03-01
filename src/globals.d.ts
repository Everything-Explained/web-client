import Vue from 'vue';
import { MiniModal } from './libs/minimodal';
import imageData from '@/assets/data-images.json';
import Markdown from 'markdown-it';
import ClientAPI from './api/mock';

declare module "vue/types/vue" {
  interface Vue {
    readonly $modal: MiniModal;
    readonly $dataImages: typeof imageData;
    readonly $markdown: Markdown;
    readonly $api: ClientAPI;
    readonly $debounce: (fn: () => void, delay: number) => (...any) => void;
  }
}