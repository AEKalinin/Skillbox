<template>
  <li class="catalog__item">
    <a class="catalog__pic" href="#" @click.prevent="gotoPage('product',{id: product.id})">
      <img :src="product.image">
    </a>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price">
        {{ product.price | numberFormat }} Р
      </span>

    <ul class="colors colors--black">
      <li class="colors__item" v-for="color in product.colors" :key="color.index">
        <label class="colors__label">
          <input class="colors__radio sr-only" type="radio" :value="color">
          <span class="colors__value" :style="{backgroundColor: color}">
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
