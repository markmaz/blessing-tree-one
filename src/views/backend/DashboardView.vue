<script setup>
import { reactive, ref } from "vue";
import {useUserStore} from  "@/stores/userStore";
import FamilyWidget from "@/components/FamilyWidget.vue";
import GiftWidget from "@/components/GIftWidget.vue";
import SponsorWidget from "@/components/SponsorWidget.vue";
import SeniorsWidget from "@/components/SeniorsWidget.vue";

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
        <seniorsWidget/>
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
    <!-- Recent Orders -->
    <BaseBlock title="Un-Sponsored Gifts">
      <template #content>
        <div
          v-if="orderSearch"
          id="one-dashboard-search-orders"
          class="block-content border-bottom"
        >
        </div>
        <div class="block-content block-content-full">
          <!-- Recent Orders Table -->
          <div class="table-responsive">
            <table class="table table-hover table-vcenter">
              <thead>
                <tr>
                  <th>Gift ID</th>
                  <th>Gift Category</th>
                  <th class="d-none d-xl-table-cell">Gift Description</th>
                  <th>Age Group</th>
                  <th class="d-none d-sm-table-cell">Gender</th>
                  <th class="d-none d-sm-table-cell">Family</th>
                </tr>
              </thead>
              <tbody class="fs-sm">
                <tr>
                  <td>
                    <a class="fw-semibold" href="javascript:void(0)">601</a>
                  </td>
                  <td class="fw-semibold text-muted">
                    Clothing
                  </td>
                  <td class="d-none d-xl-table-cell fw-semibold text-muted">
                    Socks (8)
                  </td>
                  <td>
                    <span
                      class="fs-xs fw-semibold text-muted"
                      >2 - 3</span>
                  </td>
                  <td>
                    <span class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-info-light text-info text-center">M</span>
                  </td>
                  <td class="d-none d-sm-table-cell fw-semibold text-muted">
                    <a class="fw-semibold" href="javascript:void(0)">Jessica Sprang</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a class="fw-semibold" href="javascript:void(0)">611</a>
                  </td>
                  <td class="fw-semibold text-muted">
                    Toys
                  </td>
                  <td class="d-none d-xl-table-cell fw-semibold text-muted">
                    Cabbage Patch Doll
                  </td>
                  <td>
                    <span
                        class="fs-xs fw-semibold text-muted"
                    >6 - 8</span>
                  </td>
                  <td>
                    <span class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-warning-light text-info text-center">F</span>
                  </td>
                  <td class="d-none d-sm-table-cell fw-semibold text-muted">
                    <a class="fw-semibold" href="javascript:void(0)">Jessica Sprang</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a class="fw-semibold" href="javascript:void(0)">633</a>
                  </td>
                  <td class="fw-semibold text-muted">
                    Clothing
                  </td>
                  <td class="d-none d-xl-table-cell fw-semibold text-muted">
                    Baseball Cap (6)
                  </td>
                  <td>
                    <span
                        class="fs-xs fw-semibold text-muted"
                    >6 - 8</span>
                  </td>
                  <td>
                    <span class="fs-xs fw-semibold d-inline-block py-1 px-3 rounded-pill bg-warning-light text-info text-center">F</span>
                  </td>
                  <td class="d-none d-sm-table-cell fw-semibold text-muted">
                    <a class="fw-semibold" href="javascript:void(0)">Jessica Sprang</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- END Recent Orders Table -->
        </div>
        <div class="block-content block-content-full bg-body-light">
          <!-- Pagination -->
          <nav aria-label="Photos Search Navigation">
            <ul class="pagination pagination-sm justify-content-end mb-0">
              <li class="page-item">
                <a
                  class="page-link"
                  href="javascript:void(0)"
                  tabindex="-1"
                  aria-label="Previous"
                >
                  Prev
                </a>
              </li>
              <li class="page-item active">
                <a class="page-link" href="javascript:void(0)">1</a>
              </li>
              <li class="page-item">
                <a class="page-link" href="javascript:void(0)">2</a>
              </li>
              <li class="page-item">
                <a class="page-link" href="javascript:void(0)">3</a>
              </li>
              <li class="page-item">
                <a class="page-link" href="javascript:void(0)">4</a>
              </li>
              <li class="page-item">
                <a
                  class="page-link"
                  href="javascript:void(0)"
                  aria-label="Next"
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
          <!-- END Pagination -->
        </div>
      </template>
    </BaseBlock>
    <!-- END Recent Orders -->
  </div>
  <!-- END Page Content -->
</template>
