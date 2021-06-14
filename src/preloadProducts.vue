<template>
  <body>
    <div class="loadRing">
      <p> {{ message }}</p>
      <div class="ring-1"></div>
    </div>
  </body>
</template>

<style>

.ring-1 {
  width: 10px;
  height: 10px;
  margin: 0 auto;
  padding: 10px;
  border: 17px dashed #4b9cdb;
  border-radius: 100%;
}

.loadRing .ring-1 {
  animation: loading 1.5s 0.3s cubic-bezier(0.17, 0.37, 0.43, 0.67) infinite;
}

@keyframes loading {
0 {
  transform: rotate(0deg);
}
50% {
  transform: rotate(180deg);
}
100% {
  transform: rotate(360deg);
}
}
</style>

<script>
export default {
  props: ['message'],
};
</script>
