import { computed, defineComponent } from "vue";
import Lazyimg from '@/components/lazyimg.vue';

export default defineComponent({
  components: {
    'lazy-img': Lazyimg,
  },
  props: {
    title: String,
    videoId: String,
  },
  setup(props) {
    const titleRef     = computed(() => props.title);
    const videoIDRef   = computed(() => props.videoId);
    const thumbnailRef = computed(() =>
      `//img.youtube.com/vi/${videoIDRef.value}/0.jpg`
    );

    const openVideo = () => {
      window.open(
        `//www.youtube-nocookie.com/embed/${videoIDRef.value}?rel=0`,
        '_blank'
      );
    };

    return {
      title    : titleRef,
      thumbnail: thumbnailRef,
      openVideo
    };
  }
});