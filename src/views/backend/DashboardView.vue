<script setup>
import { reactive, ref } from "vue";
import {useUserStore} from  "@/stores/userStore";
import FamilyWidget from "@/components/FamilyWidget.vue";
import GiftWidget from "@/components/GIftWidget.vue";
import SponsorWidget from "@/components/SponsorWidget.vue";
import TopTenWidget from "@/components/TopTenWidget.vue";
import ChildWidget from "@/components/ChildWidget.vue";

// vue-chartjs, for more info and examples you can check out https://vue-chartjs.org/ and http://www.chartjs.org/docs/ -->
import { Line, Bar } from "vue-chartjs";
import { Chart, registerables } from "chart.js";
const userStore = useUserStore();
Chart.register(...registerables);

// Set Global Chart.js configuration
Chart.defaults.color = "#818d96";
Chart.defaults.scale.grid.lineWidth = 0;
Chart.defaults.scale.beginAtZero = true;
Chart.defaults.datasets.bar.maxBarThickness = 45;
Chart.defaults.elements.bar.borderRadius = 4;
Chart.defaults.elements.bar.borderSkipped = false;
Chart.defaults.elements.point.radius = 0;
Chart.defaults.elements.point.hoverRadius = 0;
Chart.defaults.plugins.tooltip.radius = 3;
Chart.defaults.plugins.legend.labels.boxWidth = 10;

// Helper variables
const orderSearch = ref(false);
const {login, logout, username, isAuthenticated, name, title} = userStore;

</script>

<template>
  <!-- Hero -->
  <div class="content">
    <div
      class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center py-2 text-center text-md-start"
    >
      <div class="flex-grow-1 mb-1 mb-md-0">
        <h1 class="h3 fw-bold mb-2">Dashboard</h1>
        <h2 class="h6 fw-medium fw-medium text-muted mb-0">
          Welcome {{ name }}, everything looks great.
        </h2>
      </div>

    </div>
  </div>
  <!-- END Hero -->

  <!-- Page Content -->
  <div class="content">
    <!-- Overview -->
    <div class="row items-push">
      <div class="col-sm-6 col-xxl-3">
        <!-- Families -->
        <family-widget/>
        <!-- END Pending Orders -->
      </div>
      <div class="col-sm-6 col-xxl-3">
        <!-- New Customers -->
        <child-widget/>
        <!-- END New Customers -->
      </div>
      <div class="col-sm-6 col-xxl-3">
        <!-- Sponsors -->
        <SponsorWidget/>
        <!-- END sponsors -->
      </div>
      <div class="col-sm-6 col-xxl-3">
        <!-- Gifts -->
        <gift-widget/>
        <!-- END Gifts-->
      </div>
    </div>
    <!-- END Overview -->
    <div class="row items-push">
      <div></div>
    </div>
    <!-- Recent Orders -->
    <div class="row items-push">
      <div class="col-sm-6 col-xxl-6">
        <TopTenWidget limit="10" gender="M" title="Top 10 Most Requested Gifts for Boys"/>
      </div>
      <div class="col-sm-6 col-xxl-6">
        <TopTenWidget limit="10" gender="F" title="Top 10 Most Requested Gifts for Girls"/>
      </div>
    </div>
    <!-- END Recent Orders -->
  </div>
  <!-- END Page Content -->
</template>
