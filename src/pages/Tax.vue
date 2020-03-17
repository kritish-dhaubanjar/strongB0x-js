<template>
  <div>
    <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Menu @insert="insert" />
    <List @update="update" :items="taxes" />
  </div>
</template>

<script>
import Menu from "@/components/taxes/Menu";
import List from "@/components/taxes/List";
import axios from "axios";

export default {
  data() {
    return {
      overlay: false,
      taxes: []
    };
  },
  created() {
    this.overlay = true;
    axios.get("/api/taxes").then(res => {
      this.taxes = res.data.data;
      this.overlay = false;
    });
  },
  components: {
    Menu,
    List
  },
  methods: {
    insert(payload) {
      this.taxes.push(payload);
    },
    update({ index, data }) {
      this.taxes.splice(index, 1, data);
    }
  }
};
</script>