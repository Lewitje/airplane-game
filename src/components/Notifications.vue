<template>
<div :class="{ open: showMenu }">
  <div class="notifications-toggle toggle" @click="showMenu = !showMenu" title="History">
    <eva-icon name="bell-outline"></eva-icon>
  </div>
  <div class="notifications" v-if="showMenu">
    <h3>History</h3>
    <div class="notification-history" v-for="(item, i) in history" :key="i" :class="{ error: item.type === 'IMPORTANT' }">
      {{ item.content }}
    </div>
  </div>
  <div class="live-feed" v-if="notifications.length || showAchievement">
    <div v-for="item in achievements" :key="item.content" class="achievement" v-if="!item.seen">
      <eva-icon name="star" :width="100" :height="100"></eva-icon>
      <h2>{{ item.content }}</h2>
      <button @click="item.seen = true">Dismiss</button>
    </div>

    <div v-for="(notification, i) in notifications"
    v-if="notification.type === 'IMPORTANT'"
    class="notification"
    :class="{ error: notification.type === 'IMPORTANT' }"
    :key="notification.id"
    :style="{ top: `${i * 5}px`, opacity: 1 - (i * 0.2), 'z-index': 10-i }">
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
      showAchievement: false,
      notifications: [],
      history: [],
      achievements: []
    }
  },
  created () {
    bus.$on('notification', (data) => {
      this.createNotification(data, 'NORMAL')
    })

    bus.$on('important', (data) => {
      this.createNotification(data, 'IMPORTANT')
    })

    bus.$on('achievement', (data) => {
      this.createAchievement(data)
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
    },
    createAchievement (data) {
      let achievement = {
        content: data,
        seen: false
      }
      this.achievements.push(achievement)
      this.showAchievement = true
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
  right: 90px;
  width: 250px;
  z-index: 19;
}

.notification {
  background-color: hsl(215deg, 30%, 85%);
  color: black;
  /* box-shadow: 0 10px 20px -5px rgba(0, 0, 0, .5); */
  cursor: pointer;
  padding: 10px 15px;
  margin-bottom: 10px;
  text-align: left;
  border-radius: 10px;
}

.notification.error {
  background-color: hsl(215, 100%, 50%);
  color: white;
}

.notifications {
  height: 350px;
  max-height: 70vh;
  overflow-y: auto;
}

.notification-history {
  padding: 8px 10px;
  background-color: rgba(0, 0, 0, .05);
  border-radius: 4px;
  margin-top: 5px;

}

.notification-history.error {
  background-color: hsl(215, 100%, 50%);
  color: white;
}

.achievement {
  background-color: white;
  padding: 20px 10px;
  background-color: white;
  color: black;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, .2);
  border-radius: 4px;
  fill: hsl(40deg, 100%, 50%);
  margin-bottom: 20px;
}

.achievement .eva-hover {
  display: block;
  margin: 0 auto 20px;
  animation: achievement .5s infinite alternate-reverse cubic-bezier(.6, 0, .4, 1);
}

@keyframes achievement {
  from {
    transform: rotate(-10deg);
  }
  to {
    transform: rotate(10deg);
  }
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
