<template>
  <v-app>
    <Bar />
    <Drawer />
    <v-content>
      <v-container class="py-3 px-6">
        <router-view />
        <Footer />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Bar from "@/components/Bar";
import Drawer from "@/components/Drawer";
import Footer from "@/components/Footer";

export default {
  components: {
    Bar,
    Drawer,
    Footer
  }
};
</script>
