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
import { ref, reactive, computed, onMounted } from "vue";
import giftService from "@/services/giftService.js";

let gifts = ref([]);
let giftID = ref(0);
let loading = ref(true);
let pagination = ref({
  page: 1,
  perPage: 10,
  totalPages: 1
})

const cols = reactive([
  {
    name: "ID",
    field: "child.parent.btid",
    sort: ""
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
    name: "Age",
    field: "child.age",
    sort: "",
  },
  {
    name: "Gender",
    field: "child.gender",
    sort: "",
  },
  {
    name: "Last Name",
    field: "child.parent.lastName",
    sort: "",
  },
  {
    name: "Phone #",
    field: "child.parent.primaryPhoneNumber",
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
    gifts.value.sort((a, b) => {
      if (toset === "asc") {
        return a[sortEl.field] > b[sortEl.field] ? 1 : -1;
      } else {
        return a[sortEl.field] < b[sortEl.field] ? 1 : -1;
      }
    });
  }
}

function openDetails(id){
  giftID.value = id;
  console.log(giftID.value)
  router.push({name:'backend-families-details', params:{id: id}});
}
async function fetchGifts() {
  try {
    loading.value = true;
    const { page, perPage } = pagination.value;

    const response = await giftService.getUnsponsoredGifts(page - 1, perPage);
    const { content, totalPages } = response.data;

    gifts.value = content;
    pagination.value.totalPages = totalPages;

  } catch (err) {
    console.warn(err.message);
  }finally {
    loading.value = false;
  }
}

async function handlePageChange(newPage){
  if (newPage >= 1 && newPage <= pagination.value.totalPages){
    pagination.value.page = newPage;
    await fetchGifts();
  }
}
// function showRemoveFamilyModal(id, familyName){
//   giftID.value = id;
//   lastName.value = familyName;
//
//   removeFamilyModal.value = new bootstrap.Modal(document.getElementById('deleteFamily'));
//   removeFamilyModal.value.show();
// }

/*async function removeFamily(){
  try{
    await familyService.deleteFamily(familyID.value);
    removeFamilyModal.value.hide();
  }catch (err){
    console.warn(err);
  }finally {
    await fetchGifts();
  }
}*/

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
  <!-- Hero -->
  <BasePageHeading
      title="Gifts"
      subtitle="Manage all gifts here."
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
  <div class="content"  v-if="!loading">
    <Dataset
        v-slot="{ ds }"
        :ds-data="gifts"
        :ds-sortby="sortBy"
        :ds-search-in="['description', 'primaryPhoneNumber', 'lastName', 'btid']"
    >
      <div class="row" :data-page-count="ds.dsPagecount">
        <div id="datasetLength" class="col-md-8 py-2">
          <DatasetShow style="width: 80px"/>
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
                    <th scope="row">{{ row.child.parent.btid }}</th>
                    <td style="min-width: 150px">{{ row.size }}</td>
                    <td style="min-width: 150px">{{ row.description }}</td>
                    <td>{{ row.child.age }}</td>
                    <td>{{ row.child.gender }}</td>
                    <td>{{ row.child.parent.lastName }}</td>
                    <td>{{ row.child.parent.primaryPhone }}</td>
                    <td class="text-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-alt-secondary" @click="openDetails(row.id)">
                          <i class="fa fa-fw fa-pencil-alt"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-alt-secondary" @click="">
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
</template>
