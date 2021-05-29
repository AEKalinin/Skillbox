<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <a :class="pageLink(1)" href="#"
         aria-label="Предыдущая страница"
         @click.prevent="paginate(page-1, 1)" >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </a>
    </li>
    <li class="pagination__item" v-for="pageNumber in pages" :key="pageNumber">
      <a class="pagination__link" @click.prevent="paginate(pageNumber, 0)"
         :class="{'pagination__link--current': pageNumber === page}"  href="#">
        {{ pageNumber }}
      </a>
    </li>
    <li class="pagination__item">
      <a :class="pageLink(2)" href="#"
         aria-label="Следующая страница"
         @click.prevent="paginate(page+1,2)">
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  model: {
    prop: 'page',
    event: 'paginate',
  },
  props: ['page', 'count', 'perPage', 'isItemPage'],
  computed: {
    pages() {
      return Math.ceil(this.count / this.perPage);
    },
  },
  methods: {
    pageLink(isItemPage) {
      let lnk;
      if (this.enablePrev(isItemPage)) {
        lnk = 'pagination__link pagination__link--arrow';
      } else {
        lnk = 'pagination__link pagination__link--disabled';
      }
      return lnk;
    },
    enablePrev(isItemPage) {
      let isEnable;
      isEnable = 0;
      if (isItemPage === 0) {
        isEnable = 1;
      }
      if (isItemPage === 1 && this.page !== 1) {
        isEnable = 1;
      }
      if (isItemPage === 2 && this.page !== this.pages) {
        isEnable = 1;
      }
      return isEnable === 1;
    },
    paginate(page, isItemPage) {
      if (this.enablePrev(isItemPage)) {
        this.$emit('paginate', page);
      }
    },
  },
};
</script>
