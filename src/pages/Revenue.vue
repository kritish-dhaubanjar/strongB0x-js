<template>
  <div>
    <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Menu
      :accounts="accounts"
      :methods="methods"
      :vendors="vendors"
      :categories="categories"
      @insert="insert"
    />
    <Jumbotron v-if="revenues.length == 0" />
    <List
      v-else
      :accounts="accounts"
      :methods="methods"
      :vendors="vendors"
      :categories="categories"
      :items="revenues"
      @update="update"
    />
  </div>
</template>

<script>
import Menu from "@/components/revenues/Menu";
import Jumbotron from "@/components/revenues/Jumbotron";
import List from "@/components/revenues/List";
import axios from "axios";

export default {
  data() {
    return {
      overlay: false,
      revenues: [],
      accounts: [],
      vendors: [],
      categories: [],
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
    axios.get("/api/contacts/customer").then(res => {
      this.vendors = res.data.data.map(e => {
        return {
          value: e.id,
          text: e.name
        };
      });
      this.vendors.unshift({
        text: "None",
        value: null
      });
    });
    axios.get("/api/categories/income").then(res => {
      this.categories = res.data.data.map(e => {
        return {
          value: e.id,
          text: e.name
        };
      });
    });
    axios.get("/api/transactions/revenues").then(res => {
      this.revenues = res.data.data;
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
      this.revenues.unshift(payload);
    },
    update({ index, data }) {
      this.revenues.splice(index, 1, data);
    }
  }
};
</script>