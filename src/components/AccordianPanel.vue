<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: { type: String, required: true },
});

const showPanel = ref(false);

const togglePanel = (event) => {
  showPanel.value = !showPanel.value;
}
</script>

<template>
  <div class="panel container mb-4 border-2 rounded-1 shadow-sm">
    <button class="p-4 w-full border-b-2 font-semibold flex flex-row items-center justify-between"
        @click.prevent="togglePanel">
      {{ title }} >
      <span class="fa fa-expand fa-2" v-if="showPanel"></span>
      <span class="fa fa-chevron-right fa-2"></span>
    </button>
    <div class="content" v-if="showPanel">
      <slot></slot>
    </div>
  </div>
</template>