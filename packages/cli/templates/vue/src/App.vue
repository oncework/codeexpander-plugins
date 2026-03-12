<script setup lang="ts">
import { ref, computed } from "vue";
import DemoTool from "./tools/DemoTool.vue";
import type { ToolDef } from "./tools";

const TOOLS: ToolDef[] = [
  { id: "demo", name: "Demo", component: DemoTool },
];

const activeId = ref(TOOLS[0]?.id ?? "");
const activeTool = computed(() => TOOLS.find((t) => t.id === activeId.value));
const ActiveComponent = computed(() => activeTool.value?.component);
</script>

<template>
  <div class="p-4 min-h-[400px] w-full max-w-full overflow-hidden">
    <div class="flex gap-1 border-b border-gray-200 dark:border-gray-700 mb-4">
      <button
        v-for="t in TOOLS"
        :key="t.id"
        type="button"
        :class="[
          'px-3 py-2 text-sm font-medium rounded-t transition-colors',
          activeId === t.id
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50',
        ]"
        @click="activeId = t.id"
      >
        {{ t.name }}
      </button>
    </div>
    <div class="min-h-[320px]">
      <component :is="ActiveComponent" v-if="ActiveComponent" />
    </div>
  </div>
</template>
