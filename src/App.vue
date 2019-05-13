<template>
  <main id="PageTop">
    <header class="global">
      <div class="ribbon"></div>
      <aside class="logo"></aside>
    </header>

    <aside id="VersionModal" class="modal-overlay">
      <div class="modal-preload-container">
        <div class="preloader"></div>
      </div>
      <section class="modal-container">
        <header>
          <span class="normal">{{ verType + version }}</span>
        </header>
        <section class="code">{{ verDesc }}</section>
        <a href="javascript:void(0);" class="modal-close">&#10060;</a>
      </section>
    </aside>

    <section id="TrayTop"></section>

    <section id="PageMiddle">
      <section id="TrayLeft">
        <menu id="MainMenu">
          <ul>
            <li v-for="(route, i) of routes" :key="i">
              <router-link :to='"/" + route.name'
              >{{route.name.toUpperCase()}}</router-link>
            </li>
          </ul>
        </menu>
        <aside class="watermark" @click="openWatermark">
          <span>{{ verType + version }}</span>
        </aside>
      </section>

        <div id="PageContent">
          <transition name="fade">
            <router-view />
          </transition>
        </div>
    </section>

  </main>
</template>

<script type='ts' src='./app.ts'></script>
<style lang="sass" src="./app.sass"></style>
