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
          <ee-video v-for="(v, i) of videos" :key="i"
            :videoId='v.id'
            :desc='v.content'
            class="red33m-video"
          >{{ v.title }}</ee-video>
        </div>
      </div>

    </transition>
  </div>
</template>

<script lang='ts' src='./red33m.ts'></script>