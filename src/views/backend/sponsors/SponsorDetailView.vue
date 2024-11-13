<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import sponsorService from "@/services/sponsorService.js";
import router from "@/router/index.js";

const route = useRoute();
const sponsorID = Number(route.params.id);
let sponsor = ref({firstName: null, lastName: null, phone: null, email: null,
  address: {address: null, city: null, state: "TX", zip: null}, bestTimeToCall: null, sponsorYear: [], id: null,
  hasSponsoredPreviously: null, howDidYouHearAboutUs: null, wantToVolunteer: null});
// const childModal = ref(null);
// const removeChildModal = ref(null);
// const removeGiftModal = ref(null);
// const giftModal = ref(null);
// const removeFamilyModal = ref(null);

// let currentChildID = ref(-1)
// let child = ref({age: null, gender: null, gifts:[]});
// let age = ref(null);
// let gender = ref(null);
// let gift = ref({id: null, child_id: null, description: null, size: null, status: null, sponsor_id: null})
// let currentGiftIndex = ref(null);

// function showRemoveFamilyModal(){
//   removeFamilyModal.value = new bootstrap.Modal(document.getElementById('deleteFamily'));
//   removeFamilyModal.value.show();
// }
//
// async function removeFamily(){
//   try{
//     await familyService.deleteFamily(family.value.id);
//   }catch (err){
//     console.warn(err);
//   }finally {
//     await router.push({name: "backend-families"});
//   }
// }
// async function updateChild(index){
//   let child = family.value.children[index];
//   await familyService.updateChild(child.id, family.value.id, child);
// }

async function saveSponsor(){
  if (sponsor.value.id == null){
    try{
      const response = await sponsorService.createSponsor(sponsor.value);
      sponsor.value = response.data;
    }catch (err){
      console.warn(err);
    }finally {
      await fetchSponsor(sponsor.value.id);
    }
  }else {
    try {
      console.log(family.value)
      await sponsorService.updateSponsor(sponsor.value.id, sponsor.value);
      await router.push({name: "backend-sponsors"});
    } catch (err) {
      console.warn(err);
    }
  }
}

// function openGiftModal(id){
//   giftModal.value = new bootstrap.Modal(document.getElementById('addGift'));
//   giftModal.value.show();
//   currentChildID.value = id;
//
//   console.log("Current child id:" + currentChildID.value)
//
//   let child_id = family.value.children[currentChildID.value].id;
//   gift.value = {description: null, size: null, status: null}
// }
//
// function openEditGift(giftIndex, childIndex){
//   gift.value = family.value.children[childIndex].gifts[giftIndex]
//   giftModal.value = new bootstrap.Modal(document.getElementById('addGift'));
//   giftModal.value.show();
//   currentGiftIndex.value = giftIndex;
//   currentChildID.value = childIndex;
// }

