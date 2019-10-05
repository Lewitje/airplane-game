<template>
  <div :class="{ open: showMenu }">
    <div class="store-toggle toggle" @click="showMenu = !showMenu">
      <eva-icon name="shopping-cart-outline"></eva-icon>
    </div>
    <div class="store" v-if="showMenu">
      <div class="store-inner">
        <h3>Store</h3>
        <button @click="buyGate" :class="{ disabled: $root.player.gates.length === 16 }">Build gate ($50,000)</button>
        <button @click="buyRunway" :class="{ disabled: $root.player.runways.length === 3 }">Build runway ($100,000)</button>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from '@/main'

export default {
  name: 'store',
  components: {
    bus
  },
  data () {
    return {
      showMenu: false
    }
  },
  created () {
  },
  methods: {
    buyPlane () {
      bus.$emit('buy-plane')
    },
    buySchedule () {
      bus.$emit('buy-schedule')
    },
    buyGate () {
      bus.$emit('buy-gate')
    },
    buyRunway () {
      bus.$emit('buy-runway')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.store {
  position: fixed;
  bottom: 45px;
  left: 0;
  width: 100%;
}

.store-inner {
  margin: 0 auto 30px;
  width: 100%;
  max-width: 700px;
  background-color: white;
  padding: 15px;
  border-radius: 10px;
}

.store-toggle {
  top: 120px;
}
</style>
