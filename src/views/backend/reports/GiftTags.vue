<script setup>
import tagService from "@/services/tagService.js";
import utils from "@/utility/utils.js";

import {ref} from "vue";
let tags = ref(1);

async function generateTags(){
  try {
    const response = await tagService.printGiftTags(tags.value);
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    const date = utils.getCurrentDateTime();
    const fileName = tags.value + "_giftTags_printed_on_" + date + ".pdf";
    link.setAttribute('download', fileName); // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up after download
  } catch (error) {
    console.error('Error downloading PDF:', error);
  }
}

</script>

<style scoped>

</style>

<template>
  <BasePageHeading
      title="Gift Tags"
      subtitle="Print Blank Gift Tags"
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
  <div class="content">
    <!-- Family Form -->
    <BaseBlock>
      <div class="row pb-4">
        <div class="col-lg-12">
          <div class="row g-4">
            <div class="col-5">
              <label class="form-label" for="val-tags">Number of Tags <span class="text-danger">*</span></label>
              <input
                  type="number"
                  id="val-tags"
                  class="form-control"
                  placeholder="Enter the number of tags you want to print"
                  v-model="tags"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="pb-2 d-flex justify-content-end">
          <div class="me-2"><button type="button" class="btn btn-primary " @click="generateTags">Generate Tags</button></div>
        </div>
      </div>
    </BaseBlock>
  </div>
</template>