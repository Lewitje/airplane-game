<template>
  <div class="status-bar-wrapper">
    <div class="status-bar">
      <div class="status-bar-item time" title="Airport open/closed">
        <eva-icon v-if="$root.airport.open" name="sun-outline"></eva-icon>
        <eva-icon v-else name="moon-outline"></eva-icon>
        <span>{{ Math.floor($root.mainTick / 5) }}:00</span>
        <div class="time-inner" :style="{ width: getTimeWidth }"></div>
      </div>
      <div class="status-bar-item" title="Balance">
        <eva-icon name="credit-card-outline"></eva-icon> <span>{{ getCash }}</span>
      </div>
      <div class="status-bar-item" title="Waiting to takeoff">
        <eva-icon name="diagonal-arrow-right-up-outline"></eva-icon> <span>{{ $root.airport.takeoffQueue.length }}</span>
      </div>
      <div class="status-bar-item" title="Waiting to land">
        <eva-icon name="diagonal-arrow-right-down-outline"></eva-icon> <span>{{ $root.airport.landingQueue.length }}</span>
      </div>
      <div class="status-bar-item clickable" title="Waiting to land">
        <eva-icon name="trending-up-outline"></eva-icon>
      </div>
      <div class="status-bar-item clickable" title="Waiting to land">
        <eva-icon name="options-outline"></eva-icon>
      </div>
      <!-- time {{ Math.floor($root.mainTick / 5) }}:00 /
      cash {{ getCash }} /
      planes ({{ planesOnGround }}) /
      scheduled flights ({{ $root.player.scheduled.length }}) /
      waiting to takeoff {{ $root.airport.takeoffQueue.length }} /
      waiting to land {{ $root.airport.landingQueue.length }} /
      landing {{ getLandings }} / taking off {{ getTakeoffs }} /
      {{ $root.statistics }} -->
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'status-bar',
  data () {
    return {
    }
  },
  mounted () {
  },
  computed: {
    getTimeWidth () {
      return Math.ceil(this.$root.mainTick / 120 * 100) + '%'
    },
    planesOnGround () {
      let total = _.filter(this.$root.player.planes, { requestedLanding: false })
      if (total) {
        total = total.length
      } else {
        total = 0
      }
      return total
    },
    getCash () {
      return this.$root.player.cash.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    },
    getLandings () {
      let total = _.filter(this.$root.player.planes, { landing: true })
      if (total) {
        total = total.length
      } else {
        total = 0
      }
      return total
    },
    getTakeoffs () {
      let total = _.filter(this.$root.player.planes, { takingOff: true })
      if (total) {
        total = total.length
      } else {
        total = 0
      }
      return total
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.status-bar-wrapper {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 0 15px 15px;
}
.status-bar {
  margin: 0 auto;
  padding: 10px 5px;
  height: 50px;
  border-radius: 30px;
  color: black;
  background-color: white;
  display: inline-flex;
  justify-content: center;
}

.status-bar-item {
  flex: 0 0 auto;
  margin: 0 5px;
  padding: 0 10px;
  height: 30px;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid black;
}

.status-bar-item.clickable {
  background-color: black;
  color: white;
  fill: white;
  cursor: pointer;
  border: 0;
}

.status-bar-item.clickable:hover {
  background-color: hsl(215deg, 100%, 50%);
}

.status-bar-item span {
  font-size: 16px;
  letter-spacing: -0.05em;
  padding-left: 3px;
}

.time {
  position: relative;
  overflow: hidden;
  z-index: 2;
}

.time-inner {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: rgb(62, 242, 255);
  z-index: -1;
  transition: all .5s;
}

.airport-closed .time-inner {
  background-color: rgb(255, 246, 166);
}
</style>
