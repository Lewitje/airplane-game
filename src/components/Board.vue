<template>
  <div class="board">
    <slot></slot>
    <div class="runway"></div>
    <div class="gates">
      <gate v-for="gate in $root.player.gates" :key="gate.gateNumber"  :gate="gate"></gate>
    </div>
    <div class="terminal"></div>
  </div>
</template>

<script>
import Gate from '@/components/gate'
export default {
  name: 'board',
  components: {
    Gate
  },
  data () {
    return {
    }
  },
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.board {
  position: relative;
  overflow: hidden;
  background-color: lightgreen;
  width: 100%;
  padding-top: 45%;
}

.runway {
  position: absolute;
  top: 10%;
  left: 82%;
  width: 3%;
  height: 80%;
  background-color: white;
}

.terminal {
  position: absolute;
  top: 21%;
  left: 5%;
  width: 70%;
  height: 30%;
  background-color: grey;
  border: 5px solid lightskyblue;
}
</style>
