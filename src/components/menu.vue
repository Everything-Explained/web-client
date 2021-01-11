<template>
  <menu ref='menu' class="app-menu" :class="{ '--opened': opened }">
    <header class="app-menu__header">
      <span class="app-menu__header_text">Menu</span>
      <icon
        class='app-menu__header_exit-icon'
        :type='"cross"'
        @mousedown="closeMenu"
      ></icon>
    </header>
    <ul>
      <li class="app-menu_item" v-for="(route, i) of stdRoutes" :key="i" @click="closeMenu">
        <router-link :to="route.path">{{ route.title }}</router-link>
      </li>
      <li class="app-menu_category">Library</li>
      <li class="app-menu_item" v-for="(route, i) of libRoutes" :key="i" @click="closeMenu">
        <router-link :to="route.path">{{ route.title }}</router-link>
      </li>
    </ul>
  </menu>
</template>



<script lang='ts' src='./menu.ts'></script>