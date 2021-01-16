<template>
  <div class="temp">
    <title-bar :easeIn='350' :easeOut='350'></title-bar>
    <ee-video v-for="(v, i) of videos" :key="i"
      :title='v.title'
      :videoId='v.id'
      class="lib-videos_video"
    ></ee-video>
  </div>
</template>


<script lang="ts" src='./videos.ts'></script>