import { defineStore } from 'pinia';
import { ref } from 'vue';

import AgentPauseCausesAPI from '../../../../../../app/api/agent-workspace/endpoints/agent-info/agent-pause-causes';
import AgentQueuesAPI from '../../../../../../app/api/agent-workspace/endpoints/agent-info/agent-queues';
import AgentStatusAPI from '../../../../../../app/api/agent-workspace/endpoints/agent-info/agent-status';

export type Agent = Record<string, unknown>;
export type PauseCause = Record<string, unknown>;

export interface AgentQueueAgentStats {
  pause: number;
  online: number;
  allowPause: boolean;
}

export interface AgentQueueItem {
  queue: {
    id: string;
    name: string;
  };
  waitingMembers: number;
  maxMemberLimit: number;
  agents: AgentQueueAgentStats;
}

export const useAgentInfoStore = defineStore('agentInfo', () => {
  const agent = ref<Agent>({});
  const pauseCauses = ref<PauseCause[]>([]);
  const queues = ref<AgentQueueItem[]>([]);

  const loadStatus = async (agentId: number | string) => {
    const data = await AgentStatusAPI.get({ itemId: agentId });
    agent.value = data as Agent;
  };

  const loadPauseCauses = async (agentId: number | string) => {
    const { items } = await AgentPauseCausesAPI.getList({ agentId });
    pauseCauses.value = items as PauseCause[];
  };

  const loadQueues = async (agentId: number | string) => {
    const params = {
      parentId: agentId,
      size: 100,
      fields: ['queue', 'waiting_members', 'agents', 'max_member_limit'],
    };
    const { items } = await AgentQueuesAPI.getList(params);
    queues.value = items as AgentQueueItem[];
  };

  const loadAgentInfo = async (agentId: number | string) => {
    await Promise.allSettled([
      loadStatus(agentId),
      loadPauseCauses(agentId),
      loadQueues(agentId),
    ]);
  };

  return {
    agent,
    pauseCauses,
    queues,
    loadAgentInfo,
    loadStatus,
    loadPauseCauses,
    loadQueues,
  };
});


