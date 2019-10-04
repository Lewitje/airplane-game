<template>
  <div class="status-bar">
    time {{ Math.floor($root.mainTick / 5) }}:00 /
    cash {{ getCash }} /
    planes ({{ planesOnGround }}) /
    scheduled flights ({{ $root.player.scheduled.length }}) /
    waiting to takeoff {{ $root.airport.takeoffQueue.length }} /
    waiting to land {{ $root.airport.landingQueue.length }} /
    landing {{ getLandings }} / taking off {{ getTakeoffs }} /
    {{ $root.statistics }}
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
.status-bar {
  position: fixed;
  top: 15px;
  left: calc(50% - 300px);
  padding: 5px 10px;
  width: 600px;
  line-height: 25px;
  color: black;
  background-color: white;
  border-radius: 10px;
}
</style>
