<template>
  <div class="red33m">
    <title-bar></title-bar>
    <div class="disclaimer">
      This page contains sensitive content which requires authentication.
      If you have a passcode, enter it below.
    </div>
    <div class="form">
      <input class="red33m_input" type="text"
        v-model="passcode"
        placeholder="Passcode..."
        maxlength="10"
        required
        pattern="[a-zA-Z0-9]{10}"
      />
      <button class="std btn-gold" :disabled='!hasValidPasscode'>ENTER</button>
    </div>
    <ee-footer></ee-footer>
    <!-- <transition name='fade' mode="out-in">
      <div class="preloader page" v-if="getVideos.isRunning"></div>
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
        <ee-footer></ee-footer>
      </div>
    </transition> -->
  </div>
</template>

<script lang='ts' src='./red33m.ts'></script>