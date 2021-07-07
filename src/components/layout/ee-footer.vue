<template>
  <footer ref="footRef" class="app-footer">
    <span class="app-footer__version">
      α<sup>3<sub><router-link :to="'/changelog/a3-insulation'">insulation</router-link></sub></sup>
    </span>
    <span class="app-footer_copyright">
      <span>Copyright &#169; 2020 - 2021</span><br>
      <span>Everything Explained, Some Rights Reserved</span> <br>
      <a
        rel="license"
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
        target="_blank"
      >Creative Commons BY-NC-SA-4.0 License</a><br>
    </span>
  </footer>
</template>


<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const { setFooterPos, debounceFooterPos, footRef } = useFooterPosition();
    const store = useStore();

    const storeUnsubscribe = store.subscribe(m => {
      if ('update-footer' == m.type) debounceFooterPos();
    });

    onMounted(() => {
      setFooterPos();
      window.addEventListener('resize', debounceFooterPos);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', debounceFooterPos);
      storeUnsubscribe();
    });

    return { footRef };
  }
});


function useFooterPosition() {
  const footRef = ref<HTMLElement>();
  const app = document.getElementById('App')!;

  let timeout = 0;
  function debounceFooterPos() {
    footRef.value!.style.position = 'relative';
    footRef.value!.style.bottom = 'auto';
    clearTimeout(timeout);
    timeout = setTimeout(setFooterPos, 30);
  }

  function setFooterPos() {
    const footHeight   = footRef.value!.clientHeight;
    const scrollOffset = footHeight + app.clientHeight;
    const scrollArea   = footHeight + window.innerHeight
    ;
    if (scrollOffset <= scrollArea) {
      footRef.value!.style.position = 'fixed';
      footRef.value!.style.bottom = '0';
    }
  }

  return { setFooterPos, debounceFooterPos, footRef };
}
</script>

