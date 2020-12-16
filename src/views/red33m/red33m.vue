<template>
  <div class="red33m">
    <title-bar></title-bar>
    <toggle
      :legend='"Sort By"'
      :leftText='"Oldest"'
      :rightText='"Latest"'
      :callback='toggle'
      class='red33m-toggle'
    ></toggle>
    <div class="red33m-video-list">
      <div
        v-for="(v, i) of videos"
        :key="i"
        class="red33m-video"
        :data-title='v[1]'
        @click="openVideo('//www.youtube-nocookie.com/embed/'+ v[0] +'?rel=0')"
      >
        <lazy-img
          :src="'//img.youtube.com/vi/' + v[0] + '/0.jpg'"
          class="red33m-video_thumbnail-container"
        />
      </div>
    </div>
  </div>
</template>

<script lang='ts' src='./_red33m'></script>