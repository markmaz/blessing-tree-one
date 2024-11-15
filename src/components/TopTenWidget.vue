<script setup>
  import GiftService from "@/services/giftService.js";
  import {onMounted, ref} from "vue";
  let data = ref([]);
  let landing = ref(true);

  async function fetchData(gender, limit){
    landing.value = true;
    try{
      const response = await GiftService.getTopTen(gender, limit);
      data.value = response.data;
    }catch (err){
      console.warn(err);
    }finally {
      landing.value = false;
    }

  }

  const props = defineProps({
    gender: {
      type: String,
      required: true
    },
    limit: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  });

  const { gender, limit, title } = props;

  onMounted(() => {
    fetchData(gender, limit);
  })

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
  <BaseBlock :title=title :class="['mb-4', 'rounded', 'child-border', 'shadow', 'shadow-sm',
  gender === 'M' ? 'gender-m' :
  gender === 'F' ? 'gender-f' :
  'gender-other']" :headerClass="['rounded', 'child-header', 'shadow', 'shadow-sm',
  gender === 'M' ? 'gender-m' :
  gender === 'F' ? 'gender-f' :
  'gender-other']">
    <div class="content">
      <table class="table table-striped table-vcenter table-hover">
        <thead>
          <th>Gift Description</th>
          <th>Requests</th>
        </thead>
        <tbody>
          <tr v-for="row in data">
            <td>{{row.giftDescription}}</td>
            <td>{{row.count}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseBlock>
</template>