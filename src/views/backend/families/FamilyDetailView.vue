<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import familyService from "@/services/familyService.js";
import router from "@/router/index.js";

const route = useRoute();
const familyID = Number(route.params.id);
let family = ref({firstName: null, lastName: null, primaryPhone: null, secondaryPhone: null, mhid: null, btid: null, children: [], notes: [], id:null})
const childModal = ref(null);
const removeChildModal = ref(null);
const removeGiftModal = ref(null);
const removeNoteModal = ref(null);
const addNoteModal = ref(null);
let note = ref({note: null, noteDate: null, id: null});

const giftModal = ref(null);
const removeFamilyModal = ref(null);

let currentChildID = ref(-1)
let child = ref({age: null, gender: null, gifts:[]});
let age = ref(null);
let gender = ref(null);
let gift = ref({id: null, child_id: null, description: null, size: null, status: null, sponsor_id: null})
let currentGiftIndex = ref(null);

function showRemoveFamilyModal(){
  removeFamilyModal.value = new bootstrap.Modal(document.getElementById('deleteFamily'));
  removeFamilyModal.value.show();
}

function showRemoveNoteModal(id){
  note.value.id = id;
  removeNoteModal.value = new bootstrap.Modal(document.getElementById('removeNote'));
  removeNoteModal.value.show();
}

function openNoteModal(){
  addNoteModal.value = new bootstrap.Modal(document.getElementById('addNote'));
  addNoteModal.value.show();
}


async function removeNote(){
  try{
    const response = await familyService.deleteNote(family.value.id, note.value.id);
  }catch(err){
    console.warn(err);
  }finally {
    await fetchFamily(family.value.id);
    removeNoteModal.value.hide();
  }
}

async function addNote(){
  try{
    const now = new Date();
    note.value.noteDate = now.toLocaleDateString();

    console.log(note.value);
    const response = await familyService.addNote(family.value.id, note.value);
  }catch (err){
    console.warn(err)
  }finally {
    await fetchFamily(family.value.id);
    addNoteModal.value.hide();
  }
}

async function removeFamily(){
  try{
    await familyService.deleteFamily(family.value.id);
  }catch (err){
    console.warn(err);
  }finally {
    await router.push({name: "backend-families"});
  }
}
async function updateChild(index){
  let child = family.value.children[index];
  await familyService.updateChild(child.id, family.value.id, child);
}

async function saveFamily(){
  if (family.value.id == null){
    try{
      const response = await familyService.createFamily(family.value);
      family.value = response.data;
    }catch (err){
      console.warn(err);
    }finally {
      await fetchFamily(family.value.id);
    }
  }else {
    try {
      console.log(family.value)
      await familyService.updateFamily(family.value.id, family.value);
      await router.push({name: "backend-families"});
    } catch (err) {
      console.warn(err);
    }
  }
}

function openGiftModal(id){
  giftModal.value = new bootstrap.Modal(document.getElementById('addGift'));
  giftModal.value.show();
  currentChildID.value = id;


  let child_id = family.value.children[currentChildID.value].id;
  gift.value = {description: null, size: null, status: null}
}

function openEditGift(giftIndex, childIndex){
  gift.value = family.value.children[childIndex].gifts[giftIndex]
  giftModal.value = new bootstrap.Modal(document.getElementById('addGift'));
  giftModal.value.show();
  currentGiftIndex.value = giftIndex;
  currentChildID.value = childIndex;
}

