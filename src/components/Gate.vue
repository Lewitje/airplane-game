<template>
  <div class="gate"
      :style="{ left: 2 + gate.gateNumber * 8 + '%' }"
      @click="showMenu = !showMenu">
      <div class="menu" v-if="showMenu">
        <button @click="upgrade">Upgrade PPM {{ gate.passengersPerTick }}</button>
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
  },
  methods: {
    upgrade () {
      this.gate.passengersPerTick += 10
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
  top: 9%;
  background-color: grey;
  border: 4px solid orange;
  transition: all .2s;
  cursor: pointer;
}

.gate:hover {
  background-color: hsl(0deg, 0%, 60%);
}

.menu {
  position: absolute;
  top: 0;
  left: calc(50% - 100px);
  width: 200px;
  padding: 30px;
  border-radius: 10px;
  z-index: 5;
  background-color: white;
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, .05);
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
