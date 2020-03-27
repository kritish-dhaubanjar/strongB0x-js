<template>
  <div>
    <v-snackbar v-model="snackbar" color="success" top right>
      200 (Company Detail Updated Successfully)
      <v-btn text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-form ref="form" lazy-validation class="mb-10">
      <v-row>
        <v-col>
          <h1 class="title">Company Details</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" class="pb-0">
          <v-text-field
            v-model="company.name"
            label="Name"
            :rules="nameRules"
            counter="100"
            prepend-icon="mdi-account-box-multiple-outline"
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="pb-0">
          <v-text-field
            v-model="company.tax_number"
            label="Tax Number"
            prepend-icon="mdi-label-percent-outline"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" class="pb-0">
          <v-text-field
            v-model="company.phone_number"
            label="Phone Number"
            :rules="phoneRules"
            counter="100"
            prepend-icon="mdi-phone"
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="pb-0">
          <v-text-field v-model="company.email" label="Email" prepend-icon="mdi-at"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pb-0">
          <v-text-field
            v-model="company.address"
            label="Address"
            :rules="addressRules"
            prepend-icon="mdi-map-marker"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-file-input
            v-model="company.file"
            @change="handleLogo"
            accept="image/*"
            prepend-icon="mdi-camera"
            label="Company Logo"
          ></v-file-input>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="col-6" id="preview">
          <div v-if="company.logo !== null && company.logo.length > 0">
            <v-img :src="`/company/logo/${company.logo}`" height="128" width="128" contain></v-img>
            <br />
            <v-btn small depressed dark color="red darken-1" @click="deleteLogo">DELETE</v-btn>
          </div>
        </v-col>

        <v-col class="text-right">
          <v-btn class="success" depressed small @click="save">Save</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";
const fileReader = new FileReader();
fileReader.onload = e => {
  document.getElementById("preview").innerHTML = `
        <img src="${e.target.result}" height="128">
    `;
  //   console.log(e.target.result);
};

export default {
  data() {
    return {
      snackbar: false,
      overlay: false,
      company: {
        name: "",
        tax_number: "",
        phone_number: "",
        email: "",
        address: "",
        logo: "",
        _method: "PUT"
      },
      nameRules: [
        v => !!v || "Company Name is required",
        v => (v && v.length <= 100) || "Name must be less than 100 characters"
      ],
      phoneRules: [
        v => !!v || "Phone Number is required",
        v =>
          (v && v.length <= 100) || "Phone Number be less than 100 characters"
      ],
      addressRules: [v => !!v || "Address is required"]
    };
  },
  created() {
    this.overlay = true;
    axios.get("/api/company").then(res => {
      this.company = res.data;
      this.overlay = false;
    });
  },
  methods: {
    handleLogo(e) {
      if (!e) {
        this.company.file = null;
        document.getElementById("preview").innerHTML = "";
      } else {
        this.company.file = e;
        fileReader.readAsDataURL(e);
      }
    },

    deleteLogo() {
      this.company.logo = "";
      this.company.file = null;
    },

    save() {
      if (this.$refs.form.validate()) {
        let formData = new FormData();

        formData.append("name", this.company.name);
        formData.append("address", this.company.address);
        formData.append("phone_number", this.company.phone_number);
        formData.append(
          "tax_number",
          this.company.tax_number == null ? "" : this.company.tax_number
        );
        formData.append(
          "email",
          this.company.email == null ? "" : this.company.email
        );
        formData.append("_method", "PUT");

        formData.append("file", this.company.file); //undefined, null, File

        axios
          .post("/api/company", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json"
            }
          })
          .then(res => {
            if (res.status == 200) {
              this.snackbar = true;
              this.company = res.data;
            }
          });
      }
    }
  }
};
</script>

<style scoped>
.v-icon .v-icon {
  font-size: 16px !important;
}
</style>