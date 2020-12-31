<template>
  <div class="red33m">
    <title-bar></title-bar>
    <transition name='fade' mode="out-in">
      <preloader class="data-loader" v-if="getVideos.isRunning"></preloader>
      <div v-else>
        <toggle
          :legend='"Sort By"'
          :leftText='"Oldest"'
          :rightText='"Latest"'
          :callback='toggle'
          :prevent='isLoading'
          class='red33m-toggle'
        ></toggle>
        <div class="red33m-video-list">
          <div
            v-for="(v, i) of videos"
            :key="i"
            class="red33m-video"
            :data-title='v.title'
            @click="openVideo('//www.youtube-nocookie.com/embed/'+ v.id +'?rel=0')"
          >
            <lazy-img
              :src="'//img.youtube.com/vi/' + v.id + '/0.jpg'"
              class="red33m-video_thumbnail-container"
            />
          </div>
        </div>
      </div>

    </transition>
  </div>
</template>

<script lang='ts' src='./red33m.ts'></script>