<template>
  <div id="app" :class="{ 'airport-closed': !$root.airport.open }">
    <div class="screen-too-small">
      <h1>Small screen</h1>
      <p>A screen with a minimum width of 600px is required to play this game.</p>
    </div>
    <tutorial></tutorial>
    <main>
      <notifications></notifications>
      <div class="game-over" v-if="$root.gameOver">
        <h1>Game Over</h1>
        <p>You went bankrupt</p>
        <button @click="restart">Restart</button>
      </div>
      <board v-else>
        <plane v-for="plane in $root.player.planes" :key="plane.id" :plane="plane"></plane>
      </board>
      <status-bar />
      <store />
    </main>
  </div>
</template>

<script>
import Board from './components/board'
import Plane from './components/plane'
import StatusBar from './components/statusBar'
import Store from './components/store'
import Notifications from './components/notifications'
import Tutorial from './components/tutorial'

export default {
  name: 'app',
  components: {
    Board,
    Plane,
    StatusBar,
    Store,
    Notifications,
    Tutorial
  },
  methods: {
    restart () {
      location.reload()
    }
  }
}
</script>

<style>
*,
*:before,
*:after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  user-select: none;
}

body {
  text-align: center;
  font-size: 14px;
}

body,
button,
input,
textarea {
  font-family: 'Hind Medium', sans-serif;
}

h1,
h2,
h3 {
  margin-bottom: 15px;
  font-weight: 500;
}

h4,
h5 {
  margin-bottom: 10px;
  font-weight: 500;
}

p {
  margin-bottom: 10px;
}

h1 {
  font-size: 30px;
}

h2 {
  font-size: 25px;
}

h3 {
  font-size: 20px;
}

h4 {
  font-size: 16px;
  font-weight: 700;
}

.text-faded {
  opacity: 0.33;
}

button {
  appearance: none;
  border: 0;
  box-shadow: none;
  background-color: white;
  border: 2px solid black;
  border-radius: 30px;
  height: 30px;
  padding: 0 10px;
  color: black;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 10px;
  transition: all .1s;
  outline: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

button + button {
  margin-left: 10px;
  margin-bottom: 10px;
}

button:hover {
  background-color: black;
  color: white;
  fill: white;
}

button:active {
  transform: scale(0.95);
}

button.disabled {
  pointer-events: none;
  opacity: .5;
}

button .eva-hover {
  width: 24px;
  height: 24px;
  margin: 0 3px;
}

main {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: hsl(215deg, 50%, 97%);
  transition: all 2s;
}

.airport-closed main {
  background-color: #161718;
}

.toggle {
  position: fixed;
  top: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: white;
  z-index: 9;
  box-shadow: 0 5px 10px -3px rgba(0, 0, 0, .2);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all .1s;
}

.toggle:hover {
  background-color: rgb(0, 221, 103);
  fill: white;
}

.toggle:active {
  transform: scale(0.9);
}

.toggle .eva-hover {
  width: 30px;
  height: 30px;
  margin-top: 4px;
}

.open .toggle {
  background-color: rgb(0, 231, 123);
}

.open .toggle svg {
  fill: white;
}

table {
  margin: 0 auto;
  margin-bottom: 10px;
}

.screen-too-small,
.game-over {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background-color: white;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  display: flex;
}

@media (min-width: 600px) {
  .screen-too-small {
    display: none;
  }
}
</style>
