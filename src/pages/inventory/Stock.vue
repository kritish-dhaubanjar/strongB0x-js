<template>
  <div class="mb-10">
    <!-- <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>-->
    <v-row>
      <v-col cols="6">
        <h1 class="title" v-text="item.name"></h1>
      </v-col>
      <v-col cols="6">
        <v-autocomplete
          :items="items"
          v-model="item.id"
          hide-no-data
          hide-selected
          dense
          @change="getStock"
          item-value="id"
          item-text="name"
          label="Product"
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
              <v-card-title class="body-2 font-weight-medium">Bills</v-card-title>
            </div>
            <div>
              <v-card-title class="body-2 pb-0 text-right">{{invoices.data.length}}</v-card-title>
              <v-card-title class="body-2 text-right">{{bills.data.length}}</v-card-title>
            </div>
          </div>
        </v-card>
        <v-card class="mx-auto mb-5" tile>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="body-2 pb-0 font-weight-medium">Category</v-card-title>
              <v-card-text class="caption">
                <p class="mb-0" v-if="item.category">{{item.category.name}}</p>
              </v-card-text>
              <v-card-title class="body-2 py-0 font-weight-medium">Description</v-card-title>
              <v-card-text class="caption">
                <p class="mb-0">{{item.description}}</p>
              </v-card-text>
              <v-card-title class="body-2 py-0 font-weight-medium">Unit</v-card-title>
              <v-card-text class="caption">
                <p class="mb-0" v-if="item.unit">{{item.unit.name}}</p>
              </v-card-text>
              <v-card-title class="body-2 py-0 font-weight-medium">Tax</v-card-title>
              <v-card-text class="caption">
                <p class="mb-0" v-if="item.tax">{{item.tax.name}}</p>
              </v-card-text>
            </div>
          </div>
        </v-card>
        <v-card class="mx-auto mb-5" tile>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="body-2 pb-0 font-weight-medium">Opening Stock</v-card-title>
              <v-card-text class="caption">
                <p class="mb-0">{{item.quantity}}</p>
              </v-card-text>
              <v-card-title class="body-2 py-0 font-weight-medium">Sale Price</v-card-title>
              <v-card-text class="caption">
                <p class="mb-0">NPR {{item.sale_price}}</p>
              </v-card-text>
              <v-card-title class="body-2 py-0 font-weight-medium">Purchase Price</v-card-title>
              <v-card-text class="caption">
                <p class="mb-0">NPR {{item.purchase_price}}</p>
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
                <v-card-title class="body-1 pb-0 font-weight-medium">In Stock</v-card-title>
                <v-card-text class="title">
                  <p class="mb-0">{{stock}}</p>
                </v-card-text>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card tile class="mr-sm-2 ml-sm-2" color="#F70034" dark>
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="body-1 pb-0 font-weight-medium">Units Purchased</v-card-title>
                  <v-card-text class="title">
                    <p class="mb-0">{{purchase_count}}</p>
                  </v-card-text>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card tile class="ml-sm-4" color="#556BE7" dark>
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title class="body-1 pb-0 font-weight-medium">Units Sold</v-card-title>
                  <v-card-text class="title">
                    <p class="mb-0">{{sale_count}}</p>
                  </v-card-text>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <v-row no-gutters class="my-5">
          <v-tabs class="elevation-2" grow="grow">
            <v-tabs-slider></v-tabs-slider>

            <v-tab href="#tabBill">Bills</v-tab>
            <v-tab href="#tabInvoice">Invoices</v-tab>

            <v-tab-item value="tabBill">
              <v-data-table
                :headers="bills.headers"
                :items="bills.data"
                :items-per-page="10"
                class="elevation-1"
                :footer-props="{
            'items-per-page-options': [10, 25, 50, 100, -1]
        }"
              ></v-data-table>
            </v-tab-item>
            <v-tab-item value="tabInvoice">
              <v-data-table
                :headers="invoices.headers"
                :items="invoices.data"
                :items-per-page="10"
                class="elevation-1"
                :footer-props="{
            'items-per-page-options': [10, 25, 50, 100, -1]
        }"
              ></v-data-table>
            </v-tab-item>
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
      item: {
        id: null,
        name: "Stock Count",
        unit: {},
        category: {},
        tax: {}
      },
      items: [],
      sale_count: 0,
      purchase_count: 0,
      invoices: {
        data: [],
        headers: [
          {
            text: "Invoice Number",
            align: "start",
            sortable: true,
            value: "invoice.invoice_number"
          },
          { text: "Date", value: "invoice.date" },
          { text: "Quantity", value: "quantity" },
          { text: "Price", value: "price" },
          { text: "Amount", value: "total" },
          { text: "Tax", value: "tax.name" },
          { text: "Tax Amount", value: "tax_amount" }
        ]
      },
      bills: {
        data: [],
        headers: [
          {
            text: "Bill Number",
            align: "start",
            sortable: true,
            value: "bill.bill_number"
          },
          { text: "Date", value: "bill.date" },
          { text: "Quantity", value: "quantity" },
          { text: "Price", value: "price" },
          { text: "Amount", value: "total" },
          { text: "Tax", value: "tax.name" },
          { text: "Tax Amount", value: "tax_amount" }
        ]
      }
    };
  },
  created() {
    axios.get("/api/items").then(res => {
      this.items = res.data.data;
      this.overlay = false;
    });
  },

  computed: {
    stock() {
      return this.purchase_count - this.sale_count;
    }
  },

  methods: {
    getStock() {
      this.overlay = true;

      axios.get(`/api/items/${this.item.id}`).then(res => {
        this.item = res.data;
      });
      axios.get(`/api/stock/${this.item.id}`).then(res => {
        this.purchase_count = res.data.purchase_count;
        this.sale_count = res.data.sale_count;
        this.bills.data = res.data.purchases;
        this.invoices.data = res.data.sales;
        this.overlay = false;
      });
    }
  }
};
</script>