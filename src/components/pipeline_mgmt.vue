<template>
	<div>
    <!-- 박스 그려주는 부분 -->
		<!-- resource 부분 -->
		<div>
		<h1>
			RESOURCES
		</h1>
		<h2 style="display:inline-block;">
			<b-badge variant="success" class="resourcePosition" v-for="(item, index) in pipeline_resources" :key="index" style="cursor:pointer;" :item="item" @click="resource_info(index)">{{item.name}}</b-badge>
		</h2>
		<br>
		<h1>
			ADD RESOURCES
		</h1>
		<h2>
			<b-badge variant="primary" class="resourcePosition" v-for="(item, index) in add_resources" :key="index" style="cursor:pointer;" :item="item" @click="add_resource_info(index)">{{item.name}}</b-badge>
			<b-badge variant="primary" class="resourcePosition"  style="cursor:pointer;"  @click="add_resource">ADD RESOURCE +</b-badge>
			<b-badge variant="danger" class="resourcePosition"  style="cursor:pointer;"  @click="add_resource_delete">ALL DELETE</b-badge>
		</h2>
		<!-- pipeline 부분 -->
		<h1 class="topGrayLine"> 
			PIPE LINE
		</h1>
		<draggable v-model="pipeline_jobs" ghost-class="ghost" group="pipeline" @start="drag=true" @end="job_change">
			<div v-for="(item,index) in pipeline_jobs" :key="index" style="float:left;position:relative;cursor:pointer;" @mouseover="job_mouseover(index)" @mouseleave="job_mouseleave(index)" >
				<div v-if="item.length>1">
					<div style="width:140px;height:50px">
						<div v-if="index!=0" class="splitLineSize" :style="passed_pipeline[index][0]=='not'? 'border:3px solid green;':'border:3px solid green;'">
						</div>
						<div class="splitBoxSize" @click="showInfo(index)">
						<br>{{item[0].name}}
						</div>
						<div v-if="index!=0" class="splitLineSize" :style="passed_pipeline[index][1]=='not'? 'border:3px solid green;':'border:3px solid green;'">
						</div>
						<div class="splitBoxSize" @click="showInfo(index)">
							<br>{{item[1].name}}
						</div>
					</div>
					</div>
				<div v-else>
					<div v-if="index!=0" class="fullLineSize" :style="passed_pipeline[index]=='not'? 'border:3px solid green;':'border:3px solid green;'">
					</div>
					<div class="fullBoxSize"  @click="showInfo(index)">
						<br>{{item.name}}
					</div>
				</div>
				<b-badge v-if="index==deleteIndex" variant="danger" class="jobDelete" @click="delete_job(index)">Delete</b-badge>
				<!-- <b-badge v-if="typeof(passed_pipeline[index])=='string' && passed_pipeline[index] != 'not'" variant="primary" class="jobLink" @click="link_job(index)">Link</b-badge>
				<b-badge v-if="typeof(passed_pipeline[index])=='object' && (passed_pipeline[index][0] != 'not' || passed_pipeline[index][1] != 'not')" variant="primary" class="jobLink" @click="link_job(index)">Link</b-badge> -->
			</div>
			
		</draggable>
		<div class="addBoxSize" @click="add_pipeline">
			<br><br>+
		</div>


		</div>
		
		<!-- 버튼부분 -->
		<button type="button" class="btn btn-primary" @click="exportYml" style="float:right;">export data</button>
		<!-- job info 다이얼로그 -->
		<vue-window-modal  :active="pipeline_info_dialog"  title="Job" style="left:40%;top:10%;overflow-y:auto;overflow-x:hidden;" v-on:clickClose="pipeline_info_dialog=false">
    			<div v-if="job_backup.name != null">
				<h1>{{job_backup.name}}</h1>
				<h2>Aggregate</h2>
				<h3>
					<draggable
						class="dragArea list-group"
						:list="job_backup.plan[0].aggregate"
						group="resources"
						@change="aggregate_change"
					>
						<div v-for="item in job_backup.plan[0].aggregate" :key="item.get">
							<b-badge variant="success"  style="margin-right:15px;">{{item.get? item.get:item.name}} : {{item.resource? item.resource:item.name}}</b-badge>
							<br>
							<b-form-checkbox v-if="item.passed!=null" v-model="item.passed" name="check-button" switch>
								<b>Passed: {{ item.passed!=null? item.passed: 'false'}}</b>
							</b-form-checkbox>
							<b-form-checkbox v-model="item.trigger" name="check-button" switch>
								<b>Trigger: {{ item.trigger!=null? item.trigger : 'false'}}</b>
							</b-form-checkbox>
						</div>
					</draggable>
				</h3>
				<div v-if="job_backup.plan.length>1">
				<h2>Image resource</h2>
				<h3>
					<b-badge variant="success" v-if="job_backup.plan[1].config.image_resource.type" style="margin-right:15px;">type : {{job_backup.plan[1].config.image_resource.type}}</b-badge>
					<b-badge variant="success" v-for="source in Object.keys(job_backup.plan[1].config.image_resource.source)" :key="source" style="margin-right:15px;">{{source}} : {{job_backup.plan[1].config.image_resource.source[source]}}</b-badge>
				</h3>
				<h2>Run</h2>
					<b-form-textarea
					id="textarea"
					v-model="job_backup.plan[1].config.run.args"
					rows="7"
					disabled
					></b-form-textarea>
				</div>
				<h2>Resources</h2>
				<draggable
						class="dragArea list-group"
						:list="job_backup.plan"
						group="resources"
						@change="put_change"
					>
					<h3 v-for="(item, index) in job_backup.plan" :key="item.get">
						<div v-if="index>1">
							<b-badge  variant="success"  style="margin-right:15px;">{{item.put? item.put:item.name}}</b-badge>
							<div v-if="item.params">
								<div v-for="item2 in Object.keys(item.params)" style="width:100%;">
									<br><h6><b-row><b-col sm="5" stlye="text-align:left;">{{item2}} : </b-col><b-col sm="7"><b-form-input v-model="item.params[item2]" style="height:20px;"></b-form-input></b-col></b-row></h6>
								</div>				
							</div>
						</div>
					</h3>
				</draggable>
			</div>
			<div v-else v-for="item in job_backup">
				<h1>{{item.name}}</h1>
				<h3>Aggregate</h3>
				<h4>
					<div v-for="item in item.plan[0].aggregate" :key="item.get">
						<b-badge variant="success" style="margin-right:15px;">{{item.get}} : {{item.resource}}</b-badge>
						<b-form-checkbox v-if="item.passed!=null" v-model="item.passed" name="check-button" switch>
							<b>Passed: {{ item.passed!=null? item.passed: 'false'}}</b>
						</b-form-checkbox>
						<b-form-checkbox v-model="item.trigger" name="check-button" switch>
							<b>Trigger: {{ item.trigger!=null? item.trigger : 'false'}}</b>
						</b-form-checkbox>
					</div>
				</h4>
				<div v-if="item.plan.length>1">
				<h3>Image resource</h3>
				<h4>
					<b-badge variant="success" v-if="item.plan[1].config.image_resource.type" style="margin-right:15px;">type : {{item.plan[1].config.image_resource.type}}</b-badge>
					<b-badge variant="success" v-for="source in Object.keys(item.plan[1].config.image_resource.source)" :key="source" style="margin-right:15px;">{{source}} : {{item.plan[1].config.image_resource.source[source]}}</b-badge>
				</h4>
				<h3>Run</h3>
					<b-form-textarea
					id="textarea"
					v-model="item.plan[1].config.run.args"
					rows="7"
					disabled
					></b-form-textarea>
				</div>
				<h3>Resources</h3>
				<h4 v-for="(item, index) in item.plan" :key="item.get">
					<div v-if="index>1">
						<b-badge  variant="success"  style="margin-right:15px;">{{item.put}}</b-badge>
						<div v-if="item.params">
							<div v-for="item2 in Object.keys(item.params)" style="width:100%;">
								<h6><b-row><b-col sm="4">{{item2}} : </b-col><b-col sm="8"><b-form-input v-model="item.params[item2]" style="height:20px;"></b-form-input></b-col></b-row></h6>
							</div>				
						</div>
					</div>
				</h4>
			</div>
			
			<b-button class="mt-2" variant="outline-success" block @click="job_save(now_pipeline_index)">SAVE</b-button>
		</vue-window-modal>
		<vue-window-modal  :active="pipeline_info_dialog"  title="Client 2" style="left:10%;top:10%;width:300px;" v-on:clickClose="pipeline_info_dialog=false">
    						<div class="toast-body">
					<draggable
						class="dragArea list-group"
						:list="add_resources"
						:group="{ name: 'resources', pull: 'clone', put: false }"
						 @change="log"
					>
						<b-badge variant="success"  v-for="(item, index) in add_resources" :key="item.name" style="margin-bottom:15px;">{{item.name}}</b-badge>
				</draggable>
			</div>
		</vue-window-modal>
		{{pipeline_info_dialog}}
		<!-- <b-toast id="add_resource2" title="Job" static no-auto-hide style="position:absolute;top:20%;left:30%">
			
		</b-toast> -->
		<!-- job info 다이얼로그 끝 -->




		<!-- resource info 다이얼로그 -->
		<b-modal v-model="resource_info_dialog" title="Resource" hide-footer>
			<div v-for="item in Object.keys(resource_backup)">
				<div v-if="typeof(resource_backup[item])!='object'">
					<h3>{{item}} :</h3><b-form-input v-model="resource_backup[item]"></b-form-input>
				</div>
				<div v-else>
					<h3>{{item}} : </h3>
					<div v-for="item2 in Object.keys(resource_backup[item])">
					<h4>&nbsp;&nbsp;&nbsp;&nbsp;{{item2}} :</h4><b-form-input v-model="resource_backup[item][item2]"></b-form-input>
					</div>
				</div>
			</div>
			<b-button class="mt-2" variant="outline-success" block @click="change_resource()">SAVE</b-button>
		</b-modal>
		<!-- resource info 다이얼로그 끝-->
	</div>
