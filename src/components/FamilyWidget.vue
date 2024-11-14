<script setup>
import familyService from "@/services/familyService";
import {onMounted, ref} from "vue";

let count = ref(0);
async function fetchFamilies(){
  try{
    const response = await familyService.familyCount();
    count.value = response.data.count;
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
            Families
          </dd>
        </dl>
        <div class="item item-rounded-lg bg-body-light">
          <i class="fa fa-baby fs-3 text-primary"></i>
        </div>
      </div>
      <div class="bg-body-light rounded-bottom">
        <RouterLink :to="{name: 'backend-families'}" class="block-content block-content-full block-content-sm fs-sm fw-medium d-flex align-items-center justify-content-between">
          <span>View all Families</span>
          <i class="fa fa-arrow-alt-circle-right ms-1 opacity-25 fs-base"></i>
        </RouterLink>
      </div>
    </template>
  </BaseBlock>
</template>