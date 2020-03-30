<template>
  <div class="mb-10">
    <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-row>
      <v-col cols="6">
        <h1 class="title" v-text="customer.name"></h1>
      </v-col>
      <v-col cols="6">
        <v-autocomplete
          :items="customers"
          v-model="customer.id"
          hide-no-data
          hide-selected
          dense
          @change="getLedger"
          item-value="id"
          item-text="name"
          label="Customers"
          placeholder="Start typing to Search"
          prepend-icon="mdi-database-search"
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="3">
        <v-card class="mx-auto mb-5" tile>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="body-2 pb-0 font-weight-medium">Invoices</v-card-title>
              <v-card-title class="body-2 font-weight-medium">Transactions</v-card-title>
            </div>
            <div>
              <v-card-title class="body-2 pb-0 text-right">{{customer.invoices.length}}</v-card-title>
              <v-card-title class="body-2 text-right">{{customer.transactions.length}}</v-card-title>
            </div>
          </div>
        </v-card>
        <v-card class="mx-auto mb-5" tile>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="body-2 pb-0 font-weight-medium">Email</v-card-title>
              <v-card-text class="caption">
                <p class="mb-0">{{customer.email}}</p>
              </v-card-text>
              <v-card-title class="body-2 py-0 font-weight-medium">Phone</v-card-title>
              <v-card-text class="caption">
                <p class="mb-0">{{customer.phone}}</p>
              </v-card-text>
              <v-card-title class="body-2 py-0 font-weight-medium">TAX Number</v-card-title>
              <v-card-text class="caption">
                <p class="mb-0">{{customer.tax_number}}</p>
              </v-card-text>
              <v-card-title class="body-2 py-0 font-weight-medium">Address</v-card-title>
              <v-card-text class="caption">
                <p class="mb-0">{{customer.address}}</p>
              </v-card-text>
            </div>
          </div>
        </v-card>
        <v-card class="mx-auto mb-5" tile>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="body-2 pb-0 font-weight-medium">Opening Balance</v-card-title>
              <v-card-text class="caption">
                <p class="mb-0">NPR {{customer.opening_balance}}</p>
              </v-card-text>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col>
        <v-row no-gutters>
          <v-col cols="12" sm="4">
            <v-card tile class="mr-sm-4" color="#62AC5B" dark>
              <div>
                <v-card-title class="body-1 pb-0 font-weight-medium">Paid</v-card-title>
                <v-card-text class="title">
                  <p class="mb-0">NPR {{debit}}</p>
                </v-card-text>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card tile class="mr-sm-2 ml-sm-2" color="#F70034" dark>
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="body-1 pb-0 font-weight-medium">Open Invoice</v-card-title>
                  <v-card-text class="title">
                    <p class="mb-0">NPR {{credit}}</p>
                  </v-card-text>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card tile class="ml-sm-4" color="#556BE7" dark>
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="body-1 pb-0 font-weight-medium">Total Invoice</v-card-title>
                  <v-card-text class="title">
                    <p class="mb-0">NPR {{total}}</p>
                  </v-card-text>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <v-row no-gutters class="my-5">
          <v-tabs class="elevation-2" grow="grow">
            <v-tabs-slider></v-tabs-slider>

            <v-tab href="#tabInvoice">Invoices</v-tab>
            <v-tab href="#tabTansactions">Tansactions</v-tab>

            <v-tab-item value="tabInvoice">
              <v-data-table
                :headers="invoices.headers"
                :items="customer.invoices"
                :items-per-page="10"
                class="elevation-1"
                :footer-props="{
            'items-per-page-options': [10, 25, 50, 100, -1]
        }"
              ></v-data-table>
            </v-tab-item>
            <v-tab-item value="tabTansactions">
              <v-data-table
                :headers="transactions.headers"
                :items="customer.transactions"
                :items-per-page="10"
                class="elevation-1"
                :footer-props="{
            'items-per-page-options': [10, 25, 50, 100, -1]
        }"
              ></v-data-table>
            </v-tab-item>
            <v-tab-item value="tabTansactions"></v-tab-item>
          </v-tabs>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      overlay: true,
      accounts: [],
      categories: [],
      customer: {
        id: null,
        name: "Customer Ledger Report",
        opening_balance: 0,
        invoices: [],
        transactions: []
      },
      customers: [
        {
          text: "Hello",
          value: 1
        }
      ],
      transactions: {
        headers: [
          {
            text: "Date",
            align: "start",
            sortable: true,
            value: "date"
          },
          { text: "Amount", value: "amount" },
          { text: "Category", value: "category.name" },
          { text: "Account", value: "account.name" }
        ]
      },
      invoices: {
        headers: [
          {
            text: "Invoice Number",
            align: "start",
            sortable: true,
            value: "invoice_number"
          },
          { text: "Date", value: "date" },
          { text: "Amount", value: "amount" },
          { text: "Category", value: "category.name" }
        ]
      }
    };
  },
  created() {
    axios.get("/api/contacts/customer").then(res => {
      this.customers = res.data.data;
      this.overlay = false;
    });
  },

  computed: {
    debit() {
      if (this.customer.transactions.length > 0) {
        return this.customer.transactions.reduce((accumulator, { amount }) => {
          return accumulator + amount;
        }, 0);
      }
      return 0;
    },

    credit() {
      return this.total - this.debit;
    },

    total() {
      if (this.customer.invoices.length > 0) {
        return this.customer.invoices.reduce((accumulator, { amount }) => {
          return accumulator + amount;
        }, 0);
      }
      return 0;
    }
  },

  methods: {
    getLedger() {
      this.overlay = true;
      // let intl = new Intl.NumberFormat("en-IN");
      axios.get(`/api/reports/ledger/${this.customer.id}`).then(res => {
        this.customer = res.data;
        this.overlay = false;
      });
    }
  }
};
</script>