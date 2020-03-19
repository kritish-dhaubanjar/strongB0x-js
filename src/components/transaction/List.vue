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
      ></v-data-table>
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
      ]
    };
  }
};
</script>
