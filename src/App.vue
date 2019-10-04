<template>
  <div id="app">
    <main>
      <notifications></notifications>
      <board>
        <div v-for="plane in $root.player.planes" :key="plane.id">
          <plane :plane="plane"></plane>
        </div>
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

export default {
  name: 'app',
  components: {
    Board,
    Plane,
    StatusBar,
    Store,
    Notifications
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
  font-family: 'hind medium';
  text-align: center;
}

main {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
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
  box-shadow: 0 5px 10px -3px rgba(0, 0, 0, .5);
  cursor: pointer;
  line-height: 60px;
  font-size: 25px;
}

.open .toggle {
  background-color: black;
}
</style>
