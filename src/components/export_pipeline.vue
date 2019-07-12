<template>
  <div>
			  <b-form-textarea
				id="textarea"
				v-model="data"
				rows="30"
				disabled
				></b-form-textarea>
  </div>
</template>

<script>
export default {
  name: 'export_pipeline',
  data() {
    return {
      data:''
    }
  },
  created(){
    this.data = this.$route.params.export_pipeline
  },
  methods: {
  }
}
</script>