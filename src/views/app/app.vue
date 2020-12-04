<template>
  <main-menu></main-menu>
  <div id="App" class="app-container">
    <div class="app-ribbon"></div>
    <header class="app-header">
      <div class="app-header__title">Everything Explained</div>
    </header>
    <section class="app-body">
      <div class="app-body__content">
        <div class="app-title-bar">
          <icon
            class="app-title-bar__menu-icon"
            @mousedown="openMenu"
            :class="{ '--menu-open': isMenuOpen }" :type='"menu"'
          ></icon>
          <div class="app-title-bar__text">{{title}}</div>
        </div>
        <router-view />
      </div>
    </section>
  </div>
</template>

<script lang='ts' src='./_app.ts'></script>