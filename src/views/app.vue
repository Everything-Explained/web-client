<template>
  <div id="App" class="app-container">
    <div class="app-ribbon" />
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
import { defineComponent, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import eeMenuVue from "@/components/layout/ee-menu.vue";

export default defineComponent({
  components: {
    'ee-menu': eeMenuVue,
  },
  setup() {
    // const version     = '36';
    // const versionType = 'α';
    const body          = ref<HTMLBodyElement|null>(null);
    const blogScrollPos = ref(0);
    const router        = useRouter();
    const route         = useRoute();

    onMounted(() => {
      body.value = document.getElementsByTagName('body')[0];
    });

    const setScrollTop = (top: number) => {
      // Prevents user from noticing scroll reset.
      // Resets when view is hidden in transition.
      setTimeout(() => body.value!.scrollTop = top, 450);
    };

    const setBlogScrollPos = () => {
      if (route.path.includes('/blog/')) {
        blogScrollPos.value = body.value!.scrollTop;
        setScrollTop(0);
      }
      if (route.path == '/blog') {
        setScrollTop(blogScrollPos.value);
      }
    };

    // onRouteChange
    watch(() => route.path,
      async () => {
        await router.isReady();
        if (route.path.includes('/blog')) {
          setBlogScrollPos(); return;
        }
        setScrollTop(0);
      }
    );
  }
});
</script>