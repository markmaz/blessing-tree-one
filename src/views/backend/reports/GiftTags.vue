<script setup>
import tagService from "@/services/tagService.js";
import {ref} from "vue";
let tags = ref(1);

function getCurrentDateTime() {
  const now = new Date();

  const pad = (num) => String(num).padStart(2, '0');

  const month = pad(now.getMonth() + 1); // Months are 0-based
  const day = pad(now.getDate());
  const year = now.getFullYear();

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${month}_${day}_${year}_${hours}${minutes}${seconds}`;
}
async function generateTags(){
  try {
    const response = await tagService.printGiftTags(tags.value);
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    const date = getCurrentDateTime();
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