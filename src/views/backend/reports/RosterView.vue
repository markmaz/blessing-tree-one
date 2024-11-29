<script setup>
import familyService from "@/services/familyService.js";
import utils from "@/utility/utils.js";
import {computed, onMounted, ref} from "vue";
import tagService from "@/services/tagService.js";

let families = ref([{id: 0, btid: "", children:[{gifts:[{sponsor:{id:0, firstName:null, lastName:null}}]}]}]);
let loading = ref(false);

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

    return families.value.filter((family) => {
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

          <li class="breadcrumb-item">
            <a class="link-fx " href="javascript:void(0)" @click="">
              <span class="fa fa-gift fa-2x"></span>
            </a>
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <div v-if="loading" class="spinner-container">
    <div class="spinner"></div>
  </div>
  <div class="content" v-if="!loading">
    <div class="row items-push pb-3 justify-content-center">
      <div class="col-2 form-check form-switch">
        <input
            checked
            class="form-check-input"
            type="checkbox"
            id="val-az"
            v-model="azFilter"
        />
        <label class="form-check-label" for="val-az">AZ</label>
      </div>
      <div class="col-2 form-check form-switch">
        <input
            checked
            class="form-check-input"
            type="checkbox"
            id="val-bt"
            v-model="btFilter"
        />
        <label class="form-check-label" for="val-bt">BT</label>
      </div>
      <div class="col-2 form-check form-switch">
        <input
            checked
            class="form-check-input"
            type="checkbox"
            id="val-fc"
            v-model="fcFilter"
        />
        <label class="form-check-label" for="val-fc">FC</label>
      </div>
      <div class="col-2 form-check form-switch">
        <input
            checked
            class="form-check-input"
            type="checkbox"
            id="val-hb"
            v-model="hbFilter"
        />
        <label class="form-check-label" for="val-hb">HB</label>
      </div>
      <div class="col-2 form-check form-switch">
        <input
            checked
            class="form-check-input"
            type="checkbox"
            id="val-oak"
            v-model="oakFilter"
        />
        <label class="form-check-label" for="val-oak">OAK</label>
      </div>
      <div class="col-2">
        <button class="btn btn-primary" @click="printReport"><i class="fa fa-fw me-1 fa-print"></i>Print Report</button>
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
</template>