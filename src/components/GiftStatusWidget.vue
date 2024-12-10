<script setup>
import sponsorService from "@/services/sponsorService.js";
import giftService from "@/services/giftService.js";
import {onMounted, ref} from "vue";

let count = ref(0);
let giftCount = ref(0);

async function fetchFamilies(){
  try{
    const response = await sponsorService.getGiftStatusCount();
    count.value = response.data.count;

    const response2 = await giftService.outstandingCount();
    giftCount.value = response2.data.count;
  }catch (err){
    console.warn(err);
  }
}

onMounted(() => {
  fetchFamilies();
})
</script>

<style scoped>

</style>
<template>
  <BaseBlock class="d-flex flex-column h-100 mb-0">
    <template #content>
      <div
          class="block-content block-content-full flex-grow-1 d-flex justify-content-between align-items-center"
      >
        <dl class="mb-0">
          <dt class="fs-3 fw-bold">{{ count }}</dt>
          <dd class="fs-sm fw-medium fs-sm fw-medium text-muted mb-0">
            Sponsors
          </dd>
        </dl>
        <div class="item item-rounded-lg bg-body-light">
          <i class="fa fa-medal fs-3 text-danger"></i>
        </div>
      </div>
      <div class="bg-body-light rounded-bottom">
        <RouterLink :to="{name: 'backend-sponsors-volunteer'}" class="block-content block-content-full block-content-sm fs-sm fw-medium d-flex align-items-center justify-content-between">
          <span>View all Sponsors with Gifts Due</span>
          <i class="fa fa-arrow-alt-circle-right ms-1 opacity-25 fs-base"></i>
        </RouterLink>
      </div>
    </template>
  </BaseBlock>
</template>