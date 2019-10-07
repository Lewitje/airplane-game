<template>
<div :class="{ open: showMenu }">
  <div class="atc" @click="showMenu = !showMenu">ATC</div>
  <div v-if="showMenu" class="menu">
    <div class="menu-inner">
      <div class="text-faded" @click="showMenu = false">Close ATC</div>
      <h2>ATC</h2>
      <p v-if="!$root.airport.open" class="error"><b>Airport closed</b></p>
      <p v-else-if="$root.config.lastLandingSlot - $root.mainTick > 0"><b>Open for {{ ($root.config.lastLandingSlot - $root.mainTick) / 10 }} hours</b></p>
      <p v-else><b class="error">Arrivals closed.</b><br/>Departures open for {{ (220 - $root.mainTick) / 10 }} hours</p>
      <div v-for="(flight, key, i) in groupedConversations" class="flight" v-if="i < 40">
        <h4>Flight {{ key }}</h4>
        <div v-for="item in flight" class="message" :class="{ 'response': item.isAtc }">
          <p>{{ item.message }}</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { bus } from '@/main'
import _ from 'lodash'
export default {
  name: 'atc',
  components: {
    bus
  },
  data () {
    return {
      showMenu: false,
      conversations: [],
      focused: false
    }
  },
  created () {
    bus.$on('atc', this.createConversation)
  },
  computed: {
    groupedConversations () {
      return _.groupBy(this.conversations, 'flightNumber')
    }
  },
  methods: {
    createConversation (message, flightNumber, isAtc) {
      this.conversations.unshift({
        message,
        flightNumber,
        isAtc,
        id: Math.floor(Math.random() * Math.random() * 1000 * Math.random() * 10000)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.atc {
  position: absolute;
  top: 36%;
  left: 68%;
  width: 5%; 
  height: 10%;
  background-color: hsl(0deg, 0%, 70%);
  color: hsl(0deg, 0%, 40%);
  z-index: 8;
  font-weight: 700;
  transform: rotate(-45deg);
  border-radius: 4vw;
  cursor: pointer;
  box-shadow: -10px 5px 40px -5px rgba(0, 0, 0, 0.3);
  transition: all 2s;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.airport-closed .atc {
  background-color: black;
  box-shadow: -10px 5px 40px -5px rgba(255, 0, 0, 0.3);
}

.menu {
  position: fixed;
  bottom: 15px;
  left: 15px;
  width: 250px;
  z-index: 15;
}

.menu-inner {
  max-height: 300px;
  padding: 10px 15px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, .5);
  overflow-y: auto;
}

.menu .text-faded {
  padding: 10px 20px;
  cursor: pointer;
}

.flight {
  border-radius: 4px;
  margin-bottom: 5px;
  background-color: hsl(0deg, 0%, 94%);
  text-align: left;
  padding: 10px;
}

.flight p {
  margin: 0;
}

.flight h4 {
  font-size: 18px;
}

.message {
  border-radius: 4px;
  margin-top: 5px;
  background-color: hsl(215deg, 100%, 50%);
  color: white;
  padding: 10px;
  margin-left: 40px;
}

.message.response {
  margin-left: 0;
  margin-right: 40px;
  background-color: white;
  color: black;
}
</style>
