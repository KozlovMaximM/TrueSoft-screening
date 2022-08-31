<script setup>
import { watch, ref } from "vue";

const props = defineProps({
  shaftId: String,
  stories: Number,
  currentFloor: Number,
});

const emit = defineEmits(["available"]);
emit("available", props.shaftId);


// helper functions
const generate_lift_id = (shaft_id) => `lift-${shaft_id}`;


// setting up refs
const floors_data = ref(
  Array.from({ length: props.stories }, (_, i) => ({
    number: i + 1,
    className: i % 2 == 0 ? "floor odd" : "floor",
  }))
);

const current_floor = ref(0);

const lift_data = ref({
  style: {
    height: `${100.0 / props.stories}%`,
    transition: `transform ${current_floor.value}s`,
    transform: `translate(0, ${current_floor.value * 100}%)`,
  },
});


// event listeners
watch(current_floor, (new_floor, old_floor) => {

  lift_data.value = {
    ...lift_data.value,
    style: {
      ...lift_data.value.style,
      transition: `transform ${Math.abs(old_floor - new_floor)}s`,
      transitionTimingFunction: "linear",
      transform: `translate(0, ${new_floor * 100}%)`,
      backgroundColor: "red",
    },
  };
});

watch(props, (new_props) => {
  current_floor.value = new_props.currentFloor
});

addEventListener("transitionend", (event) => {
  // looking for a transform transition end which indicates that a lift has reached floor
  if (event.propertyName === "transform") {
    if (event.target.id === generate_lift_id(props.shaftId)) {
      // switching color to orange
      lift_data.value = {
        ...lift_data.value,
        style: {
          ...lift_data.value.style,
          backgroundColor: "orange",
        },
      };

      // waiting a bit and emmiting "available" event
      setTimeout(() => {
        lift_data.value = {
          ...lift_data.value,
          style: {
            ...lift_data.value.style,
            backgroundColor: "green",
          },
        };
        console.log(`lift ${event.target.id} is available`);
        emit("available", props.shaftId);
      }, 3000);
    }
  }
});
</script>

<template>
  <div class="shaft">
    <div
      v-for="floor_data in floors_data"
      :key="floor_data.number"
      :class="floor_data.className">
    </div>
    <div
      class="lift"
      :id="generate_lift_id(shaftId)"
      :style="lift_data.style"
    ></div>
  </div>
</template>

<style scoped>
.floor {
  text-align: center;
}

.floor.odd {
  background-color: #f0f0f0;
}

.shaft {
  display: grid;
  height: 100%;
  width: 80px;
}

.shaft:first-child {
  border-left: black;
  border-left-style: solid;
  border-left-width: 1px;
}

.shaft {
  border-right: black;
  border-right-style: solid;
  border-right-width: 1px;
}

.lift {
  width: 80px;
  position: absolute;

  background-color: blue;
  opacity: 0.5;
}
</style>