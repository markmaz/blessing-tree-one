<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import router from "@/router/index.js";
import sponsorService from "@/services/sponsorService.js";
import GiftSearchComponent from "@/components/GiftSearchComponent.vue";

import {
  Dataset,
  DatasetItem,
  DatasetInfo,
  DatasetPager,
  DatasetSearch,
  DatasetShow,
} from "vue-dataset";
import giftService from "@/services/giftService.js";
import tagService from "@/services/reportService.js";
import utils from "@/utility/utils.js";

let sponsors = ref([{}]);
let sponsorID = ref(0);
let loading = ref(true);
let currentSponsor = ref(null);
let logEntry = ref({id: null, callDate: null, callDescription:null});

const callLogModal = ref(null);
const sponsorName = ref(null);
const showAddGift = ref(null);
const selectedGifts = ref([]);
let saveGiftText = ref("Save Gift");
let giftID = ref(null);
const showModal = ref("false");
const emit = defineEmits(['giftsAdded']);
const childRef = ref(null);

function addGift(value){
  const val = selectedGifts.value.indexOf(value);

  if(val > -1) {
    selectedGifts.value.splice(val, 1);
  }else{
    selectedGifts.value.push(value);
  }

  if(selectedGifts.value.length > 1){
    saveGiftText.value = "Save Gifts";
  }else{
    saveGiftText.value = "Save Gift";
  }
}
function closeModal() {
  showAddGift.value.hide();
  showModal.value = "false";
  selectedGifts.value.slice(0, selectedGifts.value.length);

  if(childRef.value){
    console.log("here");
    childRef.value.fetch();
  }else{
    console.log(childRef.value);
  }
}
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
    name: "Email",
    field: "emailAddress",
    sort: "",
  },
  {
    name: "Best Time to Call",
    field: "bestTimeToCall",
    sort: "",
  },
  {
    name: "# Pledged",
    field: "giftCount",
    sort: "",
  },
  {
    name: "# Sponsored",
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
  },
]);
function getCurrentDateTime() {
  const now = new Date();

  const pad = (num) => String(num).padStart(2, '0');

  const month = pad(now.getMonth() + 1); // Months are 0-based
  const day = pad(now.getDate());
  const year = now.getFullYear();

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

function openSearchGiftModal(id){
  childRef.value.fetch();
  currentSponsor.value = sponsors.value.find(s => s.id === id);
  showModal.value = "true";
  showAddGift.value = new bootstrap.Modal(document.getElementById('addGift'));
  showAddGift.value.show();
}

async function saveGift(){
  for (const gift of selectedGifts.value) {
    try{
      const response = await giftService.sponsorGift(gift, currentSponsor.value.id);
      console.log(response.data);
    }catch (err){
      console.error(err);
    }finally {
      await fetchSponsors();
      showAddGift.value.hide();

      if(childRef.value){
        console.log("here");
        childRef.value.fetch();
      }else{
        console.log(childRef.value);
      }
    }
  }
}

function openCallLog(id){
  currentSponsor.value = sponsors.value.find(s => s.id === id);
  callLogModal.value = new bootstrap.Modal(document.getElementById('callLogModal'));
  callLogModal.value.show();
}

async function saveEntry(){
  try{
    logEntry.value.callDate = getCurrentDateTime();
    const response = sponsorService.addLogEntry(currentSponsor.value.id, logEntry.value);
  }catch(err){
    console.error(err);
  }finally {
    await fetchSponsors();
    callLogModal.value.hide();
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
    sponsors.value.sort((a, b) => {
      if (toset === "asc") {
        return a[sortEl.field] > b[sortEl.field] ? 1 : -1;
      } else {
        return a[sortEl.field] < b[sortEl.field] ? 1 : -1;
      }
    });
  }
}
async function fetchSponsors() {
  try {
    loading.value =true;
    const response = await sponsorService.getSponsors();
    sponsors.value = response.data; // Adjust this based on your API response structure
    console.log(sponsors.value)
  } catch (err) {
    console.warn(err.message);
  }finally {
    loading.value=false;
  }
}
const showNonSponsorsOnly = ref(false);
const pendingFilter = ref(true);
const receivedFilter = ref(true);
const partialFilter = ref(false);

const filteredData = computed(() => {
  return sponsors.value.map((sponsor) => ({
    ... sponsor,
    giftCount: sponsor.gifts.length,
  }));
})

const filteredSponsors = computed(() => {
  if (showNonSponsorsOnly.value) {
    return filteredData.value.filter(
        (sponsor) => sponsor.giftCount < sponsor.numberOfChildrenSponsored
    );
  }

  return filteredData.value;
});

const statusFilters = computed(() => {
  const filters = [];

  if (pendingFilter.value) filters.push("Pending");
  if (receivedFilter.value) filters.push("Received");
  if (partialFilter.value) filters.push("Partial");

  return filteredSponsors.value.filter((sponsor) => {
      return filters.some((filter) => sponsor.giftStatus.includes(filter))
  });
});

onMounted(() => {
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


  fetchSponsors()
  console.log("sponsors:" + sponsors.value)
});

function getBorderColor(row){
  if (row.logEntries.some((log) => log.callDescription === 'None')) {
    return row.giftStatus === "Pending" ? "yellow-border" :
        row.giftStatus === "Received" ? "green-border" : "";
  }

  if (row.giftCount > 0) {
    return row.giftStatus === "Pending" ? "yellow-border" :
        row.giftStatus === "Received" ? "green-border" : "";
  }else{
    if(row.logEntries.length > 0){
      return "red-border"
    }
  }

}

async function updateStatus(sponsorID, status){
  const sponsor = sponsors.value.find((sponsor) => sponsor.id === sponsorID);
  sponsor.giftStatus = status;

  try{
    const response = await sponsorService.updateGiftStatus(sponsorID, status);
    console.log(response.data);
  }catch(err){
    console.error(err);
  }
}

async function printSponsorReport() {
  try {
    loading.value = true

    const sponsorDTO = statusFilters.value.map(({ giftCount, ...data }) => data);
    console.log(sponsorDTO);

    const response = await tagService.printSponsorReport(sponsorDTO);
    const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));
    const link = document.createElement('a');
    link.href = url;
    const date = utils.getCurrentDateTime();
    const fileName = "sponsors_" + date + ".pdf";
    link.setAttribute('download', fileName); // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up after download
  } catch (err) {
    console.error(err);
  }finally {
    loading.value = false;
  }
}
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

