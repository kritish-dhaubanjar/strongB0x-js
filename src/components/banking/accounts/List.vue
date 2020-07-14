<template>
  <v-row class="px-3 mb-12 pb-12">
    <v-snackbar v-model="snackbar.show" top :color="snackbar.color" right>
      {{snackbar.message}}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
    <v-col>
      <v-card-title>
        Accounts
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
        <template v-slot:item.enabled="{ item }">
          <v-simple-checkbox v-model="item.enabled" disabled></v-simple-checkbox>
        </template>
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
        name="accounts.xls"
        :data="json_data"
        :fields="json_fields"
      >
        <v-icon>mdi-upload</v-icon>Export
      </download-excel>
    </v-col>

    <!-- Delete Dialog -->
    <v-dialog v-model="destroy.destroy" max-width="512px">
      <v-card>
        <v-card-title class="headline">Delete {{destroy.item.name}}</v-card-title>
        <v-card-text>Are you sure that you want to permanently delete {{destroy.item.name}} ?</v-card-text>
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
    <v-dialog v-model="edit.edit" max-width="768px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Account</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="edit" v-model="valid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="6" class="py-0">
                  <v-text-field
                    prepend-inner-icon="mdi-label-multiple-outline"
                    v-model="edit.item.name"
                    :counter="100"
                    :rules="nameRules"
                    label="Name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-text-field
                    prepend-inner-icon="mdi-safe-square-outline"
                    v-model="edit.item.number"
                    :counter="100"
                    label="Account Number"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" class="py-0">
                  <v-text-field
                    prepend-inner-icon="mdi-cash"
                    v-model="edit.item.opening_balance"
                    label="Opening Balance"
                    :rules="balanceRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-text-field
                    prepend-inner-icon="mdi-phone"
                    v-model="edit.item.bank_phone"
                    label="Bank Phone"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" class="py-0">
                  <v-text-field
                    prepend-inner-icon="mdi-office-building"
                    v-model="edit.item.bank_name"
                    label="Bank Name"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-text-field
                    prepend-inner-icon="mdi-map-marker"
                    v-model="edit.item.bank_address"
                    label="Bank Address"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0">
                  <v-checkbox v-model="edit.item.enabled" label="Enabled"></v-checkbox>
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
  props: ["items"],
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
          text: "NAME",
          align: "start",
          sortable: true,
          value: "name"
        },
        { text: "ACCOUNT NO.", value: "number" },
        { text: "OPENING BALANCE (NPR)", value: "opening_balance" },
        { text: "BANK NAME", value: "bank_name" },
        { text: "BANK PHONE", value: "bank_phone" },
        { text: "BANK ADDRESS", value: "bank_address" },
        { text: "ENABLED", value: "enabled" },
        { text: "ACTIONS", value: "actions", sortable: false }
      ],

      valid: true,

      nameRules: [
        v => !!v || "Name is required",
        v => (v && v.length <= 100) || "Name must be less than 100 characters"
      ],
      balanceRules: [
        v => !!v || "Opening Balance is required",
        v => (v && v >= 0) || "Opening Balance must not be less than 0."
      ],
      json_data: [],
      json_fields: {
        Name: "name",
        "Account No.": "number",
        "Opening Balance": "opening_balance",
        "Bank Name": "bank_name",
        "Bank Phone": "bank_phone",
        "Bank Address": "bank_address"
      },
      loading: false
    };
  },
  methods: {
    /* Excel */
    filter(data) {
      this.json_data = data;
    },
    editItem(item) {
      this.edit.item = item;
      this.edit.index = this.items.indexOf(item);
      axios.get(`/api/accounts/${item.id}`).then(res => {
        this.edit.item = res.data.data;
        this.edit.item.opening_balance += "";
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
        this.loading = true;
        axios
          .put(`/api/accounts/${this.edit.item.id}`, this.edit.item)
          .then(res => {
            if (res.status == 200) {
              this.snackbar.show = true;
              this.snackbar.color = "success";
              this.snackbar.message = `200 (${res.data.data.name} Updated Successfully)`;
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
        this.loading = false;
        axios
          .delete(`/api/accounts/${this.destroy.item.id}`)
          .then(res => {
            this.snackbar.show = true;
            if (res.status == 200) {
              if (res.data.status == 412) {
                this.snackbar.color = "error";
                this.snackbar.message = `412 Precondition Failed`;
              } else {
                this.snackbar.color = "success";
                this.snackbar.message = `200 (${res.data.name} Deleted Successfully)`;
                this.items.splice(this.destroy.index, 1);
              }
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
