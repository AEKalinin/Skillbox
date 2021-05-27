<template>
  <li class="catalog__item">
    <a class="catalog__pic" href="#">
      <img :src="product.image">
    </a>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price">
        {{ product.price }} Р
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
export default {
  props: ['product'],
};
</script>
