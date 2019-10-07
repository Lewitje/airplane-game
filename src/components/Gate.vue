<template>
  <div>
    <div class="gate"
        :style="{ left: getXPosition, top: getYPosition }"
        :class="{ 'gate-staffed': gate.staffed && $root.airport.open, 'gate-bottom': gate.gateNumber > 8 }">
        <div class="menu-toggle" title="Upgrade stand" @click="showMenu = !showMenu">
          <eva-icon name="arrowhead-up-outline" width="18" height="18"></eva-icon>
        </div>
        <div class="staff" :style="`animation-delay: ${3 * Math.random()}s;`"></div>
        <div class="walkway" :style="`transition-delay: ${2 * Math.random()}s;`"></div>
        <div class="number">{{ gate.gateNumber }}</div>
        <div v-if="!gate.staffed && $root.airport.open" class="info" @click="staffGate" title="Needs staff!"><eva-icon name="people-outline"></eva-icon></div>
    </div>
    <div class="menu" v-if="showMenu">
      <div class="menu-inner">
        <div class="text-faded" @click="showMenu = false">Close</div>
        <h3>Upgrade gate {{ gate.gateNumber }}</h3>
        <h4>Passengers boarded / unboarded per tick</h4>
        <p class="error" v-show="$root.statistics.totalPlanesDeparted < planesTillNextUpgrade">You need to dispatch a minimum of {{ planesTillNextUpgrade }} planes to unlock this.</p>
        <button @click="upgrade" :class="{ disabled: $root.statistics.totalPlanesDeparted < planesTillNextUpgrade }">Upgrade {{ Math.ceil(gate.passengersPerTick * 1.2) }} (${{ planesTillNextUpgrade * 100 }})</button>
        <div>
          <h4>Permanently staff gate</h4>
          <p>Each time a plane takesoff staff are automatically requested for the next flight.</p>
          <button @click="addPermanentStaff" :class="{ disabled: gate.permanentlyStaffed }">Add permanent staff (10,000)</button>
        </div>
        <div>
          <h4>Auto approve takeoff</h4>
          <p>When the plane is fully boarded the plane will automatically request takeoff.</p>
          <button @click="autoApproveTakeoff" :class="{ disabled: gate.autoApproveTakeoff }">Auto approve takeoff (10,000)</button>
        </div>
        <div class="text-faded" @click="showMenu = false">Close</div>
      </div>
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
      let x = this.gate.gateNumber * 8 + '%'
      if (this.gate.gateNumber > 8) {
        x = (this.gate.gateNumber - 8) * 8 + '%'
      }
      return x
    },
    getYPosition () {
      let y = '16%'
      if (this.gate.gateNumber > 8) {
        y = '61%'
      }
      return y
    },
    planesTillNextUpgrade () {
      return Math.ceil((this.gate.passengersPerTick * 10) * 1.2)
    }
  },
  methods: {
    upgrade () {
      let price = this.planesTillNextUpgrade * 100
      this.gate.passengersPerTick = this.planesTillNextUpgrade
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
      this.gate.staffed = true
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
  width: 7%;
  height: 15%;
  /* background-image: url('/static/img/Gate.png');
  background-size: 100% 100%; */
  background-color: rgba(150, 150, 150, 0.2);
  transition: all 2s;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 2s;
}

/* WALKWAY */

.walkway {
  position: absolute;
  bottom: -5px;
  right: 3px;
  height: 40%;
  width: 15%;
  background-color: rgb(100, 100, 100);
  z-index: 3;
  transition: all 2.5s;
  transform-origin: 50% 80%;
  transform: rotate(20deg);
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(0, 0, 0, .2);
}

.gate-bottom .walkway {
  top: -5px;
  bottom: auto;
  left: 3px;
  right: auto;
  transform-origin: 50% 20%;
}

.gate-staffed .walkway {
  transform: rotate(-30deg);
}

.airport-closed .gate {
  background-color: black;
}

.number {
  color: rgba(190, 190, 190, .5);
  font-size: 2.5vw;
  font-weight: 700;
  transition: all 2s;
}

.airport-closed .number {
  opacity: .33;
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
  cursor: pointer;
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

.menu-toggle {
  position: absolute;
  top: -15px;
  left: -10px;
  width: 30px;
  height: 30px;
  background-color: white;
  border-radius: 50%;
  border: 2px solid black;
  z-index: 11;
  cursor: pointer;
}

.gate-bottom .menu-toggle {
  top: auto;
  bottom: -15px;
}

.menu-toggle:hover {
  background-color: black;
  fill: white;
}

.menu-toggle .eva-hover {
  margin-top: 3px;
  width: 18px;
  height: 18px;
}

.menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 90;
  backdrop-filter: blur(3px) brightness(.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-inner {
  width: 350px;
  max-height: 80vh;
  padding: 10px 15px;
  border-radius: 10px;
  z-index: 20;
  background-color: white;
  animation: menu .5s forwards cubic-bezier(.2, 1.5, .5, 1);
  opacity: 0;
  overflow-y: auto;
}

.menu .text-faded {
  padding: 10px 20px;
  cursor: pointer;
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

/* STAFF */
.staff {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.staff:before,
.staff:after {
  position: absolute;
  width: 15%;
  height: 45%;
  content: '';
  background-color: hsl(45deg, 100%, 50%);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(0, 0, 0, .1);
  pointer-events: none;
}

.gate-bottom .staff {
  transform: rotate(180deg);
}

.staff:before {
  bottom: 10px;
  left: 5px;
  height: 30%;
  background-color: white;
  transform: translateY(3vh);
}

.staff:after {
  top: -5px;
  right: 5px;
  transform: translateY(8vh);
}

.gate-staffed .staff:before {
  opacity: 1;
  animation: truck-before 3s linear forwards;
  animation-delay: inherit;
}

.gate-staffed .staff:after {
  opacity: 1;
  animation: truck-after 6s linear forwards;
  animation-delay: inherit;
}

@keyframes truck-before {
  0% {
    transform: translateY(3vh);
  }
  50% {
    transform: translateY(1vh);
  }
  100% {
    transform: rotate(20deg);
  }
}

@keyframes truck-after {
  0% {
    transform: translateY(8vh);
  }
  50% {
    transform: translateY(2vh);
  }
  100% {
    transform: rotate(-40deg);
  }
}
</style>
