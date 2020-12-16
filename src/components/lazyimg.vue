
<template>
  <div ref='containerRef' class="lazyimg">
    <preloader
      v-if="loading"
      id='LazyPreloader'
      class="lazyimg_preloader"
      :class="{ '--disabled': loaded }"
    ></preloader>
    <img
      ref="imgRef"
      class="lazyimg_image"
      :class="{ '--loaded': loaded }"
      alt="">
  </div>
</template>


<script lang="ts" src='./lazyimg.ts'></script>