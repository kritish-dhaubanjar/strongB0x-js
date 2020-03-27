<template>
  <div>
    <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Menu @insert="insert" />
    <Jumbotron v-if="vendors.length == 0" />
    <List v-else @update="update" :items="vendors" />
  </div>
</template>

<script>
import Menu from "@/components/purchases/vendor/Menu";
import Jumbotron from "@/components/purchases/vendor/Jumbotron";
import List from "@/components/purchases/vendor/List";
import axios from "axios";

export default {
  data() {
    return {
      overlay: false,
      vendors: []
    };
  },
  created() {
    this.overlay = true;
    axios.get("/api/contacts/vendor").then(res => {
      this.vendors = res.data.data;
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
      this.vendors.unshift(payload);
    },
    update({ index, data }) {
      this.vendors.splice(index, 1, data);
    }
  }
};
</script>