// async function saveGift(){
//   console.log("gift index: " + currentGiftIndex.value);
//
//   if(currentGiftIndex.value == null){
//     try{
//       const child_id = family.value.children[currentChildID.value].id;
//       await familyService.addGift(family.value.id, child_id, gift.value);
//       //family.value.children[currentChildID.value].gifts.push(gift.value);
//     }catch (err){
//       console.warn(err);
//     }finally {
//       await fetchFamily(family.value.id);
//     }
//   }else{
//     try{
//       console.log(gift.value);
//       await familyService.updateGift(gift.value.id, gift.value);
//       family.value.children[currentChildID.value].gifts[currentGiftIndex] = gift.value;
//     }catch (err){
//       await fetchFamily(family.value.id);
//     }
//
//   }
//
//   currentGiftIndex.value = null;
//   giftModal.value.hide();
// }
// function showRemoveGiftModel(giftIndex, childIndex){
//   currentChildID.value = childIndex;
//   currentGiftIndex.value = giftIndex;
//   console.log("gift:" + giftIndex + ", chiild: " + childIndex);
//   gift.value = family.value.children[childIndex].gifts[giftIndex];
//   removeGiftModal.value = new bootstrap.Modal(document.getElementById('deleteGift'));
//   removeGiftModal.value.show();
// }
// async function removeGift(){
//   try{
//     const gift = family.value.children[currentChildID.value].gifts[currentGiftIndex.value]
//     await familyService.deleteGift(gift.id)
//     //family.value.children[currentChildID.value].gifts.splice(currentGiftIndex, 1)
//   }catch (err){
//     console.warn(err);
//   }finally {
//     await fetchFamily(family.value.id);
//   }
//
//   removeGiftModal.value.hide();
//   currentGiftIndex.value = null;
// }
// function openChildModal(){
//   childModal.value = new bootstrap.Modal(document.getElementById('addChild'));
//   childModal.value.show();
// }
// async function addChild(){
//   const newChild = {
//     age: age.value,
//     gender: gender.value,
//     gifts:[],
//   };
//
//   await familyService.addChild(family.value.id, newChild)
//   age.value = null;
//   gender.value = null;
//
//   childModal.value.hide();
//   await fetchFamily(family.value.id);
// }
//
// async function removeChild(){
//   try{
//     //family.value.children.splice(id, 1);
//     child = family.value.children[currentChildID.value];
//     await familyService.deleteChild(child.id, family.value.id);
//   }catch (err){
//     console.warn(err);
//   }finally {
//     await fetchFamily(family.value.id);
//   }
//
//   removeChildModal.value.hide();
// }
//
// function openDeleteChildModal(id){
//   removeChildModal.value = new bootstrap.Modal(document.getElementById('deleteChild'));
//   removeChildModal.value.show();
//   currentChildID.value = id;
//   child.value = family.value.children[id];
// }

async function fetchSponsor(id){
  try{
    console.log("parent id: " + id)
    const response = await sponsorService.getSponsor(id);
    sponsor.value = response.data
    console.log(sponsor.value)
    console.log(sponsor.value.children)
  }catch(err){
    console.warn(err);
  }

}
onMounted(() => {
  if(sponsorID !== 0){
    fetchSponsor(sponsorID);
  }
});

</script>

<style scoped>
</style>

