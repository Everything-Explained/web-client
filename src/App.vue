<template>
  <main id="PageTop">
    <header class="global">
      <div class="ribbon"></div>
      <aside class="logo"></aside>
    </header>

    <!-- <aside id="VersionModal" class="modal-overlay">
      <div class="modal-preload-container">
        <div class="preloader"></div>
      </div>
      <section class="modal-container">
        <header>
          <span class="normal"></span>
        </header>
        <section class="code"></section>
        <a href="javascript:void(0);" class="modal-close">&#10060;</a>
      </section>
    </aside> -->

    <section id="TrayTop">
      <aside class="watermark">
        <span>{{ verType + version }}</span>
      </aside>
    </section>

    <section id="PageMiddle">
      <section id="TrayLeft">
        <menu id="MainMenu">
          <ul>
            <li>
              <span></span>
            </li>
          </ul>
        </menu>
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
