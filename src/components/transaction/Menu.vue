<template>
  <v-row>
    <v-col cols="5">
      <h1 class="title">Transactions</h1>
    </v-col>
    <v-col cols="7" class="text-right">
      <v-btn color="success" dark depressed small class="ml-2">
        <v-icon>mdi-plus</v-icon>Add Income
      </v-btn>
      <v-btn color="success" dark depressed small class="ml-2">
        <v-icon>mdi-plus</v-icon>Add Expense
      </v-btn>
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
      expense_account_id: 1,
      income_account_id: 1,
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
          )) ||
        "Date must be formated as yyyy-mm-dd"
    ]
  }),

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