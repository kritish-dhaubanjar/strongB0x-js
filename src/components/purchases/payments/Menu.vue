<template>
  <v-row>
    <v-snackbar v-model="snackbar.show" top :color="snackbar.color" right>
      {{snackbar.message}}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
    <v-col cols="5">
      <h1 class="title">Payments</h1>
    </v-col>
    <v-col cols="7" class="text-right">
      <v-dialog v-model="dialog" max-width="768px">
        <template v-slot:activator="{ on }">
          <v-btn color="success" dark depressed small class="ml-2" v-on="on">
            <v-icon>mdi-plus</v-icon>Add New
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">New Payment</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-container>
                <v-row>
                  <v-col cols="4" class="py-0">
                    <v-text-field
                      prepend-inner-icon="mdi-calendar-month"
                      v-model="item.paid_at"
                      label="Date"
                      :rules="dateRules"
                      placeholder="2076-12-01"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4" class="py-0">
                    <v-text-field
                      prepend-inner-icon="mdi-cash-multiple"
                      v-model="item.amount"
                      :rules="amountRules"
                      label="Amount"
                      type="number"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4" class="py-0">
                    <v-select
                      prepend-inner-icon="mdi-folder-outline"
                      v-model="item.category_id"
                      :items="categories"
                      :rules="categoryRules"
                      label="Category"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4" class="py-0">
                    <v-select
                      prepend-inner-icon="mdi-account-circle-outline"
                      v-model="item.contact_id"
                      :items="vendors"
                      label="Vendor"
                    ></v-select>
                  </v-col>
                  <v-col cols="4" class="py-0">
                    <v-select
                      prepend-inner-icon="mdi-folder-outline"
                      v-model="item.account_id"
                      :items="accounts"
                      :rules="accountRules"
                      label="Account"
                    ></v-select>
                  </v-col>
                  <v-col cols="4" class="py-0">
                    <v-select
                      prepend-inner-icon="mdi-folder-outline"
                      v-model="item.payment_method"
                      :items="methods"
                      label="Payment Method"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="py-0">
                    <v-textarea
                      :auto-grow="false"
                      label="Description"
                      rows="3"
                      v-model="item.description"
                    ></v-textarea>
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
  props: ["accounts", "methods", "vendors", "categories"],
  data: () => ({
    dialog: false,
    valid: true,
    snackbar: {
      show: false,
      color: "",
      message: ""
    },
    item: {
      type: "expense",
      paid_at: "",
      amount: "0.00",
      account_id: null,
      document_id: null,
      contact_id: null,
      category_id: null,
      description: null,
      payment_method: "Cash"
    },
    amountRules: [
      v => !!v || "Amount is required",
      v => (v && v >= 0) || "Amount must not be less than 0."
    ],
    categoryRules: [v => !!v || "Category is required"],
    accountRules: [v => !!v || "Account is required"],
    dateRules: [
      v => !!v || "Date is required",
      v =>
        (v &&
          RegExp(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[012]))/).test(
            v
          ) &&
          v.length === 10) ||
        "Date must be formated as yyyy-mm-dd"
    ],
    loading: false
  }),

  watch: {
    categories() {
      this.init();
    }
  },

  methods: {
    init() {
      if (this.categories.length > 0)
        this.item.category_id = this.categories[0].value;
      if (this.accounts.length > 0)
        this.item.account_id = this.accounts[0].value;
    },
    close() {
      this.dialog = false;
      this.$refs.form.resetValidation();
      this.item.type = "expense";
      this.item.paid_at = "";
      this.item.amount = "0.00";
      this.item.account_id = null;
      this.item.document_id = null;
      this.item.contact_id = null;
      this.item.category_id = null;
      this.item.description = null;
      this.item.payment_method = "Cash";
      this.init();
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        axios
          .post("/api/transactions", this.item)
          .then(res => {
            if (res.status == 201) {
              this.close();
              this.snackbar.show = true;
              this.snackbar.color = "success";
              this.snackbar.message = `200 (Transaction created Successfully)`;
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

<style>
.v-dialog .v-icon {
  font-size: 16px !important;
}
</style>