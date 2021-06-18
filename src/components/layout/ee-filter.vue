<template>
  <div class="ee-filter">
    <fieldset :class="['ee-filter__fieldset', { '--visible': isFilterOpen }]">
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
          :checked="true"
          @changed="filter(i, $event)"
        />
      </div>
    </fieldset>
    <div class="ee-filter__expand-filter" @mousedown="toggleFilter">
      <span v-if="isFilterOpen">
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
import { defineComponent, PropType, ref } from "@vue/runtime-core";
import { StaticPage } from "@/composeables/staticPager";
import { useStore }   from "vuex";
import eeCheckboxVue  from "../ui/ee-checkbox.vue";
import eeIconVue      from "../ui/ee-icon.vue";
import eeToggleVue    from "../ui/ee-toggle.vue";


export default defineComponent({
  components: {
    'ee-checkbox': eeCheckboxVue,
    'ee-toggle': eeToggleVue,
    'ee-icon': eeIconVue,
  },
  props: {
    pages: { type: Array as PropType<StaticPage[]>, required: true },
  },
  emits: ['filter'],
  setup(props, {emit}) {
    const isChecked        = ref([]);
    const store            = useStore();

    const {
      toggleFilter,
      filterAuthor,
      reversePages,
      authors,
      isFilterOpen,
      filteredPages
    } = usePageFilter(props.pages);

    emit('filter', filteredPages);

    return {
      isChecked,
      authors,
      isFilterOpen,
      toggleFilter,

      filter: (i: number, v: boolean) => {
        emit('filter', filterAuthor(i, v));
        store.commit('update-footer');
      },

      toggleAge: () => { emit('filter', reversePages()); },
    };
  }
});



function usePageFilter(pages: StaticPage[]) {
  const clonedPages    = pages.slice(0);
  const authors        = getAuthors(clonedPages);
  const isFilterOpen   = ref(false);
  const authorIndexMap = authors.map((a, i) => i) // Filter all authors
  ;
  let filteredPages    = clonedPages.slice();

  function filterAuthor(index: number, val: boolean) {
    if (val)  authorIndexMap.push(index);
    if (!val) authorIndexMap.splice(authorIndexMap.indexOf(index), 1)
    ;
    filteredPages = clonedPages.filter(item => {
      return authorIndexMap.some(i => authors[i] == item.author);
    });
    return filteredPages;
  }

  function reversePages() {
    // Original pages must also reflect reverse order
    clonedPages.reverse();
    return filteredPages.reverse().slice();
  }

  function toggleFilter() { isFilterOpen.value = !isFilterOpen.value; }

  return { filterAuthor, toggleFilter, reversePages, authors, isFilterOpen, filteredPages };
}



function getAuthors(pages: StaticPage[]) {
  return pages.reduce((pv, cv) => {
    if (pv.includes(cv.author)) return pv;
    pv.push(cv.author);
    return pv;
  }, [] as string[]);
}


</script>