async function saveGift(){
  console.log("gift index: " + currentGiftIndex.value);

  if(currentGiftIndex.value == null){
    try{
      const child_id = family.value.children[currentChildID.value].id;
      await familyService.addGift(family.value.id, child_id, gift.value);
    }catch (err){
      console.warn(err);
    }finally {
      await fetchFamily(family.value.id);
    }
  }else{
    try{
      console.log(gift.value);
      await familyService.updateGift(gift.value.id, gift.value);
      family.value.children[currentChildID.value].gifts[currentGiftIndex] = gift.value;
    }catch (err){
      await fetchFamily(family.value.id);
    }

  }

  currentGiftIndex.value = null;
  giftModal.value.hide();
}
function showRemoveGiftModel(giftIndex, childIndex){
  currentChildID.value = childIndex;
  currentGiftIndex.value = giftIndex;
  gift.value = family.value.children[childIndex].gifts[giftIndex];
  removeGiftModal.value = new bootstrap.Modal(document.getElementById('deleteGift'));
  removeGiftModal.value.show();
}
async function removeGift(){
  try{
    const gift = family.value.children[currentChildID.value].gifts[currentGiftIndex.value]
    await familyService.deleteGift(gift.id)
  }catch (err){
    console.warn(err);
  }finally {
    await fetchFamily(family.value.id);
  }

  removeGiftModal.value.hide();
  currentGiftIndex.value = null;
}
function openChildModal(){
  childModal.value = new bootstrap.Modal(document.getElementById('addChild'));
  childModal.value.show();
}
async function addChild(){
  const newChild = {
    age: age.value,
    gender: gender.value,
    gifts:[],
  };

  await familyService.addChild(family.value.id, newChild)
  age.value = null;
  gender.value = null;

  childModal.value.hide();
  await fetchFamily(family.value.id);
}

async function removeChild(){
  try{
    child = family.value.children[currentChildID.value];
    await familyService.deleteChild(child.id, family.value.id);
  }catch (err){
    console.warn(err);
  }finally {
    await fetchFamily(family.value.id);
  }

  removeChildModal.value.hide();
}

function openDeleteChildModal(id){
  removeChildModal.value = new bootstrap.Modal(document.getElementById('deleteChild'));
  removeChildModal.value.show();
  currentChildID.value = id;
  child.value = family.value.children[id];
}

async function fetchFamily(id){
  try{
    const response = await familyService.getFamily(id);
    family.value = response.data
  }catch(err){
    console.warn(err);
  }

}
onMounted(() => {
  if(familyID !== 0){
    fetchFamily(familyID);
  }
});

</script>

<style scoped>
html.theme-flat .child-border {
  border: 1px solid transparent !important; /* Default transparent border */
}

html.theme-flat .child-border.gender-m {
  border-color: lightblue !important; /* Male */
}

html.theme-flat .child-border.gender-f {
  border-color: #FCE7F0 !important; /* Female */
}

html.theme-flat .child-border.gender-other {
  border-color: lightgray !important; /* Other */
}

html.theme-flat .child-header.gender-f {
  background-color: #FCE7F0 !important;
}

html.theme-flat .child-header.gender-m {
  background-color: lightblue !important;
}

html.theme-flat .child-header.gender-other {
  background-color: lightgray !important;
}
</style>

