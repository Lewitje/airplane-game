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
  gate: false,
  runway: false,
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
  passengersPerTick: 4,
  staffed: false
}

const defaultRunway = {
  runwayNumber: 0
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  data: {
    mainTick: 50,
    player: {
      planes: [],
      gates: [],
      runways: [],
      cash: 0,
      scheduled: []
    },
    airport: {
      open: true,
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
    this.player.cash = 600000
    this.buyGate()

    setInterval(() => {
      this.tick()
    }, 500)

    bus.$on('buy-plane', this.buyPlane)
    bus.$on('buy-gate', this.buyGate)
    bus.$on('buy-runway', this.buyRunway)
    bus.$on('buy-schedule', this.buySchedule)
    bus.$on('request-takeoff', this.requestTakeoff)
    bus.$on('plane-landed', this.planeLanded)
  },
  methods: {
    tick () {
      this.updateDay()
      // this.checkTakeoffs()
      this.checkLandings()
      this.generateRandomLandings()
    },
    updateDay () {
      this.mainTick++
      if (this.mainTick === 120) {
        this.mainTick = 0

        // Terminal costs
        this.player.cash -= 7000
        bus.$emit('notification', 'Terminal costs -7000')

        // Gate costs
        let gateCost = this.player.gates.length * 2000
        this.player.cash -= gateCost
        bus.$emit('notification', `Gate costs ${this.player.gates.length} X 2000 (-${gateCost})`)

        // Grounded plane costs
        let groundedPlaneCosts = this.player.planes.length * 5000
        this.player.cash -= groundedPlaneCosts
        bus.$emit('notification', `Ground plane fine ${this.player.planes.length} X 5000 (-${groundedPlaneCosts})`)
      }

      if (this.mainTick === 80) {
        bus.$emit('notification', 'The airport is closing soon, make sure the gates are empty to avoid fines.')
      }

      // if (this.mainTick < 30 || this.mainTick > 100) {
      //   if (this.airport.open) {
      //     this.airport.open = false
      //     bus.$emit('notification', 'The airport has now closed. All remaining passengers will be unboarded, runways are closed. Boardings will resume when the airport opens in the morning.')
      //   }
      // } else {
      //   if (!this.airport.open) {
      //     this.airport.open = true
      //     bus.$emit('notification', 'The airport is now open. Boarding will begin shortly.')
      //   }
      // }
    },
    generateRandomLandings () {
      if (!this.airport.open) {
        return false
      }
      if (Math.random() < 0.9 && this.airport.landingQueue.length < 3) {
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
        if (!_.find(this.player.planes, { gate: gate.gateNumber }) && gate.staffed) {
          x = gate.gateNumber
        }
      })
      // console.log(x)
      return x
    },
    findFreeRunway () {
      let x = false
      this.player.runways.forEach((runway) => {
        console.log('checking runway ' + runway.runwayNumber)
        let plane = _.find(this.player.planes, { runway: runway.runwayNumber, landing: true })
        if (!plane) {
          console.log('Runway free ' + runway.runwayNumber, plane)
          x = runway.runwayNumber
        }
      })
      return x
    },
    buyGate () {
      if (this.player.gates.length >= 16 || this.player.cash < 50000) {
        return false
      }
      console.log('buying gate')
      this.player.cash -= 50000
      bus.$emit('notification', 'Purchased gate -50000')
      let gate = _.cloneDeep(defaultGate)
      gate.gateNumber = this.player.gates.length + 1
      this.player.gates.push(gate)
    },
    buyRunway () {
      if (this.player.runways.length >= 3 || this.player.cash < 100000) {
        return false
      }
      console.log('buying runway')
      this.player.cash -= 100000
      bus.$emit('notification', 'Purchased runway -100000')
      let runway = _.cloneDeep(defaultRunway)
      runway.runwayNumber = this.player.runways.length + 1
      this.player.runways.push(runway)
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
      if (!this.airport.takeoffQueue.length || !this.airport.open) {
        return false
      }

      if (this.findFreeRunway()) {
        let plane = _.find(this.player.planes, { id: this.airport.takeoffQueue[0], runway: false })
        if (plane) {
          plane.runway = this.findFreeRunway()
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
      } else if (!this.airport.open) {
        this.airport.landingQueue.forEach((item) => {
          console.log('airport closed queue item ', item)
          let i = _.findIndex(this.player.planes, { id: item })
          if (this.player.planes[i].landing) {
            bus.$emit('notification', 'Landing aborted due to closure, fine of -3000')
            this.player.cash += 3000
          }
          console.log('deleting', i)
          this.$delete(this.player.planes, i)
        })
        this.airport.landingQueue = []
      } else if (this.findFreeRunway() !== false) {
        let i = _.findIndex(this.player.planes, { id: this.airport.landingQueue[0], runway: false, landing: false })
        let plane = this.player.planes[i]
        if (plane) {
          let gate = this.findFreeGate()
          let runway = this.findFreeRunway()
          if (plane && gate & runway) {
            plane.gate = gate
            plane.runway = runway
            plane.landing = true
            plane.requestedLanding = false
            setTimeout(() => {
              plane.runway = false
              plane.landing = false
              let x = _.findIndex(this.airport.landingQueue, plane.id)
              this.$delete(this.airport.landingQueue, x)
            }, 4000)
          }
        }
      } else if (this.airport.landingTimer) {
        // this.airport.landingTimer++
        // if (this.airport.landingTimer >= this.config.landingTime) {
        //   this.airport.landingTimer = false
        //   this.airport.runwayInUse = false
        //   let plane = _.find(this.player.planes, { id: this.airport.landingQueue[0] })
        //   plane.landing = false
        //   this.airport.landingQueue.splice(0, 1)
        //   bus.$emit('notification', 'Runway usage (Landing) +1000')
        //   this.player.cash += 1000
        //   this.statistics.totalPlanesArrived++
        //   this.statistics.totalPassengersArrived += 200
        // }
      }
    },
    planeLanded (id) {
      let i = _.findIndex(this.airport.landingQueue, id)
      console.log('INDEX!!!', i)
      this.$delete(this.airport.landingQueue, i)
      bus.$emit('notification', 'Runway usage (Landing) +1000')
      this.$root.player.cash += 1000
      this.$root.statistics.totalPlanesArrived++
      this.$root.statistics.totalPassengersArrived += 200
    }
  }
})
