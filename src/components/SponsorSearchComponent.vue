<script setup>
import sponsorService from "@/services/sponsorService.js";
import {computed, defineExpose, onMounted, reactive, ref} from "vue";
import {
  Dataset,
  DatasetItem,
  DatasetInfo,
  DatasetPager,
  DatasetSearch,
  DatasetShow,
} from "vue-dataset";

const cols = reactive([
  {
    name: "Name",
    field: "firstName lastName",
    sort: "",
  },
  {
    name: "Phone",
    field: "phone",
    sort: "",
  },
  {
    name: "Best Time to Call",
    field: "bestTimeToCall",
    sort: "",
  },
  {
    name: "# of Children",
    field: "numberOfChildrenSponsored",
    sort: "",
  },
  {
    name: "Age",
    field: "agePreference",
    sort: "",
  },
  {
    name: "Gender",
    field: "genderPreference",
    sort: "",
  }
]);

let sponsors = ref([{id: null, phone:null, gifts:[{}]}]);
let loading = ref(false);
let selectedSponsor = ref(null);

function selectSponsor(id){
  selectedSponsor.value = id;
  emit("addSponsor", id);
}

async function fetch(){
  loading.value = true;

  try {
    const response = await sponsorService.getSponsors();
    sponsors.value = response.data;
    console.log(sponsors.value);
  }catch (err){
    console.error(err);
  }finally {
    loading.value = false;
  }
}

onMounted( () => {
  if(!loading.value){
    // Remove labels from
    document.querySelectorAll("#datasetLength label").forEach((el) => {
      el.remove();
    });

    // Replace select classes
    let selectLength = document.querySelector("#datasetLength select");

    selectLength.classList = "";
    selectLength.classList.add("form-select");
    selectLength.style.width = "80px";
  }

  fetch();
})

const showNonSponsorsOnly = ref(true);
const sponsorsWithGiftCount = computed(() => {
    return sponsors.value.map((sponsor) => ({
      ... sponsor,
      giftCount: sponsor.gifts.length,
  }));
});

const filteredSponsors = computed(() => {
  if (showNonSponsorsOnly.value) {
    return sponsorsWithGiftCount.value.filter(
        (sponsor) => sponsor.giftCount < sponsor.numberOfChildrenSponsored
    );
  }

  return sponsorsWithGiftCount.value;
});

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
    sponsors.value.sort((a, b) => {
      if (toset === "asc") {
        return a[sortEl.field] > b[sortEl.field] ? 1 : -1;
      } else {
        return a[sortEl.field] < b[sortEl.field] ? 1 : -1;
      }
    });
  }
}

const sortBy = computed(() => {
  return cols.reduce((acc, o) => {
    if (o.sort) {
      o.sort === "asc" ? acc.push(o.field) : acc.push("-" + o.field);
    }
    return acc;
  }, []);
});

const fetchSponsor = () =>{
  fetch();
}


defineExpose({
  fetchSponsor
});

const emit = defineEmits(['closeModal', 'addSponsor']);
function handleLinkClick() {
  emit('closeModal'); // Notify the parent to close the modal
}
</script>

<style scoped>
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
        :ds-data="filteredSponsors"
        :ds-sortby="sortBy"
        :ds-search-in="['firstName', 'phone', 'lastName', 'email']"
    >
      <div class="row" :data-page-count="ds.dsPagecount">
        <div id="datasetLength" class="col-md-8 py-2">
          <DatasetShow style="width: 80px" />
        </div>
        <div class="col-md-4 py-2">
          <DatasetSearch ds-search-placeholder="Search..." />
        </div>
      </div>
      <hr />
      <div class="row items-push">
        <div class="mb-3 col-auto ms-auto">
          <div class="form-block form-check">
            <input
                checked
                type="checkbox"
                id="filterSponsors"
                v-model="showNonSponsorsOnly"
                class="form-check-input"
            />
            <label for="filterSponsors" class="form-check-label">
              Show only sponsors who haven't sponsored all their designated children
            </label>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="table-responsive">
            <table class="table table-striped mb-0">
              <thead>
              <tr>
                <th
                    v-for="(th, index) in cols"
                    :key="th.field"
                    :class="['sort', th.sort]"
                    @click="onSort($event, index)"
                >
                  {{ th.name }} <i class="gg-select float-end"></i>
                </th>
                <th>Action</th>
              </tr>
              </thead>
              <DatasetItem tag="tbody" class="fs-sm">
                <template #default="{ row }">
                  <tr v-if="row">
                    <td style="min-width: 150px"><router-link @click.prevent="handleLinkClick" :to="{ name: 'backend-sponsors-detail', params: { id: row.id } }">
                      {{ row.firstName }} {{row.lastName}}
                    </router-link></td>
                    <td>{{ row.phone }}</td>
                    <td>{{ row.bestTimeToCall }}</td>
                    <td>{{row.giftCount}}/{{row.numberOfChildrenSponsored}}</td>
                    <td>{{row.childAgePreference}}</td>
                    <td>{{row.genderPreference}}</td>
                    <td class="text-center">
                      <div class="form-check form-block">
                        <input type="radio" class="form-check-input" @click="selectSponsor(row.id)" :id="row.id" name="sponsor_block">
                        <label class="form-check-label" :for="row.id"><i class="fa fa-gift"></i> </label>
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