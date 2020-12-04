<template>
  <div class="blog" v-if="posts.length && !activePost">
    <div class="blog-entry"
      v-for="(post, i) of posts"
      :key="i"
      @click="goTo(post.uri)"
    >
      <h1 class="blog-entry__title">{{post.title}}</h1>
      <div class="blog-entry__date">
        <icon
          class="blog-entry__icon"
          :type='"calendar"'
        ></icon>{{ formatDate(post.date) }}
      </div>
      <div class="blog-entry__time">
        <icon
          class="blog-entry__icon"
          :type='"clock"'
        ></icon>{{ formatTime(post.date)}}
      </div>
      <article class="md blog-entry__snippet" v-html="post.content"></article>
    </div>
  </div>
  <div class="blog__display" v-if="activePost">
    <article class="md blog_content" v-html="activePost.content"></article>
  </div>
</template>

<script lang='ts' src='./_blog.ts'></script>