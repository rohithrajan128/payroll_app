<template>
  <div id="app">
    <!-- <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      color="orange"
      centered
      top
      v-if="user"
    >
      {{ messagetitle }} <br />
      {{ messagebody }}

      <template v-slot:action="{ attrs }">
        <v-btn color="black" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar> -->
    <component :is="layout">
      <FlashMessage
        :position="'right bottom'"
        style="position: fixed; z-index: 15000"
      ></FlashMessage>
      <transition name="scale" mode="out-in">
        <router-view></router-view>
      </transition>
    </component>
  </div>
</template>

<script>
// import { getMessaging, onMessage } from "firebase/messaging";
// import * as firebase from "firebase/app";

const default_layout = "default";

export default {
  data: () => ({
    // messagetitle: "",
    // messagebody: "",
    // snackbar: false,
    user: "",
  }),
  mounted() {
    // window.addEventListener("localstorage-user", (event) => {
    //   this.user = JSON.parse(localStorage.getItem("user"));
    //   this.snackbar = false;
    //   console.log(event);
    //   this.firebase_function();
    // });
    // var config = {
    //   messagingSenderId: process.env.VUE_APP_FIREBASE_SENDER_ID,
    //   apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    //   projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    //   appId: process.env.VUE_APP_FIREBASE_APP_ID,
    // };
    // firebase.initializeApp(config);
    // this.firebase_function();
  },
  computed: {
    layout() {
      return (this.$route.meta.layout || default_layout) + "-layout";
    },
  },
  methods: {
    // firebase_function() {
    //   this.user = JSON.parse(localStorage.getItem("user"));
    //   const messaging = getMessaging();
    //   onMessage(messaging, (payload) => {
    //     this.messagetitle = payload.notification.title;
    //     this.messagebody = payload.notification.body;
    //     this.snackbar = true;
    //     localStorage.setItem("msgtitle", this.messagetitle);
    //     localStorage.setItem("msgbody", this.messagebody);
    //     window.dispatchEvent(
    //       new CustomEvent("localstorage-notificaion", {
    //         detail: {
    //           storage: localStorage.getItem("msgtitle"),
    //         },
    //       })
    //     );
    //   });
    // },
  },
};
</script>

<style lang="scss">
// @import "~@fullcalendar/core/main.css";
// @import "~@fullcalendar/daygrid/main.css";
// @import "~@fullcalendar/timegrid/main.css";
@import "assets/base.scss";
@import "assets/global.css";
</style>
<style lang="css">
.scale-enter-active,
.scale-leave-active {
  transition: all 0.6s ease !important;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0 !important;
  transform: scale(0.9) !important;
}
</style>
