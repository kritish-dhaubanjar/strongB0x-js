<template>
  <v-app>
    <Login v-if="!isAuth" @loggedIn="loggedIn" />
    <Bar v-if="isAuth" @loggedOut="isAuth=false" :company="company" />
    <Drawer v-if="isAuth" :user="user" :company="company" />
    <v-content v-if="isAuth">
      <v-container class="py-3 px-6">
        <router-view />
        <Footer />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Login from "@/pages/auth/Login";
import Bar from "@/components/Bar";
import Drawer from "@/components/Drawer";
import Footer from "@/components/Footer";
import axios from "axios";

export default {
  data() {
    return {
      isAuth: false,
      user: {},
      company: {},
      roles: []
    };
  },

  created() {
    this.isAuth = this.$auth.isAuth();
    if (this.isAuth) {
      this.getUser();
    }
  },

  methods: {
    loggedIn() {
      this.isAuth = true;
      this.getUser();
    },

    getUser() {
      axios
        .get("/api/user")
        .then(res => {
          this.user = res.data.user;
          this.roles = res.data.roles;
        })
        .then(() => {
          axios.get("/api/company").then(res => {
            this.company = res.data;
          });
        })
        .catch(() => {
          this.isAuth = false;
          this.$auth.destroyToken();
        });
    }
  },

  components: {
    Bar,
    Drawer,
    Footer,
    Login
  }
};
</script>

<style>
input,
label,
.v-select__selection,
textarea {
  font-size: 14px !important;
}

td {
  font-size: 0.84rem !important;
}

.v-menu__content {
  max-height: 360px !important;
}

*::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}

*::-webkit-scrollbar {
  width: 10px;
  background-color: #f5f5f5;
}

*::-webkit-scrollbar-thumb {
  background-color: #0ae;

  background-image: -webkit-gradient(
    linear,
    0 0,
    0 100%,
    color-stop(0.5, rgba(255, 255, 255, 0.2)),
    color-stop(0.5, transparent),
    to(transparent)
  );
}
</style>
