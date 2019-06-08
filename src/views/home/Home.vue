<template>
  <div>
    <markdown-paging
      :pages='home'
      :selectedPage='page'
      placeholder='#### select a topic on the left'
      :mdClass="'md-welcome md-rules'"
      :displayType="'fullscreen'"
      sortBy="inline"
      redirect="true"
    ></markdown-paging>
  </div>
</template>

<script lang="ts" src='./_home.ts'></script>
<style lang='sass' src='@/styles/markdown/_md_welcome.sass'></style>