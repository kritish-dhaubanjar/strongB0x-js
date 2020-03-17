<template>
  <div>
    <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Menu :accounts="accounts" :methods="methods" @insert="insert" />
    <Jumbotron v-if="transfers.length == 0" />
    <List v-else :accounts="accounts" :methods="methods" @update="update" :items="transfers" />
  </div>
</template>

<script>
import Menu from "@/components/transfer/Menu";
import Jumbotron from "@/components/transfer/Jumbotron";
import List from "@/components/transfer/List";
import axios from "axios";

export default {
  data() {
    return {
      overlay: false,
      transfers: [],
      accounts: [],
      methods: ["Cash", "Cheque", "Bank Transfer"]
    };
  },
  created() {
    this.overlay = true;
    axios.get("/api/accounts").then(res => {
      this.accounts = res.data.data.map(e => {
        return {
          value: e.id,
          text: e.name
        };
      });
    });
    axios.get("/api/transfers").then(res => {
      this.transfers = res.data.data;
      this.overlay = false;
    });
  },
  components: {
    Menu,
    Jumbotron,
    List
  },
  methods: {
    insert(payload) {
      this.transfers.unshift(payload);
    },
    update({ index, data }) {
      this.transfers.splice(index, 1, data);
    }
  }
};
</script>