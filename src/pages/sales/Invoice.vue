<template>
  <div>
    <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <Menu
      @customer="dialog=true"
      :products="products"
      :taxes="taxes"
      :accounts="accounts"
      :methods="methods"
      :customers="customers"
      :categories="categories"
      @insert="insert"
    />
    <Jumbotron v-if="invoices.length == 0" />
    <List
      v-else
      :products="products"
      :taxes="taxes"
      :accounts="accounts"
      :methods="methods"
      :customers="customers"
      :categories="categories"
      :items="invoices"
      @update="update"
    />
    <Customer :dialog="dialog" @close="refresh" />
  </div>
</template>

<script>
import Menu from "@/components/sales/invoices/Menu";
import Jumbotron from "@/components/sales/invoices/Jumbotron";
import List from "@/components/sales/invoices/List";
import Customer from "@/components/sales/invoices/Customer";
import axios from "axios";

export default {
  data() {
    return {
      //
      dialog: false,
      //
      overlay: false,
      invoices: [],
      accounts: [],
      customers: [],
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
    axios.get("/api/contacts/customer").then(res => {
      this.customers = res.data.data.map(e => {
        return {
          value: e.id,
          text: e.name
        };
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
    axios.get("/api/items").then(res => {
      this.products = res.data.data.map(e => {
        return {
          value: e.id,
          text: e.name,
          price: e.sale_price,
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
    axios.get("/api/sales").then(res => {
      this.invoices = res.data.data;
      this.overlay = false;
    });
  },
  components: {
    Menu,
    Jumbotron,
    List,
    Customer
  },
  methods: {
    insert(payload) {
      this.invoices.unshift(payload);
    },
    update({ index, data }) {
      this.invoices.splice(index, 1, data);
    },
    refresh() {
      this.dialog = false;
      axios.get("/api/contacts/customer").then(res => {
        this.customers = res.data.data.map(e => {
          return {
            value: e.id,
            text: e.name
          };
        });
      });
    }
  }
};
</script>