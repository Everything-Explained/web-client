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
    <!-- <aside class="main__header-logo"></aside> -->
  </header>
    <!-- In case firefox needs some css polyfills -->
    <!-- main_body-content :class="{ firefox: isFirefox }" -->
  <section class="main__body --default-scrollbar">
    <!-- <section class="main__body-left-section">

      <aside class="main__watermark">
        <span>{{ versionType + version }}</span>
      </aside>
    </section> -->

    <div class="main__body-content --default-scrollbar">
      <!-- <transition name="fade"> -->
        <router-view />
      <!-- </transition> -->
    </div>
  </section>
    <!-- <aside id="VersionModal" class="modal-overlay">
    <div class="modal-preload-container">
      <div class="preloader"></div>
    </div>
    <section class="modal-container">
      <header>
        <span class="normal">{{ verType + version }}</span>
      </header>
      <section class="code">{{ verDesc }}</section>
      <a href="javascript:void(0);" class="modal-close">&times;</a>
    </section>
  </aside> -->
</template>

<script lang='ts' src='./_app.ts'></script>