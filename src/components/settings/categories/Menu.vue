<template>
  <v-row>
    <v-snackbar v-model="snackbar.show" top :color="snackbar.color" right>
      {{snackbar.message}}
      <v-btn text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
    <v-col cols="5">
      <h1 class="title">Categories</h1>
    </v-col>
    <v-col cols="7" class="text-right">
      <v-dialog v-model="dialog" max-width="512px">
        <template v-slot:activator="{ on }">
          <v-btn color="success" dark depressed small class="ml-2" v-on="on">
            <v-icon>mdi-plus</v-icon>Add New
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">New Category</span>
          </v-card-title>

          <v-card-text class="py-0">
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
                    <v-select
                      prepend-inner-icon="mdi-folder-outline"
                      v-model="item.type"
                      :items="types"
                      label="Type"
                    ></v-select>
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
      type: "income",
      enabled: true
    },
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 100) || "Name must be less than 100 characters"
    ],
    loading: false
  }),

  methods: {
    close() {
      this.dialog = false;
      this.$refs.form.resetValidation();
      this.item.name = "";
      this.item.enabled = true;
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        axios
          .post("/api/categories", this.item)
          .then(res => {
            if (res.status == 201) {
              this.close();
              this.snackbar.show = true;
              this.snackbar.color = "success";
              this.snackbar.message = `200 (${res.data.data.name} created successfully)`;
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