<template>
  <v-row>
    <v-snackbar v-model="snackbar.show" top :color="snackbar.color" right>
      <p v-html="snackbar.message" class="mb-0"></p>
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
    <v-col cols="5">
      <h1 class="title">Users</h1>
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
            <span class="headline">New User</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-container>
                <v-row>
                  <v-col cols="6" class="py-0">
                    <v-text-field
                      prepend-inner-icon="mdi-label-multiple-outline"
                      v-model="item.name"
                      :counter="100"
                      :rules="nameRules"
                      label="Name"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <v-text-field
                      prepend-inner-icon="mdi-at"
                      v-model="item.email"
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
                      v-model="item.phone"
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
                      v-model="item.role_id"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" class="py-0">
                    <v-text-field
                      prepend-inner-icon="mdi-lock"
                      v-model="item.password"
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
                      v-model="item.password_confirmation"
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
                    <v-checkbox v-model="item.enabled" label="Enabled"></v-checkbox>
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
      <!-- <v-btn small depressed class="ml-2">
        <v-icon>mdi-book-information-variant</v-icon>Inventory
      </v-btn>-->
    </v-col>
  </v-row>
</template>


<script>
import axios from "axios";

export default {
  props: ["types"],
  data: () => ({
    dialog: false,
    valid: true,
    snackbar: {
      show: false,
      color: "",
      message: ""
    },
    item: {
      name: "",
      password: "",
      password_confirmation: "",
      email: "",
      phone: "",
      role_id: "",
      enabled: true
    },
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 100) || "Name must be less than 100 characters"
    ],
    phoneRules: [v => !!v || "Phone Number is required"],
    passwordRules: [
      v => !!v || "Password is required",
      v =>
        (v && v.length >= 8) ||
        "Password must be at least 8 characters in length"
    ],
    rolesRules: [v => !!v || "Role is required"],

    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    loading: false
  }),

  computed: {
    confirmRules() {
      return [
        v => !!v || "Password must be confirmed",
        v => (v && v == this.item.password) || "Password must be confirmed"
      ];
    }
  },

  methods: {
    close() {
      this.dialog = false;
      this.$refs.form.resetValidation();
      this.item.name = "";
      this.item.password = "";
      this.item.password_confirmation = "";
      this.item.email = "";
      this.item.phone = "";
      this.item.role_id = "";
      this.item.enabled = true;
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        axios
          .post("/api/register", this.item)
          .then(res => {
            if (res.data.status == 201) {
              this.close();
              this.snackbar.show = true;
              this.snackbar.color = "success";
              this.snackbar.message = "200 (User Created Successfully)";
              this.$emit("insert", res.data.user);
            } else {
              this.snackbar.show = true;
              this.snackbar.color = "error";
              this.snackbar.message = "500 (Internal Server Error)";
            }
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
    }
  }
};
</script>

<style>
.v-dialog .v-icon {
  font-size: 16px !important;
}
</style>