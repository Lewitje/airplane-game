// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import _ from 'lodash'
import EvaIcons from 'vue-eva-icons'

Vue.use(EvaIcons)

export const bus = new Vue()

const defaultPlane = {
  id: 0,
  fuelled: false,
  boarded: 0,
  unboarding: false,
  requestedLanding: false,
  requestedTakeoff: false,
  takingOff: false,
  landing: false,
  atGate: true,
  schedule: null,
  passengerCapacity: 200,
  gate: null,
  position: {
    x: 0,
    y: 10
  }
}

const defaultSchedule = {
  requiresFuel: false,
  passengers: 200
}

const defaultGate = {
  gateNumber: 0,
  passengersPerTick: 1,
  position: {
    x: 0,
    y: 0
  }
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  data: {
    mainTick: 0,
    player: {
      planes: [],
      gates: [],
      cash: 0,
      scheduled: []
    },
    airport: {
      takeoffQueue: [],
      landingQueue: [],
      runwayInUse: false,
      takeoffTimer: false,
      landingTimer: false
    },
    config: {
      landingTime: 4
    },
    statistics: {
      totalPlanesArrived: 0,
      totalPlanesDeparted: 0,
      totalPassengersArrived: 0,
      totalPassengersDeparted: 0
    }
  },
  created () {
    this.player.cash = 5000000
    this.buyGate()

    setInterval(() => {
      this.tick()
    }, 1000)

    bus.$on('buy-plane', this.buyPlane)
    bus.$on('buy-gate', this.buyGate)
    bus.$on('buy-schedule', this.buySchedule)
    bus.$on('request-takeoff', this.requestTakeoff)
  },
  methods: {
    tick () {
      this.updateDay()
      this.checkTakeoffs()
      this.checkLandings()
      this.generateRandomLandings()
    },
    updateDay () {
      this.mainTick++
      if (this.mainTick === 120) {
        this.mainTick = 0
        this.player.cash -= 5000
        bus.$emit('notification', 'Daily costs -5000')
      }
    },
    generateRandomLandings () {
      if (Math.random() < 0.2 && this.airport.landingQueue.length < 3) {
        let plane = _.cloneDeep(defaultPlane)
        plane.landing = false
        plane.requestedLanding = true
        plane.unboarding = true
        plane.boarded = 200
        plane.id = parseInt(Math.random() * 100 * Math.random() / Math.random() * Math.random() * Math.random() * 1000000)
        this.airport.landingQueue.push(plane.id)
        this.player.planes.push(plane)
      }
    },
    findFreeGate () {
      let x = false
      this.player.gates.forEach((gate) => {
        if (!_.find(this.player.planes, { gate: gate.gateNumber })) {
          x = gate.gateNumber
        }
      })
      console.log(x)
      return x
    },
    buyGate () {
      if (this.player.gates.length >= 8 || this.player.cash < 50000) {
        return false
      }
      console.log('buying gate')
      this.player.cash -= 50000
      bus.$emit('notification', 'Purchased gate -50000')
      let gate = _.cloneDeep(defaultGate)
      gate.gateNumber = this.player.gates.length + 1
      this.player.gates.push(gate)
    },
    buyPlane () {
      if (this.player.planes.length >= this.player.gates.length || this.player.cash < 10000) {
        return false
      }
      this.player.cash -= 10000
      bus.$emit('notification', 'Purchased plane -10000')
      let plane = _.cloneDeep(defaultPlane)
      plane.gate = this.findFreeGate()
      plane.id = parseInt(Math.random() * 100 * Math.random() / Math.random() * Math.random() * Math.random() * 1000000)
      this.player.planes.push(plane)
    },
    buySchedule () {
      this.player.scheduled.push(defaultSchedule)
    },
    requestTakeoff (plane) {
      this.airport.takeoffQueue.push(plane.id)
    },
    checkTakeoffs () {
      if (!this.airport.takeoffQueue.length) {
        return false
      }

      if (!this.airport.runwayInUse) {
        let plane = _.find(this.player.planes, { id: this.airport.takeoffQueue[0] })
        if (plane) {
          plane.takingOff = true
          this.airport.runwayInUse = true
          this.airport.takeoffTimer = 1
        }
      } else if (this.airport.takeoffTimer) {
        this.airport.takeoffTimer++

        if (this.airport.takeoffTimer >= this.config.landingTime) {
          this.airport.takeoffTimer = false
          this.airport.runwayInUse = false
          let i = _.findIndex(this.player.planes, { id: this.airport.takeoffQueue[0] })
          this.$delete(this.player.planes, i)
          this.airport.takeoffQueue.splice(0, 1)
          bus.$emit('notification', 'Runway usage (Takeoff) +1000')
          this.player.cash += 1000
          this.statistics.totalPlanesDeparted++
          this.statistics.totalPassengersDeparted += 200
        }
      }
    },
    checkLandings () {
      if (!this.airport.landingQueue.length) {
        return false
      }

      if (!this.airport.runwayInUse) {
        let plane = _.find(this.player.planes, { id: this.airport.landingQueue[0] })
        console.log('trying to land', plane, this.findFreeGate())
        if (plane && this.findFreeGate()) {
          plane.gate = this.findFreeGate()
          plane.requestedLanding = false
          plane.landing = true
          this.airport.runwayInUse = true
          this.airport.landingTimer = 1
        }
      } else if (this.airport.landingTimer) {
        this.airport.landingTimer++
        if (this.airport.landingTimer >= this.config.landingTime) {
          this.airport.landingTimer = false
          this.airport.runwayInUse = false
          let plane = _.find(this.player.planes, { id: this.airport.landingQueue[0] })
          plane.landing = false
          this.airport.landingQueue.splice(0, 1)
          bus.$emit('notification', 'Runway usage (Landing) +1000')
          this.player.cash += 1000
          this.statistics.totalPlanesArrived++
          this.statistics.totalPassengersArrived += 200
        }
      }
    }
  }
})
