<template>
  <div>
    <div class="status-bar-wrapper">
      <div class="status-bar">
        <div class="status-bar-item time" title="Airport open/closed">
          <eva-icon v-if="$root.airport.open" name="sun-outline"></eva-icon>
          <eva-icon v-else name="moon-outline"></eva-icon>
          <span>{{ Math.floor($root.mainTick / 5) }}:00</span>
          <div class="time-inner" :style="{ width: getTimeWidth }"></div>
        </div>
        <div class="status-bar-item clickable" title="Balance" @click="showCashflow = !showCashflow">
          <eva-icon name="credit-card-outline"></eva-icon> <span>{{ getCash }}</span>
        </div>
        <div class="status-bar-item" title="Waiting to takeoff">
          <eva-icon name="diagonal-arrow-right-up-outline"></eva-icon> <span>{{ getTakeoffs }}</span>
        </div>
        <div class="status-bar-item" title="Waiting to land">
          <eva-icon name="diagonal-arrow-right-down-outline"></eva-icon> <span>{{ getLandings }}</span>
        </div>
        <div class="status-bar-item clickable" :title="`Play speed (${$root.config.gameSpeed}X)`">
          <eva-icon name="arrow-ios-forward-outline" v-if="$root.config.gameSpeed === 1" @click="setGameSpeed(3)"></eva-icon>
          <eva-icon name="arrowhead-right" v-else-if="$root.config.gameSpeed === 3" @click="setGameSpeed(0)"></eva-icon>
          <eva-icon name="pause-circle-outline" v-else @click="setGameSpeed(1)"></eva-icon>
        </div>
      </div>
    </div>
    <div v-if="showCashflow" class="cashflow">
      <h2>Cash flow</h2>
      <div class="cash-history">
        <div class="history-item" v-for="(item, i) in historyGraph" :style="getHistoryHeight(item)" :key="item * i + i"></div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'status-bar',
  data () {
    return {
      showCashflow: false
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
      let total = _.filter(this.$root.player.planes, { requestedLanding: true })
      if (total) {
        total = total.length
      } else {
        total = 0
      }
      return total
    },
    getTakeoffs () {
      let total = _.filter(this.$root.player.planes, { requestedTakeoff: true })
      if (total) {
        total = total.length
      } else {
        total = 0
      }
      return total
    },
    historyGraph () {
      let a = this.$root.statistics.cashHistory.slice(0, 200)
      return a.reverse()
    },
    getMaxCashflow () {
      if (this.showCashflow) {
        return _.max(this.historyGraph)
      } else {
        return false
      }
    }
  },
  methods: {
    getHistoryHeight (item) {
      return `height: ${item / this.getMaxCashflow * 100}%`
    },
    setGameSpeed (x) {
      this.$root.pause()
      this.$root.config.gameSpeed = x
      if (x !== 0) {
        this.$root.play()
      }
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
  box-shadow: 0 5px 10px -3px rgba(0, 0, 0, .2);
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

.status-bar-item .eva-hover {
  width: 24px;
  height: 24px;
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

.cashflow {
  position: fixed;
  bottom: 90px;
  left: calc(50% - 300px);
  width: 600px;
  padding: 30px;
  background-color: white;
  border-radius: 10px;
  z-index: 6;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, .1);
}

.cash-history {
  width: 100%;
  height: 150px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.history-item {
  margin: 0 0.5px;
  width: 100%;
  background-color: hsl(215deg, 100%, 50%);
  border-radius: 2px;
  animation: history-item .5s forwards;
}

@keyframes history-item {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
