<script setup>
import { watch, ref } from "vue";

const props = defineProps({
  stories: Number,
  shaftId: String,
});

// helper functions
const new_random_floor = () => {
  const new_value = Math.floor(Math.random() * props.stories);
  if (new_value === current_floor.value) new_random_floor();
  else current_floor.value = new_value;
};

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
      transition: `transform ${Math.abs(old_floor - new_floor) / 5}s`,
      transitionTimingFunction: "linear",
      transform: `translate(0, ${new_floor * 100}%)`,
      backgroundColor: "red",
    },
  };
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
      console.log(`lift ${event.target.id} has reached the floor, waiting`);

      // waiting a bit and switch
      setTimeout(() => {
        lift_data.value = {
          ...lift_data.value,
          style: {
            ...lift_data.value.style,
            backgroundColor: "green",
          },
        };
        console.log(`lift ${event.target.id} is available`);
      }, 500``);
    }
  }
});
</script>

<template>
  <div class="shaft">
    <div
      v-for="floor_data in floors_data"
      :key="floor_data.number"
      :class="floor_data.className"
    >
      <!-- <p>{{ floor_data.number }}</p> -->
    </div>
    <div
      :id="generate_lift_id(shaftId)"
      @click="new_random_floor"
      class="lift"
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