<template>
  <v-row class="px-3 mb-12 pb-12">
    <v-snackbar v-model="snackbar.show" top :color="snackbar.color" right>
      {{snackbar.message}}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
    <v-col>
      <v-card-title>
        Bills
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :search="search"
        :headers="headers"
        :items="items"
        :items-per-page="2"
        class="elevation-1"
        :footer-props="{
            'items-per-page-options': [25, 50, 100, -1]
        }"
        @current-items="filter"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-col>

    <v-col cols="12" class="text-right">
      <download-excel
        class="v-btn v-btn--depressed theme--light v-size--small"
        worksheet="Worksheet"
        name="bills.xls"
        :data="json_data"
        :fields="json_fields"
      >
        <v-icon>mdi-upload</v-icon>Export
      </download-excel>
    </v-col>

    <!-- Delete Dialog -->
    <v-dialog v-model="destroy.destroy" max-width="512px">
      <v-card>
        <v-card-title class="headline">Delete Bill of {{destroy.item.billed_at}}</v-card-title>
        <v-card-text>Are you sure that you want to permanently delete Bill of {{destroy.item.billed_at}} ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="resetDelete">Cancel</v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="confirmDelete"
            :loading="loading"
          >Delete Permanently</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Dialog -->
    <v-dialog v-model="edit.edit" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Bill</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="edit" v-model="valid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4" class="pt-0 pb-1">
                  <v-select
                    prepend-inner-icon="mdi-account-circle-outline"
                    v-model="edit.item.vendor_id"
                    :items="vendors"
                    :rules="vendorRules"
                    label="Vendor"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4" class="pt-0 pb-1">
                  <v-text-field
                    prepend-inner-icon="mdi-label-multiple-outline"
                    v-model="edit.item.bill_number"
                    :counter="100"
                    label="Bill Number"
                    :rules="billNumberRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4" class="pt-0 pb-1">
                  <v-text-field
                    prepend-inner-icon="mdi-label-multiple-outline"
                    v-model="edit.item.order_number"
                    :counter="100"
                    label="Order Number"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="4" class="pt-0 pb-1">
                  <v-select
                    prepend-inner-icon="mdi-folder-outline"
                    v-model="edit.item.category_id"
                    :items="categories"
                    :rules="categoryRules"
                    label="Category"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4" class="pt-0 pb-1">
                  <v-text-field
                    prepend-inner-icon="mdi-calendar-month"
                    v-model="edit.item.billed_at"
                    label="Bill Date"
                    :rules="billedAtRules"
                    placeholder="2076-12-01"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4" class="pt-0 pb-1">
                  <v-text-field
                    prepend-inner-icon="mdi-calendar-month"
                    v-model="edit.item.due_at"
                    label="Due Date"
                    :rules="dueAtRules"
                    placeholder="2076-12-01"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- ITEMS -->
              <v-row>
                <v-col>
                  <h4>ITEMS</h4>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">ACTIONS</th>
                          <th class="text-left">NAME</th>
                          <th class="text-left">QUANTITY</th>
                          <th class="text-left">PRICE</th>
                          <th class="text-left">TAX</th>
                          <th class="text-left">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item,index) in edit.item.items" :key="index">
                          <td>
                            <v-btn
                              small
                              depressed
                              rounded
                              outlined
                              color="red darken-1"
                              @click.prevent="removeItem(index)"
                            >
                              <v-icon>mdi-trash-can-outline</v-icon>
                            </v-btn>
                          </td>
                          <td>
                            <v-autocomplete
                              v-model="item.item_id"
                              :rules="nameRules"
                              dense
                              :items="products"
                              @change="changeName(item)"
                            ></v-autocomplete>
                          </td>
                          <td>
                            <v-text-field
                              v-model="item.quantity"
                              :rules="quantityRules"
                              dense
                              type="number"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-text-field
                              v-model="item.price"
                              :rules="priceRules"
                              dense
                              type="number"
                            ></v-text-field>
                          </td>
                          <td>
                            <v-autocomplete v-model="item.tax_id" dense :items="taxes"></v-autocomplete>
                          </td>
                          <td>
                            <v-text-field
                              style="margin-top: -12px;"
                              dense
                              readonly
                              type="number"
                              v-text="subTotal[index]"
                            ></v-text-field>
                          </td>
                        </tr>
                        <!-- BEFORE DISCOUNT -->
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td class="subtitle-2 text-right">Subtotal</td>
                          <td class="subtitle-2">{{beforeDiscount}}</td>
                        </tr>
                        <!-- DISCOUNT -->
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td class="subtitle-2 text-right">Discount</td>
                          <td>
                            <v-text-field
                              style="padding-top: 14px"
                              v-model="edit.item.discount"
                              class="subtitle-1"
                              :rules="discountRules"
                              dense
                              type="number"
                            ></v-text-field>
                          </td>
                        </tr>
                        <!-- TAX AMOUNT -->
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                            <v-autocomplete
                              v-model="edit.item.tax_id"
                              style="width: 100px !important; padding-top: 13px; float:right;"
                              dense
                              :items="taxes"
                              label="TAX"
                            ></v-autocomplete>
                          </td>
                          <td class="subtitle-2">{{tax}}</td>
                        </tr>
                        <!-- GRAND TOTAL -->
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td class="subtitle-2 text-right">TOTAL</td>
                          <td class="subtitle-2">{{gtotal}}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-btn
                    small
                    outlined
                    depressed
                    rounded
                    color="success"
                    class="mt-4"
                    @click.prevent="addItem"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" class="pt-0 pb-1">
                  <v-textarea :auto-grow="false" label="Notes" rows="3" v-model="edit.item.notes"></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="resetEdit">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveEdit" :loading="loading">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";

