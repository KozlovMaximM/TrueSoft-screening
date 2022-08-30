<script setup>
import { ref } from "vue";
import LiftShaft from "./LiftShaft.vue";

const props = defineProps({
  stories: Number,
  shaftsNumber: Number,
});

// helper functions
const resolve_button_indicator = (activated) => (activated ? "🔴" : "⚪");

const shafts_data = ref(
  Array.from({ length: props.shaftsNumber }, (_, i) => ({
    id: `shaft_${i}`,
  }))
);

const buttons_data = ref(
  Array.from({ length: props.stories }, (_, i) => ({
    id: i,
    inQueue: false,
  }))
);
</script>

<template>
  <LiftShaft
    v-for="shaft_data in shafts_data"
    :shaftId="shaft_data.id"
    :key="shaft_data.id"
    :stories="stories"
  />
  <div class="wall">
    <button
      class="lift-button"
      v-for="button_data in buttons_data"
      :key="button_data.id"
    >
      <p>{{ props.stories - button_data.id }}</p>
      {{ resolve_button_indicator(button_data.inQueue) }}
    </button>
  </div>
</template>

<style>
.wall {
  padding-left: 1rem;
  padding-right: 1rem;
  display: grid;
  height: 100%;
}

.lift-button {
  align-self: center;
  height: fit-content;
}
</style>
