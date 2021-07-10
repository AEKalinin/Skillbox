<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{name: 'product', params: {id: product.id}}">
      <img :src="product.preview.file.url">
    </router-link>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price">
        {{ product.price | numberFormat }} Р
      </span>

    <ul class="colors colors--black">
      <li class="colors__item" v-for="item in product.colors" :key="item.id">
        <label class="colors__label">
          <input class="colors__radio sr-only" type="radio" :value="item">
          <span class="colors__value" :style="{backgroundColor: item.color.code}">
                  </span>
        </label>
      </li>
    </ul>
  </li>
</template>

<script>
import gotoPage from '@/helpers/gotoPage';
import numberFormat from '@/helpers/numberFormat';

export default {
  methods: {
    gotoPage,
  },
  props: ['product'],
  filters: {
    numberFormat,
  },
};
</script>
