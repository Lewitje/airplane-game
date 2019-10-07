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
  flightNumber: null,
  fuelled: false,
  boarded: 0,
  unboarding: false,
  requestedLanding: false,
  requestedTakeoff: false,
  takingOff: false,
  landing: false,
  atGate: false,
  schedule: null,
  passengerCapacity: 200,
  gateNumber: false,
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
  staffed: false,
  permanentlyStaffed: false,
  autoApproveTakeoff: false
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
    gameTimer: null,
    gameOver: false,
    mainTick: 120,
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
      runwayInUse: false,
      takeoffTimer: false,
      landingTimer: false
    },
    config: {
      landingTime: 4,
      tickSpeed: 1000,
      gameSpeed: 1,
      skipNight: true,
      sandboxMode: false,
      lastLandingSlot: 200
    },
    statistics: {
      totalPlanesArrived: 0,
      totalPlanesDeparted: 0,
      totalPassengersArrived: 0,
      totalPassengersDeparted: 0,
      cashHistory: []
    }
  },
  created () {
    this.player.cash = 310050
    // this.buyGate()
    // this.buyRunway()
    this.load()
    this.play()

    bus.$on('buy-plane', this.buyPlane)
    bus.$on('buy-gate', this.buyGate)
    bus.$on('buy-runway', this.buyRunway)
    bus.$on('buy-schedule', this.buySchedule)
    bus.$on('request-takeoff', this.requestTakeoff)
    bus.$on('plane-landed', this.planeLanded)
    bus.$on('staff-gate', this.staffGate)
  },
  methods: {
    save () {
      let game = JSON.stringify(this.$data)
      window.localStorage.setItem('saveGame', game)
      bus.$emit('important', 'Game autosaved.')
    },
    load () {
      let game = window.localStorage.getItem('saveGame')
      if (game) {
        let o = JSON.parse(game)
        for (var key in o) {
          this[key] = o[key]
        }
      }
    },
    play () {
      this.gameTimer = setInterval(() => {
        this.tick()
      }, this.config.tickSpeed / this.config.gameSpeed)
    },
    pause () {
      clearInterval(this.gameTimer)
    },
    tick () {
      this.statistics.cashHistory.unshift(this.player.cash)
      this.updateDay()
      this.checkLandings()
      this.checkTakeoffs()
      this.generateRandomLandings()
      bus.$emit('tick')
    },
    updateDay () {
      this.mainTick++
      if (this.mainTick === 240) {
        this.mainTick = 0

        // Terminal costs
        this.player.cash -= 7000
        bus.$emit('notification', 'Terminal costs -7000')

        // Gate costs
        let gateCost = this.player.gates.length * 2000
        this.player.cash -= gateCost
        bus.$emit('notification', `Gate costs ${this.player.gates.length} X 2000 (-${gateCost})`)

        // Grounded plane costs
        let groundedPlaneCosts = _.filter(this.player.planes, { atGate: true }).length * 2000
        this.player.cash -= groundedPlaneCosts
        bus.$emit('notification', `Ground plane fine ${this.player.planes.length} X 2000 (-${groundedPlaneCosts})`)

        this.save()
      }

      if (this.config.lastLandingSlot === this.mainTick) {
        bus.$emit('important', 'Arrivals closed. Departures are still open.')
      }

      if (this.mainTick === 200) {
        bus.$emit('important', 'The airport is closing soon, make sure the gates are empty to avoid fines.')
      }

      if (this.mainTick <= 60 || this.mainTick >= 220) {
        if (this.airport.open) {
          this.airport.open = false
          document.body.style.background = '#161718'
          if (this.config.skipNight) {
            this.pause()
            this.config.gameSpeed = 12
            this.play()
          }
          bus.$emit('important', 'The airport has now closed. All remaining passengers will be unboarded, runways are closed. Boardings will resume when the airport opens in the morning.')
        }
      } else {
        if (!this.airport.open) {
          this.airport.open = true
          document.body.style.background = '#f3f6fb'
          this.pause()
          this.config.gameSpeed = 1
          this.play()
          bus.$emit('important', 'The airport is now open. Boarding will begin shortly.')
        }
      }
    },
    generateRandomLandings () {
      if (!this.airport.open || this.mainTick > this.config.lastLandingSlot) {
        return false
      }
      if (Math.random() < 0.3 && this.getAllPlanesInLandingQueue().length < this.player.gates.length) {
        let plane = _.cloneDeep(defaultPlane)
        plane.landing = false
        plane.flightNumber = this.generateFlightNumber()
        plane.requestedLanding = true
        plane.unboarding = true
        plane.boarded = 200
        plane.id = parseInt(Math.random() * 100 * Math.random() / Math.random() * Math.random() * Math.random() * 1000000)
        this.player.planes.push(plane)
        bus.$emit('atc', 'Landing requested', plane.flightNumber, false)
      }
    },
    findFreeGate () {
      let x = false
      let gatesList = []
      this.player.gates.forEach((gate) => {
        if (!_.find(this.player.planes, { gateNumber: gate.gateNumber }) && gate.staffed) {
          gatesList.push(gate.gateNumber)
        }
      })
      console.log({gatesList})
      if (gatesList.length) {
        x = gatesList[Math.floor(Math.random() * gatesList.length)]
      }
      return x
    },
    findFreeRunway () {
      let x = false
      let runwaysList = []
      this.player.runways.forEach((runway) => {
        console.log('checking runway ' + runway.runwayNumber)
        let planes = _.filter(this.player.planes, { runway: runway.runwayNumber })
        if (!planes.length) {
          console.log('Runway free ' + runway.runwayNumber, planes)
          runwaysList.push(runway.runwayNumber)
        }
      })
      if (runwaysList.length) {
        x = runwaysList[Math.floor(Math.random() * runwaysList.length)]
      }
      return x
    },
    buyGate () {
      if (this.player.gates.length >= 16 || this.player.cash < 50000) {
        return false
      }
      console.log('buying gate')
      this.player.cash -= 50000
      bus.$emit('important', 'Purchased gate -50000')
      let gate = _.cloneDeep(defaultGate)
      gate.gateNumber = this.player.gates.length + 1
      this.player.gates.push(gate)
    },
    buyRunway () {
      if (this.player.runways.length >= 5 || this.player.cash < 250000) {
        return false
      }
      console.log('buying runway')
      this.player.cash -= 250000
      bus.$emit('important', 'Purchased runway -250000')
      let runway = _.cloneDeep(defaultRunway)
      runway.runwayNumber = this.player.runways.length + 1
      this.player.runways.push(runway)
    },
    buyPlane () {
      if (this.player.planes.length >= this.player.gates.length || this.player.cash < 10000) {
        return false
      }
      this.player.cash -= 10000
      bus.$emit('important', 'Purchased plane -10000')
      let plane = _.cloneDeep(defaultPlane)
      plane.gateNumber = this.findFreeGate()
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
      if (!this.airport.open) {
        return false
      }

      // let queue = this.getAllPlanesInLandingQueue()

      if (this.findFreeRunway()) {
        let plane = _.find(this.player.planes, { requestedTakeoff: true })
        if (plane) {
          this.unstaffGate(plane.gateNumber)
          plane.requestedTakeoff = false
          plane.atGate = false
          plane.gateNumber = false
          plane.runway = this.findFreeRunway()
          plane.takingOff = true
          bus.$emit('atc', `Takeoff approved. Use runway ${plane.runway}`, plane.flightNumber, true)
          // Plane takeoff timer
          setTimeout(() => {
            let i = _.findIndex(this.player.planes, { id: plane.id })
            this.$delete(this.player.planes, i)
            bus.$emit('notification', 'Runway usage (Takeoff) +1500')
            this.player.cash += 1500
            this.statistics.totalPlanesDeparted++
            this.statistics.totalPassengersDeparted += 200
          }, 3500)
        }
      }
    },
    checkLandings () {
      if (!this.airport.open || this.mainTick > this.config.lastLandingSlot) {
        // REMOVE ALL PLANES IN QUEUE WHEN CLOSED
        let planesToLand = _.filter(this.player.planes, { requestedLanding: true })
        planesToLand.forEach((plane) => {
          bus.$emit('atc', 'Landing denied', plane.flightNumber, true)
          let i = _.findIndex(this.player.planes, {id: plane.id})
          this.$delete(this.player.planes, i)
        })
        console.log('Planes trying to land', planesToLand.length)
      } else if (this.findFreeRunway() !== false) {
        let planes = this.getAllPlanesInLandingQueue()
        if (planes.length) {
          console.log('Planes waiting to land', planes.length)
          let plane = _.find(this.player.planes, { id: planes[0].id })
          let gate = this.findFreeGate()
          let runway = this.findFreeRunway()
          if (plane && !plane.runway && gate && runway) {
            console.log('free gate + runway for landing', gate, runway, plane)
            plane.gateNumber = gate
            plane.runway = runway
            plane.requestedLanding = false
            plane.landing = true
            bus.$emit('atc', `Landing approved. Use runway ${plane.runway} and gate ${plane.gateNumber}`, plane.flightNumber, true)
            setTimeout(() => {
              plane.runway = false
              plane.landing = false
              plane.atGate = true
              bus.$emit('notification', 'Runway usage (Landing) +1500')
              this.player.cash += 1500
              this.statistics.totalPlanesArrived++
              this.statistics.totalPassengersArrived += 200
            }, 3500)
          }
        }
      }
    },
    planeLanded (id) {
      // let i = _.findIndex(this.airport.landingQueue, id)
      // console.log('INDEX!!!', i)
      // this.$delete(this.airport.landingQueue, i)
      bus.$emit('notification', 'Runway usage (Landing) +1000')
      this.$root.player.cash += 1000
      this.$root.statistics.totalPlanesArrived++
      this.$root.statistics.totalPassengersArrived += 200
    },
    getPlaneInLandingQueue () {
      return _.find(this.player.planes, { requestedLanding: true, runway: false, landing: false, atGate: false })
    },
    getAllPlanesInLandingQueue () {
      return _.filter(this.player.planes, { requestedLanding: true, runway: false, landing: false, atGate: false })
    },
    unstaffGate (x) {
      let gate = _.find(this.player.gates, {gateNumber: x})
      if (gate && !gate.permanentlyStaffed) {
        gate.staffed = false
      }
    },
    staffGate (x) {
      let gate = _.find(this.player.gates, {gateNumber: x})
      gate.staffed = true
      let price = gate.passengersPerTick * 100
      this.player.cash -= price
      bus.$emit('notification', `Staff costs -${price}`)
    },
    generateFlightNumber () {
      let r = Math.random().toString(36).substring(7).toUpperCase()
      return `AIR${r}`
    }
  },
  watch: {
    'config.sandboxMode' () {
      if (this.config.sandboxMode) {
        this.player.cash = 100000000
      }
    },
    'player.cash' (to, from) {
      if (this.player.cash <= 0) {
        this.gameOver = true
        this.pause()
      }

      if (this.player.cash < 10000 && from > 10000) {
        bus.$emit('important', 'Your cash is getting low!')
      }
    },
    'statistics.totalPlanesDeparted' () {
      let prize = 10000
      if (this.statistics.totalPlanesDeparted === 5) {
        bus.$emit('achievement', `5 planes departed (+${prize})!`)
        this.player.cash += prize
      } else if (this.statistics.totalPlanesDeparted === 50) {
        bus.$emit('achievement', `50 planes departed (+${prize})!`)
        this.player.cash += prize
      } else if (this.statistics.totalPlanesDeparted === 500) {
        bus.$emit('achievement', `500 planes departed (+${prize})!`)
        this.player.cash += prize
      } else if (this.statistics.totalPlanesDeparted === 500) {
        bus.$emit('achievement', `500 planes departed (+${prize})!`)
        this.player.cash += prize
      } else if (this.statistics.totalPlanesDeparted === 1000) {
        bus.$emit('achievement', `1000 planes departed (+${prize})!`)
        this.player.cash += prize
      }
    }
  }
})
