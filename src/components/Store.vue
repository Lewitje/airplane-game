<template>
  <div :class="{ open: showMenu }">
    <div class="store-toggle toggle" @click="showMenu = !showMenu">
      <eva-icon name="shopping-cart-outline"></eva-icon>
    </div>
    <div class="store" v-if="showMenu">
      <div class="store-inner">
        <h3>Store</h3>
        <div>
          <button @click="buyGate" :class="{ disabled: $root.player.gates.length === 22 }"><eva-icon name="upload-outline"></eva-icon> Build gate ($50,000)</button>
        </div>
        <div>
          <button @click="buyRunway" :class="{ disabled: $root.player.runways.length === 6 }"><eva-icon name="arrowhead-up-outline"></eva-icon> Build runway ($100,000)</button>
        </div>
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
  top: 120px;
  right: 105px;
  width: 250px;
}

.store-inner {
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 5px 10px -3px rgba(0, 0, 0, .5);
}

.store-toggle {
  top: 120px;
}
</style>
