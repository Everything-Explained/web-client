<template>
  <main class="main">
    <header class="main__header">
      <div class="main__header-ribbon"></div>
      <aside class="main__header-logo"></aside>
    </header>

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
      <!-- In case firefox needs some css polyfills -->
      <!-- main_body-content :class="{ firefox: isFirefox }" -->
    <section class="main__body">
      <section class="main__body-left-section">
        <menu class="main__menu">
          <ul>
            <!-- <li v-for="(route, i) of routes" :key="i">
              <router-link :to='"/" + route.name'
              >{{route.name.toUpperCase()}}</router-link>
            </li> -->
            <li>
              <a href="#/home" class="router-link">HOME</a>
            </li>
          </ul>
        </menu>
        <aside class="main__watermark" @click="openWatermark">
          <span>{{ versionType + version }}</span>
        </aside>
      </section>

      <div class="main__body-content">
        <transition name="fade">
          <router-view />
        </transition>
      </div>
    </section>

  </main>
</template>

<script lang="ts" src="./_app.ts"></script>
