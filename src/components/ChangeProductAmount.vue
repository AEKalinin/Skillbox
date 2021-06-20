<template>
  <div class="form__counter">
    <button type="button" aria-label="Убрать один товар"
            @click.prevent="changeAmount(-1)">
    <svg width="12" height="12" fill="currentColor">
      <use xlink:href="#icon-minus"></use>
    </svg>
  </button>

   <input type="number" v-model.number="amount"  readonly  >

    <button type="button" aria-label="Добавить один товар"
            @click.prevent="changeAmount(1)">
    <svg width="12" height="12" fill="currentColor">
      <use xlink:href="#icon-plus"></use>
    </svg>
  </button>
  </div>

</template>

<style>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none;}
input[type='number'],
input[type="number"]:hover,
input[type="number"]:focus {
  appearance: none;
  -moz-appearance: textfield;
}
</style>

<script>
export default {
  data() {
    return {
      amount: 0,
    };
  },
  props: ['value'],
  methods: {
    changeAmount(delta) {
      this.amount += delta;
      if (this.amount < 1) {
        this.amount = 1;
        return;
      }
      this.$emit('input', this.amount);
    },
  },
  created() {
    this.amount = this.value;
  },
};
</script>
