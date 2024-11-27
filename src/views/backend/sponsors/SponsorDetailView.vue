<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import sponsorService from "@/services/sponsorService.js";
import giftService from "@/services/giftService.js";
import router from "@/router/index.js";
import GiftSearchComponent from "@/components/GiftSearchComponent.vue";
import tagService from "@/services/tagService.js";
import utils from "@/utility/utils.js";

const route = useRoute();
const sponsorID = Number(route.params.id);
let sponsor = ref({firstName: null, lastName: null, phone: null, email: null,
  address: {id: null, street: null, city: null, state: "TX", zip: null}, bestTimeToCall: null,
  id: null,
  hasSponsoredPreviously: null, howDidYouHearAboutUs: null, wantToVolunteer: null,
  childAgePreference:null, genderPreference:null, numberOfChildrenSponsored: null, gifts:[]});

const deleteSponsorModal = ref(null);
const sponsorName = ref(null);
const saveNotification = ref(null);
const showAddGift = ref(null);
const selectedGifts = ref([]);
let saveGiftText = ref("Save Gift");
const removeGiftModel = ref(null);
let giftID = ref(null);
const showModal = ref("false");
async function printGiftTags(){
  try {
    const response = await tagService.printGiftTagsForSponsor(sponsor.value.id);
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    const date = utils.getCurrentDateTime();
    const fileName = sponsor.value.lastName + "_giftTags_printed_on_" + date + ".pdf";
    link.setAttribute('download', fileName); // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up after download
  } catch (err){
    console.error(err);
  }
}
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
}
function openSearchGiftModal(){
  showModal.value = "true";
  showAddGift.value = new bootstrap.Modal(document.getElementById('addGift'));
  showAddGift.value.show();
}
function openRemoveSponsorModal(){
  sponsorName.value = sponsor.value.firstName + " " + sponsor.value.lastName;
  deleteSponsorModal.value = new bootstrap.Modal(document.getElementById('removeSponsorModal'));
  deleteSponsorModal.value.show();
}

function showRemoveGiftModel(id){
  giftID.value = id;
  removeGiftModel.value = new bootstrap.Modal(document.getElementById('showRemoveGiftModel'));
  removeGiftModel.value.show();
}

async function removeGift(){
  try{
    const response = await giftService.unSponsorGift(giftID.value, sponsor.value.id);
  }catch (err){
    console.log(err);
  }finally {
    await fetchSponsor(sponsor.value.id);
    removeGiftModel.value.hide();
  }
}

async function removeSponsor(){
  try{
    const response = sponsorService.deleteSponsor(sponsor.value.id);
  }catch (err){
    console.warn(err);
  }finally {
    deleteSponsorModal.value.hide();
    await router.push({name: 'backend-sponsors'})
  }
}

async function saveGift(){
   for (const gift of selectedGifts.value) {
     try{
       const response = await giftService.sponsorGift(gift, sponsor.value.id);
       console.log(response.data);
     }catch (err){
       console.error(err);
     }finally {
       await fetchSponsor(sponsor.value.id);
       showAddGift.value.hide();
     }
   }
}

