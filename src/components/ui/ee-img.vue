
<template>
  <div ref="containerRef" class="lazyimg">
    <div v-if="showPreloader"
         :class="['preloader lazyimg_preloader', { '--disabled': loaded }]"
    />
    <img ref="imgRef"
         :class="['lazyimg_image', { '--loaded': loaded }]"
         alt=""
    >
  </div>
</template>


<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs, watch } from "vue";
import { useStore } from "vuex";
import { VuexStore } from "../../vuex/vuex-store";

export default defineComponent({
  props: {
    src:   { type: String,  default: ''    },
    asset: { type: Boolean, default: false },
  },
  setup(props) {
    if (!props.src) throw Error('LazyImg::missing SRC attribute');

    const imgRef        = ref<HTMLImageElement>();
    const containerRef  = ref<HTMLElement>();
    const store         = useStore<VuexStore>();

    const state = reactive({
      img           : computed(() => imgRef.value!),
      loaded        : false,
      showPreloader : false,
      activeSrc     : computed(() => props.src!),
      cache         : computed(() => store.state.lazyimgCache)
    });

    function isImageCached(uri: string) {
      const uriSlug = uri ? uri.split('//', 2)[1] : uri;
      return state.cache.find(v => v.includes(uriSlug));
    }

    function detectAssetSize() {
      if (props.asset) {
        const [width, height] = state.activeSrc.split('/')[5].split('x');
        state.img.height = parseInt(height);
        state.img.width = parseInt(width);
      }
    }

    const updateImageSrc = () => state.img.src = state.activeSrc;
    function loadImage(entries: IntersectionObserverEntry[], obs: IntersectionObserver) {
      if (entries[0].isIntersecting) {
        if (!isImageCached(state.activeSrc)) {
          state.showPreloader = true;
          // Provides a smoother transition with fast loading images
          setTimeout(updateImageSrc, 150);
          store.commit('lazyimg-cache-add', state.activeSrc);
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
</script>