.red-border {
  border-left: 3px solid lightcoral !important;
  border-right: 3px solid lightcoral !important;
}

.yellow-border {
  border-left: 3px solid lightsalmon !important;
  border-right: 3px solid lightsalmon !important;
}

.green-border {
  border-left: 3px solid lightgreen !important;
  border-right: 3px solid lightgreen !important;
}
</style>

<template>
  <!-- Hero -->
  <BasePageHeading
      title="Sponsors"
      subtitle="Call and Sponsor Children."
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">

          <li class="breadcrumb-item">
            <div class="row g-2">
              <div class="col-auto">
                <button class="btn btn-primary" @click="printSponsorReport"><i class="fa fa-fw me-1 fa-print"></i>Print Report</button>
              </div>
<!--              <div class="col-auto">-->
<!--                <button class="btn btn-primary" @click="printExcel"><i class="fa fa-fw me-1 fa-file-excel"></i>Export Excel</button>-->
<!--              </div>-->
            </div>
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <!-- END Hero -->
  <!-- Page Content -->
  <div v-if="loading" class="spinner-container">
    <div class="spinner"></div>
  </div>
  <div class="content"  v-if="!loading">
    <Dataset
        v-slot="{ ds }"
        :ds-data="statusFilters"
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
      <div class="row items-push justify-content-center">
        <div class="col-auto">
          <div class="form-check form-block">
          <input
              type="checkbox"
              id="filterSponsors"
              name="filterSponsors"
              v-model="showNonSponsorsOnly"
              class="form-check-input"
          />
          <label for="filterSponsors" class="form-check-label" style="background-color: white">
            Show only sponsors who haven't sponsored all their designated children
          </label>
          </div>
        </div>
        <div class="col-auto">
          <div class="form-check form-block">
            <input
                checked
                class="form-check-input"
                type="checkbox"
                id="val-received"
                v-model="receivedFilter"
                name="val-received"
            />
            <label class="form-check-label" for="val-received" style="width: 100px; background-color: white">Received</label>
          </div>
        </div>
        <div class="col-auto">
          <div class="form-check form-block">
            <input
                checked
                class="form-check-input"
                type="checkbox"
                id="val-pending"
                v-model="pendingFilter"
                name="val-pending"
            />
            <label class="form-check-label" for="val-pending" style="width: 100px; background-color: white">Pending</label>
          </div>
        </div>
        <div class="col-auto">
          <div class="form-check form-block">
            <input
                class="form-check-input"
                type="checkbox"
                id="val-partial"
                v-model="partialFilter"
                name="val-partial"
            />
            <label class="form-check-label" for="val-partial" style="width: 100px; background-color: white">Partial</label>
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
                <th>Gift Status</th>
              </tr>
              </thead>
              <DatasetItem tag="tbody" class="fs-sm">
                <template #default="{ row }">
                  <tr v-if="row" :class="getBorderColor(row)">
                    <td style="min-width: 150px"><router-link :to="{ name: 'backend-sponsors-detail', params: { id: row.id } }">
                      {{ row.firstName }} {{row.lastName}}
                    </router-link></td>
                    <td>{{ row.phone }}</td>
                    <td>{{ row.email }}</td>
                    <td>{{ row.bestTimeToCall }}</td>
                    <td>{{row.giftCount}}</td>
                    <td>{{row.numberOfChildrenSponsored}}</td>
                    <td>{{row.childAgePreference}}</td>
                    <td>{{row.genderPreference}}</td>
                    <td class="text-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-alt-secondary" @click="openCallLog(row.id)">
                          <i class="fa fa-fw fa-phone-alt"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-alt-secondary" @click="openSearchGiftModal(row.id)">
                          <i class="fa fa-fw fa-gift"></i>
                        </button>
                      </div>
                    </td>
                    <td v-if="row.giftCount === 0"></td>
                    <td v-else>
                      <select id="giftStatus" class="form-select form-select-sm" :disabled="row.giftCount === 0" v-model="row.giftStatus" @change="updateStatus(row.id, row.giftStatus)">
                        <option value="Pending">Pending</option>
                        <option value="Received">Received</option>
                        <option value="Partial">Partial</option>
                      </select>
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
  <div class="modal fade" id="callLogModal" tabindex="-1" aria-labelledby="callLogModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="myModalLabel">Call Log</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row items-push">
            <div class="col-12">
              <table class="table table-striped table-vcenter">
                <thead>
                  <th>Call Date</th>
                  <th>Call Description</th>
                  <th></th>
                </thead>
                <tbody>
                  <tr v-for="row in currentSponsor?.logEntries">
                    <td>{{row.callDate}}</td>
                    <td>{{row.callDescription}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="row items-push>">
            <div class="row g-4">
              <div class="col-12">
                <label for="callDescription" class="form-label mb-0">Description</label>
                <select id="callDescription" class="form-select form-select-sm" v-model="logEntry.callDescription">
                  <option selected>None</option>
                  <option value="Left Message">Left Message</option>
                  <option value="No Answer">No Answer</option>
                  <option value="Call back later">Call back later</option>
                  <option value="Called">Called</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger" @click="saveEntry">Save</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade modal-xl" id="addGift" tabindex="-1" aria-labelledby="addGift" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="myModalLabel">Search Gifts</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <GiftSearchComponent @closeModal="closeModal" @addGift="addGift" :show-modal="showModal" ref="childRef"/>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">Close</button>
          <button type="button" class="btn btn-primary btn-warning" @click="saveGift">{{ saveGiftText }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
