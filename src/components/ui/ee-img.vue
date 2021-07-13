
<template>
  <div ref="containerRef" class="lazyimg">
    <div
      v-if="showPreloader"
      :class="['preloader lazyimg_preloader', { '--disabled': loaded }]"
    />
    <img
      ref="imgRef"
      :class="['lazyimg_image', { '--loaded': loaded }]"
      alt=""
    >
  </div>
</template>


<script lang="ts">
import { useDateCache } from "@/state/cache-state";
import { computed, defineComponent, onMounted, reactive, ref, toRefs, watch } from "vue";

type IMGProps = { src: string; asset: boolean }

export default defineComponent({
  props: {
    src:   { type: String,  default: ''    },
    asset: { type: Boolean, default: false },
  },
  setup(props) {
    if (!props.src) throw Error('LazyImg::missing SRC attribute');

    const {
      detectAssetSize,
      observeImage,
      imgRef,
      state,
      containerRef } = useImageObserver(props)
    ;

    onMounted(() => {
      detectAssetSize();
      observeImage();
      // Reload image if src changes
      watch(() => props.src, () => {
        state.img.src = '';
        state.loaded = false;
        observeImage();
      });
    });


    return { imgRef, containerRef, ...toRefs(state) };
  }
});


function useImageObserver(props: IMGProps) {
  const imgRef        = ref<HTMLImageElement>();
  const containerRef  = ref<HTMLElement>();
  const dataCache     = useDateCache();

  const state = reactive({
    img           : computed(() => imgRef.value!),
    loaded        : false,
    showPreloader : false,
    activeSrc     : computed(() => props.src!),
    cache         : dataCache.getArrayData<string>('lazyimg-data'),
  });

  function isImageCached(uri: string) {
    const uriSlug = uri ? uri.split('//', 2)[1] : uri;
    return state.cache.find(v => v.includes(uriSlug));
  }

  function detectAssetSize() {
    if (props.asset) {
      const [width, height] = state.activeSrc.split('/')[5].split('x').map(v => parseInt(v));

      const winWidth = document.body.clientWidth;
      const contentWidth = winWidth > 1024 ? 1024 : winWidth;
      const ratio = width / height;

      if (width >= contentWidth) state.img.height = (contentWidth * 0.97) / ratio;
      else state.img.height = width / ratio;
    }
  }

  const updateImageSrc = () => state.img.src = state.activeSrc;
  function loadImage(entries: IntersectionObserverEntry[], obs: IntersectionObserver) {
    if (entries[0].isIntersecting) {
      if (!isImageCached(state.activeSrc)) {
        state.showPreloader = true;
        // Provides a smoother transition with fast loading images
        setTimeout(updateImageSrc, 150);
        dataCache.updArrayData('lazyimg-data', state.activeSrc);
      }
      else updateImageSrc();

      obs.unobserve(containerRef.value!);
    }
  }

  const observer = new IntersectionObserver(loadImage);
  let loadEvents = true;
  function observeImage() {
    if (loadEvents) {
      state.img.addEventListener('load', () => state.loaded = true);
      state.img.addEventListener('animationend', () => state.showPreloader = false);
      loadEvents = false;
    }
    observer.observe(containerRef.value!);
  }

  return { state, imgRef, containerRef, observeImage, detectAssetSize };
}
</script>