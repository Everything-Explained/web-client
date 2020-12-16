import { defineComponent, onMounted, ref, watch } from "vue";
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
    const img = ref<HTMLImageElement>();
    const containerRef = ref<HTMLElement>();
    const loaded = ref(false);
    const loading = ref(false)
    ;
    const hidePreloader = () => { loading.value = false; };
    const onImgLoad = () => setTimeout(() => loaded.value = true, 150);
    const loadImage = (entries: IntersectionObserverEntry[], obs: IntersectionObserver) => {
      if (entries[0].isIntersecting) {
        loading.value = true;
        img.value!.src = props.src!;
        obs.unobserve(containerRef.value!);
      }
    };
    const observer = new IntersectionObserver(loadImage);

    let loadEvents = true;
    const observeImage = () => {
      if (loadEvents) {
        img.value!.addEventListener('transitionend', hidePreloader);
        img.value!.addEventListener('load', onImgLoad);
        loadEvents = false;
      }
      observer.observe(containerRef.value!);
    };

    onMounted(() => {
      observeImage();
      // Reload image if src changes
      watch(() => props.src, () => {
        loaded.value = false;
        img.value!.src = '';
        observeImage();
      });
    });


    return { imgRef: img, containerRef, loaded, loading };
  }
});