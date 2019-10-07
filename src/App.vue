<template>
  <div id="app" :class="{ 'airport-closed': !$root.airport.open }">
    <div class="screen-too-small">
      <img src="/static/img/plane.jpg" alt="" class="logo">
      <h1>Airport</h1>
      <p>A game where you manage an airport.</p>
      <p class="text-faded">Rotate your phone to continue.</p>
    </div>
    <tutorial></tutorial>
    <main>
      <settings></settings>
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
      <atc />
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
import Settings from './components/settings'
import Atc from '@/components/atc'

export default {
  name: 'app',
  components: {
    Board,
    Plane,
    StatusBar,
    Store,
    Notifications,
    Tutorial,
    Settings,
    Atc
  },
  methods: {
    restart () {
      window.localStorage.removeItem('saveGame')
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  -ms-touch-action: manipulation;
  touch-action: manipulation;
}

body {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  background-color: #f3f6fb;
  text-align: center;
  font-size: 14px;
  line-height: 1.2;
  transition: background 2s;
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
  margin-bottom: 10px;
  font-weight: 600;
}

h4,
h5 {
  margin-bottom: 8px;
  font-weight: 600;
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
  font-weight: 600;
}

.text-faded {
  opacity: 0.33;
}

.error {
  color: hsl(340deg, 100%, 50%);
}

button,
a {
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
  text-decoration: none;
}

button + a,
a + button,
button + button,
a + a {
  margin-left: 10px;
  margin-bottom: 10px;
}

button:hover,
a:hover {
  background-color: black;
  color: white;
  fill: white;
}

button:active,
a:active {
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
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: #f3f6fb;
  transition: all 2s; */
}

.airport-closed main {
  /* background-color: #161718; */
}

.toggle {
  position: fixed;
  top: 15px;
  right: 15px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid black;
  z-index: 20;
  /* box-shadow: 0 5px 10px -3px rgba(0, 0, 0, .2); */
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

.logo {
  width: 40px;
  height: 40px;
  margin: 0 auto 20px;
  animation: logo 1s infinite alternate cubic-bezier(.6, 0, .4, 1);
}

@keyframes logo {
  from {
    transform: rotateZ(35deg);
  }
  to {
    transform: rotateZ(55deg);
  }
}

.row {
  display: flex;
}

.col {
  padding: 0 10px;
  flex: 1 1 auto;
}

@media (min-width: 600px) {
  .screen-too-small {
    display: none;
  }
}
</style>
