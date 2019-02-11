<template>
  <div>
    <markdown-paging
      :pages='changelog'
      :selectedPage='selected'
      path='/changelog'
      placeholder='#### select a log on the left'
      class="md-changelog"
    ></markdown-paging>
  </div>
</template>

<script lang="ts" src='./changelog.ts'></script>