</template>

<script>
import draggable from 'vuedraggable'
import json2yaml from 'json2yaml'
export default {
	name: 'pipeline_mgmt',
	props: {
	msg: String
	},
	components: {
		draggable,
	},
  data() {
	return {
		pipeline_yml:'',
		pipeline_jobs:'',
		pipeline_resources:'',
		add_resources:[],
		pipeline_name:'',
		load_pipeline_deck:[],
		checkBox:[],
		name_dialog:false,
		resource_info_dialog:false,
		pipeline_info_dialog:false,
		resource_backup:'',
		job_backup:'',
		link_dialog:false,
		now_pipeline_index:0,
		now_resource_index:0,
		passed_pipeline:[],
		passed_index:-1,
		deleteIndex:-1,
		passed_check:[],
		passed_check_double:[[],[]],
		trigger_check:[],
		trigger_check_double:[[],[]],
    }
  },
  watch:{
		pipeline_jobs(){
		// for(let i=0;i<this.pipeline_jobs.length;i++){
		// 	console.log(typeof(this.pipeline_jobs[i][0]))
		// }

		},
		now_aggregate(){
			console.log(this.now_aggregate)
		}
  },
  created(){
	if(this.$route.params.pipeline_yml){
		this.pipeline_yml=this.$route.params.pipeline_yml
		localStorage.setItem("pipeline_json", JSON.stringify(this.pipeline_yml));
	}else{
		this.pipeline_yml=JSON.parse(localStorage.getItem("pipeline_json"));
	}


	this.pipeline_jobs=this.pipeline_yml.jobs
	this.pipeline_resources=this.pipeline_yml.resources
	//최초 세팅 정리
	this.first_setting();

	//job add부분에서 넘어온 데이터가 있는지 체크 
	if(this.$route.params.add_data){
		
		var add_data = this.$route.params.add_data
		//resource 중복검사 부분
		for(let i=add_data.resources.length-1;i>=0;i--){
			for(let j=0;j<this.pipeline_resources.length;j++){
				if(add_data.resources[i].name==this.pipeline_resources[j].name){
					add_data.resources.splice(i,1)
					break;
				}	
			}
		}
		
		// if(typeof(add_data.job[0])=='object'){
		// 	var front_name=''
		// 	if(typeof(this.pipeline_jobs[this.pipeline_jobs.length-1])=='object')
		// 		front_name='cloes'
		// 	else
		// 		front_name=this.pipeline_jobs[this.pipeline_jobs.length-1].name
			
			
		// 	for(let i=0;i<add_data.job.length;i++){
		// 		console.log('1111111')
		// 		for(let j=0;j<add_data.job[i].plan[0].aggregate.length;j++){
		// 			console.log('222222222')
		// 			if(add_data.job[i].plan[0].aggregate[j].get=='repo'){
		// 				console.log('33333333')
		// 				add_data.job[i].plan[0].aggregate[j]['passed'] = [front_name]
		// 			}
		// 		}
		// 	}
		// }
		//job과 리소스추가부분
		this.pipeline_jobs.push(add_data.job);
		for(let i=0;i<add_data.resources.length;i++){
			this.pipeline_resources.push(add_data.resources[i]);
		}

	}

	if(localStorage.getItem("add_resource_json")!== 'undefined')
		this.add_resources=JSON.parse(localStorage.getItem("add_resource_json"));
		
	//resource add부분에서 넘어온 데이터가 있는지 체크 
	if(this.$route.params.send_resource){
		this.add_resources.push(this.$route.params.send_resource)
		localStorage.setItem("add_resource_json", JSON.stringify(this.add_resources));
	}


	this.all_passed_reset();
  },
  methods: {
	first_setting(){
		var beforePassed=''
		//2개짜리 배열 검사
		for(let i=0;i<this.pipeline_jobs.length;i++){
			var plan = this.pipeline_jobs[i].plan[0]
			this.passed_pipeline[i] = ''
			for(let j=0;j<plan.aggregate.length;j++){
				//passed 찾기
				if(plan.aggregate[j].passed!=null){
					if(beforePassed==plan.aggregate[j].passed[0]){
						this.passed_pipeline[i-1] = ['','']
						this.pipeline_jobs[i-1] = [this.pipeline_jobs[i-1],this.pipeline_jobs[i]]
						this.pipeline_jobs.splice(i,1)
						i= i-1;
					}else{
						beforePassed=plan.aggregate[j].passed[0]
					}
				}
			}        
		}	
	},
	job_change(e){
		//기존의 passed와 trigger을 끊어주는 부분
		this.remove_resource_link(e.newIndex);
		this.remove_resource_link(e.newIndex+1);
		if(e.oldIndex>e.newIndex)
			this.remove_resource_link(e.oldIndex+1);

		else
			this.remove_resource_link(e.oldIndex);
			
		this.all_passed_reset();
		this.drag=false;
	},
	aggregate_change(e){
		//기존의 passed와 trigger을 끊어주는 부분
		console.log(e)
		//내용에 추가하는부분
		if(e['added']){
			var temp = {
				'get': e['added']['element'].name,
				'resource': e['added']['element'].name
			}
			this.job_backup.plan[0].aggregate[e['added'].newIndex] = temp
			console.log(this.job_backup.plan[0].aggregate[e['added'].newIndex])
		}

		//기존의 리소스가 있는지 검사하는부분

		//없다면 리소스 추가
		this.all_passed_reset();
	},
	put_change(e){
		console.log(e)
		if(e['added']){
			var temp = {
				'put': e['added']['element'].name,
				'resource': e['added']['element'].name,
				'params': e['added']['element'].params
			}
			this.job_backup.plan[0].aggregate[e['added'].newIndex] = temp
		}
	},
	all_passed_reset(){
			for(let i=0;i<this.passed_pipeline.length;i++){
				this.passed_reset(i);
			}	
	},
	passed_reset(index){
		//두개짜리가 앞일때
		if(typeof(this.pipeline_jobs[index-1])=='object'&&this.pipeline_jobs[index-1].length&&this.pipeline_jobs[index-1].length>1){
			this.passed_pipeline[index] =this.pipeline_passed_check(index,'before');
		}
		//두개짜리가 뒤일때
		else if(typeof(this.pipeline_jobs[index])=='object'&&this.pipeline_jobs[index].length&&this.pipeline_jobs[index].length>1){
			this.passed_pipeline[index] = this.pipeline_passed_check(index,'after');
		}
		//걍 한개짜리일때
		else{
			this.passed_pipeline[index] = this.pipeline_passed_check(index);
		}
		
		
	},
	log: function(evt) {
      window.console.log(evt);
    },
	showInfo(index){
		this.now_pipeline_index=index
		this.job_backup=JSON.parse(JSON.stringify(this.pipeline_jobs[this.now_pipeline_index]));
		if(this.job_backup.plan){
			var rsc_data = this.job_backup.plan[0].aggregate;
			for(let i=0; i<rsc_data.length;i++){
				//이미 패스드 값이 존재하는지 확인
				if(typeof(rsc_data[i].passed)=='object'&&rsc_data[i].passed.length>0){
					rsc_data[i].passed=true
					continue;
				}
				delete rsc_data[i]['passed']
				//앞의 패스드와 연결되는지를 체크
				if(this.passed_pipeline[index]){
					for(let j=0;j<this.passed_pipeline[index].length;j++){
						if(i===this.passed_pipeline[index][j]){
							rsc_data[i]['passed']=false
							break;
						}
					}
				}
			}
		}else{
			for(let k=0;k<this.job_backup.length;k++){
				var rsc_data = this.job_backup[k].plan[0].aggregate;
				for(let i=0; i<rsc_data.length;i++){
					//패스드가 있으면 passed로
					if(typeof(rsc_data[i].passed)=='object'&&rsc_data[i].passed.length>0){
						rsc_data[i].passed=true
						continue;
					}
					delete rsc_data[i]['passed']
					//패스드가 없지만 인덱스넘버가 겹치면 nonpassed로
					if(this.passed_pipeline[index].length){
						for(let j=0;j<this.passed_pipeline[index].length;j++){
							if(i==this.passed_pipeline[index][j]){
								rsc_data[i]['passed']=false
								break;
							}
						}
					}

				}
			}
		}
		
		
		this.pipeline_info_dialog=true
	},
	job_save(index){
		if(this.job_backup.plan){
			var rsc_data = this.job_backup.plan[0].aggregate;
			for(let i=0; i<rsc_data.length;i++){
				if(rsc_data[i]==null){
					rsc_data.splice(i,1);
					console.log("123123123")
					continue;
				}
				//이미 패스드가 트루라면 앞의것과 연결
				if(rsc_data[i].passed != null&&rsc_data[i].passed==true){
						if(this.pipeline_jobs[index-1].name){
							rsc_data[i].passed=[this.pipeline_jobs[index-1].name]
							console.log(this.pipeline_jobs[index-1].name)
						}else{
							rsc_data[i].passed=['close']
						}
					continue;
				}
				//패스드가 펄스라면 패스드자체를 지워준다
				else if(rsc_data[i].passed != null &&rsc_data[i].passed==false){
					delete rsc_data[i]['passed']
					continue;
				}
			}
		}else{
			for(let k=0;k<this.job_backup.length;k++){
				var rsc_data = this.job_backup[k].plan[0].aggregate;
				for(let i=0; i<rsc_data.length;i++){
					//이미 패스드가 트루라면 앞의것과 연결
					if(rsc_data[i].passed&&rsc_data[i].passed==true){
						if(this.pipeline_jobs[index-1].name){
							rsc_data[i].passed=[this.pipeline_jobs[index-1].name]
						}else{
							rsc_data[i].passed=['close']
						}
						continue;
					}
					//패스드가 펄스라면 패스드자체를 지워준다
					else if(rsc_data[i].passed&&rsc_data[i].passed==false){
						delete rsc_data[i]['passed']
						continue;
					}
				}
			}
		}

		this.pipeline_jobs[index]=JSON.parse(JSON.stringify(this.job_backup));
		this.pipeline_info_dialog=false
	},
	resource_info(index){
		this.now_resource_index=index
		this.resource_backup = JSON.parse(JSON.stringify(this.pipeline_resources[this.now_resource_index]));	
		this.resource_info_dialog=true
	},
	add_resource_info(index){
		this.now_resource_index=index
		this.resource_backup = JSON.parse(JSON.stringify(this.add_resources[this.now_resource_index]));	
		this.resource_info_dialog=true
	},
	change_resource(){
		this.pipeline_resources[this.now_resource_index] = JSON.parse(JSON.stringify(this.resource_backup));
		this.resource_info_dialog= false;
	},
	exportYml(){
		this.now_pipeline_save();
		var qq = JSON.parse(JSON.stringify(this.pipeline_yml));
		var self = this
		console.log("rrrrr")
		(function () {
		"use strict";

		var YAML= require('json2yaml')
			, ymlText
			;
		
			ymlText = YAML.stringify(
			qq
			);
		
			console.log(ymlText);
			self.$router.push({ name: 'export_pipeline', params: { export_pipeline: ymlText }})
		}());
	},
	now_pipeline_save(){
		for(let i=0;i<this.pipeline_jobs.length;i++){
			if(typeof(this.pipeline_jobs[i][0])=='object')
				this.pipeline_jobs.splice(i,1,this.pipeline_jobs[i][0],this.pipeline_jobs[i][1])
		}
		this.pipeline_yml.jobs = this.pipeline_jobs
		this.pipeline_yml.resources = this.pipeline_resources
		localStorage.setItem("pipeline_json", JSON.stringify(this.pipeline_yml));
	},
	pipeline_passed_check(num,arr_position){
			var before = []
			var after = []
			var before2=[]
			var self = this
		if(num==0){
			return ''
		}
		else if(arr_position==null){
			before = this.pipeline_jobs[num-1].plan[0].aggregate
			after = this.pipeline_jobs[num].plan[0].aggregate
			
			if(this.pipeline_jobs[num-1].plan.length>2){
				this.pipeline_jobs[num-1].plan.forEach(function(item, index){
					if(index>1){
						before2.push(item)
					}
				})
			}
		}
		else if(arr_position=='before'){
			for(let i=0;i<this.pipeline_jobs[num-1].length;i++){
				if(this.pipeline_jobs[num-1][i].name=='close')
					before = this.pipeline_jobs[num-1][i].plan[0].aggregate

					if(this.pipeline_jobs[num-1][i].plan.length>2){
						this.pipeline_jobs[num-1][i].plan.forEach(function(item, index){
						if(index>1){
							before2.push(item)
						}
							
					})
				}
			}
			after = this.pipeline_jobs[num].plan[0].aggregate
			
		}
		else if(arr_position=='after'){
			before = this.pipeline_jobs[num-1].plan[0].aggregate
			if(this.pipeline_jobs[num-1].plan.length>2){
				this.pipeline_jobs[num-1].plan.forEach(function(item, index){
					
					if(index>1){
						before2.push(item)
					}
				})
			}
			after = [this.pipeline_jobs[num][0].plan[0].aggregate, this.pipeline_jobs[num][1].plan[0].aggregate]
		}
		before = before.concat(before2)		

		var value=[]
		if(arr_position=='after'){
			for(let i=0;i<after.length;i++){
				var value2=[]
				after[i].forEach(function(item, index){				
					before.forEach(function(item2, index2){
						if(item.resource == item2.resource || item.resource == item2.put){
							value2.push(index)
						}
							
					});
				});
				if(value2.lengt==0)
					value2=true

				value2 = value2.slice().sort(function(a,b){return a - b}).reduce(function(a,b){if (a.slice(-1)[0] !== b) a.push(b);return a;},[]);
				value.push(value2)
			}

		}else{
			after.forEach(function(item, index){
				before.forEach(function(item2, index2){
					if(item.resource == item2.resource || item.resource == item2.put)
						value.push(index)
				});
			});
			value = value.slice().sort(function(a,b){return a - b}).reduce(function(a,b){if (a.slice(-1)[0] !== b) a.push(b);return a;},[]);
		}

		if(value.length>0)
			return value
		else
			return ''
	},
	job_mouseover(index){
		this.deleteIndex=index
	},
	job_mouseleave(index){
		this.deleteIndex=-1
	},
	delete_job(index){
		var job = this.pipeline_jobs[index];
		var resource_arr=[]
		var resource_another=[]

		//가지고있는 resource검사
		if(job.length>1){
			for(let i =0;i<job.length;i++){
				resource_arr = this.find_resource(job[i],resource_arr)
			}
		}else{
			resource_arr = this.find_resource(job,resource_arr)
		}

		//중복제거
		resource_arr = resource_arr.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
		
		//다른 job에서 사용중인지 resource 검사
		for(let i=0;i<this.pipeline_jobs.length;i++){
			if(i!=index){
				if(this.pipeline_jobs[i].length>1){
					for(let j =0;j<this.pipeline_jobs[i].length;j++){
						resource_another = this.find_resource(this.pipeline_jobs[i][j],resource_another)
					}
				}else{
					resource_another = this.find_resource(this.pipeline_jobs[i],resource_another)
				}
			}
		}
		
		resource_another = resource_another.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
		
		var delete_arr = []
		for(let i=0;i<resource_arr.length;i++){
			for(let j=0;j<resource_another.length;j++){
				if(resource_arr[i]==resource_another[j]){
					delete_arr.push(i)			
					break;
				}
					
			}
		}
		//중복 삭제 부분
		for(let i=delete_arr.length-1; i>=0;i--){
			resource_arr.splice(delete_arr[i],1)	
		}
		//중복없는 resource 제거
		for(let i=0;i<resource_arr.length;i++){
			for(let j=0;j<this.pipeline_resources.length;j++){
				
				if(resource_arr[i]==this.pipeline_resources[j].name){
					this.pipeline_resources.splice(j,1)
				}
					
			}
		}

		//resource 제거
		this.passed_pipeline.splice(index,1)
		this.pipeline_jobs.splice(index,1)
		this.passed_reset(index)
		this.remove_resource_link(index);
	},
	find_resource(job,resource_arr){
		var resource=resource_arr
		for(let i=0;i<job.plan.length;i++){
			//aggregate 검사
			if(i==0){
				job.plan[i].aggregate.forEach(function(item, arr_index, array){
					if(item.resource!=null)
						resource.push(item.resource)
					else
						resource.push(item.get)
				});
			}
			//put검사
			else if(i>1){
				var item = job.plan[i]
					//리소스명 검사
					if(item.resource!=null)
						resource.push(item.resource)
					else
						resource.push(item.put)

					//on_success 검사
					if(item.on_success!=null)
						resource.push(item.on_success.put)
					//on_failure 검사
					if(item.on_failure!=null)
						resource.push(item.on_failure.put)
			}
		}
		return resource
	},
	remove_resource_link(index){
		if(this.pipeline_jobs[index].name != null){
			for(let i=0;i<this.pipeline_jobs[index].plan[0].aggregate.length;i++){
				if(this.pipeline_jobs[index].plan[0].aggregate[i].passed!=null){
					delete this.pipeline_jobs[index].plan[0].aggregate[i]['passed']					

				}
				if(this.pipeline_jobs[index].plan[0].aggregate[i].trigger!=null){
					this.pipeline_jobs[index].plan[0].aggregate[i]['trigger'] = false
				}
			}
		}
		else{
			for(let j=0;j<this.pipeline_jobs[index].length;j++){
				for(let i=0;i<this.pipeline_jobs[index][j].plan[0].aggregate.length;i++){
					if(this.pipeline_jobs[index][j].plan[0].aggregate[i].passed!=null){
						delete this.pipeline_jobs[index][j].plan[0].aggregate[i]['passed']
					}
					if(this.pipeline_jobs[index][j].plan[0].aggregate[i].trigger!=null){
						this.pipeline_jobs[index][j].plan[0].aggregate[i]['trigger'] = false
					}
				}
			}
		}
	},
	save_pass(index){
		//수정한대로 변경하는버튼
		if(typeof(this.passed_pipeline[index][0])=='number'){
			for(let i=0;i<this.passed_check.length;i++){
				if(this.passed_check[i]==true){
					var res = this.passed_pipeline[index][i];
					if(typeof(this.passed_pipeline[index-1][0])=='number'||typeof(this.passed_pipeline[index-1][0])=='string'){
						this.pipeline_jobs[index].plan[0].aggregate[res]['passed'] = [this.pipeline_jobs[index-1].name]
					}
					else{
						this.pipeline_jobs[index].plan[0].aggregate[res]['passed'] = ['close']
					}
				}
			}
			for(let i=0;i<this.trigger_check.length;i++){
				if(this.trigger_check[i]==true){
					var res = this.passed_pipeline[index][i]
					this.pipeline_jobs[index].plan[0].aggregate[res]['trigger'] = true
				}
			}
		}
		else{
			var self = this
			this.passed_check_double.forEach(function(item,idx){
				item.forEach(function(item2, idx2){
					if(item2==true){
						var res = self.passed_pipeline[index][idx][idx2]
						self.pipeline_jobs[index][idx].plan[0].aggregate[res]['passed'] = [self.pipeline_jobs[index-1].name]
					}
				})
			})
			this.trigger_check_double.forEach(function(item,idx){
				item.forEach(function(item2, idx2){
					if(item2==true){
						var res = self.passed_pipeline[index][idx][idx2]
						self.pipeline_jobs[index][idx].plan[0].aggregate[res]['trigger'] = true
					}
				})
			})
		}

		this.link_dialog=false;
		this.passed_check=[]
		this.trigger_check=[]
		this.passed_check_double=[[],[]]
		this.trigger_check_double=[[],[]]
	},
	add_pipeline(){
		this.now_pipeline_save();
		this.$router.push({ name: 'add_pipeline'})
	},
	add_resource(){
		this.now_pipeline_save();
		this.$router.push({ name: 'add_resource'})
	},
	add_resource_delete(){
		this.add_resources=[]
		localStorage.setItem("add_resource_json", JSON.stringify(this.add_resources));
	}
  }
}
</script>

<style>
.resourcePosition{
	margin-right:15px; float:left; margin-bottom:8px;
}
.topGrayLine{
	padding-top: 9px;margin: 40px 0 20px; border-top: 1px solid #eee;display: inline-block; width: 100%;
}
.splitLineSize{
	width:20px;height:0px;float:left;margin: 6px;margin-top: 20px; cursor:pointer;border:3px solid green
}
.splitBoxSize{
	width:100px;height:50px;border:1px solid black;float:left;text-align:center
}
.fullLineSize{
	width:20px;height:0px;float:left;margin: 6px;margin-top: 41px; cursor:pointer;border:3px solid green
}
.fullBoxSize{
	width:100px;height:100px;border:1px solid black;float:left;text-align:center
}
.addBoxSize{
	width:100px;height:100px;border:1px solid black; margin-left:20px;float:left;text-align:center;cursor:pointer
}
.b-toast{
	z-index:9999 !important;
}
.add_list_pop{
	width:200px;height:400px;background:red;z-index:9999 !important
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.jobDelete{
	position: absolute;
    top: -6px;
    right: -15px;
    cursor: pointer;
}
.jobLink{
	position: absolute;
    top: -6px;
    left: 23px;
    cursor: pointer;
}
</style>