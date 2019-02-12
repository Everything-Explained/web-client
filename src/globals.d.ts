import Vue from 'vue';
import { MiniModal } from './libs/minimodal';
import imageData from '@/assets/data-images.json';

declare module "vue/types/vue" {
  interface Vue {
    readonly $modal: MiniModal;
    readonly $dataImages: typeof imageData;
  }
}