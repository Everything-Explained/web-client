<template>
  <div id="App" class="app-container">
    <div class="app-ribbon"></div>
    <header id='AppHeader' class="app-header">
      <div class="app-header__title">Everything Explained</div>
    </header>
    <section class="app-body">
      <main-menu
        :headerId='"AppHeader"'
        :contentId='"AppBodyContent"'
      ></main-menu>
      <div id='AppBodyContent' class="app-body__content">
        <router-view v-slot='{ Component }'>
          <transition name='fade' mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
        <footer class="app-footer">
          <span class="app-footer_copyright">
            <span>Copyright &#169; 2020 - 2021</span><br/>
            <a
              rel="license"
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"
            >Creative Commons BY-NC-SA-4.0 License</a><br/>
            <span>Everything Explained, Some Rights Reserved</span> <br>
          </span>
        </footer>
      </div>
    </section>
  </div>
</template>

<script lang='ts' src='./app.ts'></script>