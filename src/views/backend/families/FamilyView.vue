<script setup>
import familyService from "@/services/familyService";
import router from "@/router/index.js";

import {
  Dataset,
  DatasetItem,
  DatasetInfo,
  DatasetPager,
  DatasetSearch,
  DatasetShow,
} from "vue-dataset";
import { ref, reactive, computed, onMounted } from "vue";
import tagService from "@/services/reportService.js";
import utils from "@/utility/utils.js";
import sponsorService from "@/services/sponsorService.js";

let families = ref([]);
let familyID = ref(0);
let lastName = ref(null);
const removeFamilyModal = ref(null);
let loading = ref(true);

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

const cols = reactive([
  {
    name: "ID",
    field: "btid",
    sort: ""
  },
  {
    name: "First Name",
    field: "firstName",
    sort: "",
  },
  {
    name: "Last Name",
    field: "lastName",
    sort: "",
  },
  {
    name: "Primary Phone",
    field: "primaryPhone",
    sort: "",
  },
  {
    name: "Secondary Phone",
    field: "secondaryPhone",
    sort: "",
  },
  {
    name: "MHID",
    field: "mhid",
    sort: "",
  },
  {
    name: "# Children",
    field: "children.length",
    sort: ""
  }
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
    families.value.sort((a, b) => {
      if (toset === "asc") {
        return a[sortEl.field] > b[sortEl.field] ? 1 : -1;
      } else {
        return a[sortEl.field] < b[sortEl.field] ? 1 : -1;
      }
    });
  }
}

function openDetails(id){
  familyID.value = id;
  console.log(familyID.value)
  router.push({name:'backend-families-details', params:{id: id}});
}

function getBorderColor(isActive){
  if (isActive){
    return "green-border";
  }else{
    return "red-border";
  }
}

async function fetchParents() {
  try {
    loading.value = true;
    const response = await familyService.getAllFamilies();
    families.value = response.data; // Adjust this based on your API response structure
    console.log(families)
  } catch (err) {
    console.warn(err.message);
  }finally {
    loading.value = false;
  }
}
function showRemoveFamilyModal(id, familyName){
  familyID.value = id;
  lastName.value = familyName;

  removeFamilyModal.value = new bootstrap.Modal(document.getElementById('deleteFamily'));
  removeFamilyModal.value.show();
}

async function removeFamily(){
  try{
    await familyService.deleteFamily(familyID.value);
    removeFamilyModal.value.hide();
  }catch (err){
    console.warn(err);
  }finally {
    await fetchParents();
  }
}

async function onArchiveChange(e, row) {
  try{
    await familyService.updateFamily(row.id, row);
  }catch (err){
    console.warn(err);
  }finally {
    //await fetchParents();
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


  fetchParents()
  console.log("parents:" + families.value)
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

.red-border {
  border-left: 3px solid lightcoral !important;
  border-right: 3px solid lightcoral !important;
}

.green-border {
  border-left: 3px solid lightgreen !important;
  border-right: 3px solid lightgreen !important;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>

<template>
  <!-- Hero -->
  <BasePageHeading
      title="Families"
      subtitle="Manage Families here - add children and gift requests."
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">

          <li class="breadcrumb-item">
            <a class="link-fx " href="javascript:void(0)" @click="openDetails(0)">
              <span class="fa fa-baby fa-2x"></span>
            </a>
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
        :ds-data="families"
        :ds-sortby="sortBy"
        :ds-search-in="['firstName', 'primaryPhone', 'lastName', 'btid', 'mhid']"
    >
      <div class="row" :data-page-count="ds.dsPagecount">
        <div id="datasetLength" class="col-md-8 py-2">
          <DatasetShow style="width: 80px"/>
        </div>
        <div class="col-md-4 py-2">
          <DatasetSearch ds-search-placeholder="Search..." />
        </div>
      </div>
      <div class="row">
        <div class="p-1 d-flex justify-content-end">
          <div class="me-2"><button type="button" class="btn btn-primary" @click="printAllGiftTags">Print Gift Tags</button></div>
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-md-12">
          <div class="table-responsive">
            <table class="table table-striped mb-0">
              <thead>
              <tr>
                <th>Status</th>
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
                  <tr v-if="row" :class="getBorderColor(row.active)">
                    <td style="min-width: 150px">
                      <select id="is_archive" class="form-select form-select-sm"  v-model="row.active"
                              @change="onArchiveChange($event, row)">
                        <option :value="false">Inactive</option>
                        <option :value="true">Active</option>
                      </select>
                    </td>
                    <td>{{ row.btid }}</td>
                    <td style="min-width: 150px">{{ row.firstName }}</td>
                    <td style="min-width: 150px">{{ row.lastName }}</td>
                    <td>{{ row.primaryPhone }}</td>
                    <td>{{ row.secondaryPhone }}</td>
                    <td>{{ row.mhid }}</td>
                    <td>{{ row.children ? row.children.length : 0 }}</td>
                    <td class="text-center" v-if="row.active">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-alt-secondary" @click="openDetails(row.id)">
                          <i class="fa fa-fw fa-pencil-alt"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-alt-secondary" @click="showRemoveFamilyModal(row.id, row.lastName)">
                          <i class="fa fa-fw fa-times"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-alt-secondary" @click="printGiftTags(row.id, row.lastName)">
                          <i class="fa fa-fw fa-print"></i>
                        </button>
                      </div>
                    </td>
                    <td class="text-center" v-else></td>
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
  <div class="modal fade" id="deleteFamily" tabindex="-1" aria-labelledby="deleteFamily" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="myModalLabel">Are you sure you want to delete this family?</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row items-push">
            <div>Are you sure you want to delete the <strong>{{lastName}}</strong> family?</div>
            <div>
              <br>
              <p class="text-danger">
                If you delete the family, you will also delete all the children and gifts associated with this family.
                Once deleted, the data can not be retrieved and you may lose hours of work and all the information tied
                to this family. If you're not sure about deleting this family, please ask.
              </p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger" @click="removeFamily">Delete</button>
        </div>
      </div>
    </div>
  </div>

</template>