async function saveSponsor(){
  if(sponsorID.value == null){
    try{
      const response = await sponsorService.createSponsor(sponsor.value);
      sponsor.value = response.data;
    }catch (err){
      console.error(err);
    }finally {
      saveNotification.value.show();
    }
  }else{
    try{
      const response = await sponsorService.updateSponsor(sponsor.value.id, sponsor.value);
      sponsor.value = response.data;
    }catch(err){
      console.error(err);
    }finally {
      saveNotification.value.show();
    }
  }
}
async function fetchSponsor(id){
  try{
    console.log("parent id: " + id)
    const response = await sponsorService.getSponsor(id);
    sponsor.value = response.data
    console.log(sponsor.value)
  }catch(err){
    console.warn(err);
  }

}
onMounted(() => {
  if(sponsorID !== 0){
    fetchSponsor(sponsorID);
  }

  saveNotification.value = new window.bootstrap.Toast(
      document.getElementById("saveNotification"),
  );
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
                    v-model="sponsor.address.street"
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
              <div class="col-3">
                <label for="howDidYouHearAboutUs" class="form-label mb-0">How did you hear about us?</label>
                <select id="howDidYouHearAboutUs" class="form-select form-select-sm" v-model="sponsor.howDidYouHearAboutUs">
                  <option selected>None</option>
                  <option value="I/my family have participated in it before">I/my family have participated in it before</option>
                  <option value="From friends who attend St. Mary Magdalen">From friends who attend St. Mary Magdalen</option>
                  <option value="Parish Bulletin">Parish Bulletin</option>
                  <option value="Parish Flocknote">Parish Flocknote</option>
                  <option value="I saw it on the parrish website">I saw it on the parrish website</option>
                  <option value="Other">Other</option>
                </select>
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
          <div class="col-3">
            <label for="genderPreference" class="form-label mb-0">Gender Preference</label>
            <select id="genderPreference" class="form-select form-select-sm" v-model="sponsor.genderPreference">
              <option selected>None</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Either">Either</option>
            </select>
          </div>
          <div class="col-3">
            <label for="agePreference" class="form-label mb-0">Child's Age Preference</label>
            <select id="agePreference" class="form-select form-select-sm" v-model="sponsor.childAgePreference">
              <option selected>None</option>
              <option value="Newborn - 5 years">Newborn - 5 years</option>
              <option value="6 -12 years">6 - 12 Years</option>
              <option value="13 - 17 years">13 - 17 Years</option>
            </select>
          </div>
          <div class="col-3">
            <label for="numberOfChildren" class="form-label mb-0">Number of Children Sponsored</label>
            <input
                type="number"
                id="numberOfChildren"
                class="form-control"
                placeholder="Number of children"
                v-model="sponsor.numberOfChildrenSponsored"
            />
          </div>
        </div>
      </div>
      </div>
    </BaseBlock>
    <BaseBlock>
      <div class="row pb-4" v-if="sponsor.gifts.length < 1">
        <div class="col-lg-12">
          <div class="row g-4">
            <div class="text-center"><button :class="['btn', 'btn-primary', sponsor.id == null ? 'disabled': '']" @click="openSearchGiftModal">Sponsor Gift</button> </div>
          </div>
        </div>
      </div>
      <div class="row pb-4" v-else>
        <div class="col-lg-12">
          <div class="row g-4">
            <table class="table table-striped">
              <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Size</th>
                <th>Status</th>
                <th>Child ID</th>
                <th>Family</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(gift, giftIndex) in sponsor.gifts" :key="giftIndex">
                <td>{{ gift.child.parent.btid }}</td>
                <td>{{ gift.description }}</td>
                <td>{{ gift.size }}</td>
                <td>{{ gift.status }}</td>
                <td>{{gift.child.id}}</td>
                <td><router-link :to="{ name: 'backend-families-details', params: { id: gift.child.parent.id } }">{{gift.child.parent.firstName}} {{gift.child.parent.lastName}}</router-link></td>
                <td class="text-center">
                  <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-alt-secondary" @click="showRemoveGiftModel(gift.id)">
                      <i class="fa fa-fw fa-times"></i>
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="col text-end">
              <button class="btn btn-primary" @click="openSearchGiftModal">Add Gift</button>
            </div>
          </div>
        </div>
      </div>
    </BaseBlock>


    <!-- Save Button -->
    <div class="block rounded p-2">
      <div class="p-1 d-flex justify-content-end">
        <div class="me-2"><button type="button" class="btn btn-primary" @click="printGiftTags">Print Gift Tags</button></div>
        <div class="me-2"><button :class="['btn', 'btn-secondary']" class="btn btn-danger" @click="router.push({name:'backend-sponsors'})">Cancel</button></div>
        <div class="me-2" v-if="sponsor.id != null"><button :class="['btn', 'btn-danger']" @click="openRemoveSponsorModal">Remove Sponsor</button></div>
        <div class="me-2"><button type="button" class="btn btn-primary" @click="saveSponsor">Save Sponsor</button></div>
      </div>
    </div>
  </div>

  <!-- Start the modals -->
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

  <div class="modal fade" id="showRemoveGiftModel" tabindex="-1" aria-labelledby="showRemoveGiftModel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="myModalLabel">Are you sure you want to remove this gift from the sponsor?</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row items-push">
            <div>Are you sure you want to remove this gift from the sponsor? This does not delete the gift - it just removes it from this sponsor.</div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger" @click="removeGift">Remove Gift</button>
        </div>
      </div>
    </div>
  </div>
  <!-- save notification -->
  <div
      id="saveNotification"
      class="toast fade hide position-fixed right"
      data-delay="4000"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
  >
    <div class="toast-header">
      <i class="si si-bubble text-primary me-2"></i>
      <strong class="me-auto">Sponsor Information Updated</strong>
      <small class="text-muted">just now</small>
      <button
          type="button"
          class="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
      ></button>
    </div>
    <div class="toast-body">
      The sponsor information was updated {{new Date()}}
    </div>
  </div>
  <!-- END Toast Example 1 -->
  <div class="modal fade modal-xl" id="addGift" tabindex="-1" aria-labelledby="addGift" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="myModalLabel">Search Gifts</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <GiftSearchComponent @closeModal="closeModal" @addGift="addGift" :show-modal="showModal"/>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary btn-warning" @click="saveGift">{{ saveGiftText }}</button>
        </div>
      </div>
    </div>
  </div>
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
