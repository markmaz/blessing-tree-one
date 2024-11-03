<template>
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content">
      <BaseBlock title="Modal Title" transparent class="mb-0">
        <template #options>
          <button
              type="button"
              class="btn-block-option"
              data-bs-dismiss="modal"
              aria-label="Close"
          >
            <i class="fa fa-fw fa-times"></i>
          </button>
        </template>
        <slot></slot>
      </BaseBlock>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close'],
  methods: {
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>

</style>