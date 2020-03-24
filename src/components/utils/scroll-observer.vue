<template>
  <div class="observer"></div>
</template>
<script>
  // https://vueschool.io/articles/vuejs-tutorials/build-an-infinite-scroll-component-using-intersection-observer-api/

  export default {
    props: {
      options: Object,
      default: () => ({
        // rootMargin: '200px',
      }),
    },
    data: () => ({
      observer: null,
    }),
    mounted() {
      this.observer = new IntersectionObserver(([entry]) => {
        if (entry && entry.isIntersecting) {
          this.$emit('intersect');
        }
      }, this.options);

      this.observer.observe(this.$el);
    },
    destroyed() {
      this.observer.disconnect();
    },
  };
</script>

<style scoped>

</style>
