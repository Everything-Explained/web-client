<template>
  <header class="main__header">
    <div class="main__header-ribbon"></div>
    <div class="main__header_title" alt="">Everything Explained</div>
    <menu class="main__menu">
      <ul>
        <li v-for="(route, i) of routes" :key="i">
          <router-link :to='route.path' :title="route.meta.title"
          >{{route.name.toUpperCase()}}</router-link>
        </li>
      </ul>
    </menu>
  </header>
    <div class="main__body-content --default-scrollbar">
        <router-view />
    </div>
  </section>
</template>

<script lang='ts' src='./_app.ts'></script>