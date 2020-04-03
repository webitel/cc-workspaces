<template>
  <div class="observer"></div>
</template>
<script>
  // https://vueschool.io/articles/vuejs-tutorials/build-an-infinite-scroll-component-using-intersection-observer-api/

  export default {
    props: {
      options: Object,
      // default: () => ({
      //   // rootMargin: '200px',
      // }),
    },
    data: () => ({
      observer: null,
    }),

    watch: {
      options() {
        this.setObserver();
      },
    },

    destroyed() {
      this.observer.disconnect();
    },

    methods: {
      setObserver() {
        if (this.options) { // if parent rendered and we can set root within options
          this.observer = new IntersectionObserver(([entry]) => {
            console.log(entry.isIntersecting, entry);
            if (entry && entry.isIntersecting) {
              this.$emit('intersect');
            }
          }, this.options);
          this.observer.observe(this.$el);
        }
      },
    },
  };
</script>

<style scoped>

</style>
