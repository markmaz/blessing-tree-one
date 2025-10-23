<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import router from "@/router/index.js";
import sponsorService from "@/services/sponsorService.js";

import {
  Dataset,
  DatasetItem,
  DatasetInfo,
  DatasetPager,
  DatasetSearch,
  DatasetShow,
} from "vue-dataset";

let sponsors = ref([]);
let sponsorID = ref(0);
let loading = ref(true);

const deleteSponsorModal = ref(null);
const sponsorName = ref(null);

const cols = reactive([
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
  }
]);

function openRemoveSponsorModal(id, firstName, lastName){
  sponsorID.value = id;
  sponsorName.value = firstName + " " + lastName;
  deleteSponsorModal.value = new bootstrap.Modal(document.getElementById('removeSponsorModal'));
  deleteSponsorModal.value.show();
}

async function removeSponsor(){
  try{
    const response = sponsorService.deleteSponsor(sponsorID.value);
  }catch (err){
    console.warn(err);
  }finally {
    await fetchSponsors();
    deleteSponsorModal.value.hide();
  }
}

function toArchiveValue(v) {
  return (v === 1 || v === true) ? 1 : 0;   // null/0/false => 0 (Active)
}
async function onArchiveChange(e, row) {
  //row.active = Number(e.target.value) === 1 ? 1 : 0;

  try{
    await sponsorService.updateSponsor(row.id, row);
  }catch (err){
    console.warn(err);
  }finally {
    await fetchSponsors();
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

function getBorderColor(isActive){
  if (isActive){
    return "green-border";
  }else{
    return "red-border";
  }
}

function openDetails(id){
  sponsorID.value = id;
  console.log("Sponsor:" + sponsorID.value)
  router.push({name:'backend-sponsors-detail', params:{id: id}});
}
async function fetchSponsors() {
  try {
    loading.value =true;
    const response = await sponsorService.getAllSponsors();
    sponsors.value = response.data; // Adjust this based on your API response structure
    console.log(sponsors.value)
  } catch (err) {
    console.warn(err.message);
  }finally {
    loading.value=false;
  }
}

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
      title="Sponsors"
      subtitle="Manage Sponsor information."
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">

          <li class="breadcrumb-item">
            <a class="link-fx " href="javascript:void(0)" @click="openDetails(0)">
              <span class="fa fa-medal fa-2x"></span>
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
        :ds-data="sponsors"
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
      <div class="row">
        <div class="col-md-12">
          <div class="table-responsive">
            <table class="table table-striped mb-0">
              <thead>
              <tr>
                <th scope="col">ID</th>
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
                    <td style="min-width: 150px">{{ row.firstName }}</td>
                    <td style="min-width: 150px">{{ row.lastName }}</td>
                    <td>{{ row.phone }}</td>
                    <td>{{ row.email }}</td>
                    <td>{{ row.bestTimeToCall }}</td>
                    <td class="text-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-alt-secondary" @click="openDetails(row.id)">
                          <i class="fa fa-fw fa-pencil-alt"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-alt-secondary" @click="openRemoveSponsorModal(row.id, row.firstName, row.lastName)">
                          <i class="fa fa-fw fa-times"></i>
                        </button>
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
  <div class="modal fade" id="removeSponsorModal" tabindex="-1" aria-labelledby="removeSponsorModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="myModalLabel">Are you sure you want to delete this Sponsor?</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row items-push">
            <div>Are you sure you want to delete this Sponsor: <strong>{{sponsorName}}</strong>?</div>
            <div>
              <br>
              <p class="text-danger">
                If you delete the Sponsor, the gifts they have sponsored will become un-sponsored.
                Once deleted, the data can not be retrieved and you may lose hours of work and all the information tied
                to this Sponsor. If you're not sure about deleting this Sponsor, please ask.
              </p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger" @click="removeSponsor">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>
