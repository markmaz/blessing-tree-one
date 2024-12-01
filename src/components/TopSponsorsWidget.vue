<script setup>
import sponsorService from "@/services/sponsorService.js";
import {computed, onMounted, ref} from "vue";
let sponsors = ref([{id: 0, phone:null, gifts:[{}]}]);
let loading = ref(true);
let limiter = ref(10);
async function fetchData(){
  loading.value = true;
  try{
    const response = await sponsorService.getTopSponsors();
    sponsors.value = response.data;
  }catch (err){
    console.warn(err);
  }finally {
    loading.value = false;
  }

}

const props = defineProps({
  limit: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

const { limit, title } = props;

onMounted(() => {
  limiter.value = limit;
  fetchData();
})

const filteredData = computed(() => {
  return sponsors.value.map((sponsor) => ({
    ... sponsor,
    giftCount: sponsor.gifts.length,
  })).slice(0, limiter.value);
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
  <BaseBlock :title=title :class="['mb-4', 'rounded', 'shadow', 'shadow-sm']">
    <div v-if="loading" class="spinner-container">
      <div class="spinner"></div>
    </div>
    <div class="row p-3" v-if="!loading">
      <div class="row pb-3 justify-content-end">
        <div class="col-2">
          <label class="form-label" for="limit"># of rows</label>
          <input class="form-control" type="number" v-model="limiter" id="limit">
        </div>
      </div>
      <div class="row">
      <table class="table table-striped table-vcenter table-hover">
        <thead>
        <th>Sponsor Name</th>
        <th># Sponsored</th>
        <th># Pledged</th>
        </thead>
        <tbody>
        <tr v-for="row in filteredData">
          <td>
            <router-link :to="{ name: 'backend-sponsors-detail', params: { id: row.id } }">
              {{ row.firstName }} {{row.lastName}}
            </router-link>
          </td>
          <td>{{row.giftCount}}</td>
          <td>{{row.numberOfChildrenSponsored}}</td>
        </tr>
        </tbody>
      </table>
      </div>
    </div>
  </BaseBlock>
</template>