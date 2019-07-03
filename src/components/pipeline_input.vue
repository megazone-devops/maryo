<template>
  <div class="hello">
    <!-- <input type="file" id="file" ref="myFiles" class="custom-file-input" style="width:300px;height:80px;border:1px solid black;" @change="previewFiles"> -->
    <button type="button" class="btn btn-primary" @click="$refs.inputUpload.click()">YML Upload</button>
  <input v-show="false" ref="inputUpload" type="file" @change="previewFiles" >
  </div>
</template>

<script>
import jsyaml from 'js-yaml'
export default {
  name: 'pipeline_input',
  props: {
    msg: String
  },
  data() {
    return {
      files: [],
      pipeline_yml:''
    }
  },
  methods: {
    previewFiles(event) {
      this.files = this.$refs.inputUpload.files[0]    
      var input = event.target;
      var reader = new FileReader();
      var self = this
      reader.onload = function () {
          
          var text = reader.result;
          this.pipeline_yml=jsyaml.load(text)
          self.$router.push({ name: 'pipeline_mgmt', params: { pipeline_yml: this.pipeline_yml }})
      };
      reader.readAsText(input.files[0]);
      
    }
  }
}
</script>
