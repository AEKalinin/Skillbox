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
        {{ products.length }} товар(а)
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
            <ul class="cart__options options" >
              <li class="options__item" v-for="item in fromDeliveries"
                  :key="item.id" :deliveriesPrice="item.price">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" :value="item.id"
                         v-model.number="fromData.deliveryTypeId" @click="Payments(item)">
                  <span class="options__value">
                    {{ item.title }} <b>{{ item.price | numberFormat}} ₽</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="item in fromPayments" :key="item.id">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" :value="item.id"
                         v-model="paymentTypeId">
                  <span class="options__value">
                    {{ item.title }}
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
            <p>Доставка: <b>{{currdeliveriesPrice | numberFormat}} ₽</b></p>
            <p>Итого: <b>{{ products.length }}</b> товар(а) на сумму <b>
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
/* eslint-disable no-return-assign */
export default {
  filters: { numberFormat },
  components: { BaseFormText, BaseFormTextarea, preloadProducts },
  data() {
    return {
      fromData: {},
      formError: {},
      formErrorMessage: '',
      orderPreloader: false,
      fromDeliveries: {},
      fromPayments: {},
      deliveriesPrice: null,
      paymentTypeId: null,
    };
  },
  computed: {
    ...mapGetters({
      products: 'cartDetailProduct',
      allProduct: 'cartAllProduct',
      totalPrice: 'cartTotalPrice',
    }),
    currdeliveriesPrice() {
      return this.deliveriesPrice;
    },
  },
  watch: {
    paymentTypeId(value) {
      this.fromData.paymentTypeId = value;
    },
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
    Deliveries() {
      this.fromDeliveries = {};
      axios
        .get(API_BASE_URL_DIP + 'api/deliveries')
        .then((response) => this.fromDeliveries = response.data)
        .then(() => this.setDeliveriesId())
        .then(() => this.Payments(this.fromDeliveries[0]));
    },
    Payments(items) {
      this.deliveriesPrice = Number(items.price);
      this.fromPayments = {};
      axios
        .get(API_BASE_URL_DIP + 'api/payments', {
          params: {
            deliveryTypeId: items.id,
          },
        })
        .then((response) => this.fromPayments = response.data)
        .then(() => this.setPaymentId(this.fromPayments[0].id));
    },
    setDeliveriesId() {
      this.fromData.deliveryTypeId = this.fromDeliveries[0].id;
    },
    setPaymentId(value) {
      this.fromData.paymentTypeId = value;
      this.paymentTypeId = value;
    },
  },
  created() {
    this.Deliveries();
  },
};
</script>
/* es-lint-enable */
