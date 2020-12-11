import { defineComponent, onMounted, ref } from "vue";
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
    const src = props.src;
    const imgRef = ref<HTMLImageElement>();
    const containerRef = ref<HTMLElement>();
    const loaded = ref(false);
    const loading = ref(false)
    ;
    const loadImage = (entries: IntersectionObserverEntry[], obs: IntersectionObserver) => {
      if (entries[0].isIntersecting) {
        loading.value = true;
        imgRef.value!.src = src;
        obs.unobserve(containerRef.value!);
      }
    };
    const hidePreloader = () => { loading.value = false; };
    const observer = new IntersectionObserver(loadImage);
    const onImgLoad = () => setTimeout(() => loaded.value = true, 150);

    onMounted(() => {
      imgRef.value!.addEventListener('transitionend', hidePreloader);
      imgRef.value!.addEventListener('load', onImgLoad);
      observer.observe(containerRef.value!);
    });

    return { imgRef, containerRef, loaded, loading };
  }
});