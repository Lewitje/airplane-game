<template>
  <div>
    <div class="toggle toggle-help" @click="startTutorial">
      <eva-icon name="question-mark-outline"></eva-icon>
    </div>
    <div class="tutorial" v-if="visible">
      <div class="tutorial-card" v-if="step === 1">
        <img src="/static/img/plane.jpg" alt="" class="logo">
        <h2>Welcome to Airport</h2>
        <p>Buy gates &amp; runways, manage planes, stay out of debt.</p>
        <button @click="step = 2">Next - Expanding your airport</button>
      </div>

      <div class="tutorial-card" v-if="step === 2">
        <eva-icon name="shopping-cart-outline" :width="40" :height="40"></eva-icon>
        <h2>Expanding your aiport</h2>
        <p>On the bottom right use the shopping cart to buy items.</p>
        <button @click="step--">Back</button>
        <button @click="step = 3">Next - What's going on?</button>
      </div>

      <div class="tutorial-card" v-if="step === 3">
        <eva-icon name="bell-outline" :width="40" :height="40"></eva-icon>
        <h2>What's going on?</h2>
        <p>On the top right use the bell to view what's been happening.</p>
        <button @click="step--">Back</button>
        <button @click="step = 4">Next - Ssssshh!</button>
      </div>

      <div class="tutorial-card" v-if="step === 4">
        <eva-icon name="moon-outline" :width="40" :height="40"></eva-icon>
        <h2>Sssssshhh!</h2>
        <p>The airport closes at 22:00 and re-opens at 6:00. You'll be fined for each plane that's at a gate. All runways are closed.</p>
        <button @click="step--">Back</button>
        <button @click="step = 5">Next - Attention please!</button>
      </div>

      <div class="tutorial-card" v-if="step === 5">
        <eva-icon name="people-outline" :width="40" :height="40"></eva-icon>
        <h2>Attention please!</h2>
        <p>Gates need staff to accept planes and passengers.</p>
        <button @click="step--">Back</button>
        <button @click="step = 6">Next - Hurry up!</button>
      </div>

      <div class="tutorial-card" v-if="step === 6">
        <eva-icon name="arrow-forward-outline" :width="40" :height="40"></eva-icon>
        <h2>Hurry up!</h2>
        <p>Click on planes to hurry up passengers.</p>
        <button @click="step--">Back</button>
        <button @click="visible = false">Finish</button>
      </div>

      <button @click="visible = false">Close tutorial</button>
    </div>
  </div>
</template>

<script>
import { bus } from '@/main'
export default {
  name: 'tutorial',
  props: [ 'tutorial' ],
  components: {
    bus
  },
  data () {
    return {
      visible: false,
      step: 1
    }
  },
  created () {
  },
  methods: {
    startTutorial () {
      this.step = 1
      this.visible = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tutorial {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  backdrop-filter: blur(3px) brightness(.8);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.tutorial > button {
  margin-top: 20px;
}

.tutorial-card h2 {
  margin-bottom: 10px;
}

.tutorial-card p {
  margin-bottom: 20px;
}

.tutorial-card {
  width: 400px;
  padding: 30px;
  background-color: white;
  box-shadow: 0 20px 20px -5px rgba(0, 0, 0, .1);
  border-radius: 10px;
}

.tutorial-card > .eva-hover {
  margin-bottom: 10px;
}

.toggle-help {
  top: auto;
  bottom: 90px;
}
</style>
