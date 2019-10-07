<template>
  <div :class="{ open: showMenu }">
    <div class="settings-toggle toggle" @click="showMenu = !showMenu" title="Open store">
      <eva-icon name="toggle-right-outline"></eva-icon>
    </div>
    <div class="settings" v-if="showMenu">
      <div class="settings-inner">
        <h2>Settings</h2>
        <label class="checkbox">
          <input type="checkbox" v-model="$root.config.skipNight">
          <span>Skip through night</span>
          <p>Super speed through the night.</p>
        </label>
        <label class="checkbox" :class="{ disabled: $root.config.sandboxMode }">
          <input type="checkbox" v-model="$root.config.sandboxMode">
          <span>Sandbox mode</span>
          <p>Lots of money (Cannot be undone).</p>
        </label>
        <label class="range" :class="{ disabled: $root.config.sandboxMode }">
          <span class="title">Last landing time</span>
          <div class="range-bar">
            <div class="range-btn"
                @click="$root.config.lastLandingSlot -= 10"
                :class="{ disabled: $root.config.lastLandingSlot === 180 }">
              <eva-icon name="minus-outline"></eva-icon>
            </div>
            <div class="range-value">
              {{ $root.config.lastLandingSlot / 10 }}:00
            </div>
            <div class="range-btn"
                @click="$root.config.lastLandingSlot += 10"
                :class="{ disabled: $root.config.lastLandingSlot === 220 }">
              <eva-icon name="plus-outline"></eva-icon>
            </div>
          </div>
          <!-- <input type="range" min="180" max="220" step="10" v-model=""> -->
          <!-- <span class="value"></span><br/> -->
          <span><b>{{ (220 - $root.config.lastLandingSlot) / 10 }} hours</b> before closure</span><br/>
          <p>No planes may land after this time. (helps with automated gates &amp; fines)</p>
        </label>
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.settings {
  position: fixed;
  bottom: 15px;
  right: 90px;
  width: 350px;
  z-index: 20;
}

.settings-inner {
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 5px 10px -3px rgba(0, 0, 0, .5);
  max-height: 70vh;
  overflow-y: auto;
  text-align: left;
}

.settings-toggle {
  top: auto;
  bottom: 165px;
}

.checkbox,
.range {
  position: relative;
  display: block;
  padding: 8px 10px 8px 30px;
  background-color: rgba(0, 0, 0, .05);
  border-radius: 4px;
  margin-top: 5px;
  cursor: pointer;
}

.checkbox:hover {
  background-color: rgba(0, 0, 0, .1);
}

.checkbox:active {
  background-color: rgba(0, 0, 0, .2);
}

.checkbox input {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  opacity: 0;
}

.checkbox p,
.range p {
  opacity: .66;
}

.checkbox span,
.range .title {
  position: relative;
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
}

.checkbox span:before {
  position: absolute;
  top: 0;
  left: -20px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  content: '';
  border: 2px solid rgba(0, 0, 0, .5);
  background-color: hsl(330deg, 100%, 50%);
}

.checkbox input:checked + span:before {
  background-color: hsl(150deg, 100%, 50%);
}

.checkbox.disabled {
  pointer-events: none;
  background-color: rgba(0, 0, 0, .05);
  color: rgba(0, 0, 0, .2);
}

.range .value {
  padding: 0 5px;
}

.range span {
  margin-bottom: 3px;
  display: inline-block;
}

.range-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.range-btn,
.range-value {
  flex: 1 1 auto;
  height: 40px;
  border-radius: 4px;
  background-color: white;
  line-height: 36px;
  font-size: 24px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.range-btn {
  flex: 0 0 40px;
  border: 2px solid black;
}

.range-btn:hover {
  background-color: hsl(0deg, 0%, 90%);
}

.range-btn:active {
  background-color: hsl(0deg, 0%, 80%);
}

.range-btn.disabled {
  opacity: .5;
  pointer-events: none;
}

.range .eva-hover {
  height: 28px;
  width: 24px;
}

.range-value {
  margin: 0 5px;
}
</style>
