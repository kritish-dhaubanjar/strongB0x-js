<template>
  <div>
    <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Menu @insert="insert" />
    <List @update="update" :items="accounts" />
  </div>
</template>

<script>
import Menu from "@/components/banking/accounts/Menu";
import List from "@/components/banking/accounts/List";
import axios from "axios";

export default {
  data() {
    return {
      overlay: false,
      accounts: []
    };
  },
  created() {
    this.overlay = true;
    axios.get("/api/accounts").then(res => {
      this.accounts = res.data.data;
      this.overlay = false;
    });
  },
  components: {
    Menu,
    List
  },
  methods: {
    insert(payload) {
      this.accounts.push(payload);
    },
    update({ index, data }) {
      this.accounts.splice(index, 1, data);
    }
  }
};
</script>