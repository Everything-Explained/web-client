<template>
  <div class="ee-video">
    <div class="ee-video_img-container">
      <ee-img :src='thumbnail' class="ee-video_img"></ee-img>
      <ee-icon class="ee-video_widget ee-video_widget-open-video"
        @click="openVideo"
        :class="{ '--open': descState }"
        :type='"export"'
      ></ee-icon>
      <ee-icon class="ee-video_widget ee-video_widget-open-desc"
        v-if="description"
        @click="setDescState('open')"
        :class="{ '--open': descState }"
        :type='"info"'
      ></ee-icon>
      <div class="ee-video_desc"
        :class="{ '--open': descState }"
      >
        <ee-icon class="ee-video_widget ee-video_widget-close-desc"
          @click="setDescState('closed')"
          :type='"cross"'
        ></ee-icon>
        <div class="ee-video-desc_text">
          <h1>Description</h1>
          <span class="--default-scrollbar"
            v-html="description"
          ></span>
        </div>
      </div>
    </div>
    <div class="ee-video_title"><slot></slot></div>
  </div>
</template>


<script lang='ts' src='./ee-video'></script>