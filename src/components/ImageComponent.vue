<template>
  <div>
    <img :src="src" :alt="alt" :class="customClass" />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: 'Image'
    },
    customClass: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
}
</style>
