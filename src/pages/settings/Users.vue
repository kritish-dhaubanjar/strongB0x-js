<template>
  <div>
    <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Menu @insert="insert" :types="roles" />
    <List @update="update" :items="users" :types="roles" />
  </div>
</template>

<script>
import Menu from "@/components/settings/users/Menu";
import List from "@/components/settings/users/List";
import axios from "axios";

export default {
  data() {
    return {
      overlay: false,
      users: [],
      roles: []
    };
  },
  created() {
    this.overlay = true;
    axios.get("/api/users").then(res => {
      this.users = res.data.map(e => {
        e.enabled = !!e.enabled || e.enabled == 1;
        return e;
      });
      this.overlay = false;
    });

    axios.get("/api/roles").then(res => {
      this.roles = res.data.map(e => {
        return {
          text: e.name,
          value: e.id
        };
      });
    });
  },
  components: {
    Menu,
    List
  },
  methods: {
    insert(payload) {
      this.users.push(payload);
    },
    update({ index, data }) {
      this.users.splice(index, 1, data);
    }
  }
};
</script>