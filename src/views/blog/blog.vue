<template>
  <div class="blog__entries" v-if="posts.length">
    <div class="blog__entry"
      v-for="(post, i) of posts"
      :key="i"
    >
      <div class="blog_title">{{post.title}}</div>
      <div class="blog_date">{{ post.date }}</div>
      <article class="blog_snippet"
        >{{ post.content.substr(0, 50) }}
      </article>
    </div>
  </div>
</template>

<script lang='ts' src='./_blog.ts'></script>