class LiftsManager {
  constructor(shafts, stories, floors = undefined) {
    
    if (floors === undefined) 
      floors = Array.from({ length: shafts }, () => 0)

    this.lifts = Array.from({ length: shafts }, (_, i) => ({
      index: i,
      id: `shaft_${i}`,
      available: true,
      current_floor: floors[i],
    }))

    this.floors = Array.from({ length: stories }, (_, i) => ({
      index: i,
      id: `floor_${i}`,
      indicator: false
    }))

    this.queue = []
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
    this.floors = this.floors.map(floor => floor.index === floor_index ? {...floor, indicator: false} : floor)

    // checking if there are unfulfilled request 
    if (this.queue.length !== 0) {
      this.dispatchLift(lift_id, this.queue[0])
      this.queue.shift()
    }
    console.log('lift arrived ok', this)
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
    this.floors = this.floors.map(floor => floor.id === floor_id ? {...floor, indicator: true} : floor)


    // checking if its possible to dispatch a lift 
    const available_lift = this.lifts.find(lift => lift.available)
    if (available_lift) {
      this.dispatchLift(available_lift.id, this.queue[0])
      this.queue.shift()
    }
  }
}

export default LiftsManager