<template>
  <div>
    <md-paging
      :pages='changelog'
      :selectedPage='selected'
      path='/changelog'
      placeholder='#### select a log on the left'
      class="md-changelog"
    ></md-paging>
  </div>
</template>

<script lang="ts" src='./changelog.ts'></script>
