<template>
<aside class="filter">
<h2 class="filter__title">Фильтры</h2>

<form class="filter__form form" action="#" method="get" @submit.prevent="submit">
  <fieldset class="form__block">
    <legend class="form__legend">Цена</legend>
    <label class="form__label form__label--price">
      <input class="form__input" type="text" name="min-price" v-model.number="currentPriceFrom">
      <span class="form__value">От</span>
    </label>
    <label class="form__label form__label--price">
      <input class="form__input" type="text" name="max-price" v-model.number="currentPriceFTo">
      <span class="form__value">До</span>
    </label>
  </fieldset>

  <fieldset class="form__block">
    <legend class="form__legend">Категория</legend>
    <label class="form__label form__label--select">
      <select class="form__select" type="text" name="category" v-model.number="currentCategoryId">
        <option value="0">Все категории</option>
        <option :value="category.id" v-for="category in categories"
                :key="category.id">{{ category.title }}
        </option>
      </select>
    </label>
  </fieldset>

  <fieldset class="form__block">
    <legend class="form__legend">Цвет</legend>
    <ul class="colors">
        <label class="colors__label" v-for="color in colors" :key="color.id" >
          <input class="colors__radio sr-only" type="radio" name="color" :value="color.id"
                 v-model="currentColorValue">
          <span class="colors__value" :style="{backgroundColor: color.code}">
          </span>
        </label>
    </ul>
  </fieldset>

  <fieldset class="form__block">
    <legend class="form__legend">Объем в ГБ</legend>
    <ul class="check-list">
      <li class="check-list__item" v-for="item in memoryProp" :key="item.value">
        <label class="check-list__label">
          <input class="check-list__check sr-only" type="checkbox" :checked= "item.check">
          <span class="check-list__desc">
                    {{ item.value }}
                    <span>({{ item.count }})</span>
                  </span>
        </label>
      </li>
    </ul>
  </fieldset>

  <button class="filter__submit button button--primery" type="submit">
    Применить
  </button>
  <button class="filter__reset button button--second" type="button" @click.prevent="reset">
    Сбросить
  </button>
</form>
</aside>
</template>

<script>
/* eslint-disable no-return-assign */
/* eslint-disable prefer-template */
/* eslint-disable import/no-duplicates */

import axios from 'axios';
import { mapGetters } from 'vuex';
import { API_BASE_URL_DIP } from '@/config';

export default {
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceFTo: 0,
      currentCategoryId: 0,
      currentColorValue: 0,
      categoriesData: null,
      colorsData: null,
    };
  },
  props: ['priceFrom', 'priceTo', 'categoryId', 'colorValue'],
  computed: {
    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
    colors() {
      return this.colorsData ? this.colorsData.items : [];
    },
    ...mapGetters({
      memoryProp: 'memoryProp',
    }),
  },
  watch: {
    priceFrom(value) {
      this.currentPriceFrom = value;
    },
    priceTo(value) {
      this.currentPriceFTo = value;
    },
    categoryId(value) {
      this.currentCategoryId = value;
    },
    colorValue(value) {
      this.currentColorValue = value;
    },
  },
  methods: {
    submit() {
      this.$emit('update:priceFrom', this.currentPriceFrom);
      this.$emit('update:priceTo', this.currentPriceFTo);
      this.$emit('update:categoryId', this.currentCategoryId);
      this.$emit('update:colorValue', this.currentColorValue);
    },
    reset() {
      this.$emit('update:priceFrom', 0);
      this.$emit('update:priceTo', 0);
      this.$emit('update:categoryId', 0);
      this.$emit('update:colorValue', null);
    },
    loadCategories() {
      axios.get(API_BASE_URL_DIP + 'api/productCategories')
        .then((response) => this.categoriesData = response.data);
    },
    loadColors() {
      axios.get(API_BASE_URL_DIP + 'api/colors')
        .then((response) => this.colorsData = response.data);
    },
  },
  created() {
    this.loadCategories();
    this.loadColors();
  },
};
</script>
/* es-lint-enable */