<template>
  <BasePageHeading title="Families" subtitle="Edit the Family information here.">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <span class="fa fa-baby fa-2x"></span>
          </li>
        </ol>
      </nav>
    </template>
  </BasePageHeading>

  <div class="content">
    <!-- Family Form -->
    <BaseBlock>
      <div class="row pb-4">
        <div class="col-lg-12">
          <form @submit.prevent>
            <div class="row g-4">
              <div class="col-5">
                <label class="form-label" for="val-firstName">First Name <span class="text-danger">*</span></label>
                <input
                    type="text"
                    id="val-firstName"
                    class="form-control"
                    placeholder="Enter a first name"
                    v-model="family.firstName"
                />
              </div>
              <div class="col-6">
                <label class="form-label" for="val-lastName">Last Name <span class="text-danger">*</span></label>
                <input
                    type="text"
                    id="val-lastName"
                    class="form-control"
                    placeholder="Enter a last name"
                    v-model="family.lastName"
                />
              </div>
              <div class="col-3">
                <label class="form-label" for="val-primaryPhone">Primary Phone Number <span class="text-danger">*</span></label>
                <input
                    type="text"
                    id="val-primaryPhone"
                    class="form-control"
                    placeholder="Enter a phone number"
                    v-model="family.primaryPhone"
                />
              </div>
              <div class="col-3">
                <label class="form-label" for="val-secondaryPhone">Secondary Phone Number</label>
                <input
                    type="text"
                    id="val-secondaryPhone"
                    class="form-control"
                    placeholder="Enter a secondary phone number"
                    v-model="family.secondaryPhone"
                />
              </div>
              <div class="col-3">
                <label class="form-label" for="val-MHID">MHID</label>
                <input
                    type="text"
                    id="val-MHID"
                    class="form-control"
                    placeholder="Enter MHID"
                    v-model="family.mhid"
                />
              </div>
              <div class="col-3">
                <label class="form-label" for="val-btid">Blessing Tree ID (BTID) <span class="text-danger">*</span></label>
                <input
                    type="text"
                    id="val-btid"
                    class="form-control"
                    placeholder="Enter Blessing Tree ID"
                    v-model="family.btid"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="row" v-if="family.children.length > 0">
        <div class="pb-2 d-flex justify-content-end">
          <div class="me-2"><button type="button" class="btn btn-primary " @click="openChildModal">Add Child</button></div>
        </div>
      </div>
    </BaseBlock>

    <!-- Children Display -->
    <BaseBlock>
      <div class="row" v-if="family.children.length < 1">
        <div class="d-flex justify-content-center pb-3">
          <div class="me-2"><button type="button" :class="['btn', 'btn-primary', family.id == null ? 'disabled': '']" @click="openChildModal">Add Child</button></div>
        </div>
      </div>
      <div class="container mt-4n">
        <div
            v-for="(child, childIndex) in family.children"
            :key="childIndex"
            :class="['mb-4', 'rounded', 'p-4', 'child-border', 'shadow', 'shadow-sm',
           child.gender === 'M' ? 'gender-m' :
           child.gender === 'F' ? 'gender-f' :
           'gender-other']"
        >

          <!-- Child Info -->
          <div class="row align-items-center mb-3 border rounded pb-2 shadow shadow-sm">
            <h5 :class="['text-bg-light', 'rounded', 'p-2', 'child-border', 'child-header', 'shadow', 'shadow-sm',
           child.gender === 'M' ? 'gender-m' :
           child.gender === 'F' ? 'gender-f' :
           'gender-other']">
              Child {{ childIndex + 1 }}
            </h5>
            <div class="col-12 d-flex align-items-center">
              <div class="me-2">
                <label for="age" class="form-label mb-0">Age</label>
                <input @blur="updateChild(childIndex)" type="text" id="age" class="form-control form-control-sm" placeholder="Age" v-model="child.age">
              </div>
              <div class="me-2">
                <label for="gender" class="form-label mb-0">Gender</label>
                <select id="gender" class="form-select form-select-sm" v-model="child.gender" @blur="updateChild(childIndex)">
                  <option selected>Choose...</option>
                  <option value="M">M</option>
                  <option value="F">F</option>
                  <option value="O">O</option>
                </select>
              </div>
              <div class="col text-end">
                <button class="btn btn-danger" @click="openDeleteChildModal(childIndex)">Remove</button>
              </div>
            </div>
          </div>

          <!-- Gifts Table or Add Gift Button -->
          <div v-if="child.gifts.length > 0">
            <table class="table table-striped">
              <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Size</th>
                <th>Status</th>
                <th>Sponsor</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(gift, giftIndex) in child.gifts" :key="giftIndex">
                <td>{{ gift.id }}</td>
                <td>{{ gift.description }}</td>
                <td>{{ gift.size }}</td>
                <td>{{ gift.status }}</td>
                <td>{{ gift.sponsor ? gift.sponsor : 'Not Sponsored' }}</td>
                <td class="text-center">
                  <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-alt-secondary" @click="openEditGift(giftIndex, childIndex)">
                      <i class="fa fa-fw fa-pencil-alt"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-alt-secondary" @click="showRemoveGiftModel(giftIndex, childIndex)">
                      <i class="fa fa-fw fa-times"></i>
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="col text-end">
              <button class="btn btn-primary" @click="openGiftModal(childIndex)">Add Gift</button>
            </div>
          </div>
          <div v-else>
            <button class="btn btn-primary" @click="openGiftModal(childIndex)">Add Gift</button>
          </div>
        </div>
      </div>
    </BaseBlock>

    <div class="block rounded p-2">
      <div class="row" v-if="family.notes.length < 1">
        <div class="d-flex justify-content-end p-2">
          <div class="me-2"><button type="button" :class="['btn', 'btn-primary', family.id == null ? 'disabled': '']" @click="openNoteModal">Add Note</button></div>
        </div>
      </div>
      <div class="row" v-else>
        <div class="p-4">
          <table class="table table-striped">
            <thead>
              <th style="width: 15%">Date</th>
              <th style="width: 75%">Note</th>
              <th style="width: 10%">Action</th>
            </thead>
            <tbody>
              <tr v-for="note in family.notes">
                <td>{{note.noteDate}}</td>
                <td style="min-width: 150px">{{note.note}}</td>
                <td><button class="btn btn-alt-secondary btn-sm" @click="showRemoveNoteModal(note.id)"><i class="fa fa-fw fa-times"></i></button> </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col text-end">
          <button class="btn btn-primary" @click="openNoteModal">Add Note</button>
        </div>
      </div>
    </div>
    <!-- Save Button -->
    <div class="block rounded p-2">
      <div class="p-1 d-flex justify-content-end">
        <div class="me-2"><button :class="['btn', 'btn-secondary']" class="btn btn-danger" @click="router.push({name:'backend-families'})">Cancel</button></div>
        <div class="me-2" v-if="family.id != null"><button :class="['btn', 'btn-danger']" @click="showRemoveFamilyModal">Remove Family</button></div>
        <div class="me-2"><button type="button" class="btn btn-primary" @click="saveFamily">Save Family</button></div>
      </div>
    </div>
  </div>

  <!-- Start the modals -->
  <div class="modal fade" id="addChild" tabindex="-1" aria-labelledby="addChild" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="myModalLabel">Add Child</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="col-12 d-flex align-items-center">
            <div class="me-2">
              <label for="age" class="form-label mb-0">Age</label>
              <input type="text" id="age" class="form-control form-control-sm" placeholder="Age" v-model="age">
            </div>
            <div class="me-2">
              <label for="gender" class="form-label mb-0">Gender</label>
              <select id="gender" class="form-select form-select-sm" v-model="gender">
                <option selected>Choose...</option>
                <option value="M">M</option>
                <option value="F">F</option>
                <option value="O">O</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-warning" @click="addChild">Add Child</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="addGift" tabindex="-1" aria-labelledby="addGift" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="myModalLabel">Add Gift</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row items-push">
            <div class="mb-4">
              <label class="form-label" for="val-description">Gift Description <span class="text-danger">*</span></label>
              <input
                  type="text"
                  id="val-description"
                  class="form-control"
                  placeholder="Enter a description for the gift"
                  v-model="gift.description"
              />
            </div>
            <div class="mb-4">
              <label class="form-label" for="val-size">Size <span class="text-danger">*</span></label>
              <input
                  type="text"
                  id="val-size"
                  class="form-control"
                  placeholder="Size of the gift"
                  v-model="gift.size"
              />
            </div>
            <div class="mb-4">
              <label for="status" class="form-label mb-0">Status</label>
              <select id="status" class="form-select form-select-sm" v-model="gift.status">
                <option selected>Choose...</option>
                <option value="Pending">Pending</option>
                <option value="Received">Received</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-warning" @click="saveGift">Save Gift</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="deleteChild" tabindex="-1" aria-labelledby="deleteChild" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="myModalLabel">Are you sure you want to delete this child?</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row items-push">
            <div>Are you sure you want to delete <strong>Child {{currentChildID + 1}}</strong></div>
            <div>Age: {{child.age}}</div>
            <div>Gender: {{child.gender}}</div>
            <div>And all of their gifts: {{child.gifts.length}}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger" @click="removeChild">Delete</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="deleteGift" tabindex="-1" aria-labelledby="deleteGift" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="myModalLabel">Are you sure you want to delete this gift?</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row items-push">
            <div>Are you sure you want to delete <strong>{{gift.description}}</strong></div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-danger" @click="removeGift">Delete</button>
        </div>
      </div>
    </div>
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
            <div>Are you sure you want to delete the <strong>{{family.lastName}}</strong> family?</div>
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
  <div class="modal fade" id="removeNote" tabindex="-1" aria-labelledby="removeNote" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="myModalLabel">Are you sure you want to delete this note?</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row items-push">
            <div>Are you sure you want to delete this note?</div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger" @click="removeNote">Delete</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="addNote" tabindex="-1" aria-labelledby="addNote" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="myModalLabel">Add a new note</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row items-push">
              <div class="mb-4">
                <label class="form-label" for="val-description">Note<span class="text-danger">*</span></label>
               <textarea v-model="note.note" class="form-control" rows="4" placeholder="Enter your note"></textarea>
              </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger" @click="addNote">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
