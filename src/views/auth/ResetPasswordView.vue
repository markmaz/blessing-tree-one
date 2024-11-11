<script setup>
import { reactive, computed, ref } from "vue";
import {useRoute, useRouter} from "vue-router";
import { useTemplateStore } from "@/stores/template";
import authService from "@/services/authService.js";
import useVuelidate from "@vuelidate/core";
import { required, minLength, email, sameAs } from "@vuelidate/validators";

// Main store and Router
const store = useTemplateStore();
const router = useRouter();
const route = useRoute();
const token = route.params.token;
let passwordChanged = ref(null);

// Input state variables
const state = reactive({
  password: null,
  confirmPassword: null,
});

// Validation rules
const rules = computed(() => {
  return {
    password: {
      required,
      minLength: minLength(5),
    },
    confirmPassword: {
      required,
      sameAs: sameAs(state.password),
    },
  };
});

// Use vuelidate
const v$ = useVuelidate(rules, state);

function openConfirmation(){
  passwordChanged.value = new bootstrap.Modal(document.getElementById('passwordChanged'));
  passwordChanged.value.show();
}

// On form submission
async function onSubmit() {
  const result = await v$.value.$validate();

  if (!result) {
    // notify user form is invalid
    return;
  }

  const userData = {token: token, password: state.password}
  let response = await authService.reset(userData);

  if(response.status === 200){
    router.push({name: "landing"});
    openConfirmation();
  }

}
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
              <h1 class="fw-bold mb-2">Reset Password</h1>
              <p class="fw-medium text-muted">
                Change your password.
              </p>
            </div>
            <!-- END Header -->

            <!-- Sign Up Form -->
            <div class="row g-0 justify-content-center">
              <div class="col-sm-8 col-xl-4">
                <form @submit.prevent="onSubmit">
                  <div class="mb-4">
                    <input
                      type="password"
                      class="form-control form-control-lg form-control-alt py-3"
                      id="signup-password"
                      name="signup-password"
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
                      Please provide a password
                    </div>
                  </div>
                  <div class="mb-4">
                    <input
                      type="password"
                      class="form-control form-control-lg form-control-alt py-3"
                      id="signup-password-confirm"
                      name="signup-password-confirm"
                      placeholder="Confirm Password"
                      :class="{
                        'is-invalid': v$.confirmPassword.$errors.length,
                      }"
                      v-model="state.confirmPassword"
                      @blur="v$.confirmPassword.$touch"
                    />
                    <div
                      v-if="v$.confirmPassword.$errors.length"
                      class="invalid-feedback animated fadeIn"
                    >
                      Please confirm the password
                    </div>
                  </div>
                  <div class="text-center">
                    <button type="submit" class="btn btn-lg btn-alt-success">
                      Reset Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <!-- END Sign Up Form -->
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

    <!-- Modal -->
    <div class="modal fade" id="passwordChanged" tabindex="-1" aria-labelledby="passwordChanged" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="myModalLabel">Your password has been reset</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row items-push">
              <div>
                Your password has been reset. Please sign in using your new password.
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <!-- End Modal -->
  </BaseBackground>
  <!-- END Page Content -->
</template>
