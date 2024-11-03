<script setup>
import {reactive, computed, ref, onMounted} from "vue";
import { useRouter } from "vue-router";
import { useTemplateStore } from "@/stores/template";
import { useUserStore} from "@/stores/userStore.js";

// Vuelidate, for more info and examples you can check out https://github.com/vuelidate/vuelidate
import useVuelidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import authService from "@/services/authService.js";
import userService from "@/services/userService.js";

// Main store and Router
const store = useTemplateStore();
const userStore = useUserStore();

const router = useRouter();
const toast2 = ref(null);
const error = null;

// Input state variables
const state = reactive({
  username: null,
  password: null,
});

// Validation rules
const rules = computed(() => {
  return {
    username: {
      required,
      minLength: minLength(3),
    },
    password: {
      required,
      minLength: minLength(5),
    },
  };
});

// Use vuelidate
const v$ = useVuelidate(rules, state);

// On form submission
async function onSubmit() {
  const result = await v$.value.$validate();

  if (!result) {
    toast2.show;
  }else{
    try {
      const response = await authService.login({
        username: state.username,
        password: state.password,
      });

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token); // Store the JWT token
        const base64Payload = response.data.token.split(".")[1];
        const payloadBuffer = atob(base64Payload);
        const vals = JSON.parse(payloadBuffer.toString());

        const response2 = await userService.getUser(vals.userID);

        if(response2.data.username){
          userStore.name = response2.data.firstName + " " + response2.data.lastName;

          if (response2.data.admin){
            userStore.title = "Administrator";
          }else{
            userStore.title = "Web User";
          }

        }

        // Optionally redirect to another page on successful login
        router.push({name:'backend-dashboard'}); // Redirect to main app/dashboard
      } else {
        toast2.show
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }
}

onMounted(() => {
  toast2.value = new window.bootstrap.Toast(
      document.getElementById("toast-user"),
  );
});
</script>

<template>
  <!-- Page Content -->
  <BaseBackground image="/assets/media/photos/church.jpg">
    <div class="row g-0 bg-primary-dark-op">
      <!-- Meta Info Section -->
      <div
        class="hero-static col-lg-4 d-none d-lg-flex flex-column justify-content-center"
      >
        <div class="p-4 p-xl-5 flex-grow-1 d-flex align-items-center">
          <div class="w-100">
          </div>
        </div>
        <div
          class="p-4 p-xl-5 d-xl-flex justify-content-between align-items-center fs-sm"
        >
          <p class="fw-medium text-white-50 mb-0">
            <strong>{{ store.app.name + " " + store.app.version }}</strong>
            &copy; {{ store.app.copyright }}
          </p>
          <ul class="list list-inline mb-0 py-2">
            <li class="list-inline-item">
              <a class="text-white-75 fw-medium" href="javascript:void(0)"
                >Legal</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-white-75 fw-medium" href="javascript:void(0)"
                >Contact</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-white-75 fw-medium" href="javascript:void(0)"
                >Terms</a
              >
            </li>
          </ul>
        </div>
      </div>
      <!-- END Meta Info Section -->

      <!-- Main Section -->
      <div
        class="hero-static col-lg-8 d-flex flex-column align-items-center bg-body-extra-light"
      >
        <div class="p-3 w-100 d-lg-none text-center">
        </div>
        <div class="p-4 w-100 flex-grow-1 d-flex align-items-center">
          <div class="w-100">
            <!-- Header -->
            <div class="text-center mb-5">
<!--              <p class="mb-3">-->
<!--                <i class="fa fa-2x fa-circle-notch text-primary-light">test</i>-->
<!--              </p>-->
              <div class="row g-0 justify-content-center">
                <div class="col-sm-8 col-xl-4"><img src="/assets/media/various/gift2.png" style="width: 100%"></div>
              </div>

              <p class="fw-medium text-muted">
                Welcome, please login or
                <RouterLink :to="{ name: 'auth-signup3' }">sign up</RouterLink>
                for a new account.
              </p>
            </div>
            <!-- END Header -->

            <!-- Sign In Form -->
            <div class="row g-0 justify-content-center">
              <div class="col-sm-8 col-xl-4">
                <form @submit.prevent="onSubmit">
                  <div class="mb-4">
                    <input
                      type="text"
                      class="form-control form-control-lg form-control-alt py-3"
                      id="login-username"
                      name="login-username"
                      placeholder="Username"
                      :class="{
                        'is-invalid': v$.username.$errors.length,
                      }"
                      v-model="state.username"
                      @blur="v$.username.$touch"
                    />
                    <div
                      v-if="v$.username.$errors.length"
                      class="invalid-feedback animated fadeIn"
                    >
                      Please enter your username
                    </div>
                  </div>
                  <div class="mb-4">
                    <input
                      type="password"
                      class="form-control form-control-lg form-control-alt py-3"
                      id="login-password"
                      name="login-password"
                      placeholder="Password"
                      :class="{
                        'is-invalid': v$.password.$errors.length,
                      }"
                      v-model="state.password"
                      @blur="v$.password.$touch"
                    />
                    <div
                      v-if="v$.password.$errors.length"
                      class="invalid-feedback animated fadeIn"
                    >
                      Please enter your password
                    </div>
                  </div>
                  <div
                    class="d-flex justify-content-between align-items-center mb-4"
                  >
                    <div>
                      <RouterLink
                        :to="{ name: 'auth-reminder3' }"
                        class="text-muted fs-sm fw-medium d-block d-lg-inline-block mb-1"
                      >
                        Forgot Password?
                      </RouterLink>
                    </div>
                    <div>
                      <button type="submit" class="btn btn-lg btn-alt-primary">
                        <i class="fa fa-fw fa-sign-in-alt me-1 opacity-50"></i>
                        Sign In
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <!-- END Sign In Form -->
          </div>
        </div>
        <div
          class="px-4 py-3 w-100 d-lg-none d-flex flex-column flex-sm-row justify-content-between fs-sm text-center text-sm-start"
        >
          <p class="fw-medium text-black-50 py-2 mb-0">
            <strong>{{ store.app.name + " " + store.app.version }}</strong>
            &copy; {{ store.app.copyright }}
          </p>
          <ul class="list list-inline py-2 mb-0">
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
                >Legal</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
                >Contact</a
              >
            </li>
            <li class="list-inline-item">
              <a class="text-muted fw-medium" href="javascript:void(0)"
                >Terms</a
              >
            </li>
          </ul>
        </div>
      </div>
      <!-- END Main Section -->
    </div>
  </BaseBackground>
  <!-- END Page Content -->

  <!-- Toast -->
  <div
      id="toast-user"
      class="toast fade hide"
      data-delay="4000"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
  >
    <div class="toast-header">
      <i class="si si-wrench text-danger me-2"></i>
      <strong class="me-auto">System</strong>
      <small class="text-muted">just now</small>
      <button
          type="button"
          class="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
      ></button>
    </div>
    <div class="toast-body">
      Invalid input.
    </div>
  </div>
</template>
