<template>
  <div>
    <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Menu @insert="insert" :units="units" :categories="categories" :taxes="taxes" />
    <Jumbotron v-if="items.length == 0" />
    <List
      v-else
      @update="update"
      :items="items"
      :units="units"
      :categories="categories"
      :taxes="taxes"
    />
  </div>
</template>

<script>
import Menu from "@/components/inventory/products/Menu";
import Jumbotron from "@/components/inventory/products/Jumbotron";
import List from "@/components/inventory/products/List";
import axios from "axios";

export default {
  data() {
    return {
      overlay: false,
      items: [],
      units: [],
      categories: [],
      taxes: []
    };
  },
  created() {
    this.overlay = true;

    axios.get("/api/items").then(data => {
      this.items = data.data.data;
      this.overlay = false;
    });
    axios.get("/api/units").then(res => {
      let mapped = res.data.data.map(e => {
        return {
          value: e.id,
          text: e.name,
          enabled: e.enabled
        };
      });

      this.units = [
        {
          text: "None",
          value: null,
          enabled: true
        },
        ...mapped
      ];
    });
    axios.get("/api/categories").then(res => {
      let mapped = res.data.data.map(e => {
        return {
          value: e.id,
          text: e.name,
          enabled: e.enabled
        };
      });

      this.categories = [
        {
          text: "None",
          value: null,
          enabled: true
        },
        ...mapped
      ];
    });
    axios.get("/api/taxes").then(res => {
      let mapped = res.data.data.map(e => {
        return {
          value: e.id,
          text: e.name,
          rate: e.rate,
          enabled: e.enabled
        };
      });
      this.taxes = [
        {
          text: "None",
          value: null,
          enabled: true
        },
        ...mapped
      ];
    });
  },
  components: {
    Menu,
    Jumbotron,
    List
  },
  methods: {
    insert(payload) {
      this.items.unshift(payload);
    },
    update({ index, data }) {
      this.items.splice(index, 1, data);
    }
  }
};
</script>