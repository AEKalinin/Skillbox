<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html">
            Каталог
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="cart.html">
            Корзина
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        3 товара
      </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText v-model="fromData.name" :error="formError.name" title="ФИО"
                          placeholder="Введите ваше полное имя"/>

            <BaseFormText v-model="fromData.address" :error="formError.address"
                          title="Адрес доставки" placeholder="Введите ваш адрес"/>

            <BaseFormText v-model="fromData.phone" :error="formError.phone" type="tel"
                          title="Телефон" placeholder="Введите ваш телефон"/>

            <BaseFormText v-model="fromData.email" :error="formError.email" type="email"
                          title="Email" placeholder="Введи ваш Email"/>

            <BaseFormTextarea title="Комментарий к заказу" v-model="fromData.comment"
                              :error="formError.comment" placeholder="Ваши пожелания"/>

          </div>
          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery"
                         value="0" checked="">
                  <span class="options__value">
                    Самовывоз <b>бесплатно</b>
                  </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery" value="500">
                  <span class="options__value">
                    Курьером <b>500 ₽</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay"
                         value="card" checked="">
                  <span class="options__value">
                    Картой при получении
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="item in products" :key="item.productOffer.product.id">
              <h3>{{ item.productOffer.title }}</h3>
              <b>{{ item.quantity * item.price | numberFormat }} ₽</b>
              <span>Артикул: {{ item.productOffer.product.id }}</span>
              <span>Кол-во: {{ item.quantity }} шт.</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>500 ₽</b></p>
            <p>Итого: <b>{{ products.length }}</b> товара на сумму <b>
              {{ totalPrice | numberFormat}} ₽</b></p>
          </div>

          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
          <preloadProducts v-if="orderPreloader"> </preloadProducts>
        </div>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import { mapGetters } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import axios from 'axios';
import preloadProducts from '@/preloadProducts.vue';
import { API_BASE_URL_DIP } from '../config';

/* eslint-disable prefer-template */
export default {
  filters: { numberFormat },
  components: { BaseFormText, BaseFormTextarea, preloadProducts },
  data() {
    return {
      fromData: {},
      formError: {},
      formErrorMessage: '',
      orderPreloader: false,
    };
  },
  computed: {
    ...mapGetters({
      products: 'cartDetailProduct',
      allProduct: 'cartAllProduct',
      totalPrice: 'cartTotalPrice',
    }),
  },
  methods: {
    order() {
      this.formError = {};
      this.formErrorMessage = '';
      this.orderPreloader = true;
      this.loadProductsTimer = setTimeout(() => {
        axios
          .post(API_BASE_URL_DIP + 'api/orders', {
            ...this.fromData,
          }, {
            params: {
              userAccessKey: this.$store.state.userAccessKey,
            },
          })
          .then((response) => {
            this.$store.commit('resetCart');
            this.$store.commit('updateOrderInfo', response.data);
            this.orderPreloader = false;
            this.$router.push({ name: 'orderInfo', params: { id: response.data.id } });
          })
          .catch((error) => {
            this.formError = error.response.data.error.request || {};
            this.formErrorMessage = error.response.data.error.message;
            this.orderPreloader = false;
          });
      }, 500);
    },
  },
};
</script>
/* es-lint-enable */
