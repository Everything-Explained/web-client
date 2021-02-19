
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
import { computed, defineComponent, onMounted, ref, watch } from "vue";
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
    const loaded        = ref(false);
    const showPreloader = ref(false);
    const store         = useStore<VuexStore>();
    const imageCache    = computed(() => store.state.lazyimgCache);
    const newSrc        = computed(() => props.src!);
    const img           = computed(() => imgRef.value!);
    const isAsset       = props.asset ?? false;

    function isImageCached(uri: string) {
      const uriSlug = uri ? uri.split('//', 2)[1] : uri;
      return imageCache.value.find(v => v.includes(uriSlug));
    }

    function detectAssetSize() {
      if (isAsset) {
        const [width, height] = newSrc.value.split('/')[5].split('x');
        img.value.height = parseInt(height);
        img.value.width = parseInt(width);
      }
    }

    const updateImageSrc = () => img.value.src = newSrc.value!;
    const loadImage = (entries: IntersectionObserverEntry[], obs: IntersectionObserver) => {
      if (entries[0].isIntersecting) {
        if (!isImageCached(newSrc.value)) {
          showPreloader.value = true;
          // Provides a smoother transition with fast loading images
          setTimeout(updateImageSrc, 150);
          store.commit('lazyimg-cache-add', newSrc.value);
        }
        else updateImageSrc();

        obs.unobserve(containerRef.value!);
      }
    };
    const observer = new IntersectionObserver(loadImage);

    let loadEvents = true;
    const observeImage = () => {
      if (loadEvents) {
        img.value.addEventListener('load', () => loaded.value = true);
        img.value.addEventListener('animationend', () => showPreloader.value = false);
        loadEvents = false;
      }
      observer.observe(containerRef.value!);
    };

    onMounted(() => {
      detectAssetSize();
      observeImage();
      // Reload image if src changes
      watch(() => props.src, () => {
        img.value.src = '';
        loaded.value = false;
        observeImage();
      });
    });


    return { imgRef, containerRef, loaded, showPreloader, imageCache };
  }
});
</script>