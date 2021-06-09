<template>
  <div class="ee-filter">
    <ee-checkbox
      v-for="(author, i) of authors"
      :key="i"
      v-model="isChecked"
      :value="author"
    />
  </div>
</template>


<script lang="ts">
import { StaticPage } from "@/composeables/staticPager";
import { defineComponent, PropType, ref } from "@vue/runtime-core";
import eeCheckboxVue from "../ui/ee-checkbox.vue";


export default defineComponent({
  components: { 'ee-checkbox': eeCheckboxVue, },
  props: {
    items: { type: Array as PropType<StaticPage[]>, required: true },
  },
  emits: ['filter'],
  setup(props, {emit}) {
    const authors: string[] = [];
    const items = props.items.slice(0);
    for (const item of items) {
      if (authors.includes(item.author)) continue;
      authors.push(item.author);
    }

    emit('filter', items.reverse());

    const isChecked = ref([false, '']);

    return {
      isChecked,
      authors,
    };
  }
});


</script>



