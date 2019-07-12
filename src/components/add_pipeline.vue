<template>
	<div>
		<b-button @click="pipeline_type='vue'" :variant="pipeline_type=='vue'? 'success':'outline-success'">Vue</b-button>&nbsp
		<b-button @click="pipeline_type='spring'" :variant="pipeline_type=='spring'? 'success':'outline-success'">Spring</b-button>&nbsp
		<b-button @click="pipeline_type='go'" :variant="pipeline_type=='go'? 'success':'outline-success'">Go</b-button>&nbsp
		<b-button @click="pipeline_type='python'" :variant="pipeline_type=='python'? 'success':'outline-success'">Python</b-button>
		<div>
				{{abc}}
		</div>
	</div>
</template>

<script>
import vue_pipeline_sample from '../assets/pipeline_json/vue_pipeline_sample.json'
export default {
	name: 'show_pipeline',
	data() {
		return {
			pipeline_type:'vue',
			vue_pipeline_sample:vue_pipeline_sample,
		}
	},
	created(){
	},
	methods: {
	}
}
</script>