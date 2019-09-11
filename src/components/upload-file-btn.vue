<template>
  <div @click="$refs.inputUpload.click()">
    <slot>
      <button type="button" class="btn btn-primary">
        File Upload
      </button>
    </slot>
    <input v-show="false" ref="inputUpload" type="file" @change="getFileData" />
  </div>
</template>

<script>
export default {
  name: 'upload-file-btn',
  methods: {
    getFileData(event) {
      this.$emit('upload', event);
    },
  },
};
</script>
