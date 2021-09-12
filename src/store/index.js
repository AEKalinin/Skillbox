import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { API_BASE_URL_DIP } from '../config';

Vue.use(Vuex);

/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */
/* eslint-disable object-shorthand */
/* eslint-disable no-shadow */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-template */
/* eslint-disable no-return-assign */
/* eslint-disable no-template-curly-in-string */
/* eslint arrow-body-style: ["error", "as-needed", { "requireReturnForObjectLiteral": true }] */

export default new Vuex.Store({
  state: {
    cartProducts: [],
    userAccessKey: null,
    cartProductsDate: [],
    cartProductsLoading: false,
    orderInfo: null,
    memoryProductData: [
      {
        value: null,
        checked: false,
        count: null,
      },
    ],
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsDate = [];
    },
    updateCartProductAmount(state, { productId, amount }) {
      const item = state.cartProducts.find((item) => item.productId === productId);
      if (item) {
        item.amount = amount;
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter(
        (item) => item.productId !== productId,
      );
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductsDate(state, items) {
      state.cartProductsDate = items;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsDate.map((item) => {
        return {
          productId: item.productOffer.id,
          amount: item.quantity,
        };
      });
    },
    chageCartProductsLoading(state) {
      state.cartProductsLoading = !state.cartProductsLoading;
    },
    syncMemoryProductData(state, products) {
      let i;
      for (i = 0; i < products.length;) {
        alert(i);
        state.memoryProductData[i].value = 1;
        i += 1;
      }
    },
  },
  getters: {
    cartDetailProduct(state) {
      return state.cartProductsDate;
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProduct.reduce((acc, item) => (item.price * item.quantity)
      + acc, 0);
    },
    cartTotalAmount(state, getters) {
      return getters.cartDetailProduct.length;
    },
    cartAllProduct(state, getters) {
      return getters.cartDetailProduct.reduce((acc, item) => (item.quantity)
        + acc, 0);
    },
  },
  actions: {
    loadOrderInfo(context, orderId) {
      return axios
        .get(API_BASE_URL_DIP + 'api/orders/' + orderId, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateOrderInfo', response.data);
        });
    },
    loadCart(context) {
      context.commit('chageCartProductsLoading');
      this.loadProductsTimer = setTimeout(() => {
        return axios
          .get(API_BASE_URL_DIP + 'api/baskets', {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          })
          .then((response) => {
            if (!context.state.userAccessKey) {
              localStorage.setItem('userAccessKey', response.data.user.accessKey);
              context.commit('updateUserAccessKey', response.data.user.accessKey);
            }
            context.commit('updateCartProductsDate', response.data.items);
            context.commit('syncCartProducts');
          })
          .then(() => context.commit('chageCartProductsLoading'));
      }, 100);
    },
    addProductToCart(context, { productOfferId, colorId, amount }) {
      return (new Promise((resolve) => setTimeout(resolve, 100)))
        .then(() => {
          return axios
            .post(API_BASE_URL_DIP + 'api/baskets/products', {
              productOfferId: productOfferId,
              colorId: colorId,
              quantity: amount,
            }, {
              params: {
                userAccessKey: context.state.userAccessKey,
              },
            })
            .then((response) => {
              context.commit('updateCartProductsDate', response.data.items);
              context.commit('syncCartProducts');
            });
        });
    },
    updateCartProductAmount(context, { productId, amount }) {
      context.commit('updateCartProductAmount', { productId, amount });
      if (amount < 1) {
        return;
      }
      return axios
        .put(API_BASE_URL_DIP + 'api/baskets/products', {
          basketItemId: productId,
          quantity: amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductsDate', response.data.items);
        })
        .catch(() => {
          context.commit('syncCartProducts');
        });
    },
    deleteCartProduct(context, { productId }) {
      return (new Promise((resolve) => setTimeout(resolve, 0)))
        .then(() => {
          return axios
            .delete(API_BASE_URL_DIP + 'api/baskets/products', {
              data: { basketItemId: productId },
              params: { userAccessKey: context.state.userAccessKey },
            })
            .then((response) => {
              context.commit('updateCartProductsDate', response.data.items);
              context.commit('syncCartProducts');
            });
        });
    },
  },
});
/* es-lint-enable */
