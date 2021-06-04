<template>
  <div id="App" class="app-container">
    <div class="app-ribbon" />
    <div :class="['app__toast-buffer', { '--show': !isToastClosed }]" />
    <div :class="['app__toast', { '--show': isToastVisible }]" @click="openVersion">
      Click here to see the New Release Changes!
      <ee-icon class="app__toast-icon"
               :type="'cross'"
               @click.stop="closeToast"
      />
    </div>
    <header id="AppHeader" class="app-header">
      <router-link :to="{ name: 'home' }" class="app-header__title">
        Everything Explained
      </router-link>
    </header>
    <section class="app-body">
      <ee-menu :header-id="'AppHeader'" :content-id="'AppBodyContent'" />
      <div id="AppBodyContent" class="app-body__content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </section>
  </div>
</template>



<script lang='ts'>
import { computed, defineComponent, onMounted, onUnmounted, Ref, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import eeMenuVue from "@/components/layout/ee-menu.vue";
import eeIconVue from "./components/ui/ee-icon.vue";
import { useDate } from "./composeables/date";
import { ISODateString } from "./typings/global-types";

export default defineComponent({
  components: {
    'ee-menu': eeMenuVue,
    'ee-icon': eeIconVue,
  },
  setup() {
    const body = computed(() => document.body);

    const {
      isToastVisible,
      isToastClosed,
      closeToast,
      openVersion,
    } = useVersionToast(body, '2021-05-27T19:03:43.501Z', 'a2-snickerdoodle');

    useCustomScrollPos(body);

    return { isToastVisible, isToastClosed, closeToast, openVersion };
  }
});


function useVersionToast(body: Ref<HTMLElement>, releaseDate: ISODateString, changelogURI: string) {
  if (localStorage.getItem('release-date') != releaseDate) {
    localStorage.setItem('release-date', releaseDate);
    localStorage.setItem('release-toast', 'open');
  }

  const router          = useRouter();
  const isNewRelease    = ref(useDate(releaseDate).toDaysOldFromNow() <= 7);
  const isToastClosed   = ref(localStorage.getItem('release-toast') == 'closed');
  const isToastHidden   = ref(false);
  const isToastVisible  = computed(() => {
    return isNewRelease.value && !isToastClosed.value && !isToastHidden.value;
  });

  function hideToastOnScroll() {
    if (isToastClosed.value || !isNewRelease.value) return;
    if (body.value.scrollTop >= 40) {
      return isToastHidden.value = true;
    }
    return isToastHidden.value = false;
  }

  function openVersion() {
    closeToast();
    router.push(`/changelog/${changelogURI}`);
  }

  function closeToast() {
    isToastClosed.value = true;
    localStorage.setItem('release-toast', 'closed');
  }

  onMounted(() => {
    if (!isToastVisible.value) return;
    body.value.addEventListener('scroll', hideToastOnScroll);
  });

  onUnmounted(() => {
    body.value.removeEventListener('scroll', hideToastOnScroll);
  });

  return {
    closeToast,
    openVersion,
    isToastVisible,
    isToastClosed,
  };
}


function useCustomScrollPos(body: Ref<HTMLElement>) {
  const blogScrollPos = ref(0);
  const router        = useRouter();
  const route         = useRoute();

  watch(() => route.path, onRouteChange);

  async function onRouteChange() {
    await router.isReady();
    if (route.path.includes('/blog')) {
      setBlogScrollPos(); return;
    }
    setScrollTop(0);
  }

  function setBlogScrollPos() {
    // If navigating to blog article
    if (route.path.includes('/blog/')) {
      blogScrollPos.value = body.value.scrollTop;
      setScrollTop(0); return;
    }
    setScrollTop(blogScrollPos.value);
  }

  function setScrollTop(top: number) {
    // Scrolls page after navigation transition delay
    setTimeout(() => body.value.scrollTop = top, 430);
  }
}


</script>



