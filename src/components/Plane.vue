<template>
  <div class="plane"
    :class="{ 'taking-off': plane.takingOff, fuelled: plane.fuelled, landing: plane.landing, unboarding: plane.unboarding }"
    :style="{ top: planePositionY, left: planePositionX }"
    @click="bump"
    @click.shift="cheat">

    <div class="sign error" v-if="!$root.airport.open">
      <eva-icon name="radio-outline" width="18" height="18"></eva-icon>
      <eva-icon name="alert-triangle-outline" width="18" height="18"></eva-icon>
    </div>
    <div class="sign takeoff" v-else-if="readyForTakeoff" @click="requestTakeoff" :class="{ disabled: !$root.airport.open }"><eva-icon name="checkmark-outline" width="18" height="18"></eva-icon></div>
    <div class="sign info" v-else-if="plane.unboarding"><eva-icon name="trending-down-outline" width="18" height="18"></eva-icon> {{ plane.boarded }}</div>
    <div class="sign waiting" v-else-if="plane.requestedTakeoff"><eva-icon name="clock-outline" width="18" height="18"></eva-icon></div>
    <div class="sign info" v-else><eva-icon name="trending-up-outline" width="18" height="18"></eva-icon> {{ 200 - plane.boarded }}</div>    
  </div>
</template>

