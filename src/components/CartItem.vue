<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="item.productOffer.product.preview.file.url" width="120" height="120"
           alt="item.product.title">
    </div>
    <h3 class="product__title">
      {{ item.productOffer.title }}
    </h3>
    <span class="product__code">
                Артикул: {{ item.productOffer.product.id }}
              </span>

    <div class="product__counter form__counter">
      <ChangeProductAmount v-model.number="amount"/>
    </div>

    <b class="product__price">
      {{ item.quantity * item.price | numberFormat}} ₽
    </b>

    <button class="product__del button-del" type="button"
            aria-label="Удалить товар из корзины" @click.prevent="deleteProduct">
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>

</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import { mapActions } from 'vuex';
import ChangeProductAmount from '@/components/ChangeProductAmount.vue';

export default {
  components: { ChangeProductAmount },
  filters: { numberFormat },
  props: ['item'],
  computed: {
    amount: {
      get() {
        return this.item.quantity;
      },
      set(value) {
        this.$store.dispatch(
          'updateCartProductAmount',
          { productId: this.item.id, amount: value },
        );
      },
    },
  },
  methods: {
    ...mapActions(['deleteCartProduct']),
    deleteProduct() {
      this.deleteCartProduct({ productId: this.item.id });
    },
  },

};
</script>
