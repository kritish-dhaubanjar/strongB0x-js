<template>
  <div class="mb-10">
    <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-row>
      <v-col cols="6">
        <h1 class="title py-3" v-text="vendor.name"></h1>
      </v-col>
      <v-col cols="6">
        <v-autocomplete
          :items="vendors"
          v-model="vendor.id"
          hide-no-data
          hide-selected
          @change="getLedger"
          item-value="id"
          item-text="name"
          label="Vendors"
          placeholder="Start typing to Search"
          prepend-icon="mdi-database-search"
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-card class="mx-auto mb-5" tile>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="body-2 pb-0 font-weight-medium">Bills</v-card-title>
              <v-card-title class="body-2 font-weight-medium">Transactions</v-card-title>
            </div>
            <div>
              <v-card-title class="body-2 pb-0 text-right">{{vendor.bills.length}}</v-card-title>
              <v-card-title class="body-2 text-right">{{vendor.transactions.length}}</v-card-title>
            </div>
          </div>
        </v-card>
        <v-card class="mx-auto mb-5" tile>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="body-2 pb-0 font-weight-medium">Email</v-card-title>
              <v-card-text class="caption">
                <p class="mb-0">{{vendor.email}}</p>
              </v-card-text>
              <v-card-title class="body-2 py-0 font-weight-medium">Phone</v-card-title>
              <v-card-text class="caption">
                <p class="mb-0">{{vendor.phone}}</p>
              </v-card-text>
              <v-card-title class="body-2 py-0 font-weight-medium">TAX Number</v-card-title>
              <v-card-text class="caption">
                <p class="mb-0">{{vendor.tax_number}}</p>
              </v-card-text>
              <v-card-title class="body-2 py-0 font-weight-medium">Address</v-card-title>
              <v-card-text class="caption">
                <p class="mb-0">{{vendor.address}}</p>
              </v-card-text>
            </div>
          </div>
        </v-card>
        <v-card class="mx-auto mb-5" tile>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="body-2 pb-0 font-weight-medium">Opening Balance</v-card-title>
              <v-card-text class="caption">
                <p class="mb-0">NPR {{vendor.opening_balance}}</p>
              </v-card-text>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col>
        <v-row no-gutters>
          <v-col cols="4">
            <v-card tile class="mr-4" color="#62AC5B" dark>
              <div>
                <v-card-title class="body-1 pb-0 font-weight-medium">Paid</v-card-title>
                <v-card-text class="title">
                  <p class="mb-0">NPR {{debit}}</p>
                </v-card-text>
              </div>
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card tile class="mr-2 ml-2" color="#F70034" dark>
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
          <v-col cols="4">
            <v-card tile class="ml-4" color="#556BE7" dark>
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

            <v-tab href="#tabBills">Bills</v-tab>
            <v-tab href="#tabTansactions">Tansactions</v-tab>

            <v-tab-item value="tabBills">
              <v-data-table
                :headers="bills.headers"
                :items="vendor.bills"
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
                :items="vendor.transactions"
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
      vendor: {
        id: null,
        name: "Vendor Ledger Report",
        opening_balance: 0,
        bills: [],
        transactions: []
      },
      vendors: [
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
      bills: {
        headers: [
          {
            text: "Bill Number",
            align: "start",
            sortable: true,
            value: "bill_number"
          },
          { text: "Date", value: "date" },
          { text: "Amount", value: "amount" },
          { text: "Category", value: "category.name" }
        ]
      }
    };
  },
  created() {
    axios.get("/api/contacts/vendor").then(res => {
      this.vendors = res.data.data;
      this.overlay = false;
    });
  },

  computed: {
    debit() {
      if (this.vendor.transactions.length > 0) {
        return this.vendor.transactions.reduce((accumulator, { amount }) => {
          return accumulator + amount;
        }, 0);
      }
      return 0;
    },

    credit() {
      return this.total - this.debit;
    },

    total() {
      if (this.vendor.bills.length > 0) {
        return this.vendor.bills.reduce((accumulator, { amount }) => {
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
      axios.get(`/api/reports/ledger/${this.vendor.id}`).then(res => {
        this.vendor = res.data;
        this.overlay = false;
      });
    }
  }
};
</script>