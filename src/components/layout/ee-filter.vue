<template>
  <div class="ee-filter">
    <fieldset :class="['ee-filter__fieldset', { '--visible': isFilterOpen }]">
      <legend>Filter</legend>
      <ee-toggle
        :init-state="arePagesReversed"
        left-text="Oldest"
        right-text="Latest"
        @toggle="toggleAge"
      />
      <div class="ee-filter__authors">
        <ee-checkbox
          v-for="(author, i) of authors"
          :key="i"
          :value="author"
          :checked="authorIndexMap.includes(i)"
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
import { computed, defineComponent, PropType, ref } from "vue";
import { useStore }   from "vuex";
import eeCheckboxVue  from "../ui/ee-checkbox.vue";
import eeIconVue      from "../ui/ee-icon.vue";
import eeToggleVue    from "../ui/ee-toggle.vue";
import { VuexStore } from "@/vuex/vuex-store";

interface FilterData {
  // Allow ignorable props
  [key: string]: any;
  author: string;
  date: string;
}

export default defineComponent({
  components: {
    'ee-checkbox': eeCheckboxVue,
    'ee-toggle': eeToggleVue,
    'ee-icon': eeIconVue,
  },
  props: {
    reverseOrder: { type: Boolean as PropType<boolean>,    default: false,             },
    items:        { type: Array as PropType<FilterData[]>, default: [] as FilterData[] },
    persist:      { type: Boolean as PropType<boolean>,    default: true               },
  },
  emits: ['filter'],
  setup(props, {emit}) {
    const isChecked        = ref([]);
    const store            = useStore<VuexStore>();

    const {
      toggleFilter,
      filterAuthor,
      reversePages,
      authors,
      isFilterOpen,
      arePagesReversed,
      filteredPages,
      authorIndexMap,
    } = usePageFilter(props.items, props.persist, props.reverseOrder);

    emit('filter', filteredPages);

    return {
      filter: (i: number, v: boolean) => {
        emit('filter', filterAuthor(i, v));
        store.commit('update-footer');
      },

      toggleAge: () => {
        emit('filter', reversePages());
      },

      isChecked,
      authors,
      isFilterOpen,
      arePagesReversed,
      authorIndexMap,
      toggleFilter,
    };
  }
});



function usePageFilter(pages: FilterData[], isPersisting: boolean, areReversed = false) {
  const store            = useStore<VuexStore>();
  const filterStore      = store.state.filter;
  const clonedPages      = pages.slice();
  const authors          = getAuthors(clonedPages);
  const isFilterOpen     = ref(filterStore.isPersisting && filterStore.isOpen || false);
  const arePagesReversed = computed(() => areReversed ? !filterStore.reversed : filterStore.reversed);
  const authorIndexMap   =
    filterStore.isPersisting
      ? filterStore.authorIndexMap
      : authors.map((a, i) => i)
  ;
  let filteredPages      =
    filterStore.isPersisting
      ? filterStore.pages
      : clonedPages.slice()
  ;

  if (filterStore.isPersisting && filterStore.reversed) {
    clonedPages.reverse();
  }

  store.commit('filter-upd-persist', isPersisting);
  store.commit('filter-upd-map', authorIndexMap);
  store.commit('filter-upd-pages', filteredPages);

  return {
    toggleFilter: () => {
      isFilterOpen.value = !isFilterOpen.value;
      store.commit('filter-upd-isOpen', isFilterOpen.value);
    },

    reversePages: () => {
      // Original pages must also reflect reverse order
      clonedPages.reverse();
      const pages = filteredPages.reverse().slice();
      store.commit('filter-upd-reversed', !filterStore.reversed);
      return pages;
    },

    filterAuthor: (index: number, val: boolean) => {
      if (val)  authorIndexMap.push(index);
      if (!val) authorIndexMap.splice(authorIndexMap.indexOf(index), 1)
      ;
      store.commit('filter-upd-map', authorIndexMap);
      filteredPages = clonedPages.filter(item => {
        return authorIndexMap.some(i => authors[i] == item.author);
      });
      store.commit('filter-upd-pages', filteredPages);
      return filteredPages;
    },

    authors,
    isFilterOpen,
    filteredPages,
    authorIndexMap,
    arePagesReversed
  };
}



function getAuthors(pages: FilterData[]) {
  return pages.reduce((authors, cpg) => {
    if (authors.includes(cpg.author)) return authors;
    authors.push(cpg.author);         return authors;
  }, [] as string[]);
}


</script>



