<script setup>
import userService from "@/services/userService";
import {
  Dataset,
  DatasetItem,
  DatasetInfo,
  DatasetPager,
  DatasetSearch,
  DatasetShow,
} from "vue-dataset";
import { ref, reactive, computed, onMounted } from "vue";
import userDetailView from '@/views/backend/users/UserDetailView.vue';
import newUserView from "@/views/backend/users/NewUserView.vue";

const userDetailRef = ref(null);
const newUserViewRef = ref(null);

const myModal = ref(null);
const saveModal = ref(null);
const deleteModal = ref(null);

let users = ref([]);
let userID = ref(0);

const cols = reactive([
  {
    name: "Username",
    field: "username",
    sort: "",
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
    name: "Email",
    field: "emailAddress",
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
    users.value.sort((a, b) => {
      if (toset === "asc") {
        return a[sortEl.field] > b[sortEl.field] ? 1 : -1;
      } else {
        return a[sortEl.field] < b[sortEl.field] ? 1 : -1;
      }
    });
  }
}

function openModal(id){
  userID.value = id;
  console.log(userID.value)
  myModal.value = new bootstrap.Modal(document.getElementById('myModal'));
  myModal.value.show();
}

function openSaveModal(){
  saveModal.value = new bootstrap.Modal(document.getElementById('newUser'));
  saveModal.value.show();
}

function openDelete(id){
  userID.value = id;
  console.log(userID.value)
  deleteModal.value = new bootstrap.Modal(document.getElementById('deleteUser'));
  deleteModal.value.show();
}

function closeModal(){
  if(myModal.value){
    myModal.value.hide();
    fetchUsers();
  }
}

function closeSaveModal(){
  if(saveModal.value){
    saveModal.value.hide();
    fetchUsers();
  }
}

function closeDeleteModal(){
  if(deleteModal.value){
    deleteModal.value.hide();
    fetchUsers();
  }
}

async function fetchUsers() {
  try {
    const response = await userService.getUsers();
    users.value = response.data; // Adjust this based on your API response structure
    console.log(users)
  } catch (err) {
    console.warn(err.message);
  }
}

function saveChanges(){
  if(userDetailRef.value){
    userDetailRef.value.saveUser();
  }
}

function saveUser(){
  if(newUserViewRef.value){
    newUserViewRef.value.createUser();
  }
}
async function deleteUser() {
  try{
    const response = await userService.deleteUser(this.userID);
  }catch(err){
    console.warn(err);
  }finally {
    closeDeleteModal();
  }
}

onMounted(() => {
  // Remove labels from
  document.querySelectorAll("#datasetLength label").forEach((el) => {
    el.remove();
  });

  // Replace select classes
  let selectLength = document.querySelector("#datasetLength select");

  selectLength.classList = "";
  selectLength.classList.add("form-select");
  selectLength.style.width = "80px";

  fetchUsers()
  console.log("users:" + users.value)
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
</style>

<template>
  <!-- Hero -->
  <BasePageHeading
    title="Users"
    subtitle="Manage the application users here."
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">

          <li class="breadcrumb-item">
            <a class="link-fx " href="javascript:void(0)" @click="openSaveModal">
              <span class="fa fa-user-cog fa-2x"></span>
            </a>
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>
  <!-- END Hero -->
  <!-- Page Content -->
  <div class="content">
    <Dataset
        v-slot="{ ds }"
        :ds-data="users"
        :ds-sortby="sortBy"
        :ds-search-in="['firstName', 'emailAddress', 'lastName', 'username']"
    >
      <div class="row" :data-page-count="ds.dsPagecount">
        <div id="datasetLength" class="col-md-8 py-2">
          <DatasetShow />
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
                  <tr>
                    <th scope="row">{{ row.userID }}</th>
                    <td style="min-width: 150px">{{ row.username }}</td>
                    <td style="min-width: 150px">{{ row.firstName }}</td>
                    <td>{{ row.lastName }}</td>
                    <td style="min-width: 150px">{{ row.emailAddress }}</td>
                    <td class="text-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-alt-secondary" @click="openModal(row.userID)">
                          <i class="fa fa-fw fa-pencil-alt"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-alt-secondary" @click="openDelete(row.userID)">
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
  <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="myModalLabel">Edit User</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <userDetailView ref="userDetailRef" :key="userID" :userID="userID" @closeModal="closeModal" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="saveChanges">Save changes</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="newUser" tabindex="-1" aria-labelledby="newUser" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="myModalLabel">New User</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <newUserView ref="newUserViewRef" @closeModal="closeSaveModal"/>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="saveUser">Save changes</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="deleteUser" tabindex="-1" aria-labelledby="deleteUser" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="myModalLabel">Are you sure you want to delete this user?</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div>Delete User?</div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-warning" @click="deleteUser()">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>
