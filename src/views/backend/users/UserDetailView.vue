<script>
import userService from "@/services/userService";

export default {
  props:{
    userID:{
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      user: null,
      loading: false,
      error: null,
    };
  },
  methods: {
    async fetchUser(id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await userService.getUser(id)
        this.user = response.data; // Adjust this based on your API response structure
        console.log(this.user)
      } catch (err) {
        this.error = 'Error fetching users: ' + err.message;
      } finally {
        this.loading = false;
      }
    },
    async saveUser() {
      try{
        const response = await userService.updateUser(this.userID, this.user);
        this.user = response.data;
      }catch (err){
        console.warn(err.message);
      }finally {
        this.$emit('closeModal');
      }
    },

    async createuser(){
      try {
        const response = await userService.createUser(this.user);
      }catch(err){
        console.warn(err.message);
      }finally {
        this.$emit('closeModal');
      }
    },

    deleteUser(userId) {
      // Implement delete user logic
      console.log(`Delete user with ID: ${userId}`);
    },
  },
  mounted() {
    console.log("Fetching user " + this.userID)
    if(this.userID !== 0){
      this.fetchUser(this.userID)
    }
  }
};
</script>

<template>
  <!-- Hero -->
<!--  <BasePageHeading-->
<!--      title="Users"-->
<!--      subtitle="Manage the application users here."-->
<!--  >-->
<!--    <template #extra>-->
<!--      <nav aria-label="breadcrumb">-->
<!--        <ol class="breadcrumb breadcrumb-alt">-->
<!--          <li class="breadcrumb-item">-->
<!--            <a class="link-fx " href="javascript:void(0)">-->
<!--              <span class="fa fa-user-cog fa-2x"></span>-->
<!--            </a>-->
<!--          </li>-->
<!--        </ol>-->
<!--      </nav>-->
<!--    </template>-->
<!--  </BasePageHeading>-->
  <!-- END Hero -->

  <!-- Page Content -->
  <BaseBlock>
    <div class="row items-push" v-if="user !== null">
        <div class="mb-4">
          <label class="form-label" for="val-username">Username <span class="text-danger">*</span></label>
          <input
              type="text"
              id="val-username"
              class="form-control"
              placeholder="Enter a username.."
              v-model="user.username"
          />
        </div>
      <div class="mb-4">
        <label class="form-label" for="val-first-name">First Name <span class="text-danger">*</span></label>
        <input
            type="text"
            id="val-first-name"
            class="form-control"
            placeholder="Enter a first name.."
            v-model="user.firstName"
        />
      </div>
      <div class="mb-4">
        <label class="form-label" for="val-last-name">Last Name <span class="text-danger">*</span></label>
        <input
            type="text"
            id="val-last-name"
            class="form-control"
            placeholder="Enter a last name.."
            v-model="user.lastName"
        />
      </div>
      <div class="mb-4">
        <label class="form-label" for="val-email">Email Address <span class="text-danger">*</span></label>
        <input
            type="text"
            id="val-email"
            class="form-control"
            placeholder="Enter an email address.."
            v-model="user.emailAddress"
        />
      </div>
    </div>
  </BaseBlock>
  <!-- END Page Content -->
</template>
