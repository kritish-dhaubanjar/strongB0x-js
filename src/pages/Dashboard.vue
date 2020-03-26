<template>
  <div class="pb-5 px-3">
    <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-row>
      <v-col cols="6" offset="3" class="text-right pb-0 pt-5">
        <v-icon>mdi-calendar-month</v-icon>
        <span class="caption">From: {{earliestDate}}</span>
        <v-icon class="ml-3">mdi-calendar-month</v-icon>
        <span class="caption">To: {{latestDate}}</span>
      </v-col>
      <v-col cols="3" class="p-0">
        <v-select
          dense
          :items="range"
          v-model="selected"
          @change="getStatistics"
          menu-props="auto"
          label="Select"
          hide-details
          prepend-icon="mdi-calendar"
          single-line
        ></v-select>
      </v-col>
    </v-row>

    <!-- Cards -->
    <Cards :amounts="values"></Cards>

    <v-row>
      <v-col class="py-10 my-10">
        <div id="chartDiv">
          <canvas id="chart"></canvas>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Cards from "@/components/dashboard/Cards";
import Chart from "chart.js";
import axios from "axios";
export default {
  data() {
    return {
      overlay: true,
      selected: "last7days",
      chartjs: null,
      duration: {
        earliest: { year: "", month: "", day: "" },
        latest: { year: "", month: "", day: "" }
      },
      range: [
        {
          text: "Last 7 days",
          value: "last7days"
        },
        {
          text: "Last 28 days",
          value: "last28days"
        },
        {
          text: "Last 90 days",
          value: "last90days"
        },
        {
          text: "Last 365 days",
          value: "last365days"
        },
        {
          text: "Lifetime",
          value: "lifetime"
        }
      ],
      months: [
        "Baishak",
        "Jestha",
        "Ashad",
        "Shrawn",
        "Bhadra",
        "Ashwin",
        "Kartik",
        "Mangshir",
        "Poush",
        "Magh",
        "Falgun",
        "Chaitra"
      ],
      values: ["0.00", "0.00", "0.00", "0.00", "0.00"],

      labels: [],
      chart: {
        bills: [],
        invoices: [],
        payments: [],
        revenues: [],
        expenses: []
      },
      server: {
        bills: {},
        invoices: {},
        payments: {},
        revenues: {},
        expenses: {}
      }
    };
  },

  created() {
    axios.get("/api/statistics").then(res => {
      let { month: m2, year: y2 } = res.data.latest;
      let { month: m1, year: y1 } = res.data.earliest;
      let months = [];
      for (let year = y2; year >= y1; year--) {
        for (let month = 11; month >= 0; month--) {
          months.push({
            text: `${this.months[month]} ${year}`,
            value: `${this.months[month]}${year}`.toLowerCase()
          });
        }
      }

      months.splice(0, 12 - m2);
      months.splice(months.length - m1 + 1, m1);
      this.range = [...this.range, ...months];
      this.getStatistics();
    });
  },

  computed: {
    earliestDate() {
      return `${this.duration.earliest.year}-${this.duration.earliest.month}-${this.duration.earliest.day}`;
    },
    latestDate() {
      return `${this.duration.latest.year}-${this.duration.latest.month}-${this.duration.latest.day}`;
    }
  },

  watch: {
    labels() {
      if (this.chartjs) {
        this.chartjs.destroy();
      }
      let ctx = document.getElementById("chart").getContext("2d");
      this.chartjs = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.labels,
          datasets: [
            {
              label: "Invoices",
              data: this.chart.invoices,
              backgroundColor: "rgba(85, 107, 231, 0.45)",
              borderColor: "#457EEB",
              borderWidth: 2
            },
            {
              label: "Revenues",
              data: this.chart.revenues,
              backgroundColor: "rgba(98, 172, 91, 0.45)",
              borderColor: "#62AC5B",
              borderWidth: 2
            },
            {
              label: "Bills",
              data: this.chart.bills,
              backgroundColor: "rgba(84, 110, 112, 0.45)",
              borderColor: "#546e7a",
              borderWidth: 2
            },

            {
              label: "Payments",
              data: this.chart.payments,
              backgroundColor: "rgba(255, 0, 52, 0.45)",
              borderColor: "#F70034",
              borderWidth: 2
            },

            {
              label: "Expenses",
              data: this.chart.expenses,
              backgroundColor: "rgba(167, 0, 172, 0.2)",
              borderColor: "#9c27b0",
              borderWidth: 2
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
          // events: ["click"]
        }
      });
      this.overlay = false;
    }
  },

  methods: {
    getStatistics() {
      this.overlay = true;
      axios.get(`/api/statistics/timeline/${this.selected}`).then(res => {
        let intl = new Intl.NumberFormat("en-IN");
        this.duration = res.data.range;
        this.values = []; //Reactivity
        this.values[0] = intl.format(res.data.invoices.amount);
        this.values[1] = intl.format(res.data.revenues.amount);
        this.values[2] = intl.format(res.data.bills.amount);
        this.values[3] = intl.format(res.data.payments.amount);
        this.values[4] = intl.format(res.data.expenses.amount);
        this.server.bills = res.data.bills.data;
        this.server.invoices = res.data.invoices.data;
        this.server.payments = res.data.payments.data;
        this.server.revenues = res.data.revenues.data;
        this.server.expenses = res.data.expenses.data;
        this.getTimeline();
      });
    },

    getTimeline() {
      let y1 = this.duration.earliest.year;
      let m1 = this.duration.earliest.month;
      let d1 = this.duration.earliest.day;
      let start = this.duration.earliest.serial;
      let end = this.duration.latest.serial;

      let marker = {
        year: y1,
        month: Number.parseInt(m1),
        day: Number.parseInt(d1),
        serial: Number.parseInt(start)
      };

      let timeline = {};
      timeline[marker.serial] = { ...marker };

      this.labels = [];

      while (marker.serial < end) {
        if (marker.day <= this.$BS[marker.year][marker.month - 1]) {
          if (marker.day == this.$BS[marker.year][marker.month - 1]) {
            if (marker.month == 12) {
              marker.month = 1;
              marker.year++;
            }
            marker.day = 1;
            marker.month++;
            marker.serial = Number.parseInt(
              `${marker.year}${
                marker.month > 9 ? marker.month : "0" + marker.month
              }${marker.day > 9 ? marker.day : "0" + marker.day}`
            );
          } else {
            marker.day++;
            marker.month = Number.parseInt(marker.month);
            marker.serial++;
          }
          timeline[marker.serial] = { ...marker };
        } else {
          break;
        }
      }

      let labels = [];
      let bills = {};
      let invoices = {};
      let revenues = {};
      let payments = {};
      let expenses = {};
      this.chart.bills = [];
      this.chart.invoices = [];
      this.chart.revenues = [];
      this.chart.payments = [];
      this.chart.expenses = [];
      for (let key in timeline) {
        let value = timeline[key];
        bills[key] = 0;
        invoices[key] = 0;
        revenues[key] = 0;
        payments[key] = 0;
        expenses[key] = 0;
        labels.push(`${value.year}-${value.month}-${value.day}`);
      }
      //
      for (let key in this.server.bills) {
        bills[key] = this.server.bills[key];
      }

      for (let key in bills) {
        this.chart.bills.push(bills[key]);
      }
      //
      for (let key in this.server.invoices) {
        invoices[key] = this.server.invoices[key];
      }

      for (let key in invoices) {
        this.chart.invoices.push(invoices[key]);
      }
      //
      for (let key in this.server.payments) {
        payments[key] = this.server.payments[key];
      }

      for (let key in payments) {
        this.chart.payments.push(payments[key]);
      }
      //
      for (let key in this.server.revenues) {
        revenues[key] = this.server.revenues[key];
      }

      for (let key in revenues) {
        this.chart.revenues.push(revenues[key]);
      }
      //
      for (let key in this.server.expenses) {
        expenses[key] = this.server.expenses[key];
      }

      for (let key in expenses) {
        this.chart.expenses.push(expenses[key]);
      }

      this.labels = labels;
    }
  },

  components: {
    Cards
  }
};
</script>

<style>
</style>