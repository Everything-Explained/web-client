<template>
  <div class="temp">
    <ee-titlebar :ease-in="350" :ease-out="350">
      Library Literature
    </ee-titlebar>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";
import { VuexStore } from "@/vuex/vuex-store";
import eeTitlebarVue from "@/components/layout/ee-titlebar.vue";

export default defineComponent({
  components: {
    'ee-titlebar': eeTitlebarVue,
  },
  setup() {
    const store = useStore<VuexStore>();

    store.commit('page-title', 'Literature');
  }
});
</script>