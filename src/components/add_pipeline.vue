<template>
	<div>
		<b-button @click="pipeline_type='vue'" :variant="pipeline_type=='vue'? 'success':'outline-success'">Vue</b-button>&nbsp
		<b-button @click="pipeline_type='maven'" :variant="pipeline_type=='maven'? 'success':'outline-success'">Maven</b-button>&nbsp
		<b-button @click="pipeline_type='go'" :variant="pipeline_type=='go'? 'success':'outline-success'">Go</b-button>&nbsp
		<b-button @click="pipeline_type='python'" :variant="pipeline_type=='python'? 'success':'outline-success'">Python</b-button>
		<br><br>
		<b-button v-b-toggle.collapse-1 variant="success" v-for="(item,index) in show_data" :key="index" style="margin-right:15px;" @click="job_name_setting(index)">
			{{typeof(item[0])=='object'? 'Roll-back&close':item.name}}
		</b-button>

		<!-- name setting 다이얼로그 -->
		<b-modal v-model="name_setting_dialog" title="Job Name Setting" hide-footer>
			<h3>Job Name</h3>
			<b-form-input v-model="job_name"></b-form-input>
			<b-button class="mt-2" variant="outline-success" block @click="name_ok">OK</b-button>
		</b-modal>
		<!-- name setting 다이얼로그 끝-->
		<!-- resource setting 다이얼로그 -->
		<b-modal v-model="resource_setting_dialog" title="Resource Name Setting" hide-footer>
			<div v-for="(item,index) in need_resource" :key="index">
				<h3>{{item}}</h3>
				<b-form-input v-model="resrouce_names[index]"></b-form-input>
			</div>
				<b-button class="mt-2" variant="outline-success" block @click="resource_check">OK</b-button>
		</b-modal>
		<!-- resource setting 다이얼로그 끝-->
	</div>
</template>

