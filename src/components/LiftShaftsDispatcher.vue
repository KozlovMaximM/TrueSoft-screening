<script setup>
import { ref, watch } from "vue";
import LiftsManager from "../services/LiftsManager";
import LiftShaft from "./LiftShaft.vue";

const props = defineProps({
  stories: Number,
  shaftsNumber: Number,
});

// helper functions
const resolve_button_indicator = (activated) => (activated ? "🔴" : "⚪");

// setting up refs
const lifts_manager = ref(new LiftsManager(props.shaftsNumber, props.stories));
</script>

<template>
  <LiftShaft
    v-for="lift_data in lifts_manager.lifts"
    :stories="stories"
    :shaftId="lift_data.id"
    :key="lift_data.id"
    :currentFloor="lift_data.current_floor"
    @available="lifts_manager.liftArrived(lift_data.id)"
  />
  <div class="wall">
    <button
      class="lift-button"
      v-for="floor_data in lifts_manager.floors"
      :key="floor_data.id"
      @click="() => lifts_manager.requestLift(floor_data.id)"
    >
      <p>{{ props.stories - floor_data.index }}</p>
      {{ resolve_button_indicator(floor_data.indicator) }}
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
