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
                     :category-id.sync="filterCategoryId" :color-index.sync="filterColorIndex"
                     :color-title.sync="filterColorTitle"
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
import { mapActions } from 'vuex';
import { API_BASE_URL_DIP } from '../config';

/* eslint-disable prefer-template */
/* eslint-disable quotes */
/* eslint-disable max-len */
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
      filterColorIndex: null,
      filterColorTitle: null,
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
    ...mapActions(['addMemoryPropProduct']),
    ...mapActions(['clearMemoryPropProduct']),
    loadProducts() {
      let i;
      let minProce;
      let maxnProce;
      let prodProps;
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
      prodProps = "";
      if (this.filterColorTitle !== null) {
        prodProps = "&props[color][]=" + this.filterColorTitle;
      }
      for (i = 0; i < this.$store.state.memoryPropValues.length;) {
        if (this.$store.state.memoryPropValues[i].check === true) {
          prodProps = prodProps + "&props[" + this.$store.state.memoryPropValues[i].code + "][]=" + this.$store.state.memoryPropValues[i].value;
        }
        i += 1;
      }
      if (prodProps !== "") {
        prodProps = "?" + prodProps;
      }
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios.get(API_BASE_URL_DIP + 'api/products' + prodProps, {
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
      let i;
      let j;
      let k;
      this.clearMemoryPropProduct();
      for (i = 0; i < this.productsData.items.length;) {
        for (j = 0; j < this.productsData.items[i].offers.length;) {
          for (k = 0; k < this.productsData.items[i].offers[j].propValues.length;) {
            if (this.productsData.items[i].offers[j].propValues[k].productProp.code !== "built_in_memory") {
              break;
            }
            this.addMemoryPropProduct({ codeProp: this.productsData.items[i].mainProp.code, Volume: this.productsData.items[i].offers[j].propValues[k].value, check: false });
            k += 1;
          }
          j += 1;
        }
        i += 1;
      }
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
    filterColorIndex() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts();
  },
};
</script>
/* es-lint-enable */
