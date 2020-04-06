<template>
  <v-content>
    <v-snackbar v-model="error" top color="red lighten-1">
      {{text}}
      <v-btn dark text @click="error = false">Close</v-btn>
    </v-snackbar>
    <v-container class="fill-height" fluid @keydown.enter="login">
      <v-row align="center" justify="center" style="max-width: unset !important;">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12" tile>
            <v-card-text>
              <v-text-field
                placeholder="User"
                prepend-icon="mdi-account-circle"
                type="email"
                autofocus
                v-model="user.email"
                :rules="emailRules"
                required
              />

              <v-text-field
                placeholder="Password"
                prepend-icon="mdi-lock"
                type="password"
                v-model="user.password"
                :rules="passwordRules"
                required
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn block color="purple darken-2" dark @click="login">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        email: "",
        password: ""
      },
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      passwordRules: [v => !!v || "Password is required"],
      error: false,
      text: ""
    };
  },

  methods: {
    login() {
      axios
        .post("/api/login", this.user)
        .then(res => {
          if (res.data.status == 401) {
            this.text = "These credentials do not match our records.";
            this.error = true;
          } else if (res.data.status == 200) {
            this.$auth.setToken(res.data.token);
            this.$router.push({ name: "Dashboard" });
            this.$emit("loggedIn");
          }
        })
        .catch(() => {
          this.text = "The given data was invalid.";
          this.error = true;
        });
    }
  }
};
</script>

<style scoped>
.fill-height {
  background-image: url("~@/assets/kelly-sikkema.jpg");
  background-size: cover;
  background-position: center;
}
</style>