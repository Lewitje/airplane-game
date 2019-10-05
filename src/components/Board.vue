<template>
  <div class="board">
    <slot></slot>
    <div class="runway" v-for="runway in $root.player.runways" :key="runway.runwayNumber" :style="{ left: 72 + (runway.runwayNumber * 4) + '%' }"></div>
    <div class="gates">
      <gate v-for="gate in $root.player.gates" :key="gate.gateNumber"  :gate="gate"></gate>
    </div>
    <div class="terminal">
      <button @click="staffAllGates" :class="{ disabled: !$root.airport.open}"><eva-icon name="people-outline"></eva-icon> Staff all gates</button>
      <button @click="dispatchAllPlanes" :class="{ disabled: !$root.airport.open}"><eva-icon name="done-all-outline"></eva-icon> Accept all takeoff requests</button>
    </div>
  </div>
</template>

<script>
import Gate from '@/components/gate'
import { bus } from '@/main'
export default {
  name: 'board',
  components: {
    Gate,
    bus
  },
  data () {
    return {
    }
  },
  methods: {
    dispatchAllPlanes () {
      bus.$emit('dispatch-all-planes')
    },
    staffAllGates () {
      bus.$emit('staff-all-gates')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.board {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-top: 45%;
}

.runway {
  position: absolute;
  top: 10%;
  left: 82%;
  width: 3%;
  height: 80%;
  background-color: rgb(168, 168, 168);
  transition: all 2s;
}

.airport-closed .runway {
  background-color: black;
}

.terminal {
  position: absolute;
  top: 31%;
  left: 3%;
  width: 70%;
  height: 30%;
  /* background-image: url('/static/img/Terminal.png');
  background-size: 100% 100%; */
  background-color: white;
  box-shadow: 0 0 40px -10px rgba(0, 0, 0, .3);
  transition: all 2s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.airport-closed .terminal {
  box-shadow: 0 0 40px -10px rgba(255, 187, 0, 0.479);
  background-color: black;
}
</style>
