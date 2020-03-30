<template>
  <v-row class="px-3 mb-12 pb-12">
    <v-snackbar v-model="snackbar.show" top :color="snackbar.color" right>
      {{snackbar.message}}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
    <v-col>
      <v-card-title>
        Revenues
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

    <!-- Delete Dialog -->
    <v-dialog v-model="destroy.destroy" max-width="512px">
      <v-card>
        <v-card-title class="headline">Delete Revenue of {{destroy.item.paid_at}}</v-card-title>
        <v-card-text>Are you sure that you want to permanently delete Revenue of {{destroy.item.paid_at}} ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="resetDelete">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="confirmDelete">Delete Permanently</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-col cols="12" class="text-right">
      <download-excel
        class="v-btn v-btn--depressed theme--light v-size--small"
        worksheet="Worksheet"
        name="revenues.xls"
        :data="json_data"
        :fields="json_fields"
      >
        <v-icon>mdi-upload</v-icon>Export
      </download-excel>
    </v-col>

    <!-- Edit Dialog -->
    <v-dialog v-model="edit.edit" max-width="768px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Revenue</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="edit" v-model="valid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="4" class="py-0">
                  <v-text-field
                    prepend-inner-icon="mdi-calendar-month"
                    v-model="edit.item.paid_at"
                    label="Date"
                    :rules="dateRules"
                    placeholder="2076-12-01"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-text-field
                    prepend-inner-icon="mdi-cash-multiple"
                    v-model="edit.item.amount"
                    :rules="amountRules"
                    label="Amount"
                    type="number"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-select
                    prepend-inner-icon="mdi-folder-outline"
                    v-model="edit.item.category_id"
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
                    v-model="edit.item.contact_id"
                    :items="vendors"
                    label="Vendor"
                  ></v-select>
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-select
                    prepend-inner-icon="mdi-folder-outline"
                    v-model="edit.item.account_id"
                    :items="accounts"
                    :rules="accountRules"
                    label="Account"
                  ></v-select>
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-select
                    prepend-inner-icon="mdi-folder-outline"
                    v-model="edit.item.payment_method"
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
                    v-model="edit.item.description"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="resetEdit">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveEdit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";

export default {
  props: ["items", "accounts", "methods", "vendors", "categories"],
  data() {
    return {
      snackbar: {
        show: false,
        color: "",
        message: ""
      },
      edit: {
        edit: false,
        index: null,
        item: {}
      },
      destroy: {
        destroy: false,
        index: null,
        item: {}
      },
      search: "",
      headers: [
        {
          text: "DATE",
          align: "start",
          sortable: true,
          value: "paid_at"
        },
        { text: "AMOUNT (NPR)", value: "amount" },
        { text: "VENDOR", value: "contact_name" },
        { text: "CATEGORY", value: "category" },
        { text: "ACCOUNT", value: "account" },
        { text: "PAYMENT METHOD", value: "payment_method" },
        { text: "ACTIONS", value: "actions", sortable: false }
      ],

      valid: true,

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
      json_data: [],
      json_fields: {
        "Paid At": "paid_at",
        Amount: "amount",
        Account: "account",
        Customer: "contact_name",
        Category: "category",
        Description: "description",
        "Payment Method": "payment_method"
      }
    };
  },

  methods: {
    /* Excel */
    filter(data) {
      this.json_data = data;
    },
    editItem(item) {
      this.edit.index = this.items.indexOf(item);
      axios.get(`/api/transactions/${item.id}`).then(res => {
        this.edit.item = res.data.data;
        this.edit.item.amount += "";
      });
      this.edit.edit = true;
    },

    resetEdit() {
      this.edit.item = {};
      this.edit.index = null;
      this.edit.edit = false;
    },

    saveEdit() {
      if (this.$refs.edit.validate()) {
        axios
          .put(`/api/transactions/${this.edit.item.id}`, this.edit.item)
          .then(res => {
            if (res.status == 201) {
              this.snackbar.show = true;
              this.snackbar.color = "success";
              this.snackbar.message = `201 (${res.data.data.paid_at} Updated Successfully)`;
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
        axios
          .delete(`/api/transactions/${this.destroy.item.id}`)
          .then(res => {
            this.snackbar.show = true;
            if (res.status == 200) {
              this.snackbar.color = "success";
              this.snackbar.message = `200 (${res.data.data.paid_at} Deleted Successfully)`;
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
          });
      }
    }
  }
};
</script>
