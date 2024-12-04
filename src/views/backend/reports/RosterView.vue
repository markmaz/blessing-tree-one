<script setup>
import familyService from "@/services/familyService.js";
import utils from "@/utility/utils.js";
import {computed, onMounted, ref} from "vue";
import tagService from "@/services/tagService.js";
import SponsorSearchComponent from "@/components/SponsorSearchComponent.vue";
import giftService from "@/services/giftService.js";

let families = ref([{id: 0, btid: "", children:[{gifts:[{sponsor:{id:0, firstName:null, lastName:null}}]}]}]);
let loading = ref(false);
let sponsorSearchModal = ref(null);
let selectedGiftID = ref(null);
let selectedSponsorID = ref(null);
const childRef = ref(null);

async function openSponsorModal(id){
  selectedGiftID.value = id;
  childRef.value.fetchSponsor();
  sponsorSearchModal.value = new bootstrap.Modal(document.getElementById('sponsorModal'));
  sponsorSearchModal.value.show();
}

function addSponsor(sponsorID){
  selectedSponsorID.value = sponsorID;
}

function closeModal() {
  sponsorSearchModal.value.hide();
}

async function saveSponsor() {
  console.log(selectedGiftID.value, selectedSponsorID.value);
  try{
    await giftService.sponsorGift(selectedGiftID.value, selectedSponsorID.value);
  }catch (err){
    console.error(err);
  }finally {
    sponsorSearchModal.value.hide();
    await fetch();
  }
}
async function printAllGiftTags() {
  try {
    loading.value = true
    const response = await tagService.printGiftTagsForAllFamilies();
    const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));
    const link = document.createElement('a');
    link.href = url;
    const date = utils.getCurrentDateTime();
    const fileName = "all_giftTags_printed_on_" + date + ".pdf";
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

async function printExcel(){
  try{
  const roster = {units: [], parents: filteredFamilies.value};
  const response = await tagService.printRosterExcelReport(roster);
  const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));
  const link = document.createElement('a');
  link.href = url;
  const date = utils.getCurrentDateTime();
  const fileName = "roster_printed_on_" + date + ".xlsx";
  link.setAttribute('download', fileName); // Set the file name
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // Clean up after download

  }catch (err){
    console.error(err);
  }finally {
    loading.value =false;
  }
}
async function printReport(){
  loading.value = true;

  try {
    const filters = [];
    if (azFilter.value) filters.push("AZ");
    if (btFilter.value) filters.push("BT");
    if (fcFilter.value) filters.push("FC");
    if (hbFilter.value) filters.push("HB");
    if (oakFilter.value) filters.push("OAK");

    const roster = {units: filters, parents: filteredFamilies.value};
    const response = await tagService.printRosterReport(roster);
    const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));
    const link = document.createElement('a');
    link.href = url;
    const date = utils.getCurrentDateTime();
    const fileName = filters.join("_") + "_roster_printed_on_" + date + ".pdf";
    link.setAttribute('download', fileName); // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up after download

  }catch (err){
   console.error(err);
  }finally {
    loading.value =false;
  }
}
async function printGiftTags(id, name) {
  try {
    const response = await tagService.printGiftTagsForFamily(id);
    const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));
    const link = document.createElement('a');
    link.href = url;
    const date = utils.getCurrentDateTime();
    const fileName = name + "_giftTags_printed_on_" + date + ".pdf";
    link.setAttribute('download', fileName); // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up after download
  } catch (err) {
    console.error(err);
  }
}
async function fetch(){
  try{
    loading.value = true;
    const response = await familyService.getFamilies();
    families.value = response.data;
    console.log(families.value);
  }catch (err){
    console.error(err);
  }finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetch();
});

let azFilter = ref(true);
let btFilter = ref(true);
let fcFilter = ref(true);
let hbFilter = ref(true);
let oakFilter = ref(true);
let unsponsoredFilter = ref(false);

const filterGifts = computed(() => {
  if (unsponsoredFilter.value) {
    return families.value.filter((family) =>
        family.children.some((child) =>
            child.gifts.some((gift) => !gift.sponsor || gift.sponsor.id === null)
        )
    );
  } else {
    return families.value;
  }
});

