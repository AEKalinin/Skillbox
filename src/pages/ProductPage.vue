<template>
  <main class="content container" v-if="productLoading">Загрузка товара...</main>
  <main class="content container" v-else-if="!productData">Не удалось загрузить товар</main>
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            {{ category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ currProductTitle }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img width="570" height="570" :src="product.preview.file.url" :alt="product.title">
        </div>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{product.id}}</span>
        <h2 class="item__title">
          {{ currProductTitle }}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST" @submit.prevent="addToCart">
            <b class="item__price">
              {{ currProductPrice | numberFormat}} ₽
            </b>

            <fieldset class="form__block">
              <legend class="form__legend">Цвет:</legend>
              <ul class="colors">
                <li class="colors__item" v-for="item in product.colors" :key="item.id">
                  <label class="colors__label">
                    <input class="colors__radio sr-only" type="radio" :value="item.id"
                           v-model="colorId">
                    <span class="colors__value" :style="{backgroundColor: item.color.code}">
                    </span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <fieldset class="form__block" v-if="product.mainProp.id != 7">
              <legend class="form__legend">{{ product.mainProp.title }}</legend>

              <ul class="sizes sizes--primery">
                <li class="sizes__item" v-for="offers in product.offers" :key="offers.id">
                  <label class="sizes__label">
                    <div class="sizes__label" v-for="(item, index) in offers.propValues"
                         :key="index">
                      <input class="sizes__radio sr-only" type="radio" :value="item.value"
                             v-model="productOfferPropValue" @click="setOffersPar(offers)">
                      <span class="sizes__value">
                      {{item.value}}
                      </span>
                    </div>
                  </label>
                </li>
              </ul>
            </fieldset>

            <div class="item__row">
              <ChangeProductAmount v-model.number="productAmount"/>

              <button class="button button--primery" type="submit" :disabled="productAddSending">
                В корзину
              </button>
            </div>
            <div v-show="productAdded">Товар добавлен в корзину</div>
            <div v-show="productAddSending">Добавляем товар в корзину...</div>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link tabs__link--current">
              Описание
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Характеристики
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Гарантия
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Оплата и доставка
            </a>
          </li>
        </ul>

        <div class="item__content">
          <p>
            Навигация GPS, ГЛОНАСС, BEIDOU Galileo и QZSS<br>
            Синхронизация со смартфоном<br>
            Связь по Bluetooth Smart, ANT+ и Wi-Fi<br>
            Поддержка сторонних приложений<br>
          </p>

          <a href="#">
            Все характеристики
          </a>

          <h3>Что это?</h3>

          <p>
            Wahoo ELEMNT BOLT GPS – это велокомпьютер, который позволяет оптимизировать свои
            велотренировки, сделав их максимально эффективными. Wahoo ELEMNT BOLT GPS
            синхронизируется с датчиками по ANT+, объединяя полученную с них информацию.
            Данные отображаются на дисплее, а также сохраняются на смартфоне.
            При этом на мобильное устройство можно установить как фирменное приложение, так и
            различные приложения сторонних разработчиков. Велокомпьютер точно отслеживает
            местоположение, принимая сигнал с целого комплекса спутников. Эта информация позволяет
            смотреть уже преодоленные маршруты ипланировать новые велопрогулки.
          </p>

          <h3>Дизайн</h3>

          <p>
            Велокомпьютер Wahoo ELEMNT BOLT очень компактный. Размеры устройства составляют всего
            74,6 x 47,3 x 22,1 мм. что не превышает габариты смартфона. Корпус гаджета выполнен из
            черного пластика. На обращенной к пользователю стороне расположен дисплей
            диагональю 56 мм. На дисплей выводятся координаты и скорость, а также полученная со
            смартфона и синхронизированных датчиков информация: интенсивность, скорость вращения
            педалей, пульс и т.д. (датчики не входят в комплект поставки). Корпус велокомпьютера
            имеет степень защиты от влаги IPX7. Это означает, что устройство не боится пыли, а
            также выдерживает кратковременное (до 30 минут) погружение в воду на глубину не более
            1 метра.
          </p>
        </div>
      </div>
    </section>
  </main>

</template>

<script>
import gotoPage from '@/helpers/gotoPage';
import numberFormat from '@/helpers/numberFormat';
import ChangeProductAmount from '@/components/ChangeProductAmount.vue';
import axios from 'axios';
import { mapActions } from 'vuex';
import { API_BASE_URL_DIP } from '@/config';

/* eslint-disable prefer-template */
/* eslint-disable no-return-assign */
/* eslint-disable object-shorthand */
/* eslint arrow-body-style: ["error", "as-needed", { "requireReturnForObjectLiteral": true }] */
export default {
  data() {
    return {
      productAmount: 1,
      productData: null,
      productLoading: false,
      productLoadingFailed: false,
      productAdded: false,
      productAddSending: false,
      productOfferId: null,
      productOfferPropValue: null,
      colorId: null,
      productTitle: null,
      productPrice: 0,
    };
  },
  components: { ChangeProductAmount },
  filters: {
    numberFormat,
  },
  computed: {
    product() {
      return this.productData;
    },
    category() {
      return this.productData.category;
    },
    currProductId() {
      return this.product.id;
    },
    currProductTitle() {
      return this.productTitle;
    },
    currProductPrice() {
      return this.productPrice;
    },
  },
  methods: {
    ...mapActions(['addProductToCart']),
    gotoPage,
    addToCart() {
      this.productAdded = false;
      this.productAddSending = true;
      this.addProductToCart({
        productOfferId: this.productOfferId,
        colorId: this.colorId,
        amount: this.productAmount,
      }).then(() => {
        this.productAdded = true;
        this.productAddSending = false;
      });
    },
    loadProduct() {
      this.productLoading = true;
      this.productLoadingFailed = false;
      axios.get(API_BASE_URL_DIP + 'api/products/' + this.$route.params.id)
        .then((response) => this.productData = response.data)
        .catch(() => this.productLoadingFailed = true)
        .then(() => this.productLoading = false)
        .then(() => this.setDefOffersPar());
    },
    setDefOffersPar() {
      this.productOfferPropValue = this.productData.offers[0].propValues[0].value;
      this.productOfferId = this.productData.offers[0].id;
      this.colorId = this.productData.colors[0].id;
      this.productPrice = this.productData.offers[0].price;
      this.setOffersPar(this.productData.offers[0]);
    },
    setOffersPar(offers) {
      this.productTitle = offers.title;
      this.productOfferId = offers.id;
      this.productPrice = offers.price;
    },
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadProduct();
      },
      immediate: true,
    },
  },
};
</script>
/* es-lint-enable */
