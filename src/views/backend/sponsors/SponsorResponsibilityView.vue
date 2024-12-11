<script setup>
import SponsorService from "@/services/sponsorService.js";
import {onMounted, ref} from "vue";

let sponsors = ref([{id:0, gifts:[{child:{parent:{id:0}}}]}]);
let loading = ref(false);

async function fetch(){
  try {
    loading.value = true;
    const response = await SponsorService.getSponsors();
    sponsors.value = response.data;
    sponsors.value = sponsors.value.filter((sponsor) => {return sponsor.giftStatus === 'Pending' || sponsor.giftStatus === 'Partial'});
    console.log(sponsors.value)
  }catch (err){
    console.log(err);
  }finally {
    loading.value = false;
  }
}

onMounted(() =>{
  fetch();
})
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
      title="Sponsors with Pending or Partial Gifts"
      subtitle="These are the Sponsors who have yet to bring in their gifts."
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">

          <li class="breadcrumb-item items-push">
            <div class="row g-2">
<!--              <div class="col-auto">-->
<!--                <button class="btn btn-primary" @click="printAllGiftTags"><i class="fa fa-fw me-1 fa-gift"></i>Print All Gift Tags</button>-->
<!--              </div>-->
<!--              <div class="col-auto">-->
<!--                <button class="btn btn-primary" @click="printReport"><i class="fa fa-fw me-1 fa-print"></i>Print Report</button>-->
<!--              </div>-->
<!--              <div class="col-auto">-->
<!--                <button class="btn btn-primary" @click="printExcel"><i class="fa fa-fw me-1 fa-file-excel"></i>Export Excel</button>-->
<!--              </div>-->
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
    <table class="table table-bordered">
      <thead>
      <th>Name</th>
      <th>Phone</th>
      <th>Email</th>
      <th>Pledged</th>
      <th>Sponsored</th>
      <th>ID</th>
      <th>Family Name</th>
      <th>Children</th>
      <th>Gifts</th>
      </thead>
      <tbody style="font-size: 0.875rem;">
        <template v-for="(sponsor, sponsorIndex) in sponsors" :key="sponsor.id">
          <tr>
            <td>
              <router-link :to="{ name: 'backend-sponsors-detail', params: { id: sponsor.id } }">
                {{ sponsor.firstName }} {{sponsor.lastName}}
              </router-link>
            </td>
            <td>{{sponsor.phone}}</td>
            <td>{{sponsor.email}}</td>
            <td>{{sponsor.numberOfChildrenSponsored}}</td>
            <td>{{sponsor.gifts.length}}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <template v-for="(gift, giftIndex) in sponsor.gifts" :key="gift.id">
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <router-link :to="{ name: 'backend-families-details', params: { id: gift.child.parent.id} }">
                  {{gift.child.parent.btid}}
                </router-link>
              </td>
              <td>{{gift.child.parent.firstName}} {{gift.child.parent.firstName}}</td>
              <td>{{gift.child.name}}</td>
              <td>{{gift.description}}</td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>