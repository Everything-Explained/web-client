<template>
  <div>
    <div class="preloader" v-if="!blog.length"></div>
    <markdown-paging
      v-if="blog.length"
      :pages="blog"
      :selectedPage="page"
      placeholder=""
      mdClass="md-blog"
      displayType="fullscreen"
      redirect="true"
    ></markdown-paging>
  </div>
</template>


<script lang="ts" src='./_blog.ts'></script>