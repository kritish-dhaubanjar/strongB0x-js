<template>
  <div>
    <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Menu
      :products="products"
      :taxes="taxes"
      :accounts="accounts"
      :methods="methods"
      :vendors="vendors"
      :categories="categories"
      @insert="insert"
    />
    <Jumbotron v-if="bills.length == 0" />
    <List
      v-else
      :products="products"
      :taxes="taxes"
      :accounts="accounts"
      :methods="methods"
      :vendors="vendors"
      :categories="categories"
      :items="bills"
      @update="update"
    />
  </div>
</template>

<script>
import Menu from "@/components/bills/Menu";
import Jumbotron from "@/components/bills/Jumbotron";
import List from "@/components/bills/List";
import axios from "axios";

export default {
  data() {
    return {
      overlay: false,
      bills: [],
      accounts: [],
      vendors: [],
      categories: [],
      products: [],
      taxes: [],
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
    axios.get("/api/contacts/vendor").then(res => {
      this.vendors = res.data.data.map(e => {
        return {
          value: e.id,
          text: e.name
        };
      });
    });
    axios.get("/api/categories/expense").then(res => {
      this.categories = res.data.data.map(e => {
        return {
          value: e.id,
          text: e.name
        };
      });
    });
    axios.get("/api/items").then(res => {
      this.products = res.data.data.map(e => {
        return {
          value: e.id,
          text: e.name,
          price: e.purchase_price,
          tax_id: e.tax_id
        };
      });
    });
    axios.get("/api/taxes").then(res => {
      this.taxes = res.data.data.map(e => {
        return {
          value: e.id,
          text: e.name,
          rate: e.rate
        };
      });
      this.taxes.unshift({
        text: "None",
        value: null
      });
    });
    axios.get("/api/purchases").then(res => {
      this.bills = res.data.data;
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
      this.bills.unshift(payload);
    },
    update({ index, data }) {
      this.bills.splice(index, 1, data);
    }
  }
};
</script>