export default {
  props: [
    "items",
    "accounts",
    "methods",
    "vendors",
    "categories",
    "products",
    "taxes"
  ],

  data() {
    return {
      valid: true,

      snackbar: {
        show: false,
        color: "",
        message: ""
      },
      edit: {
        edit: false,
        index: null,
        item: {
          items: []
        }
      },
      destroy: {
        destroy: false,
        index: null,
        item: {}
      },
      search: "",
      headers: [
        {
          text: "NUMBER",
          align: "start",
          sortable: true,
          value: "bill_number"
        },
        { text: "VENDOR", value: "vendor" },
        { text: "AMOUNT (NPR)", value: "amount" },
        { text: "BILL DATE", value: "billed_at" },
        { text: "DUE DATE", value: "due_at" },
        { text: "ORDER NUMBER", value: "order_number" },
        { text: "ACTIONS", value: "actions", sortable: false }
      ],

      amountRules: [
        v => !!v || "Amount is required",
        v => (v && v >= 0) || "Amount must not be less than 0."
      ],
      categoryRules: [v => !!v || "Category is required"],
      billNumberRules: [v => !!v || "Bill Number is required"],
      vendorRules: [v => !!v || "Vendor is required"],
      accountRules: [v => !!v || "Account is required"],
      billedAtRules: [
        v => !!v || "Bill Date is required",
        v =>
          (v &&
            RegExp(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[012]))/).test(
              v
            ) &&
            v.length === 10) ||
          "Bill Date must be formated as yyyy-mm-dd"
      ],
      dueAtRules: [
        v =>
          v == null ||
          v.length == 0 ||
          (RegExp(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[012]))/).test(
            v
          ) &&
            v.length === 10) ||
          "Due Date must be formated as yyyy-mm-dd"
      ],
      quantityRules: [
        v => !!v || "Quantity is required"
        // v => (v && v >= 0) || "Quantity must not be less than 0."
      ],
      nameRules: [v => !!v || "Name is required"],
      priceRules: [
        v => !!v || "Price is required",
        v => (v && v >= 0) || "Price must not be less than 0."
      ],
      discountRules: [
        v => (v && v >= 0) || "Discount must not be less than 0."
      ],
      json_data: [],
      json_fields: {
        "Bill Number": "bill_number",
        Vendor: "vendor",
        Amount: "amount",
        "Bill Date": "billed_at",
        "Due Date": "due_at",
        "Order Number": "order_number"
      },
      loading: false
    };
  },

  computed: {
    subTotal() {
      return this.edit.item.items.map(e => {
        let subTotal = e.price * e.quantity;
        let tax_rate = 0;
        if (e.tax_id) {
          tax_rate = this.taxes.filter(t => t.value === e.tax_id).pop().rate;
        }
        return subTotal + (tax_rate / 100) * subTotal;
      });
    },

    beforeDiscount() {
      let total = 0;
      if (this.subTotal.length > 0) {
        total = this.subTotal.reduce((accumulator, e) => {
          return accumulator + e;
        }, 0);
      }
      return total;
    },

    afterDiscount() {
      return this.beforeDiscount - this.edit.item.discount;
    },

    tax() {
      let tax_rate = 0;
      if (this.edit.item.tax_id)
        tax_rate = this.taxes
          .filter(t => t.value === this.edit.item.tax_id)
          .pop().rate;
      return (tax_rate / 100) * this.afterDiscount;
    },

    gtotal() {
      return this.afterDiscount + this.tax;
    }
  },

  methods: {
    /* Excel */
    filter(data) {
      this.json_data = data;
    },
    changeName(item) {
      const product = this.products.filter(e => e.value === item.item_id).pop();
      item.price = product.price;
      item.tax_id = product.tax_id;
    },
    addItem() {
      this.edit.item.items.push({
        id: null,
        quantity: "0",
        price: "0.00",
        tax_id: null
      });
    },
    removeItem(index) {
      this.edit.item.items.splice(index, 1);
    },
    editItem(item) {
      this.edit.index = this.items.indexOf(item);
      axios.get(`/api/purchases/${item.id}`).then(res => {
        this.edit.item = res.data.data;
      });
      this.edit.edit = true;
    },

    resetEdit() {
      this.edit.item = { items: [] };
      this.edit.index = null;
      this.edit.edit = false;
    },

    saveEdit() {
      if (this.$refs.edit.validate()) {
        this.loading = true;

        axios
          .put(`/api/purchases/${this.edit.item.id}`, this.edit.item)
          .then(res => {
            if (res.status == 201) {
              this.snackbar.show = true;
              this.snackbar.color = "success";
              this.snackbar.message = `201 (${res.data.data.billed_at} Updated Successfully)`;
              this.$emit("update", {
                index: this.edit.index,
                data: res.data.data
              });
            } else {
              this.snackbar.show = true;
              this.snackbar.color = "error";
              this.snackbar.message = "500 (Internal Server Error)";
            }
          })
          .catch(err => {
            console.log(err);
            this.snackbar.show = true;
            this.snackbar.color = "error";
            this.snackbar.message = "500 (Internal Server Error)";
          })
          .finally(() => {
            this.resetEdit();
            this.loading = false;
          });
      }
    },

    deleteItem(item) {
      this.destroy.item = item;
      this.destroy.index = this.items.indexOf(item);
      this.destroy.destroy = true;
    },

    resetDelete() {
      this.destroy.item = {};
      this.destroy.index = null;
      this.destroy.destroy = false;
    },

    confirmDelete() {
      if (this.destroy.destroy && this.destroy.index > -1) {
        this.loading = true;

        axios
          .delete(`/api/purchases/${this.destroy.item.id}`)
          .then(res => {
            this.snackbar.show = true;
            if (res.status == 200) {
              this.snackbar.color = "success";
              this.snackbar.message = `200 (${res.data.data.billed_at} Deleted Successfully)`;
              this.items.splice(this.destroy.index, 1);
            } else {
              this.snackbar.color = "error";
              this.snackbar.message = "500 (Internal Server Error)";
            }
          })
          .catch(() => {
            this.snackbar.show = true;
            this.snackbar.color = "error";
            this.snackbar.message = "500 (Internal Server Error)";
          })
          .finally(() => {
            this.destroy.item = {};
            this.destroy.index = null;
            this.destroy.destroy = false;
            this.loading = false;
          });
      }
    }
  }
};
</script>
