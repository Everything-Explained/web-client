<template>
  <div class="lib-videos">
    <title-bar :easeIn='350' :easeOut='350'>Library Videos</title-bar>
    <transition name='fade' mode='out-in'>
      <div class="preloader page" v-if="!categories"></div>
      <div v-else>
        <div class="category"
          v-for="(cat, i) of categories"
          :key="i"
        >
          <div class="category_name">{{ cat.name }}</div>
          <div class="cat_video-tray --default-scrollbar">
            <ee-video v-for="(v, i) of cat.videos" :key="i"
              :videoId='v.id'
              :desc='v.content'
              class="lib-videos_video"
            >{{ v.title }}</ee-video>
          </div>
        </div>
        <ee-footer></ee-footer>
      </div>
    </transition>
  </div>
</template>


<script lang="ts" src='./videos'></script>