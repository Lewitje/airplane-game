<template>
  <div class="board" :class="{ paused: $root.config.gameSpeed === 0, fast: $root.config.gameSpeed === 6 }">
    <slot></slot>
    <div class="runway" v-for="runway in $root.player.runways" :key="runway.runwayNumber" :style="{ left: 74 + (runway.runwayNumber * 4) + '%' }">{{ runway.runwayNumber }}</div>
    <div class="gates">
      <gate v-for="gate in $root.player.gates" :key="gate.gateNumber"  :gate="gate"></gate>
    </div>
    <div class="terminal">
      <button @click="staffAllGates" :class="{ disabled: !$root.airport.open}"><eva-icon name="people-outline"></eva-icon> Staff all gates</button>
      <button @click="dispatchAllPlanes" :class="{ disabled: !$root.airport.open}"><eva-icon name="done-all-outline"></eva-icon> Accept all takeoff requests</button>
      <div class="fan left"></div>
      <div class="fan right"></div>
    </div>
    <div class="taxiways"></div>
    <div class="road"></div>

    <div class="forests">
      <div class="forest"></div>
      <div class="forest"></div>
      <div class="forest"></div>
      <div class="forest"></div>
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
  width: 100%;
  padding-top: 45%;
}

.runway {
  position: absolute;
  top: 8%;
  left: 82%;
  width: 3%;
  height: 76%;
  background-color: rgba(150, 150, 150, 0.2);
  transition: background 2s;
  font-size: 30px;
  color: rgba(150, 150, 150, .3);
  font-weight: 700;
  line-height: 35vw;
}

.runway:before,
.runway:after {
  position: absolute;
  bottom: -1.5vw;
  left: 10%;
  width: .8vw;
  height: .8vw;
  border-radius: 50%;
  content: '';
  background-color: rgba(0, 0, 0, .3);
}

.runway:after {
  left: auto;
  right: 10%;
}

.airport-closed .runway {
  background-color: black;
}

.airport-closed .runway:before,
.airport-closed .runway:after {
  animation: runway-lights 1s infinite;
}

.airport-closed .runway:after {
  animation-delay: .5s;
}

@keyframes runway-lights {
  0%,
  10%,
  100% {
    background-color: hsl(160deg, 100%, 50%);
  }
  50%,
  60% {
    background-color: hsl(20deg, 100%, 50%);
  }
}

.road {
  position: absolute;
  top: 16%;
  left: 74%;
  width: 3%;
  height: 60%;
  background-color: rgba(0, 0, 0, .03);
  content: '';
}

.taxiways:before,
.taxiways:after {
  position: absolute;
  top: 8%;
  left: 0;
  width: 77%;
  height: 8%;
  background-color: rgba(0, 0, 0, .03);
  content: '';
}

.taxiways:after {
  top: 76%;
}

.terminal {
  position: absolute;
  top: 31%;
  left: 0;
  width: 72%;
  height: 30%;
  /* background-image: url('/static/img/Terminal.png');
  background-size: 100% 100%; */
  background-color: white;
  box-shadow: 0 0 40px -10px rgba(0, 0, 0, .3);
  transition: all 2s;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
}

.terminal button {
  position: relative;
  z-index: 5;
}

.terminal:before,
.terminal:after {
  position: absolute;
  width: 25vw;
  height: 8vw;
  background-color: white;
  content: '';
  top: calc(50% - 4vw);
  border-radius: 5vw;
  box-shadow: 0 0 40px -10px rgba(0, 0, 0, .3);
}

.terminal:before {
  left: 5%;
}

.terminal:after {
  right: 5%;
}

.fan {
  position: absolute;
  top: calc(50% - 2vw);
  z-index: 4;
  width: 4vw;
  height: 4vw;
  border-radius: 50%;
  background-color: rgba(50, 50, 50, .6);
  border: .2vw solid rgba(255, 255, 255, .4);
}

.fan:before,
.fan:after {
  position: absolute;
  top: calc(50% - .2vw);
  left: calc(50% - 1.5vw);
  width: 3vw;
  height: .4vw;
  content: '';
  background-color: rgba(0, 0, 0, .7);
  animation: fan 1s infinite linear;
  border-radius: 1vw;
}

.fan:after {
  animation: fan-after 1s infinite linear;
}

.paused .fan:before,
.paused .fan:after {
  animation-play-state: paused;
}

.fast .fan:before,
.fast .fan:after {
  animation-duration: .5s;
}

@keyframes fan {
  from {
    transform: none;
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fan-after {
  from {
    transform: rotate(90deg);
  }
  to {
    transform: rotate(450deg);
  }
}

.fan.left {
  left: 8%;
}

.fan.right {
  right: 8%;
}

.airport-closed .terminal,
.airport-closed .terminal:before,
.airport-closed .terminal:after {
  box-shadow: 0 0 40px -10px rgba(255, 187, 0, 0.479);
  background-color: black;
}

.forest,
.forest:before,
.forest:after {
  width: 3vw;
  height: 3vw;
  border-radius: 50%;
  /* box-shadow: 0 0 20px -5px rgba(0, 0, 0, .1); */
  background-color: rgba(0, 150, 0, .05);
  position: absolute;
  top: -3%;
  left: 20%;
}

.forest:before,
.forest:after {
  width: 4vw;
  height: 4vw;
  content: '';
  background-color: rgba(100, 220, 200, .2);
}

.forest:before {
  left: 12vw;
  top: -5vw;
  background-color: rgba(100, 220, 160, .1);
}

.forest:after {
  left: -13vw;
  top: -1vw;
}

.forest:nth-child(2) {
  top: -5%;
  left: auto;
  right: 25%;
  transform: scale(1.5) translateY(-80%) rotate(190deg);
}

.forest:nth-child(3) {
  left: 15%;
  top: 90%;
  transform: scale(1.2) rotate(170deg);
}

.forest:nth-child(4) {
  left: auto;
  right: 20%;
  top: 110%;
  transform: scale(2) rotate(-5deg);
}
</style>
