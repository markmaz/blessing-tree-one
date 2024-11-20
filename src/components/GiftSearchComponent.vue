<script setup>
import router from "@/router/index.js";

import {
  Dataset,
  DatasetItem,
  DatasetInfo,
  DatasetPager,
  DatasetSearch,
  DatasetShow,
} from "vue-dataset";

const props = defineProps({
  showModal: {
    type: String,
    required: true
  },
});

watch(
    () => props.showModal,
    (newValue) => {
      if (newValue) {
        fetchGifts();
      }
    }
);

import {ref, reactive, computed, onMounted, watch} from "vue";
import giftService from "@/services/giftService.js";
const emit = defineEmits(['closeModal', 'addGift']);
function handleLinkClick() {
  emit('closeModal'); // Notify the parent to close the modal
}

let gifts = ref([]);
let loading = ref(true);
let searchQuery = ref('');

const cols = reactive([
  {
    name: "ID",
    field: "parentBTID",
    sort: "",
  },
  {
    name: "Child",
    field:"sequentialChildName",
    sort: ""
  },
  {
    name: "Age",
    field: "childAge",
    sort: "",
  },
  {
    name: "Gender",
    field: "childGender",
    sort: "",
  },
  {
    name: "Size",
    field: "size",
    sort: "",
  },
  {
    name: "Description",
    field: "description",
    sort: "",
  },
  {
    name: "Family",
    field: "parentLastName",
    sort: "",
  },
]);

const sortBy = computed(() => {
  return cols.reduce((acc, o) => {
    if (o.sort) {
      o.sort === "asc" ? acc.push(o.field) : acc.push("-" + o.field);
    }
    return acc;
  }, []);
});

// On sort th click
function onSort(event, i) {
  let toset;
  const sortEl = cols[i];

  if (!event.shiftKey) {
    cols.forEach((o) => {
      if (o.field !== sortEl.field) {
        o.sort = "";
      }
    });
  }

  if (!sortEl.sort) {
    toset = "asc";
  } else if (sortEl.sort === "desc") {
    toset = event.shiftKey ? "" : "asc";
  } else if (sortEl.sort === "asc") {
    toset = "desc";
  }

  sortEl.sort = toset;

  // Sort the rows based on the column and sort direction
  if (toset) {
    gifts.value.sort((a, b) => {
      if (toset === "asc") {
        return a[sortEl.field] > b[sortEl.field] ? 1 : -1;
      } else {
        return a[sortEl.field] < b[sortEl.field] ? 1 : -1;
      }
    });
  }
}

function addGift(id){
  emit("addGift", id);
}

async function fetchGifts() {
  try {
    loading.value = true;
    const response = await giftService.getUnsponsoredGifts();
    gifts.value = response.data;
  } catch (err) {
    console.warn(err.message);
  }finally {
    loading.value = false;
  }
}

onMounted(() => {
  // Remove labels from
  document.querySelectorAll("#datasetLength label").forEach((el) => {
    el.remove();
  });

  if(!loading.value){
    let selectLength = document.querySelector("#datasetLength select");

    selectLength.classList = "";
    selectLength.classList.add("form-select");
    selectLength.style.width = "80px";
  }
  // Replace select classes


  fetchGifts()
});

const flattenedData = computed(() => {
  return gifts.value.flatMap(parent =>
      parent.children.flatMap((child, index) =>
          child.gifts
              .filter(gift => !gift?.sponsor?.id).map(gift => ({
            parentId: parent.id,
            parentBtid: parent.btid,
            parentPrimaryPhone: parent.primaryPhone,
            parentFirstName: parent.firstName,
            parentLastName: parent.lastName,
            childId: child.id,
            childGender: child.gender,
            childAge: child.age || 'N/A',
            giftId: gift.id,
            giftSize: gift.size,
            giftDescription: gift.description,
            giftStatus: gift.status,
            sequentialChildName: `Child ${index + 1}`,
            // sponsorFirstName: gift?.sponsor?.firstName || null,
            // sponsorLastName: gift?.sponsor?.lastName || null,
            // sponsorId: gift?.sponsor?.sponsorId || null,
          }))
      )
  );
});
</script>
<style lang="scss" scoped>
  .gg-select {
    box-sizing: border-box;
    position: relative;
    display: block;
    transform: scale(1);
    width: 22px;
    height: 22px;
  }
  .gg-select::after,
  .gg-select::before {
    content: "";
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 8px;
    height: 8px;
    left: 7px;
    transform: rotate(-45deg);
  }
  .gg-select::before {
    border-left: 2px solid;
    border-bottom: 2px solid;
    bottom: 4px;
    opacity: 0.3;
  }
  .gg-select::after {
    border-right: 2px solid;
    border-top: 2px solid;
    top: 4px;
    opacity: 0.3;
  }
  th.sort {
    cursor: pointer;
    user-select: none;
    &.asc {
      .gg-select::after {
        opacity: 1;
      }
    }
    &.desc {
      .gg-select::before {
        opacity: 1;
      }
    }
  }
  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
  }

  .spinner {
    border: 5px solid #f3f3f3; /* Light grey */
    border-top: 5px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

</style>
<template>
  <div v-if="loading" class="spinner-container">
    <div class="spinner"></div>
  </div>
  <div class="content"  v-if="!loading">
    <Dataset
        v-slot="{ ds }"
        :ds-data="flattenedData"
        :ds-sortby="sortBy"
        :ds-search-in="['giftDescription', 'giftSize', 'childAge', 'parentLastName', 'parentFirstName']"
    >
      <div class="row" :data-page-count="ds.dsPagecount">
        <div class="col-md-12">
          <DatasetSearch ds-search-placeholder="Search..." />
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-md-12">
          <div class="table-responsive">
            <table class="table table-striped mb-0">
              <thead>
              <tr>
                <th
                    v-for="(th, index) in cols"
                    :key="th.field"
                    :class="['sort', th.sort,]"
                    @click="onSort($event, index)"
                >
                  {{ th.name }} <i class="gg-select float-end"></i>
                </th>
                <th>Check to Sponsor</th>
              </tr>
              </thead>
              <DatasetItem tag="tbody" class="fs-sm">
                <template #default="{ row }">
                  <tr v-if="row">
                    <td>{{row.parentBtid}}</td>
                    <td>{{row.sequentialChildName}}</td>
                    <td>{{ row.childAge }}</td>
                    <td>{{ row.childGender }}</td>
                    <td>{{ row.giftSize }}</td>
                    <td style="min-width: 150px">{{ row.giftDescription }}</td>
                    <td>
                      <router-link @click.prevent="handleLinkClick" :to="{ name: 'backend-families-details', params: { id: row.parentId } }">
                        {{ row.parentFirstName }} {{ row.parentLastName }}
                      </router-link>
                    </td>
                    <td class="text-center">
                      <div class="btn-group">
                        <input type="checkbox" @click="addGift(row.giftId)">
                      </div>
                    </td>
                  </tr>
                </template>
              </DatasetItem>
            </table>
          </div>
        </div>
      </div>
      <div
          class="d-flex flex-md-row flex-column justify-content-between align-items-center"
      >
        <DatasetInfo class="py-3 fs-sm" />
        <DatasetPager class="flex-wrap py-3 fs-sm" />
      </div>
    </Dataset>
  </div>
</template>