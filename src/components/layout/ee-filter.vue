<template>
  <div class="ee-filter">
    <fieldset :class="['ee-filter__fieldset', { '--visible': isFilterExpanded }]">
      <legend>Filter</legend>
      <ee-toggle
        left-text="Oldest"
        right-text="Latest"
        @toggle="toggleAge"
      />
      <div class="ee-filter__authors">
        <ee-checkbox
          v-for="(author, i) of authors"
          :key="i"
          :value="author"
          @changed="filterAuthor(i, $event)"
        />
      </div>
    </fieldset>
    <div class="ee-filter__expand-filter" @mousedown="toggleFilter">
      <span v-if="isFilterExpanded">
        <ee-icon type="chev-up" />
        less
      </span>
      <span v-else>
        <ee-icon type="chev-down" />
        more
      </span>
    </div>
  </div>
</template>


<script lang="ts">
import { StaticPage } from "@/composeables/staticPager";
import { defineComponent, PropType, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import eeCheckboxVue from "../ui/ee-checkbox.vue";
import eeIconVue from "../ui/ee-icon.vue";
import eeToggleVue from "../ui/ee-toggle.vue";


export default defineComponent({
  components: {
    'ee-checkbox': eeCheckboxVue,
    'ee-toggle': eeToggleVue,
    'ee-icon': eeIconVue,
  },
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


    const store = useStore();
    const authorIndexMap: number[] = [];
    const isChecked = ref([]);
    const isFilterExpanded = ref(false);

    function filterAuthor(i: number, val: boolean) {
      if (val) authorIndexMap.push(i);
      else authorIndexMap.splice(authorIndexMap.indexOf(i), 1);
      const filteredItems = items.filter(item => {
        return authorIndexMap.some(i => authors[i] == item.author);
      });
      emit('filter', filteredItems.length ? filteredItems : items);
      store.commit('update-footer');
    }

    function toggleAge() {
      emit('filter', items.reverse().slice());
    }

    function toggleFilter() {
      isFilterExpanded.value = !isFilterExpanded.value;
    }

    emit('filter', items);

    return {
      isChecked,
      authors,
      isFilterExpanded,
      filterAuthor,
      toggleAge,
      toggleFilter,
    };
  }
});


</script>



