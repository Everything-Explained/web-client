import Vue from 'vue';
import { MiniModal } from './libs/minimodal';

declare module "vue/types/vue" {
  interface Vue {
    readonly $modal: MiniModal;
  }
}