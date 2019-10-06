<template>
<div :class="{ open: showMenu }">
  <div class="notifications-toggle toggle" @click="showMenu = !showMenu" title="History">
    <eva-icon name="bell-outline"></eva-icon>
  </div>
  <div class="notifications" v-if="showMenu">
    <h3>History</h3>
    <div class="notification-history" v-for="(item, i) in history" :key="i" :class="{ error: item.type === 'ERROR' }">
      {{ item.content }}
    </div>
  </div>
  <div class="live-feed" v-if="notifications.length">
    <div v-for="(notification, i) in notifications"
    v-show="i < 5"
    class="notification"
    :class="{ error: notification.type === 'ERROR' }"
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
      this.createNotification(data, 'NORMAL')
    })

    bus.$on('error', (data) => {
      this.createNotification(data, 'ERROR')
    })
  },
  computed: {
  },
  methods: {
    createNotification (data, type) {
      let notification = {
        content: data,
        id: Math.random() * Math.random() * 10000 / Math.random() * Math.random(),
        type: type
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
  top: 15px;
}

.notifications {
  position: absolute;
  z-index: 20;
  top: 15px;
  right: 90px;
  width: 250px;
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 10px -3px rgba(0, 0, 0, .2);
  text-align: left;
}

.live-feed {
  position: fixed;
  top: 15px;
  right: 105px;
  width: 250px;
  z-index: 9;
}

.notification {
  background-color: hsl(215deg, 30%, 90%);
  color: black;
  /* box-shadow: 0 10px 20px -5px rgba(0, 0, 0, .5); */
  cursor: pointer;
  padding: 10px 15px;
  margin-bottom: 10px;
  text-align: left;
  border-radius: 10px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.notification.error {
  background-color: hsl(335, 100%, 50%);
  color: white;
}

.notifications {
  height: 350px;
  max-height: 70vh;
  overflow-y: auto;
}

.notification-history {
  padding: 8px 10px;
  border-top: 1px solid rgba(0, 0, 0, .2);
}

.notification-history.error {
  color: hsl(335, 100%, 50%);
  font-weight: 700;
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
