<script>
import userService from "@/services/userService";

export default {
  data() {
    return {
      user: {
        username: '',
        firstName: '',
        lastName: '',
        emailAddress: '',
        password: '',
      },
      loading: false,
      error: null,
    };
  },
  methods: {
    async createUser()
    {
      try {
        await userService.createUser(this.user);
      }catch(err){
        console.warn(err.message);
      }finally {
        this.$emit('closeModal');
        this.user =  {
          username: '',
          firstName: '',
          lastName: '',
          emailAddress: '',
          password: '',
        };
      }
    }
,
  },
  mounted() {
    this.user =  {
      username: '',
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
    };
  }
};
</script>

<template>
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
        <label class="form-label" for="val-username">Password <span class="text-danger">*</span></label>
        <input
            type="text"
            id="val-password"
            class="form-control"
            placeholder="Enter a password.."
            v-model="user.password"
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
