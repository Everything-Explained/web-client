<template>
  <main-menu></main-menu>
  <div id="App" class="app-container">
    <div class="app-ribbon"></div>
    <header class="app-header">
      <div class="app-header__title">Everything Explained</div>
    </header>
    <section class="app-body">
      <div class="app-body__content">
        <router-view v-slot='{ Component }'>
          <transition name='fade' mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </section>
  </div>
</template>

<script lang='ts' src='./_app.ts'></script>