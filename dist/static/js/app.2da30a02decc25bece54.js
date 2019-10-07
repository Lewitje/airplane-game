webpackJsonp([0],[,function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),a.d(e,"bus",function(){return d});var n=a(14),s=a.n(n),i=a(17),o=a(21),r=a(2),l=a.n(r),c=a(53),u=a.n(c);i.a.use(u.a);var d=new i.a,h={id:0,flightNumber:null,fuelled:!1,boarded:0,unboarding:!1,requestedLanding:!1,requestedTakeoff:!1,takingOff:!1,landing:!1,atGate:!1,schedule:null,passengerCapacity:200,gateNumber:!1,runway:!1,position:{x:0,y:10}},f={requiresFuel:!1,passengers:200},p={gateNumber:0,passengersPerTick:4,staffed:!1,permanentlyStaffed:!1,autoApproveTakeoff:!1},g={runwayNumber:0};i.a.config.productionTip=!1,new i.a({el:"#app",template:"<App/>",components:{App:o.a},data:{gameTimer:null,gameOver:!1,mainTick:120,player:{planes:[],gates:[],runways:[],cash:0,scheduled:[]},airport:{open:!0,takeoffQueue:[],runwayInUse:!1,takeoffTimer:!1,landingTimer:!1},config:{landingTime:4,tickSpeed:1e3,gameSpeed:1,skipNight:!0,sandboxMode:!1,lastLandingSlot:200},statistics:{totalPlanesArrived:0,totalPlanesDeparted:0,totalPassengersArrived:0,totalPassengersDeparted:0,cashHistory:[]}},created:function(){this.player.cash=310050,this.load(),this.play(),d.$on("buy-plane",this.buyPlane),d.$on("buy-gate",this.buyGate),d.$on("buy-runway",this.buyRunway),d.$on("buy-schedule",this.buySchedule),d.$on("request-takeoff",this.requestTakeoff),d.$on("plane-landed",this.planeLanded),d.$on("staff-gate",this.staffGate)},methods:{save:function(){var t=s()(this.$data);window.localStorage.setItem("saveGame",t),d.$emit("important","Game autosaved.")},load:function(){var t=window.localStorage.getItem("saveGame");if(t){var e=JSON.parse(t);for(var a in e)this[a]=e[a]}},play:function(){var t=this;this.gameTimer=setInterval(function(){t.tick()},this.config.tickSpeed/this.config.gameSpeed)},pause:function(){clearInterval(this.gameTimer)},tick:function(){this.statistics.cashHistory.unshift(this.player.cash),this.updateDay(),this.checkLandings(),this.checkTakeoffs(),this.generateRandomLandings(),d.$emit("tick")},updateDay:function(){if(240===++this.mainTick){this.mainTick=0,this.player.cash-=7e3,d.$emit("notification","Terminal costs -7000");var t=2e3*this.player.gates.length;this.player.cash-=t,d.$emit("notification","Gate costs "+this.player.gates.length+" X 2000 (-"+t+")");var e=2e3*l.a.filter(this.player.planes,{atGate:!0}).length;this.player.cash-=e,d.$emit("notification","Ground plane fine "+this.player.planes.length+" X 2000 (-"+e+")")}this.config.lastLandingSlot===this.mainTick&&d.$emit("important","Arrivals closed. Departures are still open."),200===this.mainTick&&d.$emit("important","The airport is closing soon, make sure the gates are empty to avoid fines."),this.mainTick<=60||this.mainTick>=220?this.airport.open&&(this.airport.open=!1,document.body.style.background="#161718",this.config.skipNight&&(this.pause(),this.config.gameSpeed=12,this.play()),d.$emit("important","The airport has now closed. All remaining passengers will be unboarded, runways are closed. Boardings will resume when the airport opens in the morning.")):this.airport.open||(this.airport.open=!0,document.body.style.background="#f3f6fb",this.pause(),this.config.gameSpeed=1,this.play(),d.$emit("important","The airport is now open. Boarding will begin shortly."),this.save())},generateRandomLandings:function(){if(!this.airport.open||this.mainTick>this.config.lastLandingSlot)return!1;if(Math.random()<.3&&this.getAllPlanesInLandingQueue().length<this.player.gates.length){var t=l.a.cloneDeep(h);t.landing=!1,t.flightNumber=this.generateFlightNumber(),t.requestedLanding=!0,t.unboarding=!0,t.boarded=200,t.id=parseInt(100*Math.random()*Math.random()/Math.random()*Math.random()*Math.random()*1e6),this.player.planes.push(t),d.$emit("atc","Landing requested",t.flightNumber,!1)}},findFreeGate:function(){var t=this,e=!1,a=[];return this.player.gates.forEach(function(e){!l.a.find(t.player.planes,{gateNumber:e.gateNumber})&&e.staffed&&a.push(e.gateNumber)}),console.log({gatesList:a}),a.length&&(e=a[Math.floor(Math.random()*a.length)]),e},findFreeRunway:function(){var t=this,e=!1,a=[];return this.player.runways.forEach(function(e){console.log("checking runway "+e.runwayNumber);var n=l.a.filter(t.player.planes,{runway:e.runwayNumber});n.length||(console.log("Runway free "+e.runwayNumber,n),a.push(e.runwayNumber))}),a.length&&(e=a[Math.floor(Math.random()*a.length)]),e},buyGate:function(){if(this.player.gates.length>=16||this.player.cash<5e4)return!1;console.log("buying gate"),this.player.cash-=5e4,d.$emit("important","Purchased gate -50000");var t=l.a.cloneDeep(p);t.gateNumber=this.player.gates.length+1,this.player.gates.push(t)},buyRunway:function(){if(this.player.runways.length>=5||this.player.cash<25e4)return!1;console.log("buying runway"),this.player.cash-=25e4,d.$emit("important","Purchased runway -250000");var t=l.a.cloneDeep(g);t.runwayNumber=this.player.runways.length+1,this.player.runways.push(t)},buyPlane:function(){if(this.player.planes.length>=this.player.gates.length||this.player.cash<1e4)return!1;this.player.cash-=1e4,d.$emit("important","Purchased plane -10000");var t=l.a.cloneDeep(h);t.gateNumber=this.findFreeGate(),t.id=parseInt(100*Math.random()*Math.random()/Math.random()*Math.random()*Math.random()*1e6),this.player.planes.push(t)},buySchedule:function(){this.player.scheduled.push(f)},requestTakeoff:function(t){this.airport.takeoffQueue.push(t.id)},checkTakeoffs:function(){var t=this;if(!this.airport.open)return!1;if(this.findFreeRunway()){var e=l.a.find(this.player.planes,{requestedTakeoff:!0});e&&(this.unstaffGate(e.gateNumber),e.requestedTakeoff=!1,e.atGate=!1,e.gateNumber=!1,e.runway=this.findFreeRunway(),e.takingOff=!0,d.$emit("atc","Takeoff approved. Use runway "+e.runway,e.flightNumber,!0),setTimeout(function(){var a=l.a.findIndex(t.player.planes,{id:e.id});t.$delete(t.player.planes,a),d.$emit("notification","Runway usage (Takeoff) +1500"),t.player.cash+=1500,t.statistics.totalPlanesDeparted++,t.statistics.totalPassengersDeparted+=200},3500))}},checkLandings:function(){var t=this;if(!this.airport.open||this.mainTick>this.config.lastLandingSlot){var e=l.a.filter(this.player.planes,{requestedLanding:!0});e.forEach(function(e){d.$emit("atc","Landing denied",e.flightNumber,!0);var a=l.a.findIndex(t.player.planes,{id:e.id});t.$delete(t.player.planes,a)}),console.log("Planes trying to land",e.length)}else if(!1!==this.findFreeRunway()){var a=this.getAllPlanesInLandingQueue();if(a.length){console.log("Planes waiting to land",a.length);var n=l.a.find(this.player.planes,{id:a[0].id}),s=this.findFreeGate(),i=this.findFreeRunway();n&&!n.runway&&s&&i&&(console.log("free gate + runway for landing",s,i,n),n.gateNumber=s,n.runway=i,n.requestedLanding=!1,n.landing=!0,d.$emit("atc","Landing approved. Use runway "+n.runway+" and gate "+n.gateNumber,n.flightNumber,!0),setTimeout(function(){n.runway=!1,n.landing=!1,n.atGate=!0,d.$emit("notification","Runway usage (Landing) +1500"),t.player.cash+=1500,t.statistics.totalPlanesArrived++,t.statistics.totalPassengersArrived+=200},3500))}}},planeLanded:function(t){d.$emit("notification","Runway usage (Landing) +1000"),this.$root.player.cash+=1e3,this.$root.statistics.totalPlanesArrived++,this.$root.statistics.totalPassengersArrived+=200},getPlaneInLandingQueue:function(){return l.a.find(this.player.planes,{requestedLanding:!0,runway:!1,landing:!1,atGate:!1})},getAllPlanesInLandingQueue:function(){return l.a.filter(this.player.planes,{requestedLanding:!0,runway:!1,landing:!1,atGate:!1})},unstaffGate:function(t){var e=l.a.find(this.player.gates,{gateNumber:t});e&&!e.permanentlyStaffed&&(e.staffed=!1)},staffGate:function(t){var e=l.a.find(this.player.gates,{gateNumber:t});e.staffed=!0;var a=100*e.passengersPerTick;this.player.cash-=a,d.$emit("notification","Staff costs -"+a)},generateFlightNumber:function(){return"AIR"+Math.random().toString(36).substring(7).toUpperCase()}},watch:{"config.sandboxMode":function(){this.config.sandboxMode&&(this.player.cash=1e8)},"player.cash":function(t,e){this.player.cash<=0&&(this.gameOver=!0,this.pause()),this.player.cash<1e4&&e>1e4&&d.$emit("important","Your cash is getting low!")},"statistics.totalPlanesDeparted":function(){5===this.statistics.totalPlanesDeparted?(d.$emit("achievement","5 planes departed (+10000)!"),this.player.cash+=1e4):50===this.statistics.totalPlanesDeparted?(d.$emit("achievement","50 planes departed (+10000)!"),this.player.cash+=1e4):500===this.statistics.totalPlanesDeparted?(d.$emit("achievement","500 planes departed (+10000)!"),this.player.cash+=1e4):500===this.statistics.totalPlanesDeparted?(d.$emit("achievement","500 planes departed (+10000)!"),this.player.cash+=1e4):1e3===this.statistics.totalPlanesDeparted&&(d.$emit("achievement","1000 planes departed (+10000)!"),this.player.cash+=1e4)}}})},,,function(t,e,a){"use strict";var n=a(24),s=a(30),i=a(34),o=a(37),r=a(40),l=a(43),c=a(46),u=a(49);e.a={name:"app",components:{Board:n.a,Plane:s.a,StatusBar:i.a,Store:o.a,Notifications:r.a,Tutorial:l.a,Settings:c.a,Atc:u.a},methods:{restart:function(){window.localStorage.removeItem("saveGame"),location.reload()}}}},function(t,e,a){"use strict";var n=a(26),s=a(1);e.a={name:"board",components:{Gate:n.a,bus:s.bus},data:function(){return{}},methods:{dispatchAllPlanes:function(){s.bus.$emit("dispatch-all-planes")},staffAllGates:function(){s.bus.$emit("staff-all-gates")}}}},function(t,e,a){"use strict";var n=a(1);e.a={name:"gate",props:["gate"],components:{bus:n.bus},data:function(){return{showMenu:!1}},created:function(){var t=this;n.bus.$on("staff-all-gates",function(){t.staffGate()})},computed:{getXPosition:function(){var t=8*this.gate.gateNumber+"%";return this.gate.gateNumber>8&&(t=8*(this.gate.gateNumber-8)+"%"),t},getYPosition:function(){var t="16%";return this.gate.gateNumber>8&&(t="61%"),t},planesTillNextUpgrade:function(){return Math.ceil(5*this.gate.passengersPerTick*this.gate.passengersPerTick)}},methods:{upgrade:function(){var t=100*this.planesTillNextUpgrade;this.gate.passengersPerTick=1.2*this.gate.passengersPerTick,this.$root.player.cash-=t,n.bus.$emit("notification","Upgraded gate -"+t)},staffGate:function(){if(!this.$root.airport.open||this.gate.staffed)return!1;n.bus.$emit("staff-gate",this.gate.gateNumber)},addPermanentStaff:function(){this.gate.staffed=!0,this.gate.permanentlyStaffed=!0;this.$root.player.cash-=1e4,n.bus.$emit("notification","Upgraded gate -"+1e4)},autoApproveTakeoff:function(){this.gate.autoApproveTakeoff=!0;this.$root.player.cash-=1e4,n.bus.$emit("notification","Upgraded gate -"+1e4)}}}},function(t,e,a){"use strict";var n=a(1),s=a(2),i=a.n(s);e.a={name:"plane",props:["plane"],components:{bus:n.bus},data:function(){return{gate:null,readyForTakeoff:!1,isBottomRow:!1,timer:null}},mounted:function(){var t=this;this.plane.fuelled=!0,n.bus.$on("dispatch-all-planes",function(){t.requestTakeoff()}),n.bus.$on("tick",function(){t.tick()})},beforeDestroy:function(){},computed:{planePositionX:function(){return this.plane.requestedLanding?"150%":this.plane.takingOff||this.plane.landing?73+4*this.plane.runway+"%":this.gate&&this.gate.gateNumber>8?1+8*(this.plane.gateNumber-8)+"%":1+8*this.plane.gateNumber+"%"},planePositionY:function(){return this.plane.landing||this.plane.takingOff?"11%":this.gate&&this.gate.gateNumber>8?"62%":"17%"}},methods:{tick:function(){if(0===this.$root.config.gameSpeed||this.plane.takingOff||this.plane.requestedTakeoff||this.plane.landing||this.plane.requestedLanding||this.readyForTakeoff)return!1;this.plane.unboarding?this.unboardPassenger():this.plane.fuelled&&this.plane.boarded>=this.plane.passengerCapacity?(this.readyForTakeoff=!0,this.gate&&this.gate.autoApproveTakeoff&&this.requestTakeoff()):this.boardPassenger()},requestTakeoff:function(){if(!this.readyForTakeoff)return!1;this.readyForTakeoff=!1,n.bus.$emit("atc","Takeoff requested",this.plane.flightNumber,!1),n.bus.$emit("notification","Passenger departures terminal costs ("+this.plane.passengerCapacity+" X 10) +"+10*this.plane.passengerCapacity),n.bus.$emit("request-takeoff",this.plane),this.plane.requestedTakeoff=!0},boardPassenger:function(t){if(0===this.$root.config.gameSpeed||!this.$root.airport.open||this.plane.takingOff||this.plane.requestedTakeoff||this.plane.landing||this.plane.requestedLanding||this.readyForTakeoff)return!1;var e=this.gate?this.gate.passengersPerTick:1;isNaN(t)||(e=t),this.plane.boarded<this.plane.passengerCapacity&&(this.$root.player.cash+=10*e,this.plane.boarded=Math.min(this.plane.passengerCapacity,this.plane.boarded+e))},unboardPassenger:function(t){if(0===this.$root.config.gameSpeed||this.plane.takingOff||this.plane.requestedTakeoff||this.plane.landing||this.plane.requestedLanding||this.readyForTakeoff)return!1;var e=this.gate?this.gate.passengersPerTick:1;isNaN(t)||(e=t),this.plane.boarded>0?(this.$root.player.cash+=10*e,this.plane.boarded=Math.max(0,this.plane.boarded-e)):(n.bus.$emit("notification","Passenger arrivals terminal costs ("+this.plane.passengerCapacity+" X 10) +"+10*this.plane.passengerCapacity),this.plane.unboarding=!1)},bump:function(){this.plane.unboarding?this.unboardPassenger(6):this.boardPassenger(6)},cheat:function(){this.plane.unboarding?this.unboardPassenger(30):this.boardPassenger(30)}},watch:{"plane.gateNumber":function(){var t=this.plane.gateNumber;t&&(this.gate=i.a.find(this.$root.player.gates,{gateNumber:t}),this.gate.gateNumber>8&&(this.isBottomRow=!0))}}}},function(t,e,a){"use strict";var n=a(2),s=a.n(n);e.a={name:"status-bar",data:function(){return{showCashflow:!1}},mounted:function(){},computed:{getTimeWidth:function(){return Math.ceil(this.$root.mainTick/240*100)+"%"},planesOnGround:function(){var t=s.a.filter(this.$root.player.planes,{requestedLanding:!1});return t=t?t.length:0},getCash:function(){return this.formatCash(this.$root.player.cash)},getLandings:function(){var t=s.a.filter(this.$root.player.planes,{requestedLanding:!0});return t=t?t.length:0},getTakeoffs:function(){var t=s.a.filter(this.$root.player.planes,{requestedTakeoff:!0});return t=t?t.length:0},historyGraph:function(){return this.$root.statistics.cashHistory.slice(0,200).reverse()},getMaxCashflow:function(){return!!this.showCashflow&&s.a.max(this.historyGraph)}},methods:{getHistoryHeight:function(t){return"height: "+t/this.getMaxCashflow*100+"%"},setGameSpeed:function(t){this.$root.pause(),this.$root.config.gameSpeed=t,0!==t&&this.$root.play()},formatCash:function(t){return parseFloat(t).toFixed(2).replace(/\d(?=(\d{3})+\.)/g,"$&,")}}}},function(t,e,a){"use strict";var n=a(1);e.a={name:"store",components:{bus:n.bus},data:function(){return{showMenu:!1}},created:function(){},methods:{buyPlane:function(){n.bus.$emit("buy-plane")},buySchedule:function(){n.bus.$emit("buy-schedule")},buyGate:function(){n.bus.$emit("buy-gate")},buyRunway:function(){n.bus.$emit("buy-runway")}}}},function(t,e,a){"use strict";var n=a(1),s=a(2),i=a.n(s);e.a={name:"notifications",components:{bus:n.bus},data:function(){return{showMenu:!1,showAchievement:!1,notifications:[],history:[],achievements:[]}},created:function(){var t=this;n.bus.$on("notification",function(e){t.createNotification(e,"NORMAL")}),n.bus.$on("important",function(e){t.createNotification(e,"IMPORTANT")}),n.bus.$on("achievement",function(e){t.createAchievement(e)})},computed:{},methods:{createNotification:function(t,e){var a=this,n={content:t,id:Math.random()*Math.random()*1e4/Math.random()*Math.random(),type:e};this.history.unshift(n),this.notifications.unshift(n),setTimeout(function(){var t=i.a.findIndex(a.notifications,{id:n.id});a.$delete(a.notifications,t)},5e3)},createAchievement:function(t){var e={content:t,seen:!1};this.achievements.push(e),this.showAchievement=!0}}}},function(t,e,a){"use strict";var n=a(1);e.a={name:"tutorial",props:["tutorial"],components:{bus:n.bus},data:function(){return{visible:!1,step:1}},created:function(){},methods:{startTutorial:function(){this.step=1,this.visible=!0}}}},function(t,e,a){"use strict";var n=a(1);e.a={name:"store",components:{bus:n.bus},data:function(){return{showMenu:!1}},created:function(){},methods:{restart:function(){window.localStorage.removeItem("saveGame"),location.reload()}}}},function(t,e,a){"use strict";var n=a(1),s=a(2),i=a.n(s);e.a={name:"atc",components:{bus:n.bus},data:function(){return{showMenu:!1,conversations:[],focused:!1}},created:function(){n.bus.$on("atc",this.createConversation)},computed:{groupedConversations:function(){return i.a.groupBy(this.conversations,"flightNumber")}},methods:{createConversation:function(t,e,a){this.conversations.unshift({message:t,flightNumber:e,isAtc:a,id:Math.floor(Math.random()*Math.random()*1e3*Math.random()*1e4)})}}}},,,,,,,,function(t,e,a){"use strict";function n(t){a(22)}var s=a(4),i=a(52),o=a(0),r=n,l=o(s.a,i.a,!1,r,null,null);e.a=l.exports},function(t,e){},,function(t,e,a){"use strict";function n(t){a(25)}var s=a(5),i=a(29),o=a(0),r=n,l=o(s.a,i.a,!1,r,"data-v-aaf88eda",null);e.a=l.exports},function(t,e){},function(t,e,a){"use strict";function n(t){a(27)}var s=a(6),i=a(28),o=a(0),r=n,l=o(s.a,i.a,!1,r,"data-v-73b55f04",null);e.a=l.exports},function(t,e){},function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"gate",class:{"gate-staffed":t.gate.staffed&&t.$root.airport.open,"gate-bottom":t.gate.gateNumber>8},style:{left:t.getXPosition,top:t.getYPosition}},[a("div",{staticClass:"menu-toggle",attrs:{title:"Upgrade stand"},on:{click:function(e){t.showMenu=!t.showMenu}}},[a("eva-icon",{attrs:{name:"arrowhead-up-outline",width:"18",height:"18"}})],1),t._v(" "),a("div",{staticClass:"staff",style:"animation-delay: "+3*Math.random()+"s;"}),t._v(" "),a("div",{staticClass:"walkway",style:"transition-delay: "+2*Math.random()+"s;"}),t._v(" "),a("div",{staticClass:"number"},[t._v(t._s(t.gate.gateNumber))]),t._v(" "),!t.gate.staffed&&t.$root.airport.open?a("div",{staticClass:"info",attrs:{title:"Needs staff!"},on:{click:t.staffGate}},[a("eva-icon",{attrs:{name:"people-outline"}})],1):t._e()]),t._v(" "),t.showMenu?a("div",{staticClass:"menu"},[a("div",{staticClass:"menu-inner"},[a("div",{staticClass:"text-faded",on:{click:function(e){t.showMenu=!1}}},[t._v("Close")]),t._v(" "),a("h3",[t._v("Upgrade gate "+t._s(t.gate.gateNumber))]),t._v(" "),a("h4",[t._v("Passengers boarded / unboarded per tick")]),t._v(" "),a("p",{directives:[{name:"show",rawName:"v-show",value:t.$root.statistics.totalPlanesDeparted<t.planesTillNextUpgrade&&t.gate.passengersPerTick<24,expression:"$root.statistics.totalPlanesDeparted < planesTillNextUpgrade && gate.passengersPerTick < 24"}],staticClass:"error"},[t._v("You need to dispatch a minimum of "+t._s(t.planesTillNextUpgrade)+" planes to unlock this.")]),t._v(" "),a("button",{class:{disabled:t.$root.statistics.totalPlanesDeparted<t.planesTillNextUpgrade&&t.gate.passengersPerTick<25},on:{click:t.upgrade}},[t._v("Upgrade "+t._s(Math.ceil(1.2*t.gate.passengersPerTick))+" ($"+t._s(100*t.planesTillNextUpgrade)+")")]),t._v(" "),a("div",[a("h4",[t._v("Permanently staff gate")]),t._v(" "),a("p",[t._v("Each time a plane takesoff staff are automatically requested for the next flight.")]),t._v(" "),a("button",{class:{disabled:t.gate.permanentlyStaffed},on:{click:t.addPermanentStaff}},[t._v("Add permanent staff (10,000)")])]),t._v(" "),a("div",[a("h4",[t._v("Auto approve takeoff")]),t._v(" "),a("p",[t._v("When the plane is fully boarded the plane will automatically request takeoff.")]),t._v(" "),a("button",{class:{disabled:t.gate.autoApproveTakeoff},on:{click:t.autoApproveTakeoff}},[t._v("Auto approve takeoff (10,000)")])]),t._v(" "),a("div",{staticClass:"text-faded",on:{click:function(e){t.showMenu=!1}}},[t._v("Close")])])]):t._e()])},s=[],i={render:n,staticRenderFns:s};e.a=i},function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"board",class:{paused:0===t.$root.config.gameSpeed,fast:6===t.$root.config.gameSpeed}},[t._t("default"),t._v(" "),t._l(t.$root.player.runways,function(e){return a("div",{key:e.runwayNumber,staticClass:"runway",style:{left:74+4*e.runwayNumber+"%"}},[t._v(t._s(e.runwayNumber))])}),t._v(" "),a("div",{staticClass:"gates"},t._l(t.$root.player.gates,function(t){return a("gate",{key:t.gateNumber,attrs:{gate:t}})}),1),t._v(" "),a("div",{staticClass:"terminal"},[a("button",{class:{disabled:!t.$root.airport.open},on:{click:t.staffAllGates}},[a("eva-icon",{attrs:{name:"people-outline"}}),t._v(" Staff all gates")],1),t._v(" "),a("button",{class:{disabled:!t.$root.airport.open},on:{click:t.dispatchAllPlanes}},[a("eva-icon",{attrs:{name:"done-all-outline"}}),t._v(" Accept all takeoff requests")],1),t._v(" "),a("div",{staticClass:"fan left"}),t._v(" "),a("div",{staticClass:"fan right"})]),t._v(" "),a("div",{staticClass:"taxiways"}),t._v(" "),a("div",{staticClass:"road"}),t._v(" "),t._m(0)],2)},s=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"forests"},[a("div",{staticClass:"forest"}),t._v(" "),a("div",{staticClass:"forest"}),t._v(" "),a("div",{staticClass:"forest"}),t._v(" "),a("div",{staticClass:"forest"})])}],i={render:n,staticRenderFns:s};e.a=i},function(t,e,a){"use strict";function n(t){a(31)}var s=a(7),i=a(33),o=a(0),r=n,l=o(s.a,i.a,!1,r,"data-v-7c61cc14",null);e.a=l.exports},function(t,e){},,function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"plane",class:{"bottom-row":t.isBottomRow,"taking-off":t.plane.takingOff,fuelled:t.plane.fuelled,landing:t.plane.landing,unboarding:t.plane.unboarding},style:{top:t.planePositionY,left:t.planePositionX},on:{click:[t.bump,function(e){return e.shiftKey?t.cheat(e):null}]}},[a("div",{staticClass:"plane-img",class:{"at-gate":t.plane.atGate}}),t._v(" "),t.$root.airport.open?t.readyForTakeoff?a("div",{staticClass:"sign takeoff",class:{disabled:!t.$root.airport.open},attrs:{title:"Ready for takeoff"},on:{click:t.requestTakeoff}},[a("eva-icon",{attrs:{name:"checkmark-outline",width:"18",height:"18"}})],1):t.plane.unboarding?a("div",{staticClass:"sign info",attrs:{title:"Passengers unboarding"}},[a("eva-icon",{attrs:{name:"arrow-downward",width:"18",height:"18"}}),t._v(" "+t._s(t.plane.boarded))],1):t.plane.requestedTakeoff?a("div",{staticClass:"sign waiting",attrs:{title:"Waiting for takeoff slot"}},[a("eva-icon",{attrs:{name:"clock-outline",width:"18",height:"18"}})],1):t.plane.takingOff?t._e():a("div",{staticClass:"sign info",attrs:{title:"Passengers boarding"}},[a("eva-icon",{attrs:{name:"arrow-upward",width:"18",height:"18"}}),t._v(" "+t._s(200-t.plane.boarded))],1):a("div",{staticClass:"sign error",attrs:{title:"Plane grounded untill morning"}},[a("eva-icon",{attrs:{name:"radio-outline",width:"18",height:"18"}}),t._v(" "),a("eva-icon",{attrs:{name:"alert-triangle-outline",width:"18",height:"18"}})],1)])},s=[],i={render:n,staticRenderFns:s};e.a=i},function(t,e,a){"use strict";function n(t){a(35)}var s=a(8),i=a(36),o=a(0),r=n,l=o(s.a,i.a,!1,r,"data-v-56df3007",null);e.a=l.exports},function(t,e){},function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"status-bar-wrapper"},[a("div",{staticClass:"status-bar"},[a("div",{staticClass:"status-bar-item time",class:{sunset:t.$root.mainTick>=170||t.$root.mainTick<=90},attrs:{title:"Airport open/closed"}},[t.$root.airport.open?a("eva-icon",{class:{spin:6===t.$root.config.gameSpeed,sun:0!==t.$root.config.gameSpeed},attrs:{name:"sun-outline"}}):a("eva-icon",{attrs:{name:"moon-outline"}}),t._v(" "),a("span",[t._v(t._s(Math.floor(t.$root.mainTick/10))+":00")]),t._v(" "),a("div",{staticClass:"time-inner",style:{width:t.getTimeWidth}})],1),t._v(" "),a("div",{staticClass:"status-bar-item clickable",class:{warning:t.$root.player.cash<1e4},attrs:{title:"Balance"},on:{click:function(e){t.showCashflow=!t.showCashflow}}},[a("eva-icon",{attrs:{name:"credit-card-outline"}}),t._v(" "),a("span",[t._v(t._s(t.getCash))])],1),t._v(" "),a("div",{staticClass:"status-bar-item",class:{closed:!t.$root.airport.open},attrs:{title:"Waiting to takeoff"}},[a("eva-icon",{attrs:{name:"diagonal-arrow-right-up-outline"}}),t._v(" "),a("span",[t._v(t._s(t.getTakeoffs))])],1),t._v(" "),a("div",{staticClass:"status-bar-item",class:{closed:t.$root.mainTick>=t.$root.config.lastLandingSlot||!t.$root.airport.open},attrs:{title:"Waiting to land"}},[a("eva-icon",{attrs:{name:"diagonal-arrow-right-down-outline"}}),t._v(" "),a("span",[t._v(t._s(t.getLandings))])],1),t._v(" "),a("div",{staticClass:"status-bar-item clickable",class:{paused:0===t.$root.config.gameSpeed,"super-speed":12===t.$root.config.gameSpeed},attrs:{title:"Normal / Fast / Pause"}},[1===t.$root.config.gameSpeed?a("eva-icon",{attrs:{name:"arrow-ios-forward-outline"},on:{click:function(e){return t.setGameSpeed(6)}}}):6===t.$root.config.gameSpeed?a("eva-icon",{attrs:{name:"arrowhead-right"},on:{click:function(e){return t.setGameSpeed(0)}}}):12===t.$root.config.gameSpeed?a("eva-icon",{attrs:{name:"arrowhead-right"},on:{click:function(e){return t.setGameSpeed(0)}}}):a("eva-icon",{attrs:{name:"pause-circle-outline"},on:{click:function(e){return t.setGameSpeed(1)}}})],1)])]),t._v(" "),t.showCashflow?a("div",{staticClass:"cashflow"},[a("h2",[t._v("Cash flow")]),t._v(" "),a("div",{staticClass:"cash-history"},t._l(t.historyGraph,function(e,n){return a("div",{key:e*n+n,staticClass:"history-item",style:t.getHistoryHeight(e),attrs:{title:t.formatCash(e)}})}),0),t._v(" "),a("div",{staticClass:"row"},[a("div",{staticClass:"col"},[a("h3",[t._v("Flight & passengers")]),t._v(" "),a("table",t._l(t.$root.statistics,function(e,n){return"cashHistory"!==n?a("tr",[a("td",[t._v(t._s(n))]),t._v(" "),a("td",[t._v(t._s(e))])]):t._e()}),0)]),t._v(" "),a("div",{staticClass:"col"},[a("h3",[t._v("Daily costs")]),t._v(" "),a("table",[t._m(0),t._v(" "),a("tr",[a("td",[t._v("Gates")]),t._v(" "),a("td",[t._v(t._s(2e3*this.$root.player.gates.length))])])])])])]):t._e()])},s=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("tr",[a("td",[t._v("Terminal")]),t._v(" "),a("td",[t._v("-7000")])])}],i={render:n,staticRenderFns:s};e.a=i},function(t,e,a){"use strict";function n(t){a(38)}var s=a(9),i=a(39),o=a(0),r=n,l=o(s.a,i.a,!1,r,"data-v-9614ca3a",null);e.a=l.exports},function(t,e){},function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{class:{open:t.showMenu}},[a("div",{staticClass:"store-toggle toggle",attrs:{title:"Open store"},on:{click:function(e){t.showMenu=!t.showMenu}}},[a("eva-icon",{attrs:{name:"shopping-cart-outline"}})],1),t._v(" "),t.showMenu?a("div",{staticClass:"store"},[a("div",{staticClass:"store-inner"},[a("h3",[t._v("Store")]),t._v(" "),a("div",[a("h4",[t._v("Gate")]),t._v(" "),a("p",[t._v("Gates receive passengers & planes. They require staff.")]),t._v(" "),a("button",{class:{disabled:16===t.$root.player.gates.length||t.$root.player.cash<5e4||!t.$root.player.runways.length},on:{click:t.buyGate}},[a("eva-icon",{attrs:{name:"upload-outline"}}),t._v(" Build gate ($50,000)")],1)]),t._v(" "),a("div",[a("h4",[t._v("Runway")]),t._v(" "),a("p",[t._v("Runways allow planes to land and takeoff.")]),t._v(" "),a("button",{class:{disabled:5===t.$root.player.runways.length||t.$root.player.cash<25e4},on:{click:t.buyRunway}},[a("eva-icon",{attrs:{name:"arrowhead-up-outline"}}),t._v(" Build runway ($250,000)")],1)])])]):t._e()])},s=[],i={render:n,staticRenderFns:s};e.a=i},function(t,e,a){"use strict";function n(t){a(41)}var s=a(10),i=a(42),o=a(0),r=n,l=o(s.a,i.a,!1,r,"data-v-55719776",null);e.a=l.exports},function(t,e){},function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{class:{open:t.showMenu}},[a("div",{staticClass:"notifications-toggle toggle",attrs:{title:"History"},on:{click:function(e){t.showMenu=!t.showMenu}}},[a("eva-icon",{attrs:{name:"bell-outline"}})],1),t._v(" "),t.showMenu?a("div",{staticClass:"notifications"},[a("h3",[t._v("History")]),t._v(" "),t._l(t.history,function(e,n){return a("div",{key:n,staticClass:"notification-history",class:{error:"IMPORTANT"===e.type}},[t._v("\n      "+t._s(e.content)+"\n    ")])})],2):t._e(),t._v(" "),t.notifications.length||t.showAchievement?a("div",{staticClass:"live-feed"},[t._l(t.achievements,function(e){return e.seen?t._e():a("div",{key:e.content,staticClass:"achievement"},[a("eva-icon",{attrs:{name:"star",width:100,height:100}}),t._v(" "),a("h2",[t._v(t._s(e.content))]),t._v(" "),a("button",{on:{click:function(t){e.seen=!0}}},[t._v("Dismiss")])],1)}),t._v(" "),t._l(t.notifications,function(e,n){return"IMPORTANT"===e.type?a("div",{key:e.id,staticClass:"notification",class:{error:"IMPORTANT"===e.type}},[t._v("\n      "+t._s(e.content)+"\n    ")]):t._e()})],2):t._e()])},s=[],i={render:n,staticRenderFns:s};e.a=i},function(t,e,a){"use strict";function n(t){a(44)}var s=a(11),i=a(45),o=a(0),r=n,l=o(s.a,i.a,!1,r,"data-v-0cf4f1b1",null);e.a=l.exports},function(t,e){},function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"toggle toggle-help",on:{click:t.startTutorial}},[a("eva-icon",{attrs:{name:"question-mark-outline"}})],1),t._v(" "),t.visible?a("div",{staticClass:"tutorial"},[1===t.step?a("div",{staticClass:"tutorial-card"},[a("img",{staticClass:"logo",attrs:{src:"/static/img/plane.jpg",alt:""}}),t._v(" "),a("h2",[t._v("Welcome to Airport")]),t._v(" "),a("p",[t._v("Buy gates & runways, manage planes, stay out of debt.")]),t._v(" "),a("button",{on:{click:function(e){t.step=2}}},[t._v("Next - Expanding your airport")])]):t._e(),t._v(" "),2===t.step?a("div",{staticClass:"tutorial-card"},[a("eva-icon",{attrs:{name:"shopping-cart-outline",width:40,height:40}}),t._v(" "),a("h2",[t._v("Expanding your aiport")]),t._v(" "),a("p",[t._v("On the bottom right use the shopping cart to buy items.")]),t._v(" "),a("button",{on:{click:function(e){t.step--}}},[t._v("Back")]),t._v(" "),a("button",{on:{click:function(e){t.step=3}}},[t._v("Next - What's going on?")])],1):t._e(),t._v(" "),3===t.step?a("div",{staticClass:"tutorial-card"},[a("eva-icon",{attrs:{name:"bell-outline",width:40,height:40}}),t._v(" "),a("h2",[t._v("What's going on?")]),t._v(" "),a("p",[t._v("On the top right use the bell to view what's been happening.")]),t._v(" "),a("button",{on:{click:function(e){t.step--}}},[t._v("Back")]),t._v(" "),a("button",{on:{click:function(e){t.step=4}}},[t._v("Next - Ssssshh!")])],1):t._e(),t._v(" "),4===t.step?a("div",{staticClass:"tutorial-card"},[a("eva-icon",{attrs:{name:"moon-outline",width:40,height:40}}),t._v(" "),a("h2",[t._v("Sssssshhh!")]),t._v(" "),a("p",[t._v("The airport closes at 22:00 and re-opens at 6:00. You'll be fined for each plane that's at a gate. All runways are closed.")]),t._v(" "),a("button",{on:{click:function(e){t.step--}}},[t._v("Back")]),t._v(" "),a("button",{on:{click:function(e){t.step=5}}},[t._v("Next - Attention please!")])],1):t._e(),t._v(" "),5===t.step?a("div",{staticClass:"tutorial-card"},[a("eva-icon",{attrs:{name:"people-outline",width:40,height:40}}),t._v(" "),a("h2",[t._v("Attention please!")]),t._v(" "),a("p",[t._v("Gates need staff to accept planes and passengers.")]),t._v(" "),a("button",{on:{click:function(e){t.step--}}},[t._v("Back")]),t._v(" "),a("button",{on:{click:function(e){t.step=6}}},[t._v("Next - Hurry up!")])],1):t._e(),t._v(" "),6===t.step?a("div",{staticClass:"tutorial-card"},[a("eva-icon",{attrs:{name:"arrow-forward-outline",width:40,height:40}}),t._v(" "),a("h2",[t._v("Hurry up!")]),t._v(" "),a("p",[t._v("Spam click on planes to hurry up passengers.")]),t._v(" "),a("button",{on:{click:function(e){t.step--}}},[t._v("Back")]),t._v(" "),a("button",{on:{click:function(e){t.visible=!1}}},[t._v("Finish")])],1):t._e(),t._v(" "),a("button",{on:{click:function(e){t.visible=!1}}},[t._v("Close tutorial")])]):t._e()])},s=[],i={render:n,staticRenderFns:s};e.a=i},function(t,e,a){"use strict";function n(t){a(47)}var s=a(12),i=a(48),o=a(0),r=n,l=o(s.a,i.a,!1,r,"data-v-57d329c0",null);e.a=l.exports},function(t,e){},function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{class:{open:t.showMenu}},[a("div",{staticClass:"settings-toggle toggle",attrs:{title:"Open store"},on:{click:function(e){t.showMenu=!t.showMenu}}},[a("eva-icon",{attrs:{name:"settings-outline"}})],1),t._v(" "),t.showMenu?a("div",{staticClass:"settings"},[a("div",{staticClass:"settings-inner"},[a("h2",[t._v("Options")]),t._v(" "),a("div",[a("button",{on:{click:t.restart}},[t._v("Restart game")]),t._v(" "),a("button",{on:{click:t.$root.save}},[t._v("Save game")]),t._v(" "),a("a",{attrs:{href:"https://github.com/Lewitje/Airplane-game",target:"_blank"}},[t._v("Github")])]),t._v(" "),a("label",{staticClass:"range",class:{disabled:t.$root.config.sandboxMode}},[a("span",{staticClass:"title"},[t._v("Last landing time")]),t._v(" "),a("div",{staticClass:"range-bar"},[a("div",{staticClass:"range-btn",class:{disabled:180===t.$root.config.lastLandingSlot},on:{click:function(e){t.$root.config.lastLandingSlot-=10}}},[a("eva-icon",{attrs:{name:"minus-outline"}})],1),t._v(" "),a("div",{staticClass:"range-value"},[t._v("\n            "+t._s(t.$root.config.lastLandingSlot/10)+":00\n          ")]),t._v(" "),a("div",{staticClass:"range-btn",class:{disabled:220===t.$root.config.lastLandingSlot},on:{click:function(e){t.$root.config.lastLandingSlot+=10}}},[a("eva-icon",{attrs:{name:"plus-outline"}})],1)]),t._v(" "),a("span",[a("b",[t._v(t._s((220-t.$root.config.lastLandingSlot)/10)+" hours")]),t._v(" before closure")]),a("br"),t._v(" "),a("p",[t._v("No planes may land after this time. (helps with automated gates & fines)")])]),t._v(" "),a("label",{staticClass:"checkbox"},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.$root.config.skipNight,expression:"$root.config.skipNight"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.$root.config.skipNight)?t._i(t.$root.config.skipNight,null)>-1:t.$root.config.skipNight},on:{change:function(e){var a=t.$root.config.skipNight,n=e.target,s=!!n.checked;if(Array.isArray(a)){var i=t._i(a,null);n.checked?i<0&&t.$set(t.$root.config,"skipNight",a.concat([null])):i>-1&&t.$set(t.$root.config,"skipNight",a.slice(0,i).concat(a.slice(i+1)))}else t.$set(t.$root.config,"skipNight",s)}}}),t._v(" "),a("span",[t._v("Skip through night")]),t._v(" "),a("p",[t._v("Super speed through the night.")])]),t._v(" "),a("label",{staticClass:"checkbox",class:{disabled:t.$root.config.sandboxMode}},[a("input",{directives:[{name:"model",rawName:"v-model",value:t.$root.config.sandboxMode,expression:"$root.config.sandboxMode"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.$root.config.sandboxMode)?t._i(t.$root.config.sandboxMode,null)>-1:t.$root.config.sandboxMode},on:{change:function(e){var a=t.$root.config.sandboxMode,n=e.target,s=!!n.checked;if(Array.isArray(a)){var i=t._i(a,null);n.checked?i<0&&t.$set(t.$root.config,"sandboxMode",a.concat([null])):i>-1&&t.$set(t.$root.config,"sandboxMode",a.slice(0,i).concat(a.slice(i+1)))}else t.$set(t.$root.config,"sandboxMode",s)}}}),t._v(" "),a("span",[t._v("Sandbox mode")]),t._v(" "),a("p",[t._v("Lots of money (Cannot be undone).")])])])]):t._e()])},s=[],i={render:n,staticRenderFns:s};e.a=i},function(t,e,a){"use strict";function n(t){a(50)}var s=a(13),i=a(51),o=a(0),r=n,l=o(s.a,i.a,!1,r,"data-v-228a1284",null);e.a=l.exports},function(t,e){},function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{class:{open:t.showMenu}},[a("div",{staticClass:"atc",on:{click:function(e){t.showMenu=!t.showMenu}}},[t._v("ATC")]),t._v(" "),t.showMenu?a("div",{staticClass:"menu"},[a("div",{staticClass:"menu-inner"},[a("div",{staticClass:"text-faded",on:{click:function(e){t.showMenu=!1}}},[t._v("Close ATC")]),t._v(" "),a("h2",[t._v("ATC")]),t._v(" "),t.$root.airport.open?t.$root.config.lastLandingSlot-t.$root.mainTick>0?a("p",[a("b",[t._v("Open for "+t._s((t.$root.config.lastLandingSlot-t.$root.mainTick)/10)+" hours")])]):a("p",[a("b",{staticClass:"error"},[t._v("Arrivals closed.")]),a("br"),t._v("Departures open for "+t._s((220-t.$root.mainTick)/10)+" hours")]):a("p",{staticClass:"error"},[a("b",[t._v("Airport closed")])]),t._v(" "),t._l(t.groupedConversations,function(e,n,s){return s<40?a("div",{staticClass:"flight"},[a("h4",[t._v("Flight "+t._s(n))]),t._v(" "),t._l(e,function(e){return a("div",{staticClass:"message",class:{response:e.isAtc}},[a("p",[t._v(t._s(e.message))])])})],2):t._e()})],2)]):t._e()])},s=[],i={render:n,staticRenderFns:s};e.a=i},function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{class:{"airport-closed":!t.$root.airport.open},attrs:{id:"app"}},[t._m(0),t._v(" "),a("tutorial"),t._v(" "),a("main",[a("settings"),t._v(" "),a("notifications"),t._v(" "),t.$root.gameOver?a("div",{staticClass:"game-over"},[a("h1",[t._v("Game Over")]),t._v(" "),a("p",[t._v("You went bankrupt")]),t._v(" "),a("button",{on:{click:t.restart}},[t._v("Restart")])]):a("board",t._l(t.$root.player.planes,function(t){return a("plane",{key:t.id,attrs:{plane:t}})}),1),t._v(" "),a("status-bar"),t._v(" "),a("store"),t._v(" "),a("atc")],1)],1)},s=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"screen-too-small"},[a("img",{staticClass:"logo",attrs:{src:"/static/img/plane.jpg",alt:""}}),t._v(" "),a("h1",[t._v("Airport")]),t._v(" "),a("p",[t._v("A game where you manage an airport.")]),t._v(" "),a("p",{staticClass:"text-faded"},[t._v("Rotate your phone to continue.")])])}],i={render:n,staticRenderFns:s};e.a=i}],[1]);
//# sourceMappingURL=app.2da30a02decc25bece54.js.map