<template>
  <div>
    <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Menu @insert="insert" />
    <Jumbotron v-if="customers.length == 0" />
    <List v-else @update="update" :items="customers" />
  </div>
</template>

<script>
import Menu from "@/components/sales/customer/Menu";
import Jumbotron from "@/components/sales/customer/Jumbotron";
import List from "@/components/sales/customer/List";
import axios from "axios";

export default {
  data() {
    return {
      overlay: false,
      customers: []
    };
  },
  created() {
    this.overlay = true;
    axios.get("/api/contacts/customer").then(res => {
      this.customers = res.data.data;
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
      this.customers.unshift(payload);
    },
    update({ index, data }) {
      this.customers.splice(index, 1, data);
    }
  }
};
</script>