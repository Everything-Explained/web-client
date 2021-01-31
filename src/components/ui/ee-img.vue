
<template>
  <div ref='containerRef' class="lazyimg">
    <div class="preloader lazyimg_preloader"
      v-if="showPreloader"
      :class="{ '--disabled': loaded }"
    ></div>
    <img class="lazyimg_image"
      :class="{ '--loaded': loaded }"
      ref="imgRef"
      alt="">
  </div>
</template>


<script lang="ts" src='./ee-img'></script>