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

<style>
input,
label,
.v-select__selection,
textarea {
  font-size: 14px !important;
}

td {
  font-size: 0.84rem !important;
}

.v-menu__content {
  max-height: 360px !important;
}

*::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
}

*::-webkit-scrollbar {
  width: 10px;
  background-color: #f5f5f5;
}

*::-webkit-scrollbar-thumb {
  background-color: #0ae;

  background-image: -webkit-gradient(
    linear,
    0 0,
    0 100%,
    color-stop(0.5, rgba(255, 255, 255, 0.2)),
    color-stop(0.5, transparent),
    to(transparent)
  );
}
</style>