const filteredFamilies = computed(() => {
    const filters = [];

    if (azFilter.value) filters.push("AZ");
    if (btFilter.value) filters.push("BT");
    if (fcFilter.value) filters.push("FC");
    if (hbFilter.value) filters.push("HB");
    if (oakFilter.value) {
      filters.push("OAK");
      filters.push("Oak")
    }

    if (filters.length === 0) {
      //return families.value;
      return [{children:[]}];
    }

    return filterGifts.value.filter((family) => {
      return filters.some((filter) => family.btid.includes(filter));
    });
});
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
  <BasePageHeading
      title="Roster"
      subtitle="The complete listing of all the data."
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">

          <li class="breadcrumb-item items-push">
            <div class="row g-2">
              <div class="col-auto">
                <button class="btn btn-primary" @click="printAllGiftTags"><i class="fa fa-fw me-1 fa-gift"></i>Print All Gift Tags</button>
              </div>
              <div class="col-auto">
                <button class="btn btn-primary" @click="printReport"><i class="fa fa-fw me-1 fa-print"></i>Print Report</button>
              </div>
              <div class="col-auto">
                <button class="btn btn-primary" @click="printExcel"><i class="fa fa-fw me-1 fa-file-excel"></i>Export Excel</button>
              </div>
            </div>
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div v-if="loading" class="spinner-container">
    <div class="spinner"></div>
  </div>
  <div class="content" v-if="!loading">
    <div class="row g-3 pb-3 justify-content-center">
      <div class="col-auto">
        <div class="form-check form-block">
        <input
            checked
            class="form-check-input"
            type="checkbox"
            id="val-az"
            v-model="azFilter"
            name="val-az"
        />
        <label class="form-check-label" for="val-az" style="width: 100px; background-color: white">AZ</label>
        </div>
      </div>
      <div class="col-auto">
        <div class="form-check form-block">
        <input
            checked
            class="form-check-input"
            type="checkbox"
            id="val-bt"
            v-model="btFilter"
        />
        <label class="form-check-label" for="val-bt" style="width: 100px; background-color: white">BT</label>
        </div>
      </div>
      <div class="col-auto">
        <div class="form-check form-block">
        <input
            checked
            class="form-check-input"
            type="checkbox"
            id="val-fc"
            v-model="fcFilter"
        />
        <label class="form-check-label" for="val-fc" style="width: 100px; background-color: white">FC</label>
        </div>
      </div>
      <div class="col-auto">
        <div class="form-check form-block">
        <input
            checked
            class="form-check-input"
            type="checkbox"
            id="val-hb"
            v-model="hbFilter"
        />
        <label class="form-check-label" for="val-hb" style="width: 100px; background-color: white">HB</label>
      </div>
      </div>
      <div class="col-auto">
        <div class="form-check form-block">
        <input
            checked
            class="form-check-input"
            type="checkbox"
            id="val-oak"
            v-model="oakFilter"
        />
        <label class="form-check-label" for="val-oak" style="width: 100px; background-color: white">OAK</label>
        </div>
      </div>
      <div class="col-auto">
        <div class="form-check form-block">
          <input
              checked
              class="form-check-input"
              type="checkbox"
              id="val-unsponsored"
              v-model="unsponsoredFilter"
          />
          <label class="form-check-label" for="val-unsponsored" style="background-color: white">Unsponsored Children</label>
        </div>
      </div>
    </div>
    <table class="table table-bordered">
      <thead>
        <th>ID</th>
        <th>Name</th>
        <th>Phone</th>
        <th>Phone</th>
        <th>MHID</th>
        <th>Children</th>
        <th>Gifts</th>
        <th>Sponsor</th>
        <th>Phone</th>
        <th>Action</th>
      </thead>
      <tbody style="font-size: 0.875rem;">
      <template v-for="(parent, parentIndex) in filteredFamilies" :key="parent.id">
        <tr>
          <td class="bg-info-subtle">{{ parent.btid }}</td>
          <td class="bg-info-subtle">
            <router-link :to="{ name: 'backend-families-details', params: { id: parent.id} }">
              {{ parent.firstName }} {{ parent.lastName }}
            </router-link>
          </td>
          <td class="bg-info-subtle">{{ parent.primaryPhone }}</td>
          <td class="bg-info-subtle">{{ parent.secondaryPhone }}</td>
          <td class="bg-info-subtle">{{ parent.mhid }}</td>
          <td class="bg-info-subtle">{{ parent.children.length}}</td>
          <td class="bg-info-subtle text-end" colspan="4">
            <div class="justify-content-end">
              <div class="btn-group">
                <button type="button" class="btn btn-sm btn-alt-secondary" @click="printGiftTags(parent.id, parent.lastName)">
                  <i class="fa fa-fw fa-print"></i>
                </button>
              </div>
            </div>
          </td>
        </tr>
        <template v-for="(child, childIndex) in parent.children" :key="child.id">
          <tr v-for="(gift, giftIndex) in child.gifts" :key="gift.id">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td :class="childIndex % 2 > 0 ? 'bg-light' : ''">{{child.name}}-{{child.age}}{{child.gender}}</td>
            <td :class="childIndex % 2 > 0 ? 'bg-light' : ''">{{gift.description}}</td>
            <td :class="childIndex % 2 > 0 ? 'bg-light' : ''">
                <router-link :to="{ name: 'backend-sponsors-detail', params: { id:  gift.sponsor.id} }" v-if="gift.sponsor">
                  {{gift?.sponsor?.firstName}} {{gift?.sponsor?.lastName}}
                </router-link>
                <button class="btn btn-primary" v-else @click="openSponsorModal(gift.id)">Find Sponsor</button>
            </td>
            <td :class="childIndex % 2 > 0 ? 'bg-light' : ''">{{gift?.sponsor?.phone}}</td>
            <td></td>
          </tr>
        </template>
        <tr style="background-color: #2A363B"><td colspan="11" style="background-color: #2A363B"></td> </tr>
      </template>
      </tbody>
    </table>
  </div>

  <!-- Sponsor Search Modal -->
  <div class="modal fade modal-xl" id="sponsorModal" tabindex="-1" aria-labelledby="sponsorModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="myModalLabel">Search Sponsors</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <SponsorSearchComponent @closeModal="closeModal" @addSponsor="addSponsor" ref="childRef"/>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">Close</button>
          <button type="button" class="btn btn-primary btn-warning" @click="saveSponsor">Save</button>
        </div>
      </div>
    </div>
  </div>
  <!-- End Sponsor Search Modal -->
</template>