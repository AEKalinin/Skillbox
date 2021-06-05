<template>
  <div class="form__counter">
    <button type="button" aria-label="Убрать один товар"
            @click.prevent='spinAmount(-1)'>
    <svg width="12" height="12" fill="currentColor">
      <use xlink:href="#icon-minus"></use>
    </svg>
  </button>

    <input type="text" :value="productAmount" >

    <button type="button" aria-label="Добавить один товар"
            @click.prevent="spinAmount(1)">
    <svg width="12" height="12" fill="currentColor">
      <use xlink:href="#icon-plus"></use>
    </svg>
  </button>
  </div>

</template>

<script>
export default {
  model: {
    prop: 'productAmount',
    event: 'chAmount',
  },
  props: ['productAmount'],
  methods: {
    spinAmount(delta) {
      if (this.productAmount + delta > 0) {
        this.productAmount += delta;
        this.chAmount(this.productAmount);
      }
    },
    chAmount(productAmount) {
      this.$emit('chAmount', productAmount);
    },
  },
};
</script>
