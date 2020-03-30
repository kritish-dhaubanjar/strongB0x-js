<template>
  <v-row class="px-3 mb-12 pb-12">
    <v-col>
      <v-card-title>
        Transactions
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
      ></v-data-table>

      <v-col cols="12" class="text-right">
        <download-excel
          class="v-btn v-btn--depressed theme--light v-size--small"
          worksheet="Worksheet"
          name="transactions.xls"
          :data="json_data"
          :fields="json_fields"
        >
          <v-icon>mdi-upload</v-icon>Export
        </download-excel>
      </v-col>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["items"],
  data() {
    return {
      search: "",
      headers: [
        {
          text: "DATE",
          align: "start",
          sortable: true,
          value: "paid_at"
        },
        { text: "ACCOUNT", value: "account" },
        { text: "TYPE", value: "type" },
        { text: "CATEGORY ", value: "category" },
        { text: "DESCRIPTION ", value: "description" },
        { text: "AMOUNT", value: "amount" }
      ],
      json_data: [],
      json_fields: {
        "Paid At": "paid_at",
        Account: "account",
        Type: "type",
        Category: "category",
        Description: "description",
        Amount: "amount"
      }
    };
  },

  methods: {
    /* Excel */
    filter(data) {
      this.json_data = data.map(d => {
        if (d.type == "expense") {
          d.amount *= -1;
        }
        return d;
      });
    }
  }
};
</script>
