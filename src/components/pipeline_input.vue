<template>
  <div class="hello">
    <!-- <input type="file" id="file" ref="myFiles" class="custom-file-input" style="width:300px;height:80px;border:1px solid black;" @change="previewFiles"> -->
    <button
      type="button"
      class="btn btn-primary"
      @click="$refs.inputUpload.click()"
    >
      YML Upload
    </button>
    <input
      v-show="false"
      ref="inputUpload"
      type="file"
      @change="previewFiles"
    />
  </div>
</template>

<script>
import jsyaml from 'js-yaml';
import YAMLStorage, { getPureFileName } from '../lib/YAMLStorage.js';

export default {
  name: 'pipeline_input',
  props: {
    msg: String,
  },
  data() {
    return {
      files: [],
      yml_json: '',
    };
  },
  methods: {
    previewFiles(event) {
      this.files = this.$refs.inputUpload.files[0];
      const filepath = this.$refs.inputUpload.value;
      var input = event.target;
      var reader = new FileReader();
      var self = this;
      reader.onload = function(e) {
        var text = reader.result;
        this.yml_json = jsyaml.load(text);
        console.log(self.$refs.inputUpload.value, reader.result);

        YAMLStorage.save(getPureFileName(filepath), this.yml_json);

        self.$router.push({
          name: 'mgmt_main',
          params: { yml_json: this.yml_json },
        });
      };

      reader.readAsText(input.files[0]);
    },
  },
};
</script>