<script>
import vue_pipeline_job from '../assets/pipeline_json/vue_pipeline_job.json'
import vue_pipeline_resource from '../assets/pipeline_json/vue_pipeline_resource.json'
import maven_pipeline_job from '../assets/pipeline_json/maven_pipeline_job.json'
import maven_pipeline_resource from '../assets/pipeline_json/maven_pipeline_resource.json'
export default {
	name: 'show_pipeline',
	data() {
		return {
			pipeline_type:'vue',
			show_data:'',
			show_resource:'',
			vue_pipeline_job:vue_pipeline_job,
			vue_pipeline_resource:vue_pipeline_resource,
			maven_pipeline_job:maven_pipeline_job,
			maven_pipeline_resource:maven_pipeline_resource,
			need_resource:[],
			resrouce_names:[],
			send_data:'',
			now_index:'',
			job_name:'',
			name_setting_dialog:false,
			resource_setting_dialog:false,
		}
	},
	created(){
		this.show_data=this.vue_pipeline_job
		this.show_resource=this.vue_pipeline_resource
		console.log(this.vue_pipeline_job)
		console.log(this.show_data)
	},
	watch:{
		pipeline_type(){
			if(this.pipeline_type=='vue'){
				this.show_data=this.vue_pipeline_job
				this.show_resource=this.vue_pipeline_resource
			}
			else if(this.pipeline_type=='maven'){
				console.log("rrrr")
				this.show_data=this.maven_pipeline_job
				this.show_resource=this.maven_pipeline_resource
			}
			else{
				this.show_data=''
				this.show_resource=''
			}
			// else if(this.show_data=='spring')
			// 	this.show_data=this.vue_pipeline_sample
		},

	},
	methods: {
		job_name_setting(index){
			this.now_index=index
			this.name_setting_dialog=true
		},
		resource_setting(temp){
			//고쳐야할 리소스 찾는부분
			this.need_resource=[]
			if(typeof(temp[0])=='object'){
				for(let k=0;k<temp.length;k++){
					var temp2=temp[k]
					for(let i=0;i<temp2.plan.length;i++){
						//aggrrgate 검사
						if(i==0){
							for(let j=0;j<temp2.plan[0].aggregate.length;j++){
								this.need_resource.push(temp2.plan[0].aggregate[j].resource)
							}
						}
						//뒤에 가져오는부분 검사
						else if(i>1){
							if(temp2.plan[i].resource != null)
								this.need_resource.push(temp2.plan[i].resource)
							else
								this.need_resource.push(temp2.plan[i].put)
							if(temp2.plan[i].on_success != null)
								this.need_resource.push(temp2.plan[i].on_success.put)
							if(temp2.plan[i].on_failure != null)
								this.need_resource.push(temp2.plan[i].on_failure.put)
						}

					}
				}
			}
			else{
				for(let i=0;i<temp.plan.length;i++){
					//aggrrgate 검사
					if(i==0){
						for(let j=0;j<temp.plan[0].aggregate.length;j++){
							this.need_resource.push(temp.plan[0].aggregate[j].resource)
						}
					}
					//뒤에 가져오는부분 검사
					else if(i>1){
						if(temp.plan[i].resource != null)
							this.need_resource.push(temp.plan[i].resource)
						else
							this.need_resource.push(temp.plan[i].put)
						if(temp.plan[i].on_success != null)
							this.need_resource.push(temp.plan[i].on_success.put)
						if(temp.plan[i].on_failure != null)
							this.need_resource.push(temp.plan[i].on_failure.put)
					}

				}

			}
			//중복제거
			this.need_resource = this.need_resource.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
			
			this.resource_setting_dialog=true

		},
		name_ok(){
			this.send_data=JSON.parse(JSON.stringify(this.show_data[this.now_index]));
			if(typeof(this.send_data[0])=='object'){
				this.send_data[0].name = this.job_name + '_roleback'
				this.send_data[1].name = this.job_name + '_close'
			}
			else{
				this.send_data.name = this.job_name
			}
			this.resource_setting(this.send_data);
		},
		resource_check(){
			for(var i = 0; i < this.resrouce_names.length; i++){
				for(var j = i+1; j < this.resrouce_names.length ; j++){
					if(this.resrouce_names[i] == this.resrouce_names[j]){
						alert("resource name에 중복되는 값이 있습니다");
						return false;
						break
					}
				}
			}
			this.resource_ok();
		},
		resource_ok(){
			var temp = JSON.parse(JSON.stringify(this.send_data));
			var temp_resource = JSON.parse(JSON.stringify(this.show_resource));
			var self=this
			//job에 있는 리소스 네임 수정하는부분
			if(typeof(temp[0])=='object'){
				for(let k=0;k<temp.length;k++){
					var temp2=temp[k]
					for(let i=0;i<temp2.plan.length;i++){
						//aggrrgate 네임변경
						if(i==0){
							for(let j=0;j<temp2.plan[0].aggregate.length;j++){
								this.need_resource.forEach(function(item,idx){
									if(temp2.plan[0].aggregate[j].resource == item)
										temp2.plan[0].aggregate[j].resource = self.resrouce_names[idx]
								})
							}
						}
						//직접명령어 부분
						else if(i==1){
							if(temp2.plan[i].on_failure != null){
								this.need_resource.forEach(function(item,idx){
									if(temp2.plan[i].on_failure.put == item)
										temp2.plan[i].on_failure.put = self.resrouce_names[idx]
								})							
							}
							if(temp2.plan[i].on_success != null){
								this.need_resource.forEach(function(item,idx){
									if(temp2.plan[i].on_success.put == item)
										temp2.plan[i].on_success.put = self.resrouce_names[idx]
								})
							}
						}
						//뒤에 가져오는부분 네임변경
						else if(i>1){
							
							if(temp2.plan[i].resource != null){
								this.need_resource.forEach(function(item,idx){
									if(temp2.plan[i].resource == item)
										temp2.plan[i].resource = self.resrouce_names[idx]
								})
							}

							else{
								this.need_resource.forEach(function(item,idx){
									if(temp2.plan[i].put == item)
										temp2.plan[i].put = self.resrouce_names[idx]
								})
							}
							if(temp2.plan[i].on_success != null){
								this.need_resource.forEach(function(item,idx){
									if(temp2.plan[i].on_success.put == item)
										temp2.plan[i].on_success.put = self.resrouce_names[idx]
								})
							}
							if(temp2.plan[i].on_failure != null){
								this.need_resource.forEach(function(item,idx){
									if(temp2.plan[i].on_failure.put == item)
										temp2.plan[i].on_failure.put = self.resrouce_names[idx]
								})
							}
						}

					}
					temp[k]=temp2
				}
			}
			else{
				for(let i=0;i<temp.plan.length;i++){
					//aggrrgate 네임변경
					if(i==0){
						for(let j=0;j<temp.plan[0].aggregate.length;j++){
							this.need_resource.forEach(function(item,idx){
								if(temp.plan[0].aggregate[j].resource == item)
									temp.plan[0].aggregate[j].resource = self.resrouce_names[idx]
							})
						}
					}
					//직접명령어 부분
					else if(i==1){
						if(temp.plan[i].on_failure != null){
							this.need_resource.forEach(function(item,idx){
								if(temp.plan[i].on_failure.put == item)
									temp.plan[i].on_failure.put = self.resrouce_names[idx]
							})							
						}
						if(temp.plan[i].on_success != null){
							this.need_resource.forEach(function(item,idx){
								if(temp.plan[i].on_success.put == item)
									temp.plan[i].on_success.put = self.resrouce_names[idx]
							})
						}
					}
					//뒤에 가져오는부분 네임변경
					else if(i>1){
						
						if(temp.plan[i].resource != null){
							this.need_resource.forEach(function(item,idx){
								if(temp.plan[i].resource == item)
									temp.plan[i].resource = self.resrouce_names[idx]
							})
						}

						else{
							this.need_resource.forEach(function(item,idx){
								if(temp.plan[i].put == item)
									temp.plan[i].put = self.resrouce_names[idx]
							})
						}
						if(temp.plan[i].on_success != null){
							this.need_resource.forEach(function(item,idx){
								if(temp.plan[i].on_success.put == item)
									temp.plan[i].on_success.put = self.resrouce_names[idx]
							})
						}
						if(temp.plan[i].on_failure != null){
							this.need_resource.forEach(function(item,idx){
								if(temp.plan[i].on_failure.put == item)
									temp.plan[i].on_failure.put = self.resrouce_names[idx]
							})
						}
					}

				}

			}
			var resource_temp=[]
			//resource의 네임을 수정한 후 불러오는 부분
			for(let i=0;i<temp_resource.length;i++){
				this.need_resource.forEach(function(item,idx){
					console.log(temp_resource[i].name +  ' === ' + item)
					if(temp_resource[i].name == item){
						temp_resource[i].name = self.resrouce_names[idx]
						resource_temp.push(temp_resource[i])
					}

				})
			}
			
			console.log(resource_temp)
			var add_data ={
				job:temp,
				resources:resource_temp
			}
			this.need_resource=[]
			this.temp_resource=''
			temp=''

			this.$router.push({ name: 'pipeline_mgmt', params: { add_data: add_data }})
		}
	}
}
</script>