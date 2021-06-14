<template>
  <div class="form__counter">
    <button type="button" aria-label="Убрать один товар"
            @click.prevent="changeAmount(-1)">
    <svg width="12" height="12" fill="currentColor">
      <use xlink:href="#icon-minus"></use>
    </svg>
  </button>

    <input type="text" v-model.number="amount" @input="changeAmount(0)">

    <button type="button" aria-label="Добавить один товар"
            @click.prevent="changeAmount(1)">
    <svg width="12" height="12" fill="currentColor">
      <use xlink:href="#icon-plus"></use>
    </svg>
  </button>
  </div>

</template>

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
