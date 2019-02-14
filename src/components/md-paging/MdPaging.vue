<template>
  <article class="dyn-panel" v-if="pages && pages.length">
    <div class="panel-container" :class="displayClass">
      <div class="panel">
        <div class="titles">
          <div class="scroller scrollbars" v-if="pages.length > 0">
            <div class="title"
                 v-for="(page, index) of pages"
                 :key="index"
                 @mousedown="goTo(page.title)"
            >
              <span>{{ page.title.length > 1 ? '' : page.title[0] }}</span>
              <div class="split-title" v-if="page.title.length > 1">
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
        <img v-if="invalidPage" :src="$dataImages.lambBlush" />
        <div class="content-scroller scrollbars markdown"
            :class="mdClass"
            v-html="renderedContent"></div>
      </div>
    </div>
  </article>
</template>

<script lang='ts' src='./md-paging.ts'></script>
<!-- <style lang="sass" src='./md-paging.sass'></style> //-->

