<template>
  <v-app-bar app color="primary" dark flat dense>
    <v-btn icon @click="$emit('drawer')">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-toolbar-title class="subtitle-2">{{ company.name }}</v-toolbar-title>
    <v-spacer></v-spacer>

    <v-btn icon>
      <v-icon>mdi-help-circle-outline</v-icon>
    </v-btn>

    <v-btn icon @click="logout">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import axios from "axios";

export default {
  props: ["company"],
  methods: {
    logout() {
      axios.post("/api/logout").then((res) => {
        if (res.data.status == 200) {
          this.$auth.destroyToken();
          document.cookie =
            "strongb0x_accounting_session= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
          this.$emit("loggedOut");
        }
      });
    },
  },
};
</script>
