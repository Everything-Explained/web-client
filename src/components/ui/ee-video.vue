<template>
  <div class="ee-video">
    <div class="ee-video_img-container">
      <ee-img :src="thumbnail" class="ee-video_img" />
      <ee-icon
        :class="['ee-video_widget ee-video_widget-open-video', { '--open': descState }]"
        type="export"
        @click="openVideo"
      />
      <ee-icon
        v-if="description"
        :class="['ee-video_widget ee-video_widget-open-desc', { '--open': descState }]"
        type="info"
        @click="setDescState('open')"
      />
      <div :class="['ee-video_desc', { '--open': descState }]">
        <ee-icon
          class="ee-video_widget ee-video_widget-close-desc"
          type="cross"
          @click="setDescState('closed')"
        />
        <div class="ee-video-desc_text">
          <h1>Description</h1>
          <span class="--default-scrollbar" v-html="description" />
        </div>
      </div>
    </div>
    <div class="ee-video_title">
      <slot />
    </div>
  </div>
</template>


<script lang='ts'>import { computed, defineComponent, ref, toRefs } from "vue";
import eeIconVue from '@/components/ui/ee-icon.vue';
import eeImgVue from "./ee-img.vue";

export default defineComponent({
  components: {
    'ee-img': eeImgVue,
    'ee-icon': eeIconVue,
  },
  props: {
    desc    : { type: String, default: '' },
    videoId : { type: String, default: '' },
  },
  setup(props) {
    const { videoId, desc } = toRefs(props);
    const descStateRef = ref(false);
    const thumbnailRef = computed(() =>
      `//img.youtube.com/vi/${videoId.value}/0.jpg`
    );

    function openVideo() {
      window.open(
        `//www.youtube-nocookie.com/embed/${videoId.value}?rel=0`,
        '_blank'
      );
    }

    function setDescState(state: 'closed'|'open') {
      descStateRef.value = state == 'open';
    }

    return {
      thumbnail: thumbnailRef,
      description: desc,
      descState: descStateRef,
      openVideo, setDescState
    };
  }
});
</script>