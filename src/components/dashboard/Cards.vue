<template>
  <v-row id="cards">
    <v-col v-for="(card,index) in cards" :key="index" cols="6" sm="4" md="3" lg="3">
      <v-card class="mx-auto" tile :color="card.color" dark>
        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <v-card-title class="subtitle-2 pb-0">{{card.text}}</v-card-title>
            <v-card-title class="subtitle-1 font-weight-bold">NPR {{amounts[index]}}</v-card-title>
          </div>
          <!-- <v-icon size="50px" class="mr-5">{{card.icon}}</v-icon> -->
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["amounts"],
  data() {
    return {
      cards: [
        {
          text: "TOTAL INVOICE",
          value: "0.00",
          icon: "mdi-cash",
          color: "#457EEB"
        },
        {
          text: "TOTAL REVENUE",
          value: "0.00",
          icon: "mdi-cash",
          color: "#62AC5B"
        },
        {
          text: "TOTAL BILLS",
          value: "0.00",
          icon: "mdi-cash",
          color: "#546e7a"
        },
        {
          text: "TOTAL PAYMENTS",
          value: "0.00",
          icon: "mdi-cash",
          color: "#F70034"
        },
        {
          text: "TOTAL EXPENSES",
          value: "0.00",
          icon: "mdi-cash",
          color: "#9c27b0"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@media (min-width: 1264px) {
  .col-lg-3 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 20%;
    flex: 0 0 20%;
    max-width: 20%;
  }
}
</style>