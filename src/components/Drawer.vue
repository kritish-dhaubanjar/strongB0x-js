<template>
  <v-navigation-drawer
    v-model="show"
    :color="color"
    :expand-on-hover="expandOnHover"
    :mini-variant="miniVariant"
    :right="right"
    fixed
    dark
    app
  >
    <v-list dense nav class="py-0">
      <v-list-item two-line :class="miniVariant && 'px-0'">
        <v-list-item-avatar>
          <img src="@/assets/avatar.jpg" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ user.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ company.name }}</v-list-item-subtitle>
        </v-list-item-content>
        <!-- <v-btn icon @click="miniVariant = !miniVariant">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn> -->
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item
        v-for="item in items_1"
        :key="item.title"
        link
        @click="goto(item.title)"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-group
        v-for="item in items_2"
        :key="item.title"
        v-model="item.active"
        :prepend-icon="item.action"
        no-action
        color="white"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="subItem in item.items"
          :key="subItem.title"
          @click="goto(subItem.title)"
        >
          <v-list-item-content>
            <v-list-item-title v-text="subItem.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: ["user", "company", "drawer"],
  data() {
    return {
      show: true,
      items_1: [{ title: "Dashboard", icon: "mdi-view-dashboard" }],

      color: "primary",
      colors: ["primary", "blue", "success", "red", "teal"],
      right: false,
      miniVariant: false,
      expandOnHover: false,
      background: false,
      items_2: [
        {
          action: "mdi-folder-settings-outline",
          title: "Inventory",
          items: [
            { title: "Products" },
            { title: "Units" },
            { title: "Taxes" },
            { title: "Brands" },
            { title: "Stock Count" },
          ],
        },
        {
          action: "mdi-cash-multiple",
          title: "Sales",
          items: [
            { title: "Invoices" },
            { title: "Revenues" },
            { title: "Customers" },
          ],
        },
        {
          action: "mdi-cart",
          title: "Purchases",
          items: [
            { title: "Bills" },
            { title: "Payments" },
            { title: "Vendors" },
          ],
        },
        {
          action: "mdi-briefcase-check",
          title: "Banking",
          items: [
            { title: "Accounts" },
            { title: "Transfers" },
            { title: "Transactions" },
          ],
        },
        {
          action: "mdi-chart-bar",
          title: "Reports",
          items: [
            { title: "Income & Expense" },
            { title: "Vendor Ledger Report" },
            { title: "Customer Ledger Report" },
          ],
        },
        {
          action: "mdi-cog-outline",
          title: "Settings",
          items: [{ title: "Categories" }],
        },
      ],
    };
  },

  watch: {
    user() {
      if (this.user.role.name == "Administrator") {
        this.items_2[this.items_2.length - 1].items.push({
          title: "Company",
        });
        this.items_2[this.items_2.length - 1].items.push({
          title: "Users",
        });
      }
    },

    drawer() {
      this.show = true;
    },
  },

  methods: {
    goto(route) {
      this.$router
        .push({
          name: route,
        })
        .catch(() => {});
    },
  },
};
</script>
