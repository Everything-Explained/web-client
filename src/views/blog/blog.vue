<template>
  <div class="blog__entries" v-if="posts.length && !activePost">
    <div class="blog__entry"
      v-for="(post, i) of posts"
      :key="i"
      @click="goTo(post.uri)"
    >
      <h1 class="blog_title">{{post.title.toUpperCase()}}</h1>
      <div class="blog_date"
        ><icon class="blog_icon" :type='"calendar"'></icon>{{ formatDate(post.date) }}
      </div>
      <div class="blog_time"
        ><icon class="blog_icon" :type='"clock"'></icon>{{ formatTime(post.date)}}
      </div>
      <article class="md blog_snippet" v-html="post.content"></article>
    </div>
  </div>
  <div class="md blog__content" v-if="activePost" v-html="activePost"></div>
</template>

<script lang='ts' src='./_blog.ts'></script>