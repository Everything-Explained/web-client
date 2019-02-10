<template>
  <article class="dyn-panel">
    <div class="panel-container">
      <div class="panel">
        <div class="titles">
          <div class="scroller" v-if="pages.length > 0">
            <div class="title"
                 v-for="(page, index) of pages"
                 :key="index"
                 @mousedown="$router.push(path + '/' + page.title[1])"
            >
              <div class="split-title">
                <div class="title-left">
                  {{ page.title[0] }}
                </div>
                <div class="title-right">
                  {{ page.title[1] }}
                  <div class="title-timestamp">
                    {{ page.date | dateFormat('MM-DD-YYYY') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content"
            :class="{ hidden: inTransit }"
      >
        <header>
          {{ header }}
          <div class="timestamp">{{ subheader | dateFormat }}</div>
        </header>
        <div class="content-scroller scroller markdown"
            v-html="renderedContent"></div>
      </div>
    </div>
  </article>
</template>

<script lang='ts' src='./md-paging.ts'></script>
<!-- <style lang="sass" src='./md-paging.sass'></style> //-->

