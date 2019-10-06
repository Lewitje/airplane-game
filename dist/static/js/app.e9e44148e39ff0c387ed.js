webpackJsonp([0],[,function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),a.d(e,"bus",function(){return u});var n=a(12),s=a(16),i=a(3),r=a.n(i),o=a(42),l=a.n(o);n.a.use(l.a);var u=new n.a,c={id:0,fuelled:!1,boarded:0,unboarding:!1,requestedLanding:!1,requestedTakeoff:!1,takingOff:!1,landing:!1,atGate:!1,schedule:null,passengerCapacity:200,gate:!1,runway:!1,position:{x:0,y:10}},f={requiresFuel:!1,passengers:200},d={gateNumber:0,passengersPerTick:4,staffed:!1,permanentlyStaffed:!1,autoApproveTakeoff:!1},h={runwayNumber:0};n.a.config.productionTip=!1,new n.a({el:"#app",template:"<App/>",components:{App:s.a},data:{gameTimer:null,gameOver:!1,mainTick:120,player:{planes:[],gates:[],runways:[],cash:0,scheduled:[]},airport:{open:!0,takeoffQueue:[],runwayInUse:!1,takeoffTimer:!1,landingTimer:!1},config:{landingTime:4,tickSpeed:1e3,gameSpeed:1},statistics:{totalPlanesArrived:0,totalPlanesDeparted:0,totalPassengersArrived:0,totalPassengersDeparted:0,cashHistory:[]}},created:function(){this.player.cash=155e5,this.play(),u.$on("buy-plane",this.buyPlane),u.$on("buy-gate",this.buyGate),u.$on("buy-runway",this.buyRunway),u.$on("buy-schedule",this.buySchedule),u.$on("request-takeoff",this.requestTakeoff),u.$on("plane-landed",this.planeLanded),u.$on("staff-gate",this.staffGate)},methods:{play:function(){var t=this;this.gameTimer=setInterval(function(){t.tick()},this.config.tickSpeed/this.config.gameSpeed)},pause:function(){clearInterval(this.gameTimer)},tick:function(){this.statistics.cashHistory.unshift(this.player.cash),this.updateDay(),this.checkLandings(),this.checkTakeoffs(),this.generateRandomLandings()},updateDay:function(){if(240===++this.mainTick){this.mainTick=0,this.player.cash-=7e3,u.$emit("notification","Terminal costs -7000");var t=2e3*this.player.gates.length;this.player.cash-=t,u.$emit("notification","Gate costs "+this.player.gates.length+" X 2000 (-"+t+")");var e=2e3*r.a.filter(this.player.planes,{atGate:!0}).length;this.player.cash-=e,u.$emit("notification","Ground plane fine "+this.player.planes.length+" X 2000 (-"+e+")")}200===this.mainTick&&u.$emit("notification","The airport is closing soon, make sure the gates are empty to avoid fines."),this.mainTick<=60||this.mainTick>=220?this.airport.open&&(this.airport.open=!1,u.$emit("notification","The airport has now closed. All remaining passengers will be unboarded, runways are closed. Boardings will resume when the airport opens in the morning.")):this.airport.open||(this.airport.open=!0,u.$emit("notification","The airport is now open. Boarding will begin shortly."))},generateRandomLandings:function(){if(!this.airport.open)return!1;if(Math.random()<.9&&this.getAllPlanesInLandingQueue().length<this.player.gates.length){var t=r.a.cloneDeep(c);t.landing=!1,t.requestedLanding=!0,t.unboarding=!0,t.boarded=200,t.id=parseInt(100*Math.random()*Math.random()/Math.random()*Math.random()*Math.random()*1e6),this.player.planes.push(t)}},findFreeGate:function(){var t=this,e=!1;return this.player.gates.forEach(function(a){!r.a.find(t.player.planes,{gate:a.gateNumber})&&a.staffed&&(e=a.gateNumber)}),e},findFreeRunway:function(){var t=this,e=!1;return this.player.runways.forEach(function(a){console.log("checking runway "+a.runwayNumber);var n=r.a.filter(t.player.planes,{runway:a.runwayNumber});n.length||(console.log("Runway free "+a.runwayNumber,n),e=a.runwayNumber)}),e},buyGate:function(){if(this.player.gates.length>=22||this.player.cash<5e4)return!1;console.log("buying gate"),this.player.cash-=5e4,u.$emit("notification","Purchased gate -50000");var t=r.a.cloneDeep(d);t.gateNumber=this.player.gates.length+1,this.player.gates.push(t)},buyRunway:function(){if(this.player.runways.length>=6||this.player.cash<1e5)return!1;console.log("buying runway"),this.player.cash-=1e5,u.$emit("notification","Purchased runway -100000");var t=r.a.cloneDeep(h);t.runwayNumber=this.player.runways.length+1,this.player.runways.push(t)},buyPlane:function(){if(this.player.planes.length>=this.player.gates.length||this.player.cash<1e4)return!1;this.player.cash-=1e4,u.$emit("notification","Purchased plane -10000");var t=r.a.cloneDeep(c);t.gate=this.findFreeGate(),t.id=parseInt(100*Math.random()*Math.random()/Math.random()*Math.random()*Math.random()*1e6),this.player.planes.push(t)},buySchedule:function(){this.player.scheduled.push(f)},requestTakeoff:function(t){this.airport.takeoffQueue.push(t.id)},checkTakeoffs:function(){var t=this;if(!this.airport.open)return!1;if(this.findFreeRunway()){var e=r.a.find(this.player.planes,{requestedTakeoff:!0});e&&(this.unstaffGate(e.gate),e.requestedTakeoff=!1,e.atGate=!1,e.gate=!1,e.runway=this.findFreeRunway(),e.takingOff=!0,setTimeout(function(){var a=r.a.findIndex(t.player.planes,{id:e.id});t.$delete(t.player.planes,a),u.$emit("notification","Runway usage (Takeoff) +1500"),t.player.cash+=1500,t.statistics.totalPlanesDeparted++,t.statistics.totalPassengersDeparted+=200},3500))}},checkLandings:function(){var t=this;if(this.airport.open){if(!1!==this.findFreeRunway()){var e=this.getAllPlanesInLandingQueue();if(e.length){console.log("Planes waiting to land",e.length);var a=r.a.find(this.player.planes,{id:e[0].id}),n=this.findFreeGate(),s=this.findFreeRunway();a&&!a.runway&&n&&s&&(console.log("free gate + runway for landing",n,s,a),a.gate=n,a.runway=s,a.requestedLanding=!1,a.landing=!0,setTimeout(function(){a.runway=!1,a.landing=!1,a.atGate=!0,u.$emit("notification","Runway usage (Landing) +1500"),t.player.cash+=1500,t.statistics.totalPlanesArrived++,t.statistics.totalPassengersArrived+=200},3500))}}}else{var i=r.a.filter(this.player.planes,{requestedLanding:!0});i.forEach(function(e){var a=r.a.findIndex(t.player.planes,{id:e.id});t.$delete(t.player.planes,a)}),console.log("Planes trying to land",i.length)}},planeLanded:function(t){u.$emit("notification","Runway usage (Landing) +1000"),this.$root.player.cash+=1e3,this.$root.statistics.totalPlanesArrived++,this.$root.statistics.totalPassengersArrived+=200},getPlaneInLandingQueue:function(){return r.a.find(this.player.planes,{requestedLanding:!0,runway:!1,landing:!1,atGate:!1})},getAllPlanesInLandingQueue:function(){return r.a.filter(this.player.planes,{requestedLanding:!0,runway:!1,landing:!1,atGate:!1})},unstaffGate:function(t){var e=r.a.find(this.player.gates,{gateNumber:t});e&&!e.permanentlyStaffed&&(e.staffed=!1)},staffGate:function(t){var e=r.a.find(this.player.gates,{gateNumber:t});e.staffed=!0;var a=100*e.passengersPerTick;this.player.cash-=a,u.$emit("notification","Staff costs -"+a)}},watch:{"player.cash":function(t,e){this.player.cash<=0&&(this.gameOver=!0,this.pause()),this.player.cash<1e4&&e>1e4&&u.$emit("error","Your cash is getting low!")}}})},,,function(t,e,a){"use strict";var n=a(19),s=a(25),i=a(29),r=a(32),o=a(35),l=a(38);e.a={name:"app",components:{Board:n.a,Plane:s.a,StatusBar:i.a,Store:r.a,Notifications:o.a,Tutorial:l.a},methods:{restart:function(){location.reload()}}}},function(t,e,a){"use strict";var n=a(21),s=a(1);e.a={name:"board",components:{Gate:n.a,bus:s.bus},data:function(){return{}},methods:{dispatchAllPlanes:function(){s.bus.$emit("dispatch-all-planes")},staffAllGates:function(){s.bus.$emit("staff-all-gates")}}}},function(t,e,a){"use strict";var n=a(1);e.a={name:"gate",props:["gate"],components:{bus:n.bus},data:function(){return{showMenu:!1}},created:function(){var t=this;n.bus.$on("staff-all-gates",function(){t.staffGate()})},computed:{getXPosition:function(){var t=6*this.gate.gateNumber+"%";return this.gate.gateNumber>11&&(t=6*(this.gate.gateNumber-11)+"%"),t},getYPosition:function(){var t="19%";return this.gate.gateNumber>11&&(t="61%"),t}},methods:{upgrade:function(){var t=2*this.gate.passengersPerTick*500;this.gate.passengersPerTick=2*this.gate.passengersPerTick,this.$root.player.cash-=t,n.bus.$emit("notification","Upgraded gate -"+t)},staffGate:function(){if(!this.$root.airport.open||this.gate.staffed)return!1;n.bus.$emit("staff-gate",this.gate.gateNumber)},addPermanentStaff:function(){this.gate.permanentlyStaffed=!0;this.$root.player.cash-=1e4,n.bus.$emit("notification","Upgraded gate -"+1e4)},autoApproveTakeoff:function(){this.gate.autoApproveTakeoff=!0;this.$root.player.cash-=1e4,n.bus.$emit("notification","Upgraded gate -"+1e4)}}}},function(t,e,a){"use strict";var n=a(1),s=a(3),i=a.n(s);e.a={name:"plane",props:["plane"],components:{bus:n.bus},data:function(){return{gate:null,readyForTakeoff:!1,isBottomRow:!1}},mounted:function(){var t=this;this.plane.fuelled=!0,setInterval(function(){t.tick()},250),n.bus.$on("dispatch-all-planes",function(){t.requestTakeoff()})},computed:{planePositionX:function(){return this.plane.requestedLanding?"150%":this.plane.takingOff||this.plane.landing?72+4*this.plane.runway+"%":this.gate&&this.gate.gateNumber>11?1+6*(this.plane.gate-11)+"%":1+6*this.plane.gate+"%"},planePositionY:function(){return this.plane.landing||this.plane.takingOff?"12%":this.gate&&this.gate.gateNumber>11?"62%":"20%"}},methods:{tick:function(){if(this.plane.takingOff||this.plane.requestedTakeoff||this.plane.landing||this.plane.requestedLanding||this.readyForTakeoff)return!1;this.plane.unboarding?this.unboardPassenger():this.plane.fuelled&&this.plane.boarded>=this.plane.passengerCapacity?(this.readyForTakeoff=!0,this.gate&&this.gate.autoApproveTakeoff&&this.requestTakeoff()):this.boardPassenger()},requestTakeoff:function(){if(!this.readyForTakeoff)return!1;this.readyForTakeoff=!1,n.bus.$emit("notification","Passenger departures terminal costs ("+this.plane.passengerCapacity+" X 15) +"+15*this.plane.passengerCapacity),n.bus.$emit("request-takeoff",this.plane),this.plane.requestedTakeoff=!0},boardPassenger:function(t){if(!this.$root.airport.open||this.plane.takingOff||this.plane.requestedTakeoff||this.plane.landing||this.plane.requestedLanding||this.readyForTakeoff)return!1;var e=this.gate?this.gate.passengersPerTick:1;isNaN(t)||(e=t),this.plane.boarded<this.plane.passengerCapacity&&(this.$root.player.cash+=15*e,this.plane.boarded=Math.min(this.plane.passengerCapacity,this.plane.boarded+e))},unboardPassenger:function(t){if(this.plane.takingOff||this.plane.requestedTakeoff||this.plane.landing||this.plane.requestedLanding||this.readyForTakeoff)return!1;var e=this.gate?this.gate.passengersPerTick:1;isNaN(t)||(e=t),this.plane.boarded>0?(this.$root.player.cash+=15*e,this.plane.boarded=Math.max(0,this.plane.boarded-e)):(n.bus.$emit("notification","Passenger arrivals terminal costs ("+this.plane.passengerCapacity+" X 15) +"+15*this.plane.passengerCapacity),this.plane.unboarding=!1)},bump:function(){this.plane.unboarding?this.unboardPassenger(6):this.boardPassenger(6)},cheat:function(){this.plane.unboarding?this.unboardPassenger(30):this.boardPassenger(30)}},watch:{"plane.gate":function(){var t=this.plane.gate;t&&(this.gate=i.a.find(this.$root.player.gates,{gateNumber:t}),this.gate.gateNumber>11&&(this.isBottomRow=!0))}}}},function(t,e,a){"use strict";var n=a(3),s=a.n(n);e.a={name:"status-bar",data:function(){return{showCashflow:!1}},mounted:function(){},computed:{getTimeWidth:function(){return Math.ceil(this.$root.mainTick/240*100)+"%"},planesOnGround:function(){var t=s.a.filter(this.$root.player.planes,{requestedLanding:!1});return t=t?t.length:0},getCash:function(){return this.formatCash(this.$root.player.cash)},getLandings:function(){var t=s.a.filter(this.$root.player.planes,{requestedLanding:!0});return t=t?t.length:0},getTakeoffs:function(){var t=s.a.filter(this.$root.player.planes,{requestedTakeoff:!0});return t=t?t.length:0},historyGraph:function(){return this.$root.statistics.cashHistory.slice(0,200).reverse()},getMaxCashflow:function(){return!!this.showCashflow&&s.a.max(this.historyGraph)}},methods:{getHistoryHeight:function(t){return"height: "+t/this.getMaxCashflow*100+"%"},setGameSpeed:function(t){this.$root.pause(),this.$root.config.gameSpeed=t,0!==t&&this.$root.play()},formatCash:function(t){return parseFloat(t).toFixed(2).replace(/\d(?=(\d{3})+\.)/g,"$&,")}}}},function(t,e,a){"use strict";var n=a(1);e.a={name:"store",components:{bus:n.bus},data:function(){return{showMenu:!1}},created:function(){},methods:{buyPlane:function(){n.bus.$emit("buy-plane")},buySchedule:function(){n.bus.$emit("buy-schedule")},buyGate:function(){n.bus.$emit("buy-gate")},buyRunway:function(){n.bus.$emit("buy-runway")}}}},function(t,e,a){"use strict";var n=a(1),s=a(3),i=a.n(s);e.a={name:"notifications",components:{bus:n.bus},data:function(){return{showMenu:!1,notifications:[],history:[]}},created:function(){var t=this;n.bus.$on("notification",function(e){t.createNotification(e,"NORMAL")}),n.bus.$on("error",function(e){t.createNotification(e,"ERROR")})},computed:{},methods:{createNotification:function(t,e){var a=this,n={content:t,id:Math.random()*Math.random()*1e4/Math.random()*Math.random(),type:e};this.history.unshift(n),this.notifications.unshift(n),setTimeout(function(){var t=i.a.findIndex(a.notifications,{id:n.id});a.$delete(a.notifications,t)},5e3)}}}},function(t,e,a){"use strict";var n=a(1);e.a={name:"tutorial",props:["tutorial"],components:{bus:n.bus},data:function(){return{visible:!0,step:1}},created:function(){},methods:{}}},,,,,function(t,e,a){"use strict";function n(t){a(17)}var s=a(4),i=a(41),r=a(0),o=n,l=r(s.a,i.a,!1,o,null,null);e.a=l.exports},function(t,e){},,function(t,e,a){"use strict";function n(t){a(20)}var s=a(5),i=a(24),r=a(0),o=n,l=r(s.a,i.a,!1,o,"data-v-4574d9a1",null);e.a=l.exports},function(t,e){},function(t,e,a){"use strict";function n(t){a(22)}var s=a(6),i=a(23),r=a(0),o=n,l=r(s.a,i.a,!1,o,"data-v-661b678d",null);e.a=l.exports},function(t,e){},function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"gate",class:{"gate-staffed":t.gate.staffed},style:{left:t.getXPosition,top:t.getYPosition}},[a("div",{staticClass:"walkway"}),t._v(" "),a("div",{staticClass:"number",on:{click:function(e){t.showMenu=!t.showMenu}}},[t._v(t._s(t.gate.gateNumber))]),t._v(" "),!t.gate.staffed&&t.$root.airport.open?a("div",{staticClass:"info",attrs:{title:"Needs staff!"},on:{click:t.staffGate}},[a("eva-icon",{attrs:{name:"people-outline"}})],1):t._e(),t._v(" "),t.showMenu?a("div",{staticClass:"menu"},[a("h3",[t._v("Upgrade gate "+t._s(t.gate.gateNumber))]),t._v(" "),a("h4",[t._v("Passengers boarded / unboarded per tick")]),t._v(" "),a("button",{class:{disabled:t.$root.statistics.totalPlanesDeparted<t.gate.passengersPerTick},on:{click:t.upgrade}},[t._v("Upgrade "+t._s(2*t.gate.passengersPerTick)+" ($"+t._s(2*t.gate.passengersPerTick*500)+")")]),t._v(" "),a("div",[a("h4",[t._v("Permanently staff gate")]),t._v(" "),a("p",[t._v("Each time a plane takesoff staff are automatically requested for the next flight.")]),t._v(" "),a("button",{class:{disabled:t.gate.permanentlyStaffed},on:{click:t.addPermanentStaff}},[t._v("Add permanent staff (10000)")])]),t._v(" "),a("div",[a("h4",[t._v("Auto approve takeoff")]),t._v(" "),a("p",[t._v("When the plane is fully boarded the plane will automatically request takeoff.")]),t._v(" "),a("button",{class:{disabled:t.gate.autoApproveTakeoff},on:{click:t.autoApproveTakeoff}},[t._v("Auto approve takeoff (10000)")])]),t._v(" "),a("div",{staticClass:"text-faded",on:{click:function(e){t.showMenu=!1}}},[t._v("Close")])]):t._e()])},s=[],i={render:n,staticRenderFns:s};e.a=i},function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"board"},[t._t("default"),t._v(" "),t._l(t.$root.player.runways,function(e){return a("div",{key:e.runwayNumber,staticClass:"runway",style:{left:72+4*e.runwayNumber+"%"}},[t._v(t._s(e.runwayNumber))])}),t._v(" "),a("div",{staticClass:"gates"},t._l(t.$root.player.gates,function(t){return a("gate",{key:t.gateNumber,attrs:{gate:t}})}),1),t._v(" "),a("div",{staticClass:"terminal"},[a("button",{class:{disabled:!t.$root.airport.open},on:{click:t.staffAllGates}},[a("eva-icon",{attrs:{name:"people-outline"}}),t._v(" Staff all gates")],1),t._v(" "),a("button",{class:{disabled:!t.$root.airport.open},on:{click:t.dispatchAllPlanes}},[a("eva-icon",{attrs:{name:"done-all-outline"}}),t._v(" Accept all takeoff requests")],1)])],2)},s=[],i={render:n,staticRenderFns:s};e.a=i},function(t,e,a){"use strict";function n(t){a(26)}var s=a(7),i=a(28),r=a(0),o=n,l=r(s.a,i.a,!1,o,"data-v-2b0dd3bd",null);e.a=l.exports},function(t,e){},,function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"plane",class:{"bottom-row":t.isBottomRow,"taking-off":t.plane.takingOff,fuelled:t.plane.fuelled,landing:t.plane.landing,unboarding:t.plane.unboarding},style:{top:t.planePositionY,left:t.planePositionX},on:{click:[t.bump,function(e){return e.shiftKey?t.cheat(e):null}]}},[a("div",{staticClass:"plane-img",class:{"at-gate":t.plane.atGate}}),t._v(" "),t.$root.airport.open?t.readyForTakeoff?a("div",{staticClass:"sign takeoff",class:{disabled:!t.$root.airport.open},attrs:{title:"Ready for takeoff"},on:{click:t.requestTakeoff}},[a("eva-icon",{attrs:{name:"checkmark-outline",width:"18",height:"18"}})],1):t.plane.unboarding?a("div",{staticClass:"sign info",attrs:{title:"Passengers unboarding"}},[a("eva-icon",{attrs:{name:"trending-down-outline",width:"18",height:"18"}}),t._v(" "+t._s(t.plane.boarded))],1):t.plane.requestedTakeoff?a("div",{staticClass:"sign waiting",attrs:{title:"Waiting for takeoff slot"}},[a("eva-icon",{attrs:{name:"clock-outline",width:"18",height:"18"}})],1):t.plane.takingOff?t._e():a("div",{staticClass:"sign info",attrs:{title:"Passengers boarding"}},[a("eva-icon",{attrs:{name:"trending-up-outline",width:"18",height:"18"}}),t._v(" "+t._s(200-t.plane.boarded))],1):a("div",{staticClass:"sign error",attrs:{title:"Plane grounded untill morning"}},[a("eva-icon",{attrs:{name:"radio-outline",width:"18",height:"18"}}),t._v(" "),a("eva-icon",{attrs:{name:"alert-triangle-outline",width:"18",height:"18"}})],1)])},s=[],i={render:n,staticRenderFns:s};e.a=i},function(t,e,a){"use strict";function n(t){a(30)}var s=a(8),i=a(31),r=a(0),o=n,l=r(s.a,i.a,!1,o,"data-v-d0c33f98",null);e.a=l.exports},function(t,e){},function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"status-bar-wrapper"},[a("div",{staticClass:"status-bar"},[a("div",{staticClass:"status-bar-item time",attrs:{title:"Airport open/closed"}},[t.$root.airport.open?a("eva-icon",{class:{spin:6===t.$root.config.gameSpeed,sun:0!==t.$root.config.gameSpeed},attrs:{name:"sun-outline"}}):a("eva-icon",{attrs:{name:"moon-outline"}}),t._v(" "),a("span",[t._v(t._s(Math.floor(t.$root.mainTick/10))+":00")]),t._v(" "),a("div",{staticClass:"time-inner",style:{width:t.getTimeWidth}})],1),t._v(" "),a("div",{staticClass:"status-bar-item clickable",class:{warning:t.$root.player.cash<1e4},attrs:{title:"Balance"},on:{click:function(e){t.showCashflow=!t.showCashflow}}},[a("eva-icon",{attrs:{name:"credit-card-outline"}}),t._v(" "),a("span",[t._v(t._s(t.getCash))])],1),t._v(" "),a("div",{staticClass:"status-bar-item",attrs:{title:"Waiting to takeoff"}},[a("eva-icon",{attrs:{name:"diagonal-arrow-right-up-outline"}}),t._v(" "),a("span",[t._v(t._s(t.getTakeoffs))])],1),t._v(" "),a("div",{staticClass:"status-bar-item",attrs:{title:"Waiting to land"}},[a("eva-icon",{attrs:{name:"diagonal-arrow-right-down-outline"}}),t._v(" "),a("span",[t._v(t._s(t.getLandings))])],1),t._v(" "),a("div",{staticClass:"status-bar-item clickable",class:{paused:0===t.$root.config.gameSpeed},attrs:{title:"Play speed ("+t.$root.config.gameSpeed+"X)"}},[1===t.$root.config.gameSpeed?a("eva-icon",{attrs:{name:"arrow-ios-forward-outline"},on:{click:function(e){return t.setGameSpeed(6)}}}):6===t.$root.config.gameSpeed?a("eva-icon",{attrs:{name:"arrowhead-right"},on:{click:function(e){return t.setGameSpeed(0)}}}):a("eva-icon",{attrs:{name:"pause-circle-outline"},on:{click:function(e){return t.setGameSpeed(1)}}})],1)])]),t._v(" "),t.showCashflow?a("div",{staticClass:"cashflow"},[a("h2",[t._v("Cash flow")]),t._v(" "),a("div",{staticClass:"cash-history"},t._l(t.historyGraph,function(e,n){return a("div",{key:e*n+n,staticClass:"history-item",style:t.getHistoryHeight(e),attrs:{title:t.formatCash(e)}})}),0),t._v(" "),a("div",{staticClass:"row"},[a("div",{staticClass:"col"},[a("h3",[t._v("Flight & passengers")]),t._v(" "),a("table",t._l(t.$root.statistics,function(e,n){return"cashHistory"!==n?a("tr",[a("td",[t._v(t._s(n))]),t._v(" "),a("td",[t._v(t._s(e))])]):t._e()}),0)]),t._v(" "),a("div",{staticClass:"col"},[a("h3",[t._v("Daily costs")]),t._v(" "),a("table",[t._m(0),t._v(" "),a("tr",[a("td",[t._v("Gates")]),t._v(" "),a("td",[t._v(t._s(2e3*this.$root.player.gates.length))])])])])])]):t._e()])},s=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("tr",[a("td",[t._v("Terminal")]),t._v(" "),a("td",[t._v("-7000")])])}],i={render:n,staticRenderFns:s};e.a=i},function(t,e,a){"use strict";function n(t){a(33)}var s=a(9),i=a(34),r=a(0),o=n,l=r(s.a,i.a,!1,o,"data-v-2f172f41",null);e.a=l.exports},function(t,e){},function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{class:{open:t.showMenu}},[a("div",{staticClass:"store-toggle toggle",attrs:{title:"Open store"},on:{click:function(e){t.showMenu=!t.showMenu}}},[a("eva-icon",{attrs:{name:"shopping-cart-outline"}})],1),t._v(" "),t.showMenu?a("div",{staticClass:"store"},[a("div",{staticClass:"store-inner"},[a("h3",[t._v("Store")]),t._v(" "),a("div",[a("h4",[t._v("Gate")]),t._v(" "),a("p",[t._v("Gates receive passengers & planes. They require staff.")]),t._v(" "),a("button",{class:{disabled:22===t.$root.player.gates.length||t.$root.player.cash<5e4},on:{click:t.buyGate}},[a("eva-icon",{attrs:{name:"upload-outline"}}),t._v(" Build gate ($50,000)")],1)]),t._v(" "),a("div",[a("h4",[t._v("Runway")]),t._v(" "),a("p",[t._v("Runways allow planes to land and takeoff.")]),t._v(" "),a("button",{class:{disabled:6===t.$root.player.runways.length||t.$root.player.cash<1e5},on:{click:t.buyRunway}},[a("eva-icon",{attrs:{name:"arrowhead-up-outline"}}),t._v(" Build runway ($100,000)")],1)])])]):t._e()])},s=[],i={render:n,staticRenderFns:s};e.a=i},function(t,e,a){"use strict";function n(t){a(36)}var s=a(10),i=a(37),r=a(0),o=n,l=r(s.a,i.a,!1,o,"data-v-4905c6d4",null);e.a=l.exports},function(t,e){},function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{class:{open:t.showMenu}},[a("div",{staticClass:"notifications-toggle toggle",attrs:{title:"History"},on:{click:function(e){t.showMenu=!t.showMenu}}},[a("eva-icon",{attrs:{name:"bell-outline"}})],1),t._v(" "),t.showMenu?a("div",{staticClass:"notifications"},[a("h3",[t._v("History")]),t._v(" "),t._l(t.history,function(e,n){return a("div",{key:n,staticClass:"notification-history",class:{error:"ERROR"===e.type}},[t._v("\r\n      "+t._s(e.content)+"\r\n    ")])})],2):t._e(),t._v(" "),t.notifications.length?a("div",{staticClass:"live-feed"},t._l(t.notifications,function(e,n){return a("div",{directives:[{name:"show",rawName:"v-show",value:n<5,expression:"i < 5"}],key:e.id,staticClass:"notification",class:{error:"ERROR"===e.type},style:{top:15*n+"px",opacity:1-.2*n,"z-index":10-n},on:{click:function(e){t.showMenu=!0}}},[t._v("\r\n      "+t._s(e.content)+"\r\n    ")])}),0):t._e()])},s=[],i={render:n,staticRenderFns:s};e.a=i},function(t,e,a){"use strict";function n(t){a(39)}var s=a(11),i=a(40),r=a(0),o=n,l=r(s.a,i.a,!1,o,"data-v-be7c38be",null);e.a=l.exports},function(t,e){},function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.visible?a("div",{staticClass:"tutorial"},[1===t.step?a("div",{staticClass:"tutorial-card"},[a("h2",[t._v("Welcome to Airport")]),t._v(" "),a("p",[t._v("Buy gates & runways, manage planes, stay out of debt.")]),t._v(" "),a("button",{on:{click:function(e){t.step=2}}},[t._v("Next - Expanding your airport")])]):t._e(),t._v(" "),2===t.step?a("div",{staticClass:"tutorial-card"},[a("h2",[t._v("Expanding your aiport")]),t._v(" "),a("p",[t._v("On the bottom right use the shopping cart to buy items.")]),t._v(" "),a("button",{on:{click:function(e){t.step=3}}},[t._v("Next - What's going on?")])]):t._e(),t._v(" "),3===t.step?a("div",{staticClass:"tutorial-card"},[a("h2",[t._v("What's going on?")]),t._v(" "),a("p",[t._v("On the top right use the bell to view what's been happening.")]),t._v(" "),a("button",{on:{click:function(e){t.step=4}}},[t._v("Next - Ssssshh!")])]):t._e(),t._v(" "),4===t.step?a("div",{staticClass:"tutorial-card"},[a("h2",[t._v("Sssssshhh!")]),t._v(" "),a("p",[t._v("The airport closes at 22:00 and re-opens at 6:00. You'll be fined for each plane that's at a gate. All runways are closed.")]),t._v(" "),a("button",{on:{click:function(e){t.step=5}}},[t._v("Next - Attention please!")])]):t._e(),t._v(" "),5===t.step?a("div",{staticClass:"tutorial-card"},[a("h2",[t._v("Attention please!")]),t._v(" "),a("p",[t._v("Gates need staff to accept planes and passengers.")]),t._v(" "),a("button",{on:{click:function(e){t.step=6}}},[t._v("Next - Hurry up!")])]):t._e(),t._v(" "),6===t.step?a("div",{staticClass:"tutorial-card"},[a("h2",[t._v("Hurry up!")]),t._v(" "),a("p",[t._v("Click on planes to hurry up passengers.")]),t._v(" "),a("button",{on:{click:function(e){t.visible=!1}}},[t._v("Finish")])]):t._e(),t._v(" "),a("button",{on:{click:function(e){t.visible=!1}}},[t._v("Skip tutorial")])]):t._e()},s=[],i={render:n,staticRenderFns:s};e.a=i},function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{class:{"airport-closed":!t.$root.airport.open},attrs:{id:"app"}},[t._m(0),t._v(" "),a("tutorial"),t._v(" "),a("main",[a("notifications"),t._v(" "),t.$root.gameOver?a("div",{staticClass:"game-over"},[a("h1",[t._v("Game Over")]),t._v(" "),a("p",[t._v("You went bankrupt")]),t._v(" "),a("button",{on:{click:t.restart}},[t._v("Restart")])]):a("board",t._l(t.$root.player.planes,function(t){return a("plane",{key:t.id,attrs:{plane:t}})}),1),t._v(" "),a("status-bar"),t._v(" "),a("store")],1)],1)},s=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"screen-too-small"},[a("h1",[t._v("Small screen")]),t._v(" "),a("p",[t._v("A screen with a minimum width of 600px is required to play this game.")])])}],i={render:n,staticRenderFns:s};e.a=i}],[1]);
//# sourceMappingURL=app.e9e44148e39ff0c387ed.js.map