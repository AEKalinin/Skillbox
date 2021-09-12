<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">
        Каталог
      </h1>
      <span class="content__info">
        {{countProducts}} товаров
      </span>
    </div>

    <div class="content__catalog">
      <ProductFilter :price-from.sync="filterPriceFrom" :price-to.sync="filterPriceTo"
                     :category-id.sync="filterCategoryId" :color-value.sync="filterColorValue"
      />
      <section class="catalog">
        <preloadProducts v-if="productsLoading" message="Загрузка товаров"> </preloadProducts>
        <div
          v-if="productsLoadingFailed">Произошла ошибка при загрузке товаров...
          <button @click.prevent="loadProducts">Попробовать еще раз</button>
        </div>
        <productList :products="products"/>
        <BasePaginattion v-model="page" :count="countProducts" :per-page="productsPerPage" />
      </section>
    </div>
  </main>

</template>

<script>

import ProductList from '@/components/ProductList.vue';
import BasePaginattion from '@/components/BasePaginattion.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import preloadProducts from '@/preloadProducts.vue';
import axios from 'axios';
import { mapMutations } from 'vuex';
import { API_BASE_URL_DIP } from '../config';

/* eslint-disable prefer-template */
/* eslint-disable no-return-assign */
/* eslint-disable no-template-curly-in-string */
/* eslint arrow-body-style: ["error", "as-needed", { "requireReturnForObjectLiteral": true }] */
export default {
  components: {
    ProductList,
    BasePaginattion,
    ProductFilter,
    preloadProducts,
  },
  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterColorValue: 0,
      page: 1,
      productsPerPage: 12,
      productsData: null,
      productsLoading: false,
      productsLoadingFailed: false,
    };
  },
  computed: {
    products() {
      return this.productsData ? this.productsData : [];
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
  },
  methods: {
    ...mapMutations(['syncMemoryProductData']),
    loadProducts() {
      let minProce;
      let maxnProce;
      if (this.filterPriceFrom <= 0) {
        minProce = 1;
      } else {
        minProce = this.filterPriceFrom;
      }
      if (this.filterPriceTo <= 0) {
        maxnProce = 0xFFFFFFFFFFFFFFF;
      } else {
        maxnProce = this.filterPriceTo;
      }
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios.get(API_BASE_URL_DIP + 'api/products', {
          params: {
            page: this.page,
            limit: this.productsPerPage,
            categoryId: this.filterCategoryId,
            minPrice: minProce,
            maxPrice: maxnProce,
          },
        })
          .then((response) => this.productsData = response.data)
          .catch(() => this.productsLoadingFailed = true)
          .then(() => this.productsLoading = false)
          .then(() => this.syncMemoryProduct());
      }, 500);
    },
    syncMemoryProduct() {
      this.syncMemoryProductData(this.productsData.items);
    },
  },
  watch: {
    page() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterCategoryId() {
      this.loadProducts();
    },
    filterColorValue() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts();
  },
};
</script>
/* es-lint-enable */
