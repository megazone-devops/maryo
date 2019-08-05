<template>
	<div>
		<b-button @click="pipeline_type='vue'" :variant="pipeline_type=='vue'? 'success':'outline-success'">Vue</b-button>&nbsp
		<b-button @click="pipeline_type='maven'" :variant="pipeline_type=='maven'? 'success':'outline-success'">Maven</b-button>&nbsp
		<b-button @click="pipeline_type='go'" :variant="pipeline_type=='go'? 'success':'outline-success'">Go</b-button>&nbsp
		<b-button @click="pipeline_type='python'" :variant="pipeline_type=='python'? 'success':'outline-success'">Python</b-button>
		<br><br>
		<b-button v-b-toggle.collapse-1 variant="success" v-for="(item,index) in show_resource" :key="index" style="margin-right:15px;" @click="job_name_setting(index)">
			{{item.name}}
		</b-button>

		<!-- name setting 다이얼로그 -->
		<b-modal v-model="name_setting_dialog" title="Job Name Setting" hide-footer>
			<h3>Resource Name</h3>
			<b-form-input v-model="resource_name"></b-form-input>
			<b-button class="mt-2" variant="outline-success" block @click="resource_ok">OK</b-button>
		</b-modal>
		<!-- name setting 다이얼로그 끝-->
	</div>
</template>

<script>
import vue_pipeline_resource from '../assets/resources_json/vue_pipeline_resource.json'
import maven_pipeline_resource from '../assets/resources_json/maven_pipeline_resource.json'
export default {
	name: 'show_pipeline',
	data() {
		return {
			pipeline_type:'vue',
			show_resource:'',
			vue_pipeline_resource:vue_pipeline_resource,
			maven_pipeline_resource:maven_pipeline_resource,
			send_data:'',
			now_index:'',
			resource_name:'',
			name_setting_dialog:false,
		}
	},
	created(){
		this.show_resource=this.vue_pipeline_resource
	},
	watch:{
		pipeline_type(){
			if(this.pipeline_type=='vue')
				this.show_resource=this.vue_pipeline_resource

			else if(this.pipeline_type=='maven')
				this.show_resource=this.maven_pipeline_resource

			else
				this.show_resource=''
			
			// else if(this.show_data=='spring')
			// 	this.show_data=this.vue_pipeline_sample
		},

	},
	methods: {
		job_name_setting(index){
			this.now_index=index
			this.resource_name=''
			this.name_setting_dialog=true
		},
		resource_ok(index){
			var send_resource = JSON.parse(JSON.stringify(this.show_resource[this.now_index]));
			console.log(send_resource)
			send_resource.name = this.resource_name

			this.$router.push({ name: 'pipeline_mgmt', params: { send_resource: send_resource }})
		}
	}
}
</script>