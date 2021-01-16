<template>
  <div
    class="ee-video"
    :data-title='title'
    @click="openVideo"
  >
    <lazy-img :src='thumbnail'></lazy-img>
  </div>
</template>


<script lang='ts' src='./ee-video.ts'></script>