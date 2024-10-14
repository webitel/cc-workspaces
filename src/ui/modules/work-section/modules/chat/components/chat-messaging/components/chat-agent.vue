<template>
  <article v-if="props.agents.length" class="chat-agent">
    <div v-if="props.agents.length > 1" class="chat-agent__list">
<!--      block to show multiple chat agents    -->
    </div>
    <div v-else>
      <wt-avatar size="xs" :username="props.agents[0].name" />
      <p> {{ $t('workspaceSec.chat.chatsAgent', { agentName: props.agents[0].name }) }} </p>
    </div>
  </article>
</template>

<script setup>

const props = defineProps({
  agents: {
    type: Array,
    require: true,
  },
});

</script>

<style lang="scss" scoped>
.chat-agent {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-xs);
  p {
    @extend %typo-caption;
  }
}
</style>
