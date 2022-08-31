const ctorage_item_name = "lifts_data"

class LiftsManager {
  constructor(shafts, stories) {

    const saved_state = JSON.parse(localStorage.getItem(ctorage_item_name));
    const saved_lift_floors = saved_state ? saved_state.floors : undefined
    const saved_queue = saved_state ? saved_state.queue : undefined

    console.log(saved_queue)

    this.lifts = Array.from({ length: shafts }, (_, i) => ({
      index: i,
      id: `shaft_${i}`,
      available: true,
      current_floor: saved_lift_floors ? saved_lift_floors[i] : 0,
    }))
    this.floors = Array.from({ length: stories }, (_, i) => ({
      index: i,
      id: `floor_${i}`,
      indicator: false
    }))
    this.queue = saved_queue ? saved_queue : []
  }

  saveState() {
    localStorage.setItem(
      ctorage_item_name,
      JSON.stringify({
        floors: this.lifts.map((lift) => lift.current_floor),
        queue: this.queue,
      })
    );
  }

  dispatchLift(lift_id, floor_id) {
    const target_floor_index = this.floors.find(floor => floor.id === floor_id).index
    this.lifts = this.lifts.map(lift => lift.id === lift_id ? {
      ...lift,
      current_floor: target_floor_index,
      available: false
    } : lift)
  }

  liftArrived(lift_id) {
    // changing lift status
    this.lifts = this.lifts.map(lift => lift.id === lift_id ? { ...lift, available: true } : lift)

    // changing floor indicator
    const floor_index = this.lifts.find(lift => lift.id === lift_id).current_floor
    this.floors = this.floors.map(floor => floor.index === floor_index ? { ...floor, indicator: false } : floor)

    // checking if there are unfulfilled request 
    if (this.queue.length !== 0) {
      this.dispatchLift(lift_id, this.queue[0])
      this.queue.shift()
    }
    this.saveState()
  }

  requestLift(floor_id) {
    const floor_data = this.floors.find(floor => floor.id === floor_id)

    // checking if there is already lift on the floor or heading to that floor
    if (this.lifts.find(lift => lift.current_floor === floor_data.index)) {
      console.log('already there')
      return
    }

    // checking if there already is a request for that floor
    else if (this.queue.find(f => f === floor_id)) {
      console.log('already requested')
      return
    }

    // all checks passed, this is a valid request - adding to queue and changing floor indicator
    this.queue = this.queue.concat(floor_id)
    this.floors = this.floors.map(floor => floor.id === floor_id ? { ...floor, indicator: true } : floor)

    // checking if its possible to dispatch a lift 
    const available_lifts = this.lifts.filter(lift => lift.available)
    if (available_lifts.length) {
      // finding closest lifts
      const first_to_request_index = this.floors.find(floor => floor.id === this.queue[0]).index
      const distance_to_floor = (lift) => Math.abs(lift.current_floor - first_to_request_index)
      const closest_lifts = available_lifts.sort((a, b) => distance_to_floor(a) - distance_to_floor(b))

      this.dispatchLift(closest_lifts[0].id, this.queue[0])
      this.queue.shift()
    }
  }
}

export default LiftsManager