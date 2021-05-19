<template>
  <footer ref="footRef" class="app-footer">
    <span class="app-footer_copyright">
      <span>Copyright &#169; 2020 - 2021</span><br>
      <a
        rel="license"
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
        target="_blank"
      >Creative Commons BY-NC-SA-4.0 License</a><br>
      <span>Everything Explained, Some Rights Reserved</span> <br>
    </span>
  </footer>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

export default defineComponent({
  setup() {
    const { setFooterPos, debounceFooterPos, footRef } = useFooterPosition();

    onMounted(() => {
      setFooterPos();
      window.addEventListener('resize', debounceFooterPos);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', debounceFooterPos);
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

