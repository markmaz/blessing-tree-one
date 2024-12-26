<script setup>
  import sponsorService from "@/services/sponsorService.js";
  import {onMounted, ref} from "vue";

  const sponsors = ref({id: 0, address: {street: null, city: null, state: null, zip: null}});
  let loading = ref(false);

  async function fetch(){
    try {
      loading.value = true;
      const response = await sponsorService.getSponsors();
      sponsors.value = response.data;
    }catch (err){
      console.error(err);
    }finally {
      loading.value = false;
    }
  }

  onMounted(() => {
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
      title="Sponsor Roster"
      subtitle="Listing of the contact information for Sponsors."
  >
    <template #extra>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb breadcrumb-alt">

          <li class="breadcrumb-item items-push">
            <div class="row g-2">
              <div class="col-auto">
                <button class="btn btn-primary" @click="printReport"><i class="fa fa-fw me-1 fa-print"></i>Print Report</button>
              </div>
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
    <div class="row g-3 pb-3 justify-content-center">
      <table class="table table-bordered table-striped">
        <thead>
        <th>Name</th>
        <th>Address</th>
        <th>City</th>
        <th>State</th>
        <th>Zip</th>
        <th>Phone</th>
        <th>Email</th>
        <th># of people Sponsored</th>
        </thead>
        <tbody style="font-size: 0.875rem;">
          <tr v-for="(sponsor, sponsorIndex) in sponsors" :key="sponsors.id">
            <td>{{sponsor.firstName}} {{sponsor.lastName}}</td>
            <td>{{sponsor?.address?.street}}</td>
            <td>{{sponsor?.address?.city}}</td>
            <td>{{sponsor?.address?.state}}</td>
            <td>{{sponsor?.address?.zip}}</td>
            <td>{{sponsor?.phone}}</td>
            <td>{{sponsor?.email}}</td>
            <td>{{sponsor?.gifts?.length}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>