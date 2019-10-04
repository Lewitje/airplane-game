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
  background-color: #d9e4e6;
  width: 100%;
  padding-top: 45%;
  transition: all 2s;
}

.airport-closed .board {
  background-color: #232627;
}

.runway {
  position: absolute;
  top: 10%;
  left: 82%;
  width: 3%;
  height: 80%;
  background-color: rgb(168, 168, 168);
  transition: all 2s;
}

.airport-closed .runway {
  background-color: black;
}

.terminal {
  position: absolute;
  top: 31%;
  left: 5%;
  width: 70%;
  height: 30%;
  /* background-image: url('/static/img/Terminal.png');
  background-size: 100% 100%; */
  background-color: white;
  box-shadow: 0 0 40px -10px rgba(0, 0, 0, .3);
  transition: all 2s;
}

.airport-closed .terminal {
  box-shadow: 0 0 40px -10px rgba(255, 187, 0, 0.479);
  background-color: black;
}
</style>
