<template>
  <div class="observer"></div>
</template>
<script>
  // https://vueschool.io/articles/vuejs-tutorials/build-an-infinite-scroll-component-using-intersection-observer-api/

  export default {
    props: {
      options: Object,
      root: HTMLElement,
      rootMargin: {
        type: String,
        default: '200px',
      },
    },
    emits: ['intersect'],
    data: () => ({
      observer: null,
    }),

    watch: {
      options: {
        handler() {
          this.setObserver();
        },
        immediate: true,
      },
      root: {
        handler() {
          this.setObserver();
        },
        immediate: true,
      },
    },

    destroyed() {
      if (this.observer) this.observer.disconnect();
    },

    methods: {
      async setObserver() {
        await this.$nextTick(); // wait for component to render, so that this.$el which is watched by Observer is available

        if ((this.options || this.root) && !this.observer) { // if parent rendered and we can set root within options
          this.observer = new IntersectionObserver(([entry]) => {
            if (entry && entry.isIntersecting) {
              this.$emit('intersect');
            }
          }, {
            root: this.root,
            rootMargin: this.rootMargin,
          });
          this.observer.observe(this.$el);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
.observer {
  //display: contents;
}
</style>
