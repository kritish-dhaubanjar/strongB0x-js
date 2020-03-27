<template>
  <div>
    <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Menu @insert="insert" :types="types" />
    <List @update="update" :items="categories" :types="types" />
  </div>
</template>

<script>
import Menu from "@/components/settings/categories/Menu";
import List from "@/components/settings/categories/List";
import axios from "axios";

export default {
  data() {
    return {
      overlay: false,
      categories: [],
      types: ["income", "expense", "item", "other"]
    };
  },
  created() {
    this.overlay = true;
    axios.get("/api/categories").then(res => {
      this.categories = res.data.data;
      this.overlay = false;
    });
  },
  components: {
    Menu,
    List
  },
  methods: {
    insert(payload) {
      this.categories.push(payload);
    },
    update({ index, data }) {
      this.categories.splice(index, 1, data);
    }
  }
};
</script>