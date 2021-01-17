import { computed, defineComponent, ref } from "vue";
import Lazyimg from '@/components/lazyimg.vue';
import Icon from '@/components/icon.vue';

export default defineComponent({
  components: {
    'lazy-img': Lazyimg,
    'icon': Icon,
  },
  props: {
    desc: String,
    videoId: String,
  },
  setup(props) {
    const videoIDRef   = computed(() => props.videoId);
    const descRef      = computed(() => props.desc);
    const descStateRef = ref(false);
    const thumbnailRef = computed(() =>
      `//img.youtube.com/vi/${videoIDRef.value}/0.jpg`
    );


    const openVideo = () => {
      window.open(
        `//www.youtube-nocookie.com/embed/${videoIDRef.value}?rel=0`,
        '_blank'
      );
    };

    const setDescState = (state: 'closed'|'open') => {
      descStateRef.value = state == 'open';
    };

    return {
      thumbnail: thumbnailRef,
      description: descRef,
      descState: descStateRef,
      openVideo, setDescState
    };
  }
});