<template>
  <BasePageHeading title="Sponsors" subtitle="Edit the Sponsor information here.">
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">
          <li class="breadcrumb-item">
            <span class="fa fa-medal fa-2x"></span>
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
                    v-model="sponsor.firstName"
                />
              </div>
              <div class="col-6">
                <label class="form-label" for="val-lastName">Last Name <span class="text-danger">*</span></label>
                <input
                    type="text"
                    id="val-lastName"
                    class="form-control"
                    placeholder="Enter a last name"
                    v-model="sponsor.lastName"
                />
              </div>
              <div class="col-3">
                <label class="form-label" for="val-primaryPhone">Phone Number <span class="text-danger">*</span></label>
                <input
                    type="text"
                    id="val-primaryPhone"
                    class="form-control"
                    placeholder="Enter a phone number"
                    v-model="sponsor.phone"
                />
              </div>
              <div class="col-3">
                <label class="form-label" for="val-bestTimeToCall">Best Time to Call</label>
                <input
                    type="text"
                    id="val-bestTimeToCall"
                    class="form-control"
                    placeholder="Enter the best time to call"
                    v-model="sponsor.bestTimeToCall"
                />
              </div>
              <div class="col-5">
                <label class="form-label" for="val-email">Email Address <span class="text-danger">*</span></label>
                <input
                    type="text"
                    id="val-email"
                    class="form-control"
                    placeholder="Email"
                    v-model="sponsor.email"
                />
              </div>
            </div>
            <hr>
            <div class="row g-4">
              <div class="col-11">
                <label class="form-label" for="val-address">Address <span class="text-danger">*</span></label>
                <input
                    type="text"
                    id="val-address"
                    class="form-control"
                    placeholder="Enter the street address"
                    v-model="sponsor.address.address"
                />
              </div>
              <div class="col-5">
                <label class="form-label" for="val-city">City <span class="text-danger">*</span></label>
                <input
                    type="text"
                    id="val-city"
                    class="form-control"
                    placeholder="Enter the name of the city"
                    v-model="sponsor.address.city"
                />
              </div>
              <div class="col-3">
                <label class="form-label" for="val-state">State <span class="text-danger">*</span></label>
                <input
                    type="text"
                    id="val-state"
                    class="form-control"
                    placeholder="TX"
                    v-model="sponsor.address.state"
                />
              </div>
              <div class="col-3">
                <label class="form-label" for="val-zip">Zip</label>
                <input
                    type="text"
                    id="val-bestTimeToCall"
                    class="form-control"
                    placeholder="Zip code"
                    v-model="sponsor.address.zip"
                />
              </div>
            </div>
            <div class="row g-4 pt-4 px-2">
              <div class="col-4 form-check form-switch">
                <input
                    class="form-check-input"
                    type="checkbox"
                    id="val-sponsoredPreviously"
                    v-model="sponsor.hasSponsoredPreviously"
                />
                <label class="form-check-label" for="val-sponsoredPreviously">Have you sponsored previously?</label>
              </div>
              <div class="col-4 form-check form-switch">
                <input
                    class="form-check-input"
                    type="checkbox"
                    id="val-wantToVolunteer"
                    v-model="sponsor.wantToVolunteer"
                />
                <label class="form-check-label" for="val-wantToVolunteer">Would you like to Volunteer?</label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </BaseBlock>
    <BaseBlock>
      <div class="row pb-4">
        <div class="col-lg-12">
          <div class="row g-4">

            <div class="form-check form-switch">
              <input
                  class="form-check-input"
                  type="checkbox"
                  id="val-wantToVolunteer"
                  v-model="sponsor.wantToVolunteer"
              />
              <label class="form-check-label" for="example-switch-default1">Have you sponsored previously</label>
            </div>
          </div>
        </div>
      </div>
    </BaseBlock>


    <!-- Save Button -->
    <div class="block rounded p-2">
      <div class="p-1 d-flex justify-content-end">
        <div class="me-2"><button :class="['btn', 'btn-secondary']" class="btn btn-danger" @click="router.push({name:'backend-sponsor'})">Cancel</button></div>
        <div class="me-2" v-if="sponsor.id != null"><button :class="['btn', 'btn-danger']" @click="showRemoveSponsorModal">Remove Sponsor</button></div>
        <div class="me-2"><button type="button" class="btn btn-primary" @click="saveSponsor">Save Sponsor</button></div>
      </div>
    </div>
  </div>

  <!-- Start the modals -->
