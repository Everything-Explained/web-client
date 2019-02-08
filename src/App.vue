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
            <li>
              <router-link to='home'><span>home</span></router-link>
            </li>
            <li>
              <router-link to='changelog'><span>changelog</span></router-link>
            </li>
            <li>
              <router-link to='faq'><span>faq</span></router-link>
            </li>
            <li>
              <router-link to='invite'><span>invite</span></router-link>
            </li>
            <li>
              <router-link to='signin'><span>signin</span></router-link>
            </li>
          </ul>
        </menu>
        <aside class="watermark" @click="openWatermark">
          <span>{{ verType + version }}</span>
        </aside>
      </section>

      <router-view id="PageContent" />
    </section>

  </main>
  <!-- <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div> -->
</template>

<script type='ts' src='./app.ts'></script>
<style lang="sass" src="./app.sass"></style>
