<template>
  <div class="mb-10">
    <v-overlay :value="overlay" z-index="7">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-row>
      <v-col cols="12" md="5">
        <h1 class="title">Income vs Expense | Fiscal Year</h1>
      </v-col>
      <v-col cols="8" md="4" class="text-right pb-0 pt-5">
        <v-icon>mdi-calendar-month</v-icon>
        <span class="caption">From: {{earliestDate}}</span>
        <v-icon class="ml-3">mdi-calendar-month</v-icon>
        <span class="caption">To: {{latestDate}}</span>
      </v-col>
      <v-col cols="4" md="3" class="p-0">
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
    <v-row>
      <v-col class="py-10">
        <div id="chartDiv">
          <canvas id="chart"></canvas>
        </div>
      </v-col>
    </v-row>
    <v-row class="mb-10 pb-10">
      <v-col cols="12">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left"></th>
                <th v-for="month in labels" :key="month" class="text-left">{{month}}</th>
                <th class="text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in datasets" :key="index">
                <th
                  :class="{'revenues': item.category=='revenues',
                'expenses': item.category=='expenses',
                 'payments': item.category=='payments'}"
                >{{ item.label }}</th>
                <td
                  :class="{'revenues': item.category=='revenues',
                 'expenses': item.category=='expenses',
                  'payments': item.category=='payments'}"
                  v-for="(amount, index) in item.data"
                  :key="index"
                >{{ amount }}</td>
                <th
                  :class="{'revenues': item.category=='revenues', 'expenses': item.category=='expenses', 'payments': item.category=='payments'}"
                >{{netAmount[index]}}</th>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col cols="12" class="text-right">
        <download-excel
          class="v-btn v-btn--depressed theme--light v-size--small"
          worksheet="Worksheet"
          :name="`income_expense_${duration.earliest.year}_${duration.latest.year}.xls`"
          :data="json_data"
        >
          <v-icon>mdi-upload</v-icon>Export
        </download-excel>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import Chart from "chart.js";

export default {
  data() {
    return {
      overlay: false,
      duration: {
        earliest: { year: "", month: "", day: "" },
        latest: { year: "", month: "", day: "" }
      },
      range: [],
      selected: "",
      categories: [],
      labels: [
        "Shrawn",
        "Bhadra",
        "Ashwin",
        "Kartik",
        "Mangshir",
        "Poush",
        "Magh",
        "Falgun",
        "Chaitra",
        "Baishak",
        "Jestha",
        "Ashad"
      ],
      datasets: [],
      chartjs: null,
      colors: [
        "#FF6633",
        "#FF33FF",
        "#00B3E6",
        "#E6B333",
        "#3366E6",
        "#999966",
        "#99FF99",
        "#B34D4D",
        "#80B300",
        "#809900",
        "#E6B3B3",
        "#6680B3",
        "#66991A",
        "#FF99E6",
        "#CCFF1A",
        "#FF1A66",
        "#E6331A",
        "#33FFCC",
        "#66994D",
        "#B366CC",
        "#4D8000",
        "#B33300",
        "#CC80CC",
        "#66664D",
        "#991AFF",
        "#E666FF",
        "#4DB3FF",
        "#1AB399",
        "#E666B3",
        "#33991A",
        "#CC9999",
        "#B3B31A",
        "#00E680",
        "#4D8066",
        "#809980",
        "#E6FF80",
        "#1AFF33",
        "#999933",
        "#FF3380",
        "#CCCC00",
        "#66E64D",
        "#4D80CC",
        "#9900B3",
        "#E64D66",
        "#4DB380",
        "#FF4D4D",
        "#99E6E6",
        "#6666FF"
      ]
    };
  },

  computed: {
    earliestDate() {
      return `${this.duration.earliest.year}-${this.duration.earliest.month}-${this.duration.earliest.day}`;
    },
    latestDate() {
      return `${this.duration.latest.year}-${this.duration.latest.month}-${this.duration.latest.day}`;
    },

    netAmount() {
      return this.datasets.map(e => {
        return e.data.reduce((acc, f) => {
          return acc + f;
        }, 0);
      });
    },

    json_data() {
      let json_data = [];
      let temp = {};
      this.datasets.forEach(e => {
        temp["Category"] = e.label;
        let total = 0;
        e.data.forEach((d, index) => {
          temp[this.labels[index]] = d;
          total += d;
        });
        temp["Total"] = total;
        json_data.push(temp);
        temp = {};
      });

      return json_data;
    }
  },

  created() {
    axios
      .get("/api/categories")
      .then(res => {
        this.categories = res.data.data.filter(f => {
          return f.type == "income" || f.type == "expense";
        });
      })
      .then(() => {
        axios
          .get("/api/statistics")
          .then(res => {
            if (res.data.status != 204) {
              let { year: y2 } = res.data.latest;
              let { year: y1 } = res.data.earliest;
              for (let year = y2; year >= y1; year--) {
                this.range.push({
                  text: `${year}`,
                  value: `${year}`
                });
              }
              this.selected = `${y2}`;
              this.getStatistics();
            } else {
              this.overlay = false;
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
  },

  methods: {
    getStatistics() {
      this.overlay = true;
      axios.get(`/api/reports/income-expense/${this.selected}`).then(res => {
        if (res.data.status != 204) {
          this.duration = res.data.range;
          this.overlay = false;
          // let { revenues, payments, expenses } = res.data;

          this.datasets = [];
          let net = {
            label: "Net Amount",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            borderColor: this.colors[this.colors.length - 1],
            backgroundColor: "transparent",
            borderWidth: 2,
            hidden: false
          };

          let i = 0;
          for (let item in res.data) {
            if (item == "range") continue;
            for (let category in res.data[item]) {
              let data = {
                label: "",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: this.colors[i],
                backgroundColor: "transparent",
                borderWidth: 2,
                hidden: true,
                category: item
              };
              data.label = category;
              for (let year in res.data[item][category]) {
                for (let month in res.data[item][category][year]) {
                  let _month = Number.parseInt(month);
                  let index = _month >= 4 ? _month - 4 : _month + 8;
                  data.data[index] =
                    res.data[item][category][year][month].amount;
                  switch (item) {
                    case "revenues":
                      net.data[index] += data.data[index];
                      break;
                    case "payments":
                      net.data[index] -= data.data[index];
                      break;
                    case "expenses":
                      net.data[index] -= data.data[index];
                      break;
                  }
                }
              }
              this.datasets.push(data);
              i++;
            }
          }
          this.datasets.push(net);
        }

        this.draw();
      });
    },

    draw() {
      if (this.chartjs) {
        this.chartjs.destroy();
      }
      let ctx = document.getElementById("chart").getContext("2d");
      this.chartjs = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.labels,
          datasets: this.datasets
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
  }
};
</script>

<style scoped>
.revenues {
  background-color: rgb(98, 172, 91, 0.15);
}

.payments {
  background-color: rgb(247, 0, 52, 0.25);
}

.expenses {
  background-color: rgb(156, 39, 176, 0.15);
}
</style>