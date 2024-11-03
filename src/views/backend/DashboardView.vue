<script setup>
import { reactive, ref } from "vue";
import {useUserStore} from  "@/stores/userStore";

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
          Welcome
          <RouterLink
            :to="{ name: 'backend-pages-generic-profile' }"
            class="fw-semibold"
            >{{ name }}</RouterLink
          >, everything looks great.
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
        <!-- Pending Orders -->
        <BaseBlock class="d-flex flex-column h-100 mb-0">
          <template #content>
            <div
              class="block-content block-content-full flex-grow-1 d-flex justify-content-between align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-3 fw-bold">32</dt>
                <dd class="fs-sm fw-medium fs-sm fw-medium text-muted mb-0">
                  Families
                </dd>
              </dl>
              <div class="item item-rounded-lg bg-body-light">
                <i class="fa fa-baby fs-3 text-primary"></i>
              </div>
            </div>
            <div class="bg-body-light rounded-bottom">
              <a
                class="block-content block-content-full block-content-sm fs-sm fw-medium d-flex align-items-center justify-content-between"
                href="javascript:void(0)"
              >
                <span>View all Families</span>
                <i
                  class="fa fa-arrow-alt-circle-right ms-1 opacity-25 fs-base"
                ></i>
              </a>
            </div>
          </template>
        </BaseBlock>
        <!-- END Pending Orders -->
      </div>
      <div class="col-sm-6 col-xxl-3">
        <!-- New Customers -->
        <BaseBlock class="d-flex flex-column h-100 mb-0">
          <template #content>
            <div
              class="block-content block-content-full flex-grow-1 d-flex justify-content-between align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-3 fw-bold">124</dt>
                <dd class="fs-sm fw-medium fs-sm fw-medium text-muted mb-0">
                  Seniors
                </dd>
              </dl>
              <div class="item item-rounded-lg bg-body-light">
                <i class="fa fa-person-cane fs-3 text-primary"></i>
              </div>
            </div>
            <div class="bg-body-light rounded-bottom">
              <a
                class="block-content block-content-full block-content-sm fs-sm fw-medium d-flex align-items-center justify-content-between"
                href="javascript:void(0)"
              >
                <span>View all Seniors</span>
                <i
                  class="fa fa-arrow-alt-circle-right ms-1 opacity-25 fs-base"
                ></i>
              </a>
            </div>
          </template>
        </BaseBlock>
        <!-- END New Customers -->
      </div>
      <div class="col-sm-6 col-xxl-3">
        <!-- Messages -->
        <BaseBlock class="d-flex flex-column h-100 mb-0">
          <template #content>
            <div
              class="block-content block-content-full flex-grow-1 d-flex justify-content-between align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-3 fw-bold">45</dt>
                <dd class="fs-sm fw-medium fs-sm fw-medium text-muted mb-0">
                  Sponsors
                </dd>
              </dl>
              <div class="item item-rounded-lg bg-body-light">
                <i class="si si-badge fs-3 text-primary"></i>
              </div>
            </div>
            <div class="bg-body-light rounded-bottom">
              <a
                class="block-content block-content-full block-content-sm fs-sm fw-medium d-flex align-items-center justify-content-between"
                href="javascript:void(0)"
              >
                <span>View all Sponsors</span>
                <i
                  class="fa fa-arrow-alt-circle-right ms-1 opacity-25 fs-base"
                ></i>
              </a>
            </div>
          </template>
        </BaseBlock>
        <!-- END Messages -->
      </div>
      <div class="col-sm-6 col-xxl-3">
        <!-- Conversion Rate -->
        <BaseBlock class="d-flex flex-column h-100 mb-0">
          <template #content>
            <div
              class="block-content block-content-full flex-grow-1 d-flex justify-content-between align-items-center"
            >
              <dl class="mb-0">
                <dt class="fs-3 fw-bold">99</dt>
                <dd class="fs-sm fw-medium fs-sm fw-medium text-muted mb-0">
                  Gifts
                </dd>
              </dl>
              <div class="item item-rounded-lg bg-body-light">
                <i class="fa fa-gift fs-3 text-primary"></i>
              </div>
            </div>
            <div class="bg-body-light rounded-bottom">
              <a
                class="block-content block-content-full block-content-sm fs-sm fw-medium d-flex align-items-center justify-content-between"
                href="javascript:void(0)"
              >
                <span>View all Gifts</span>
                <i
                  class="fa fa-arrow-alt-circle-right ms-1 opacity-25 fs-base"
                ></i>
              </a>
            </div>
          </template>
        </BaseBlock>
        <!-- END Conversion Rate-->
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
