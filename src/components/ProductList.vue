<template>
  <ul class="catalog__list">
    <ProductItem v-for="product in products.items" :key="product.id" :product="product">
    </ProductItem>
  </ul>
</template>

<script>
import ProductItem from '@/components/ProductItem.vue';

export default {
  components: { ProductItem },
  props: ['products'],
};
</script>
