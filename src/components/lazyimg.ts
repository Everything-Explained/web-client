import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { VuexStore } from "../vuex/vuex-store";
import preloader from './preloader.vue';

export default defineComponent({
  components: {
    preloader,
  },
  props: {
    src: String
  },
  setup(props) {
    if (!props?.src)
      throw Error('LazyImg::missing SRC attribute')
    ;
    const img           = ref<HTMLImageElement>();
    const containerRef  = ref<HTMLElement>();
    const loaded        = ref(false);
    const showPreloader = ref(false);
    const store         = useStore<VuexStore>();
    const imageCache    = computed(() => store.state.lazyimgCache);
    const newSrc        = computed(() => props.src!);

    const isImageCached = (uri: string) => {
      const uriSlug = uri ? uri.split('//', 2)[1] : uri;
      return imageCache.value.find(v => v.includes(uriSlug));
    };
    const updateImageSrc = () => img.value!.src = newSrc.value!;
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
        img.value!.addEventListener('load', () => loaded.value = true);
        img.value!.addEventListener('animationend', () => showPreloader.value = false);
        loadEvents = false;
      }
      observer.observe(containerRef.value!);
    };

    onMounted(() => {
      observeImage();
      // Reload image if src changes
      watch(() => props.src, () => {
        img.value!.src = '';
        loaded.value = false;
        observeImage();
      });
    });


    return { imgRef: img, containerRef, loaded, showPreloader };
  }
});