<!--  <div class="modal fade" id="addChild" tabindex="-1" aria-labelledby="addChild" aria-hidden="true">-->
<!--    <div class="modal-dialog">-->
<!--      <div class="modal-content">-->
<!--        <div class="modal-header">-->
<!--          <h5 class="modal-title" id="myModalLabel">Add Child</h5>-->
<!--          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>-->
<!--        </div>-->
<!--        <div class="modal-body">-->
<!--          <div class="col-12 d-flex align-items-center">-->
<!--            <div class="me-2">-->
<!--              <label for="age" class="form-label mb-0">Age</label>-->
<!--              <input type="number" id="age" class="form-control form-control-sm" placeholder="Age" v-model="age">-->
<!--            </div>-->
<!--            <div class="me-2">-->
<!--              <label for="gender" class="form-label mb-0">Gender</label>-->
<!--              <select id="gender" class="form-select form-select-sm" v-model="gender">-->
<!--                <option selected>Choose...</option>-->
<!--                <option value="M">M</option>-->
<!--                <option value="F">F</option>-->
<!--                <option value="O">O</option>-->
<!--              </select>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="modal-footer">-->
<!--          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>-->
<!--          <button type="button" class="btn btn-primary btn-warning" @click="addChild">Add Child</button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--  <div class="modal fade" id="addGift" tabindex="-1" aria-labelledby="addGift" aria-hidden="true">-->
<!--    <div class="modal-dialog">-->
<!--      <div class="modal-content">-->
<!--        <div class="modal-header">-->
<!--          <h5 class="modal-title" id="myModalLabel">Add Gift</h5>-->
<!--          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>-->
<!--        </div>-->
<!--        <div class="modal-body">-->
<!--          <div class="row items-push">-->
<!--            <div class="mb-4">-->
<!--              <label class="form-label" for="val-description">Gift Description <span class="text-danger">*</span></label>-->
<!--              <input-->
<!--                  type="text"-->
<!--                  id="val-description"-->
<!--                  class="form-control"-->
<!--                  placeholder="Enter a description for the gift"-->
<!--                  v-model="gift.description"-->
<!--              />-->
<!--            </div>-->
<!--            <div class="mb-4">-->
<!--              <label class="form-label" for="val-size">Size <span class="text-danger">*</span></label>-->
<!--              <input-->
<!--                  type="text"-->
<!--                  id="val-size"-->
<!--                  class="form-control"-->
<!--                  placeholder="Size of the gift"-->
<!--                  v-model="gift.size"-->
<!--              />-->
<!--            </div>-->
<!--            <div class="mb-4">-->
<!--              <label for="status" class="form-label mb-0">Status</label>-->
<!--              <select id="status" class="form-select form-select-sm" v-model="gift.status">-->
<!--                <option selected>Choose...</option>-->
<!--                <option value="status_1">Status 1</option>-->
<!--                <option value="status_2">Status 2</option>-->
<!--                <option value="status_3">Status 3</option>-->
<!--              </select>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="modal-footer">-->
<!--          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>-->
<!--          <button type="button" class="btn btn-primary btn-warning" @click="saveGift">Save Gift</button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--  <div class="modal fade" id="deleteChild" tabindex="-1" aria-labelledby="deleteChild" aria-hidden="true">-->
<!--    <div class="modal-dialog">-->
<!--      <div class="modal-content">-->
<!--        <div class="modal-header">-->
<!--          <h5 class="modal-title" id="myModalLabel">Are you sure you want to delete this child?</h5>-->
<!--          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>-->
<!--        </div>-->
<!--        <div class="modal-body">-->
<!--          <div class="row items-push">-->
<!--            <div>Are you sure you want to delete <strong>Child {{currentChildID + 1}}</strong></div>-->
<!--            <div>Age: {{child.age}}</div>-->
<!--            <div>Gender: {{child.gender}}</div>-->
<!--            <div>And all of their gifts: {{child.gifts.length}}</div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="modal-footer">-->
<!--          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>-->
<!--          <button type="button" class="btn btn-danger" @click="removeChild">Delete</button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--  <div class="modal fade" id="deleteGift" tabindex="-1" aria-labelledby="deleteGift" aria-hidden="true">-->
<!--    <div class="modal-dialog">-->
<!--      <div class="modal-content">-->
<!--        <div class="modal-header">-->
<!--          <h5 class="modal-title" id="myModalLabel">Are you sure you want to delete this gift?</h5>-->
<!--          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>-->
<!--        </div>-->
<!--        <div class="modal-body">-->
<!--          <div class="row items-push">-->
<!--            <div>Are you sure you want to delete <strong>{{gift.description}}</strong></div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="modal-footer">-->
<!--          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>-->
<!--          <button type="button" class="btn btn-primary btn-danger" @click="removeGift">Delete</button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--  <div class="modal fade" id="deleteFamily" tabindex="-1" aria-labelledby="deleteFamily" aria-hidden="true">-->
<!--    <div class="modal-dialog">-->
<!--      <div class="modal-content">-->
<!--        <div class="modal-header">-->
<!--          <h5 class="modal-title" id="myModalLabel">Are you sure you want to delete this family?</h5>-->
<!--          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>-->
<!--        </div>-->
<!--        <div class="modal-body">-->
<!--          <div class="row items-push">-->
<!--            <div>Are you sure you want to delete the <strong>{{family.lastName}}</strong> family?</div>-->
<!--            <div>-->
<!--              <br>-->
<!--              <p class="text-danger">-->
<!--                If you delete the family, you will also delete all the children and gifts associated with this family.-->
<!--                Once deleted, the data can not be retrieved and you may lose hours of work and all the information tied-->
<!--                to this family. If you're not sure about deleting this family, please ask.-->
<!--              </p>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="modal-footer">-->
<!--          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>-->
<!--          <button type="button" class="btn btn-danger" @click="removeFamily">Delete</button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
</template>
