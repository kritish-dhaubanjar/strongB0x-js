<template>
  <v-row>
    <v-snackbar v-model="snackbar.show" top :color="snackbar.color" right>
      {{snackbar.message}}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
    <v-col cols="5">
      <h1 class="title">Bills</h1>
    </v-col>
    <v-col cols="7" class="text-right">
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on }">
          <v-btn color="success" dark depressed small class="ml-2" v-on="on">
            <v-icon>mdi-plus</v-icon>Add New
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">New Bill</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-container>
                <v-row>
                  <v-col cols="9" sm="9" md="3" class="pt-0 pb-1">
                    <v-select
                      prepend-inner-icon="mdi-account-circle-outline"
                      v-model="bill.vendor_id"
                      :items="vendors"
                      :rules="vendorRules"
                      label="Vendor"
                    ></v-select>
                  </v-col>
                  <v-col cols="3" sm="3" md="1">
                    <v-btn color="success" @click="$emit('vendor')">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" class="pt-0 pb-1">
                    <v-text-field
                      prepend-inner-icon="mdi-label-multiple-outline"
                      v-model="bill.bill_number"
                      :counter="100"
                      label="Bill Number"
                      :rules="billNumberRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" class="pt-0 pb-1">
                    <v-text-field
                      prepend-inner-icon="mdi-label-multiple-outline"
                      v-model="bill.order_number"
                      :counter="100"
                      label="Order Number"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4" class="pt-0 pb-1">
                    <v-select
                      prepend-inner-icon="mdi-folder-outline"
                      v-model="bill.category_id"
                      :items="categories"
                      :rules="categoryRules"
                      label="Category"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" class="pt-0 pb-1">
                    <v-text-field
                      prepend-inner-icon="mdi-calendar-month"
                      v-model="bill.billed_at"
                      label="Bill Date"
                      :rules="billedAtRules"
                      placeholder="2076-12-01"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" class="pt-0 pb-1">
                    <v-text-field
                      prepend-inner-icon="mdi-calendar-month"
                      v-model="bill.due_at"
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
                          <tr v-for="(item,index) in bill.items" :key="index">
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
                                v-model="item.id"
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
                                v-model="bill.discount"
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
                                v-model="bill.tax_id"
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
                    <v-textarea :auto-grow="false" label="Notes" rows="3" v-model="bill.notes"></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save" :loading="loading">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- <v-btn small depressed class="ml-2">
        <v-icon>mdi-download</v-icon>Import
      </v-btn>
      <v-btn small depressed class="ml-2">
        <v-icon>mdi-upload</v-icon>Export
      </v-btn>-->
    </v-col>
  </v-row>
</template>


<script>
import axios from "axios";

export default {
  props: ["accounts", "methods", "vendors", "categories", "products", "taxes"],
  data: () => ({
    dialog: false,
    valid: true,
    snackbar: {
      show: false,
      color: "",
      message: ""
    },
    bill: {
      bill_number: "",
      order_number: "",
      status: "received",
      billed_at: "",
      due_at: "",
      tax_id: null,
      category_id: null,
      vendor_id: null,
      notes: null,
      items: [], //{id, quantity, price, tax_id}
      discount: "0.00"
    },
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
        v.length == 0 ||
        (RegExp(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[012]))/).test(v) &&
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
    discountRules: [v => (v && v >= 0) || "Discount must not be less than 0."],
    loading: false
  }),

  created() {
    this.addItem();
  },

  computed: {
    subTotal() {
      return this.bill.items.map(e => {
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
      return this.beforeDiscount - this.bill.discount;
    },

    tax() {
      let tax_rate = 0;
      if (this.bill.tax_id)
        tax_rate = this.taxes.filter(t => t.value === this.bill.tax_id).pop()
          .rate;
      return (tax_rate / 100) * this.afterDiscount;
    },

    gtotal() {
      return this.afterDiscount + this.tax;
    }
  },

  methods: {
    changeName(item) {
      const product = this.products.filter(e => e.value === item.id).pop();
      item.price = product.price;
      item.tax_id = product.tax_id;
    },
    addItem() {
      this.bill.items.push({
        id: null,
        quantity: "0",
        price: "0.00",
        tax_id: null
      });
    },
    removeItem(index) {
      this.bill.items.splice(index, 1);
    },
    close() {
      this.dialog = false;
      this.$refs.form.resetValidation();
      this.bill.bill_number = "";
      this.bill.order_number = "";
      this.bill.status = "received";
      this.bill.billed_at = "";
      this.bill.due_at = "";
      this.bill.tax_id = null;
      this.bill.category_id = null;
      this.bill.vendor_id = null;
      this.bill.notes = null;
      this.bill.items = []; //{id, quantity, price, tax_id}
      this.bill.discount = "0.00";
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        axios
          .post("/api/purchases", this.bill)
          .then(res => {
            if (res.status == 201) {
              this.close();
              this.snackbar.show = true;
              this.snackbar.color = "success";
              this.snackbar.message = `200 (Bill created Successfully)`;
              this.$emit("insert", res.data.data);
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
            this.loading = false;
          });
      }
    }
  }
};
</script>

<style  lang="scss">
.v-dialog .v-icon {
  font-size: 16px !important;
}

td {
  .theme--light.v-text-field .v-input__control .v-input__slot:before {
    border-color: transparent !important;
  }
}
</style>