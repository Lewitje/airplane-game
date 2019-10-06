<template>
  <div class="gate"
      :style="{ left: getXPosition, top: getYPosition }"
      :class="{ 'gate-staffed': gate.staffed }">
      <div class="walkway"></div>
      <div class="number" @click="showMenu = !showMenu">{{ gate.gateNumber }}</div>
      <div v-if="!gate.staffed && $root.airport.open" class="info" @click="staffGate" title="Needs staff!"><eva-icon name="people-outline"></eva-icon></div>
      <div class="menu" v-if="showMenu">
        <h3>Upgrade gate {{ gate.gateNumber }}</h3>
        <h4>Passengers boarded / unboarded per tick</h4>
        <button @click="upgrade" :class="{ disabled: $root.statistics.totalPlanesDeparted < gate.passengersPerTick }">Upgrade {{ gate.passengersPerTick * 2 }} (${{ (gate.passengersPerTick * 2) * 500 }})</button>
        <div>
          <h4>Permanently staff gate</h4>
          <p>Each time a plane takesoff staff are automatically requested for the next flight.</p>
          <button @click="addPermanentStaff" :class="{ disabled: gate.permanentlyStaffed }">Add permanent staff (10000)</button>
        </div>
        <div>
          <h4>Auto approve takeoff</h4>
          <p>When the plane is fully boarded the plane will automatically request takeoff.</p>
          <button @click="autoApproveTakeoff" :class="{ disabled: gate.autoApproveTakeoff }">Auto approve takeoff (10000)</button>
        </div>
        <div class="text-faded" @click="showMenu = false">Close</div>
      </div>
  </div>
</template>

<script>
import { bus } from '@/main'
export default {
  name: 'gate',
  props: [ 'gate' ],
  components: {
    bus
  },
  data () {
    return {
      showMenu: false
    }
  },
  created () {
    bus.$on('staff-all-gates', () => {
      this.staffGate()
    })
  },
  computed: {
    getXPosition () {
      let x = this.gate.gateNumber * 6 + '%'
      if (this.gate.gateNumber > 11) {
        x = (this.gate.gateNumber - 11) * 6 + '%'
      }
      return x
    },
    getYPosition () {
      let y = '19%'
      if (this.gate.gateNumber > 11) {
        y = '61%'
      }
      return y
    }
  },
  methods: {
    upgrade () {
      let price = (this.gate.passengersPerTick * 2) * 500
      this.gate.passengersPerTick = this.gate.passengersPerTick * 2
      this.$root.player.cash -= price
      bus.$emit('notification', `Upgraded gate -${price}`)
    },
    staffGate () {
      if (!this.$root.airport.open || this.gate.staffed) {
        return false
      }
      bus.$emit('staff-gate', this.gate.gateNumber)
    },
    addPermanentStaff () {
      this.gate.permanentlyStaffed = true
      let price = 10000
      this.$root.player.cash -= price
      bus.$emit('notification', `Upgraded gate -${price}`)
    },
    autoApproveTakeoff () {
      this.gate.autoApproveTakeoff = true
      let price = 10000
      this.$root.player.cash -= price
      bus.$emit('notification', `Upgraded gate -${price}`)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.gate {
  position: absolute;
  width: 5%;
  height: 12%;
  /* background-image: url('/static/img/Gate.png');
  background-size: 100% 100%; */
  background-color: rgba(150, 150, 150, 0.2);
  transition: all .2s;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 2s;
}

.walkway {
  position: absolute;
  bottom: -5px;
  right: 5px;
  height: 20px;
  width: 5px;
  background-color: rgb(150, 150, 150);
  z-index: 3;
  transition: all 3s;
  transform-origin: 50% 80%;
  transform: rotate(20deg);
}

.gate-staffed .walkway {
  transform: rotate(-30deg);
}

.airport-closed .gate {
  background-color: black;
}

.number {
  color: rgb(190, 190, 190);
  font-size: 30px;
  font-weight: 700;
  transition: all 2s;
}

.number:hover {
  transition: all .1s;
  color: black;
}

.info {
  position: absolute;
  top: calc(50% - 20px);
  left: calc(50% - 20px);
  width: 40px;
  height: 40px;
  background-color: hsl(340deg, 100%, 50%);
  fill: white;
  border-radius: 50%;
  z-index: 4;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: info 1s infinite;
}

@keyframes info {
  0%,
  100% {
    transform: none;
    background-color: hsl(340deg, 100%, 50%);
  }
  50% {
    transform: scale(1.1);
    background-color: hsl(340deg, 100%, 60%);

  }
}

.menu {
  position: absolute;
  top: -100px;
  left: calc(50% - 150px);
  width: 300px;
  padding: 30px 15px;
  border-radius: 10px;
  z-index: 5;
  background-color: white;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, .4);
  animation: menu .5s forwards cubic-bezier(.2, 1.5, .5, 1);
  opacity: 0;
}

.menu .text-faded {
  padding: 20px 20px 10px;
}

@keyframes menu {
  from {
    transform: translateY(40px) scale(.8);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
</style>
