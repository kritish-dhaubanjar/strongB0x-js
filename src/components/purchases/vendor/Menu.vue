<template>
  <v-row>
    <v-snackbar v-model="snackbar.show" top :color="snackbar.color" right>
      {{snackbar.message}}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
    <v-col cols="5">
      <h1 class="title">Vendors</h1>
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
            <span class="headline">New Vendor</span>
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
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" class="py-0">
                    <v-text-field
                      prepend-inner-icon="mdi-cash"
                      v-model="item.tax_number"
                      label="Tax Number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <v-text-field prepend-inner-icon="mdi-phone" v-model="item.phone" label="Phone"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" class="py-0">
                    <v-text-field
                      prepend-inner-icon="mdi-cash"
                      v-model="item.opening_balance"
                      label="Opening Balance (Debit)"
                      :rules="balanceRules"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" class="py-0">
                    <v-text-field
                      prepend-inner-icon="mdi-map-marker"
                      v-model="item.address"
                      label="Address"
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
      <!-- <v-btn small depressed class="ml-2">
        <v-icon>mdi-book-information-variant</v-icon>Inventory
      </v-btn>-->
    </v-col>
  </v-row>
</template>


<script>
import axios from "axios";

export default {
  data: () => ({
    dialog: false,
    valid: true,
    snackbar: {
      show: false,
      color: "",
      message: ""
    },
    item: {
      type: "vendor",
      name: "",
      opening_balance: "0.00",
      email: "",
      tax_number: "",
      phone: "",
      address: "",
      enabled: true
    },
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 100) || "Name must be less than 100 characters"
    ],
    balanceRules: [
      v => !!v || "Opening Balance is required",
      v => (v && v >= 0) || "Opening Balance must not be less than 0."
    ]
  }),

  methods: {
    close() {
      this.dialog = false;
      this.$refs.form.resetValidation();
      this.item.name = "";
      this.item.opening_balance = "0.00";
      this.item.email = "";
      this.item.tax_number = "";
      this.item.phone = "";
      this.item.address = "";
      this.item.enabled = true;
    },
    save() {
      if (this.$refs.form.validate()) {
        axios
          .post("/api/contacts", this.item)
          .then(res => {
            if (res.status == 201) {
              this.close();
              this.snackbar.show = true;
              this.snackbar.color = "success";
              this.snackbar.message = "200 (Item Created Successfully)";
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