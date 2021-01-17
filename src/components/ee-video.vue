<template>
  <div class="ee-video">
    <div class="ee-video_img-container" @click="openVideo">
      <lazy-img :src='thumbnail' class="ee-video_img"></lazy-img>
      <icon class="ee-video-desc_open-widget"
        :type='"info"'
        @click="(e) => setDescState(e, 'open')"
        :class="{ '--open': descState }"
      ></icon>
      <div class="ee-video_desc"
        @click="preventBubble"
        :class="{ '--open': descState }"
      >
        <icon class="ee-video-desc_close-widget"
          :type='"cross"'
          @click="(e) => setDescState(e, 'closed')"
        ></icon>
        <div class="ee-video_content-container">
          <h1>Description</h1>
          <span class="--default-scrollbar" v-html="description"></span>
        </div>
      </div>
    </div>
    <div class="ee-video_title"><slot></slot></div>
  </div>
</template>


<script lang='ts' src='./ee-video.ts'></script>