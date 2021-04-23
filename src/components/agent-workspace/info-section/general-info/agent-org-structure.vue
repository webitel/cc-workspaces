<template>
  <article class="agent-org-structure">
    {{ agent.auditor }}
    {{ agent.supervisor }}
    {{ agent.team }}
  </article>
</template>

<script>
export default {
  name: 'agent-org-structure',
  props: {
    agent: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
