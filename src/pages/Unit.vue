<template>
  <div>
    <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Menu @insert="insert" />
    <List @update="update" :items="units" />
  </div>
</template>

<script>
import Menu from "@/components/units/Menu";
import List from "@/components/units/List";
import axios from "axios";

export default {
  data() {
    return {
      overlay: false,
      units: []
    };
  },
  created() {
    this.overlay = true;
    axios.get("/api/units").then(res => {
      this.units = res.data.data;
      this.overlay = false;
    });
  },
  components: {
    Menu,
    List
  },
  methods: {
    insert(payload) {
      this.units.push(payload);
    },
    update({ index, data }) {
      this.units.splice(index, 1, data);
    }
  }
};
</script>