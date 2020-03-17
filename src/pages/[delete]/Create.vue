<template>
  <div>
    <v-row>
      <v-col>
        <h1 class="title">New Item</h1>
      </v-col>
    </v-row>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row>
        <v-col cols="6" class="py-0">
          <v-text-field
            prepend-inner-icon="mdi-label-multiple-outline"
            v-model="name"
            :counter="100"
            :rules="nameRules"
            label="Name"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="3" class="py-0">
          <v-select
            prepend-inner-icon="mdi-scale-balance"
            v-model="unit"
            :items="units"
            label="Unit"
          ></v-select>
        </v-col>
        <v-col cols="3" class="py-0">
          <v-select prepend-inner-icon="mdi-percent" v-model="tax" :items="taxes" label="Tax"></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea :auto-grow="false" label="Description" rows="3" v-model="description"></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4" class="py-0">
          <v-text-field
            prepend-inner-icon="mdi-cash-multiple"
            v-model="sale"
            :rules="saleRules"
            label="Sale Price"
            type="number"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="4" class="py-0">
          <v-text-field
            prepend-inner-icon="mdi-cash-multiple"
            v-model="purchase"
            :rules="purchaseRules"
            label="Purchase Price"
            type="number"
            required
          ></v-text-field>
        </v-col>
        <!-- </v-row> -->
        <!-- <v-row> -->
        <v-col cols="4" class="py-0">
          <v-select
            prepend-inner-icon="mdi-folder-outline"
            v-model="category"
            :items="categories"
            label="Category"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0">
          <v-checkbox v-model="enabled" label="Enabled"></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="py-0 text-right">
          <v-btn small class="mr-2" depressed color="error">
            <v-icon>mdi-close</v-icon>Cancel
          </v-btn>
          <v-btn small depressed color="success">
            <v-icon>mdi-content-save</v-icon>Save
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    name: "",
    description: "",
    sale: "",
    purchase: "",
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 100) || "Name must be less than 100 characters"
    ],
    saleRules: [
      v => !!v || "Sale Price is required",
      v => (v && v >= 0) || "Sale Price must not be less than 0."
    ],
    purchaseRules: [
      v => !!v || "Purchase Price is required",
      v => (v && v >= 0) || "Purchase Price must not be less than 0."
    ],
    tax: null,
    taxes: ["None", "VAT", "Sales Tax"],
    unit: null,
    units: ["None", "kg", "gm", "mL", "L"],
    category: "General",
    categories: ["General"],
    enabled: true
  }),

  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>