<template>
<div :class="{ open: showMenu }">
  <div class="notifications-toggle toggle" @click="showMenu = !showMenu" title="History">
    <eva-icon name="bell-outline"></eva-icon>
  </div>
  <div class="notifications" v-if="showMenu">
    <h3>History</h3>
    <div class="notification-history" v-for="(item, i) in history" :key="i">
      {{ item.content }}
    </div>
  </div>
  <div class="live-feed" v-if="notifications.length">
    <div v-for="(notification, i) in notifications"
    v-show="i < 5"
    class="notification"
    @click="showMenu = true"
    :key="notification.id"
    :style="{ top: `${i * 15}px`, opacity: 1 - (i * 0.2), 'z-index': 10-i }">
      {{ notification.content }}
    </div>
  </div>
</div>
</template>

<script>
import { bus } from '@/main'
import _ from 'lodash'
export default {
  name: 'notifications',
  components: {
    bus
  },
  data () {
    return {
      showMenu: false,
      notifications: [],
      history: []
    }
  },
  created () {
    bus.$on('notification', (data) => {
      this.createNotification(data)
    })

    bus.$on('error', (data) => {
      this.createNotification(data)
    })
  },
  computed: {
  },
  methods: {
    createNotification (data) {
      let notification = {
        content: data,
        id: Math.random() * Math.random() * 10000 / Math.random() * Math.random()
      }
      this.history.unshift(notification)
      this.notifications.unshift(notification)
      setTimeout(() => {
        // this.notification = null
        let i = _.findIndex(this.notifications, { id: notification.id })
        this.$delete(this.notifications, i)
      }, 5000)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.notifications-toggle {
  top: 30px;
}

.notifications {
  position: absolute;
  z-index: 10;
  top: 30px;
  right: 105px;
  width: 250px;
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 10px -3px rgba(0, 0, 0, .2);
  animation: notifications .5s forwards cubic-bezier(.2, 1.4, .5, 1);
  text-align: left;
}

.live-feed {
  position: fixed;
  top: 30px;
  right: 105px;
  width: 250px;
  z-index: 9;
}

.notification {
  background-color: white;
  color: black;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, .5);
  cursor: pointer;
  padding: 10px 15px;
  margin-bottom: 10px;
  text-align: left;
  border-radius: 10px;
  animation: notifications .5s forwards cubic-bezier(.2, 1.4, .5, 1);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.notifications {
  height: 350px;
  overflow-y: auto;
}

.notification-history {
  padding: 8px 10px;
  border-top: 1px solid rgba(0, 0, 0, .2);
}

@keyframes notifications {
  from {
    transform: translateY(-40px);
  }
  to {
    transform: none;
  }
}
</style>
