<template>
  <main-menu></main-menu>
  <div ref='container' id="MainContainer" class="main__container">
    <div class="main__ribbon"></div>
    <header class="main__header">
      <div class="main__header_title">Everything Explained</div>
    </header>
    <section class="main__body">
      <div class="main__body-content">
        <div class="main__title-bar">
          <icon
            class="main__title-bar_menu-icon"
            @mousedown="openMenu"
            :class="{ '--menu-open': isMenuOpen }" :type='"menu"'
          ></icon>
          <div class="main__title-bar_text">{{title}}</div>
        </div>
        <router-view />
      </div>
    </section>
  </div>
</template>

<script lang='ts' src='./_app.ts'></script>