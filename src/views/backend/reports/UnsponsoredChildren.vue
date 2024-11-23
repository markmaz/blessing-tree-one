<script setup>
import familyService from "@/services/familyService.js";
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

let children = ref([]);
let loading = ref(true);

const cols = reactive([
  {
    name: "ID",
    field: "parentBtid",
    sort: ""
  },
  {
    name: "Family Name",
    field: "parentLastName",
    sort: "",
  },
  {
    name: "Child Name",
    field: "sequentialChildName",
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
    name: "Phone #",
    field: "child.parent.primaryPhoneNumber",
    sort: ""
  }
]);

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
async function fetchChildren(){
  try{
    const response = await familyService.getUnsponsoredChildren();
    children.value = response.data;
    console.log(children.value);
  }catch (err){
    console.error(err);
  }finally {
    loading.value=false;
  }
}

onMounted(() =>{
  if(!loading.value){
    document.querySelectorAll("#datasetLength label").forEach((el) => {
      el.remove();
    });

    let selectLength = document.querySelector("#datasetLength select");

    selectLength.classList = "";
    selectLength.classList.add("form-select");
    selectLength.style.width = "80px";
  }
  fetchChildren();
})

// const flattenedData = computed(() => {
//   return children.value.flatMap(parent =>
//       parent.children.flatMap((child, index) =>
//           child.gifts
//               .filter(gift => !gift?.sponsor?.id).map(gift => ({
//             parentId: parent.id,
//             parentBtid: parent.btid,
//             parentPrimaryPhone: parent.primaryPhone,
//             parentFirstName: parent.firstName,
//             parentLastName: parent.lastName,
//             childId: child.id,
//             childGender: child.gender,
//             childAge: child.age || 'N/A',
//             giftId: gift.id,
//             giftSize: gift.size,
//             giftDescription: gift.description,
//             giftStatus: gift.status,
//             sequentialChildName: `Child ${index + 1}`,
//           }))
//       )
//   );
// });

const flattenedData = computed(() => {
  return children.value.flatMap(parent =>
      parent.children
          .filter(child => child.gifts.length === 0) // Only include children without gifts
          .map((child, index) => ({
            parentId: parent.id,
            parentBtid: parent.btid,
            parentPrimaryPhone: parent.primaryPhone,
            parentFirstName: parent.firstName,
            parentLastName: parent.lastName,
            childId: child.id,
            childGender: child.gender,
            childAge: child.age || 'N/A',
            sequentialChildName: `Child ${index + 1}`,
          }))
  );
});
const showOneGiftOnly = ref(false);

const filteredChildren = computed(() => {
  if (showOneGiftOnly.value) {
    return flattenedData.filter(
        (element) => element.children.gifts.slice(0, 1)
    );
  }

  return flattenedData;
});
</script>

<style scoped>
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
        :ds-data="flattenedData"
        :ds-sortby="sortBy"
        :ds-search-in="['parentBtid', 'parentLastName', 'parentFirstName', 'parentPrimaryPhone']"
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
              </tr>
              </thead>
              <DatasetItem tag="tbody" class="fs-sm">
                <template #default="{ row }">
                  <tr v-if="row">
                    <th scope="row">{{ row.parentBtid}}</th>
                    <td>
                      <router-link :to="{ name: 'backend-families-details', params: { id: row.parentId} }">
                        {{ row.parentFirstName }} {{ row.parentLastName }}
                      </router-link>
                    </td>
                    <td>{{row.sequentialChildName}}</td>
                    <td>{{ row.childAge }}</td>
                    <td>{{ row.childGender }}</td>
                    <td>{{ row.parentPrimaryPhone }}</td>
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