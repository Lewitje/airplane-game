<template>
  <div class="gate"
      :style="{ left: getXPosition, top: getYPosition }">
      <div class="number" @click="showMenu = !showMenu">{{ gate.gateNumber }}</div>
      <div v-if="!gate.staffed && $root.airport.open" class="info" @click="staffGate"><eva-icon name="people-outline"></eva-icon></div>
      <div class="menu" v-if="showMenu">
        <h3>Upgrade gate {{ gate.gateNumber }}</h3>
        <h4>Passengers per tick</h4>
        <button @click="upgrade" :class="{ disabled: $root.statistics.totalPlanesDeparted < gate.passengersPerTick }">Upgrade {{ gate.passengersPerTick * 2 }} (${{ (gate.passengersPerTick * 2) * 500 }})</button>
        <div>
          <button @click="addPermanentStaff" :class="{ disabled: gate.permanentlyStaffed }">Add 24h Staff (10000)</button>
        </div>
        <div class="text-faded" @click="showMenu = false">Click to dismiss</div>
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

.airport-closed .gate {
  /* background-color: rgb(51, 51, 51); */
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

.airport-closed .number {
  color: black;
}

.info {
  position: absolute;
  top: calc(50% - 20px);
  left: calc(50% - 20px);
  width: 40px;
  height: 40px;
  background-color: hsl(215deg, 100%, 50%);
  fill: white;
  border-radius: 50%;
  z-index: 4;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu {
  position: absolute;
  top: 0;
  left: calc(50% - 100px);
  width: 200px;
  padding: 30px 15px;
  border-radius: 10px;
  z-index: 5;
  background-color: white;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, .4);
  animation: menu .5s forwards cubic-bezier(.2, 1.5, .5, 1);
  opacity: 0;
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
