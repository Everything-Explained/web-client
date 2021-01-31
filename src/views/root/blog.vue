<template>
  <div class="blog">
    <title-bar :easeIn='350' :easeOut='350'></title-bar>
    <transition name='fade' mode='out-in'>
      <div class="preloader page" v-if="getBlogPosts.isRunning"></div>
      <div v-else>
        <div v-if="!posts.length" class="--no-entries">No Blog Entries Yet!</div>
        <transition name='fade' @before-leave="onBeforeTransLeave" mode="out-in">
          <div class="blog-entries" v-if="posts.length && !activePost" key="postInactive">
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
              <article class="blog-entry__summary" v-html="post.summary"></article>
              <div class="blog-entry__author"
                :class="{ 'ethan': isEthan(post.author) }"
              >
                <icon class="blog-entry__author-icon" :type='"user"'></icon>
                {{ post.author }}
              </div>
            </div>
            <ee-footer></ee-footer>
          </div>
          <div class="blog-display" v-else-if="activePost" key="postActive">
            <div v-if="activePost.image_header" class="blog-display_image-header">
              <ee-img :src="activePost.image_header" :asset='true'></ee-img>
            </div>
            <article class="md blog_content" v-html="activePost.content"></article>
            <ee-footer></ee-footer>
          </div>
        </transition>
      </div>
    </transition>
  </div>

</template>

<script lang='ts' src='./blog'></script>