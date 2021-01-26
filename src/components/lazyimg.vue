
<template>
  <div ref='containerRef' class="lazyimg">
    <div
      v-if="showPreloader"
      id='LazyPreloader'
      class="preloader lazyimg_preloader"
      :class="{ '--disabled': loaded }"
    ></div>
    <img
      ref="imgRef"
      class="lazyimg_image"
      :class="{ '--loaded': loaded }"
      alt="">
  </div>
</template>


<script lang="ts" src='./lazyimg.ts'></script>