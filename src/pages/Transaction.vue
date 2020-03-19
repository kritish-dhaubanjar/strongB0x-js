<template>
  <div>
    <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Menu />
    <List :items="transactions" />
  </div>
</template>

<script>
import Menu from "@/components/transaction/Menu";
import List from "@/components/transaction/List";
import axios from "axios";

export default {
  data() {
    return {
      overlay: false,
      transactions: []
    };
  },
  created() {
    this.overlay = true;
    axios.get("/api/transactions").then(res => {
      this.transactions = res.data.data;
      this.overlay = false;
    });
  },
  components: {
    Menu,
    List
  }
};
</script>