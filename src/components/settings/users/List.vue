<template>
  <v-row class="px-3 mb-12 pb-12">
    <v-snackbar v-model="snackbar.show" top :color="snackbar.color" right>
      <p v-html="snackbar.message" class="mb-0"></p>
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
    <v-col>
      <v-card-title>
        Users
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
        name="users.xls"
        :data="json_data"
        :fields="json_fields"
      >
        <v-icon>mdi-upload</v-icon>Export
      </download-excel>
    </v-col>

    <!-- Delete Dialog -->
    <v-dialog v-model="destroy.destroy" max-width="512px">
      <v-card>
        <v-card-title class="headline">Delete {{destroy.item.name}}'s Account</v-card-title>
        <v-card-text>Are you sure that you want to permanently delete {{destroy.item.name}}'s Account ?</v-card-text>
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
          <span class="headline">Edit User</span>
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
                    prepend-inner-icon="mdi-at"
                    v-model="edit.item.email"
                    :counter="100"
                    type="email"
                    label="Email"
                    required
                    :rules="emailRules"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" class="py-0">
                  <v-text-field
                    prepend-inner-icon="mdi-phone"
                    v-model="edit.item.phone"
                    :rules="phoneRules"
                    label="Phone"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-select
                    prepend-inner-icon="mdi-account-tie-outline"
                    :items="types"
                    label="Role"
                    :rules="rolesRules"
                    v-model="edit.item.role_id"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" class="py-0">
                  <v-text-field
                    prepend-inner-icon="mdi-lock"
                    v-model="edit.item.password"
                    label="Password"
                    :rules="passwordRules"
                    required
                    type="password"
                    counter="100"
                  ></v-text-field>
                </v-col>
                <v-col cols="6" class="py-0">
                  <v-text-field
                    prepend-inner-icon="mdi-lock"
                    v-model="edit.item.password_confirmation"
                    label="Confirm Password"
                    required
                    type="password"
                    :rules="confirmRules"
                    counter="100"
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
  props: ["items", "types"],
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
        { text: "EMAIL", value: "email" },
        { text: "PHONE NUMBER", value: "phone" },
        // Single Role Per User
        { text: "ROLE", value: "role.name" },
        { text: "ENABLED", value: "enabled" },
        { text: "ACTIONS", value: "actions", sortable: false }
      ],

      valid: true,
      nameRules: [
        v => !!v || "Name is required",
        v => (v && v.length <= 100) || "Name must be less than 100 characters"
      ],
      phoneRules: [v => !!v || "Phone Number is required"],
      passwordRules: [
        // v => !!v || "Password is required",
        v =>
          !v ||
          v.length == 0 ||
          (v && v.length >= 8) ||
          "Password must be at least 8 characters in length"
      ],
      rolesRules: [v => !!v || "Role is required"],

      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      json_data: [],
      json_fields: {
        Name: "name",
        Email: "email",
        Phone: "phone",
        Role: "role.name"
      },
      loading: false
    };
  },

  computed: {
    confirmRules() {
      return [
        v =>
          !this.edit.item.password ||
          v == this.edit.item.password ||
          "Password must be confirmed"
      ];
    }
  },

  methods: {
    /* Excel */
    filter(data) {
      this.json_data = data;
    },
    editItem(item) {
      this.edit.item = { ...item };
      this.edit.index = this.items.indexOf(item);
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
          .put(`/api/user/${this.edit.item.id}`, this.edit.item)
          .then(res => {
            if (res.data.status == 200) {
              this.snackbar.show = true;
              this.snackbar.color = "success";
              this.snackbar.message = `200 (${res.data.user.name}'s account updated successfully)`;
              this.$emit("update", {
                index: this.edit.index,
                data: res.data.user
              });
            } else {
              this.snackbar.show = true;
              this.snackbar.color = "error";
              this.snackbar.message = "500 (Internal Server Error)";
            }
            this.resetEdit();
          })
          .catch(err => {
            this.snackbar.show = true;
            this.snackbar.color = "error";
            this.snackbar.message = "";
            for (let key in err.response.data.errors) {
              this.snackbar.message += `${err.response.data.errors[key]}<br>`;
            }
          })
          .finally(() => {
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
          .delete(`/api/user/${this.destroy.item.id}`)
          .then(res => {
            this.snackbar.show = true;
            if (res.status == 200) {
              this.snackbar.color = "success";
              this.snackbar.message = `200 (${res.data.name} Deleted Successfully)`;
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
