<template>
  <router-link class="header__cart"  aria-label="Корзина с товарами" :to="{name: 'cart'}">
        <svg width="30" height="21" fill="currentColor">
      <use
        xlink:href="#icon-cart">
      </use>
    </svg>
    <span class="header__count" aria-label="Количество товаров">
      {{$store.state.cartProducts.length}}
    </span>
    <small>
      <small v-if="$store.state.cartProductsLoading"> Загрузка корзины... </small>
    </small>
  </router-link>
</template>

<script>

export default {

};
</script>
