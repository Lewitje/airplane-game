<template>
<div :class="{ open: showMenu }">
  <div class="notifications-toggle toggle" @click="showMenu = !showMenu">
    <eva-icon name="swap-outline"></eva-icon>
  </div>
  <div class="notifications" v-if="showMenu">
    <h3>History</h3>
    <div class="notification-history" v-for="(item, i) in history" :key="i">
      {{ item.content }}
    </div>
  </div>
  <div v-if="notification" class="notification" @click="showMenu = true" :key="notification.id">
    {{ notification.content }}
  </div>
</div>
</template>

<script>
import { bus } from '@/main'

export default {
  name: 'notifications',
  components: {
    bus
  },
  data () {
    return {
      showMenu: false,
      notification: null,
      history: [],
      timer: null
    }
  },
  created () {
    bus.$on('notification', (data) => {
      let notification = {
        content: data,
        id: Math.random() * Math.random() * 10000 / Math.random() * Math.random()
      }
      this.history.unshift(notification)
      this.notification = notification
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.notification = null
      }, 4000)
    })
  },
  computed: {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.notifications-toggle {
  top: 30px;
}

.notifications,
.notification {
  position: absolute;
  z-index: 10;
  top: 30px;
  right: 105px;
  width: 250px;
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 10px -3px rgba(0, 0, 0, .5);
  animation: notifications .5s forwards cubic-bezier(.2, 1.4, .5, 1);
  text-align: left;
}

.notification {
  background-color: black;
  color: white;
  cursor: pointer;
  padding: 10px 15px;
}

.notifications {
  height: 350px;
  overflow-y: auto;
  top: 60px;
  background-color: rgba(50, 50, 50, .5);
  backdrop-filter: blur(20px) brightness(0.5);
  color: white;
}

.notification-history {
  padding: 8px 10px;
  border-top: 1px solid rgba(255, 255, 255, .2);
}

@keyframes notifications {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
</style>
