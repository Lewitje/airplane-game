<template>
  <div class="gate"
      :style="{ left: getXPosition, top: getYPosition }"
      @click="showMenu = !showMenu">
      <div class="number">{{ gate.gateNumber }}</div>
      <div class="menu" v-if="showMenu">
        <h3>Upgrade gate {{ gate.gateNumber }}</h3>
        <h4>Passengers per tick</h4>
        <button @click="upgrade" :class="{ disabled: $root.statistics.totalPlanesDeparted < gate.passengersPerTick }">Upgrade {{ gate.passengersPerTick * 2 }} (${{ (gate.passengersPerTick * 2) * 500 }})</button>
        <div class="text-faded">Click to dismiss</div>
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
  mounted () {
  },
  computed: {
    getXPosition () {
      let x = 2 + this.gate.gateNumber * 8 + '%'
      if (this.gate.gateNumber > 8) {
        x = 2 + (this.gate.gateNumber - 8) * 8 + '%'
      }
      return x
    },
    getYPosition () {
      let y = '19%'
      if (this.gate.gateNumber > 8) {
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
  background-color: white;
  transition: all .2s;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 2s;
}

.airport-closed .gate {
  background-color: rgb(51, 51, 51);
}

.number {
  color: rgb(190, 190, 190);
  font-size: 30px;
  font-weight: 700;
  transition: all 2s;
}

.airport-closed .number {
  color: black;
}

.gate:hover {
  background-color: hsl(0deg, 0%, 60%);
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
