<template>
  <v-row>
    <v-snackbar v-model="snackbar.show" top :color="snackbar.color" right>
      {{snackbar.message}}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
    <v-col cols="5">
      <h1 class="title">Transfers</h1>
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
            <span class="headline">New Transfer</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-container>
                <v-row>
                  <v-col cols="6" class="py-0">
                    <v-select
                      prepend-inner-icon="mdi-folder-outline"
                      v-model="item.expense_account_id"
                      :items="accounts"
                      label="From Account"
                    ></v-select>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <v-select
                      prepend-inner-icon="mdi-folder-outline"
                      v-model="item.income_account_id"
                      :items="accounts"
                      label="To Account"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
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
            <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn small depressed class="ml-2">
        <v-icon>mdi-download</v-icon>Import
      </v-btn>
      <v-btn small depressed class="ml-2">
        <v-icon>mdi-upload</v-icon>Export
      </v-btn>
    </v-col>
  </v-row>
</template>


<script>
import axios from "axios";

export default {
  props: ["accounts", "methods"],
  data: () => ({
    dialog: false,
    valid: true,
    snackbar: {
      show: false,
      color: "",
      message: ""
    },
    item: {
      expense_account_id: null,
      income_account_id: null,
      paid_at: "",
      amount: "0.00",
      payment_method: "Cash",
      description: ""
    },
    amountRules: [
      v => !!v || "Amount is required",
      v => (v && v >= 0) || "Amount must not be less than 0."
    ],
    dateRules: [
      v => !!v || "Date is required",
      v =>
        (v &&
          RegExp(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[012]))/).test(
            v
          ) &&
          v.length === 10) ||
        "Date must be formated as yyyy-mm-dd"
    ]
  }),

  watch: {
    accounts() {
      if (this.accounts.length > 0) {
        this.item.expense_account_id = this.accounts[0].value;
        this.item.income_account_id = this.accounts[0].value;
      }
    }
  },

  methods: {
    close() {
      this.dialog = false;
      this.$refs.form.resetValidation();
      this.item.expense_account_id = 1;
      this.item.income_account_id = 1;
      this.item.paid_at = "";
      this.item.amount = "0.00";
      this.item.payment_method = "Cash";
      this.item.description = "";
    },
    save() {
      if (this.$refs.form.validate()) {
        axios
          .post("/api/transfers", this.item)
          .then(res => {
            if (res.status == 201) {
              this.close();
              this.snackbar.show = true;
              this.snackbar.color = "success";
              this.snackbar.message = `200 (Transfer created Successfully)`;
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