<script>
import { bus } from '@/main'
import _ from 'lodash'
export default {
  name: 'plane',
  props: [ 'plane' ],
  components: {
    bus
  },
  data () {
    return {
      gate: null,
      readyForTakeoff: false
    }
  },
  mounted () {
    this.plane.fuelled = true
    setInterval(() => {
      this.tick()
    }, 250)
    bus.$on('dispatch-all-planes', () => {
      this.requestTakeoff()
    })
  },
  computed: {
    planePositionX () {
      if (this.plane.requestedLanding) {
        return '150%'
      } else if (this.plane.takingOff || this.plane.landing) {
        return 75 + (this.plane.runway * 6) + '%'
      } else if (this.gate && this.gate.gateNumber > 8) {
        return 3 + (this.plane.gate - 8) * 8 + '%'
      } else {
        return 3 + this.plane.gate * 8 + '%'
      }
    },
    planePositionY () {
      if (this.plane.landing || this.plane.takingOff) {
        return '12%'
      } else if (this.gate && this.gate.gateNumber > 8) {
        return '62%'
      } else {
        return '20%'
      }
    }
  },
  methods: {
    tick () {
      if (this.plane.takingOff || this.plane.requestedTakeoff || this.plane.landing || this.plane.requestedLanding || this.readyForTakeoff) {
        return false
      } else if (this.plane.unboarding) {
        this.unboardPassenger()
      } else if (this.plane.fuelled && this.plane.boarded >= this.plane.passengerCapacity) {
        this.readyForTakeoff = true
      } else {
        this.boardPassenger()
      }
    },
    requestTakeoff () {
      if (!this.readyForTakeoff) {
        return false
      }
      this.readyForTakeoff = false
      bus.$emit('notification', `Passenger departures terminal costs (${this.plane.passengerCapacity} X 10) +${this.plane.passengerCapacity * 10}`)
      bus.$emit('request-takeoff', this.plane)
      this.plane.requestedTakeoff = true
    },
    boardPassenger (x) {
      // Dont do anything if the plane is moving
      if (!this.$root.airport.open || this.plane.takingOff || this.plane.requestedTakeoff || this.plane.landing || this.plane.requestedLanding || this.readyForTakeoff) {
        return false
      }
      let amount = this.gate ? this.gate.passengersPerTick : 1
      if (!isNaN(x)) {
        amount = x
      }
      // Only board if there are empty spaces
      if (this.plane.boarded < this.plane.passengerCapacity) {
        this.$root.player.cash += amount * 10
        this.plane.boarded = Math.min(this.plane.passengerCapacity, this.plane.boarded + amount)
      }
    },
    unboardPassenger (x) {
      // Dont do anything if the plane is moving
      if (this.plane.takingOff || this.plane.requestedTakeoff || this.plane.landing || this.plane.requestedLanding || this.readyForTakeoff) {
        return false
      }
      let amount = this.gate ? this.gate.passengersPerTick : 1
      if (!isNaN(x)) {
        amount = x
      }
      if (this.plane.boarded > 0) {
        this.$root.player.cash += amount * 10
        this.plane.boarded = Math.max(0, this.plane.boarded - amount)
      } else {
        bus.$emit('notification', `Passenger arrivals terminal costs (${this.plane.passengerCapacity} X 10) +${this.plane.passengerCapacity * 10}`)
        this.plane.unboarding = false
      }
    },
    bump () {
      if (this.plane.unboarding) {
        this.unboardPassenger(2)
      } else {
        this.boardPassenger(2)
      }
    },
    cheat () {
      if (this.plane.unboarding) {
        this.unboardPassenger(100)
      } else {
        this.boardPassenger(100)
      }
    }
  },
  watch: {
    'plane.gate' () {
      let x = this.plane.gate
      if (x) {
        this.gate = _.find(this.$root.player.gates, { gateNumber: x })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.plane {
  position: absolute;
  /* background-color: red; */
  width: 3%;
  height: 10%;
  /* border: 2px solid red; */
  color: white;
  cursor: pointer;
  transition: transform .2s;
  font-size: 12px;
  z-index: 3;
  transition: transform 6s cubic-bezier(.2, 1, .4, 0);
  background-image: url('/static/img/plane.png');
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
}

.plane:active {
  transform: scale(.9);
}

.plane.waiting .info {
  background-color: orangered;
}

.plane.taking-off {
  animation: plane-taking-off 3s forwards cubic-bezier(.6, 0, .8, 0);
}

.plane.taking-off .info {
  background-color: green;
}

.plane.landing {
  animation: plane-landing 3s forwards cubic-bezier(.2, 1, .4, 1);
}

.plane.landing .info {
  background-color: darkblue;
}

.plane.unboarding .info {
  background-color: rgb(238, 68, 82);
}

@keyframes plane-landing {
  from {
    transform: translateY(70vh) scale(1.3);
  }
  to {
    transform: none;
  }
}

@keyframes plane-taking-off {
  from {
    transform: rotate(180deg);
  }
  to {
    transform: translateY(70vh) scale(1.3) rotate(180deg);
  }
}

.taking-off .waiting,
.landing .info {
  display: none !important;
}

.sign {
  position: absolute;
  top: -14px;
  left: calc(50% - 30px);
  width: 60px;
  height: 24px;
  line-height: 24px;
  background-color: rgb(0, 214, 107);
  border-radius: 30px;
  transition: all .25s;
  z-index: 3;
  font-size: 12px;
  letter-spacing: -0.05em;
  fill: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sign.disabled {
  background-color: rgb(167, 167, 167);
  fill: rgb(206, 206, 206);
  pointer-events: none;
}

.sign .eva-hover {
  margin: 0 3px !important;
  width: 18px;
  height: 18px;
}

.takeoff,
.waiting {
  background-color: hsl(215deg, 100%, 50%);
  color: white;
  top: calc(50% - 12px);
  width: 60px;
  left: calc(50% - 30px);
  opacity: 1;
}

.waiting {
  background-color: hsl(35deg, 100%, 50%);
}

.takeoff:hover {
  background-color: hsl(215deg, 100%, 60%);
}

.sign.error {
  background-color: rgb(226, 0, 75);
}

.sign.error .eva-hover:nth-child(1) {
  animation: flicker 2s infinite;
}

.sign.error .eva-hover:nth-child(2) {
  margin-left: -18px;
  animation: flicker 2s 1s infinite;
}

@keyframes flicker {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.plane:active .info {
  transition: none;
  background-color: white;
  color: black;
  fill: black;
}
</style>
