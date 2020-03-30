<template>
  <v-row class="pb-10 mb-10">
    <v-col cols="12" sm="6" md="3" lg="3">
      <span>ACCOUNTS</span>
      <v-data-table
        :headers="balance.headers"
        :items="balance.accounts"
        class="elevation-1 mt-3"
        hide-default-footer
      ></v-data-table>
    </v-col>
    <v-col cols="12" sm="6" md="3" lg="3">
      <span>LATEST REVENUES</span>
      <v-data-table
        :headers="transaction.headers"
        :items="transactions.revenues"
        class="elevation-1 mt-3"
        hide-default-footer
      ></v-data-table>
    </v-col>
    <v-col cols="12" sm="6" md="3" lg="3">
      <span>LATEST PAYMENTS</span>
      <v-data-table
        :headers="transaction.headers"
        :items="transactions.payments"
        class="elevation-1 mt-3"
        hide-default-footer
      ></v-data-table>
    </v-col>
    <v-col cols="12" sm="6" md="3" lg="3">
      <span>LATEST EXPENSES</span>
      <v-data-table
        :headers="transaction.headers"
        :items="transactions.expenses"
        class="elevation-1 mt-3"
        hide-default-footer
      ></v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      balance: {
        headers: [
          {
            text: "ACCOUNTS",
            align: "start",
            sortable: true,
            value: "name"
          },
          { text: "BALANCE", value: "balance" }
        ],
        accounts: []
      },

      transaction: {
        headers: [
          {
            text: "DATE",
            align: "start",
            sortable: true,
            value: "date"
          },
          { text: "AMOUNT", value: "amount" }
        ]
      },

      transactions: {
        revenues: [],
        payments: [],
        expenses: []
      }
    };
  },

  created() {
    let intl = new Intl.NumberFormat("en-IN");

    axios.get("/api/statistics/accounts").then(res => {
      for (let key in res.data) {
        this.balance.accounts.push({
          name: key,
          balance: `NPR ${intl.format(res.data[key])}`
        });
      }
    });

    axios.get("/api/statistics/transactions").then(res => {
      res.data.payments = res.data.payments.map(e => {
        e.amount = `NPR ${intl.format(e.amount)}`;
        return e;
      });
      res.data.revenues = res.data.revenues.map(e => {
        e.amount = `NPR ${intl.format(e.amount)}`;
        return e;
      });
      res.data.expenses = res.data.expenses.map(e => {
        e.amount = `NPR ${intl.format(e.amount)}`;
        return e;
      });
      this.transactions = res.data;
    });
  }
};
</script>