<template>
	<div>
    <!-- 박스 그려주는 부분 -->
		<!-- resource 부분 -->
		<h1>
			RESOURCES
		</h1>
		<h2>
			<b-badge variant="success" class="resourcePosition" v-for="(item, index) in pipeline_resources" :key="index" style="cursor:pointer;" :item="item" @click="resource_info(index)">{{item.name}}</b-badge>
		</h2>
		<!-- pipeline 부분 -->
		<h1 class="topGrayLine"> 
			PIPE LINE
		</h1>
		<draggable v-model="pipeline_jobs" ghost-class="ghost" group="pipeline" :move="checkMove" @start="drag=true" @end="drag=false">
			<div v-for="(item,index) in pipeline_jobs" :key="index" style="float:left;position:relative;cursor:pointer;" @mouseover="job_mouseover(index)" @mouseleave="job_mouseleave(index)" >
				<div v-if="item.length>1">
					<div style="width:140px;height:50px">
						<div v-if="index!=0" class="splitLineSize" :style="passed_pipeline[index][0]=='not'? 'border:3px solid green;':'border:3px solid red;'">
						</div>
						<div class="splitBoxSize" @click="showInfo(index)">
						<br>{{item[0].name}}
						</div>
						<div v-if="index!=0" class="splitLineSize" :style="passed_pipeline[index][1]=='not'? 'border:3px solid green;':'border:3px solid red;'">
						</div>
						<div class="splitBoxSize" @click="showInfo(index)">
							<br>{{item[1].name}}
						</div>
					</div>
					</div>
				<div v-else>
					<div v-if="index!=0" class="fullLineSize" :style="passed_pipeline[index]=='not'? 'border:3px solid green;':'border:3px solid red;'">
					</div>
					<div class="fullBoxSize"  @click="showInfo(index)">
						<br>{{item.name}}
					</div>
				</div>
				<b-badge v-if="index==deleteIndex" variant="danger" class="jobDelete" @click="delete_job(index)">Delete</b-badge>
				<b-badge v-if="typeof(passed_pipeline[index])=='string' && passed_pipeline[index] != 'not'" variant="primary" class="jobLink" @click="link_job(index)">Link</b-badge>
				<b-badge v-if="typeof(passed_pipeline[index])=='object' && (passed_pipeline[index][0] != 'not' || passed_pipeline[index][1] != 'not')" variant="primary" class="jobLink" @click="link_job(index)">Link</b-badge>
			</div>
			
		</draggable>
		<div class="addBoxSize" @click="add_pipeline">
			<br><br>+
		</div>
		<!-- 버튼부분 -->
		<button type="button" class="btn btn-primary" @click="exportYml" style="float:right;">export data</button>
		<!-- job info 다이얼로그 -->
		<b-modal v-model="pipeline_info_dialog" title="Job" ok-only>
			<div v-if="pipeline_jobs[now_pipeline_index].name != null">
				<h1>{{pipeline_jobs[now_pipeline_index].name}}</h1>
				<h2>Aggregate</h2>
				<h3>
					<b-badge variant="success" v-for="item in pipeline_jobs[now_pipeline_index].plan[0].aggregate" :key="item.get" style="margin-right:15px;">{{item.get}}</b-badge>
				</h3>
				<div v-if="pipeline_jobs[now_pipeline_index].plan.length>1">
				<h2>Image resource</h2>
				<h3>
					<b-badge variant="success" v-if="pipeline_jobs[now_pipeline_index].plan[1].config.image_resource.type" style="margin-right:15px;">type : {{pipeline_jobs[now_pipeline_index].plan[1].config.image_resource.type}}</b-badge>
					<b-badge variant="success" v-for="source in Object.keys(pipeline_jobs[now_pipeline_index].plan[1].config.image_resource.source)" :key="source" style="margin-right:15px;">{{source}} : {{pipeline_jobs[now_pipeline_index].plan[1].config.image_resource.source[source]}}</b-badge>
				</h3>
				<h2>Run</h2>
					<b-form-textarea
					id="textarea"
					v-model="pipeline_jobs[now_pipeline_index].plan[1].config.run.args"
					rows="7"
					disabled
					></b-form-textarea>
				</div>
				<h2>Resources</h2>
				<h3 v-for="(item, index) in pipeline_jobs[now_pipeline_index].plan" :key="item.get">
					<b-badge v-if="index!=0 && index!=1" variant="success"  style="margin-right:15px;">{{item.put}}</b-badge>
				</h3>
			</div>
			<div v-else v-for="item in pipeline_jobs[now_pipeline_index]">
				<h1>{{item.name}}</h1>
				<h3>Aggregate</h3>
				<h4>
					<b-badge variant="success" v-for="item in item.plan[0].aggregate" :key="item.get" style="margin-right:15px;">{{item.get}}</b-badge>
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
					<b-badge v-if="index!=0 && index!=1" variant="success"  style="margin-right:15px;">{{item.put}}</b-badge>
				</h4>
			</div>
			

		</b-modal>
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

		<!-- link 다이얼로그 -->
		<b-modal v-model="link_dialog" title="Link" hide-footer>
			<div v-for="(item,index) in passed_pipeline[passed_index]" :key="index">
				<div v-if="typeof(item)=='object'">
					<h2>{{pipeline_jobs[passed_index][index].name}}</h2>
					<div v-for="(item2, index2) in item" :key="index2">
						<br><h5>{{pipeline_jobs[passed_index][index].plan[0].aggregate[item2].resource}}</h5>
						<b-form-checkbox v-model="passed_check_double[index][index2]" name="check-button" switch>
								<b>Passed: {{ passed_check_double[index][index2]? passed_check_double[index][index2]:'false' }}</b>
						</b-form-checkbox>
							<b-form-checkbox v-model="trigger_check_double[index][index2]" name="check-button" switch>
								<b>Trigger: {{ trigger_check_double[index][index2]? trigger_check_double[index][index2]:'false' }}</b>
						</b-form-checkbox>
					</div>
				</div>
				<div v-else-if="typeof(item)=='number'">
					<h2 v-if="index==0">{{pipeline_jobs[passed_index].name}}</h2>
					<br><h5>{{pipeline_jobs[passed_index].plan[0].aggregate[item].resource}}</h5>
					<b-form-checkbox v-model="passed_check[index]" name="check-button" switch>
						<b>Passed: {{ passed_check[index]? passed_check[index]:'false' }}</b>
					</b-form-checkbox>
					<b-form-checkbox v-model="trigger_check[index]" name="check-button" switch>
						<b>Trigger: {{ trigger_check[index]? trigger_check[index]:'false' }}</b>
					</b-form-checkbox>
				</div>
			</div>
			<!-- <b-button class="mt-3" block @click="$bvModal.hide('bv-modal-example')">Close Me</b-button> -->
			<b-button class="mt-2" variant="outline-success" block @click="save_pass(passed_index)">SAVE</b-button>
		</b-modal>
		<!-- link 다이얼로그 끝-->
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
	  pipeline_name:'',
	  load_pipeline_deck:[],
	  checkBox:[],
	  name_dialog:false,
	  resource_info_dialog:false,
	  pipeline_info_dialog:false,
	  resource_backup:'',
	  link_dialog:false,
	  now_pipeline_index:0,
	  now_resource_index:0,
	  move_before_index:0,
	  move_after_index:0,
	  move_flag:false,
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
		if(this.move_flag){
			this.arr_swap();
			var index_list=[]
			index_list=[this.move_after_index,this.move_after_index+1]
			if(this.move_before_index>this.move_after_index&&this.move_before_index+1<=this.passed_pipeline.length){
				if(this.move_after_index==0){
					index_list.splice(0,1)
					this.remove_resource_link(this.move_after_index)
				}
				if(this.move_after_index!=this.passed_pipeline.length-2){
					index_list.push(this.move_before_index+1)
				}
			}else {
				if(this.move_after_index==this.passed_pipeline.length-1 ){
					index_list.splice(1,1)
				}
				else{
					index_list.push(this.move_before_index)
				}
			}
			for(let i=0;i<index_list.length;i++){
				var num = index_list[i]
				this.remove_resource_link(num)
				//여러개짜리 검사
				if(this.pipeline_jobs[num-1].length>1){
					this.passed_pipeline[num] =this.pipeline_passed_check(num,'before');
				}else if(this.pipeline_jobs[num].length>1){
					this.passed_pipeline[num] = this.pipeline_passed_check(num,'after');
				}else{
					this.passed_pipeline[num] = this.pipeline_passed_check(num);
				}
				//1개짜리 검사
			}
			//passed가 필요한지

			//passed가 필요하지 않은지

		}
	  },
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

	//add부분에서 넘어온 데이터가 있는지 체크 
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
		if(typeof(add_data.job[0])=='object'){
			var front_name=''
			if(typeof(this.pipeline_jobs[this.pipeline_jobs.length-1])=='object')
				front_name='cloes'
			else
				front_name=this.pipeline_jobs[this.pipeline_jobs.length-1].name
			for(let i=0;i<add_data.job.length;i++){
				for(let j=0;j<add_data.job[i].plan[0].aggregate.length;j++){
					if(add_data.job[i].plan[0].aggregate[j].get=='repo'){
						add_data.job[i].plan[0].aggregate[j]['passed'] = [front_name]
					}
				}
			}
		}
		//job과 리소스추가부분
		this.pipeline_jobs.push(add_data.job);
		for(let i=0;i<add_data.resources.length;i++){
			this.pipeline_resources.push(add_data.resources[i]);
		}
		//저장함수 호출
		this.now_pipeline_save();	
		this.first_setting();
		// localStorage.setItem("pipeline_json", JSON.stringify(this.pipeline_yml));
	}
  },
  methods: {
	first_setting(){
		var beforePassed=''
	
		for(let i=0;i<this.pipeline_jobs.length;i++){
			var plan = this.pipeline_jobs[i].plan[0]
			this.passed_pipeline[i] = 'not'
			for(let j=0;j<plan.aggregate.length;j++){
				//passed 찾기
				if(plan.aggregate[j].passed!=null){
					if(beforePassed==plan.aggregate[j].passed[0]){
						this.passed_pipeline[i-1] = ['not','not']
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
	boxCheck(index){
		var temp=this.checkBox[index]
		this.checkBox.splice(index, 1, !temp);
	},
	allCheck(){
		var flag=false
		var boxSize=this.checkBox.length
		for(let i=0;i<boxSize;i++){
			if(this.checkBox[i]==false){
				flag=true
				break;
			}
		}
		if(flag==true){
			for(let i=0; i<boxSize;i++){
				this.checkBox.splice(i, 1, true);
			}
		}else{
			for(let i=0; i<boxSize;i++){
				this.checkBox.splice(i, 1, false);
			}
		}
		
	},
	showInfo(index){
		this.now_pipeline_index=index
		this.pipeline_info_dialog=true
	},
	resource_info(index){
		this.now_resource_index=index
		this.resource_backup = JSON.parse(JSON.stringify(this.pipeline_resources[this.now_resource_index]));	
		this.resource_info_dialog=true
	},
	change_resource(){
		this.pipeline_resources[this.now_resource_index] = JSON.parse(JSON.stringify(this.resource_backup));
		this.resource_info_dialog= false;
	},
	change_resourceeqqqe(){
		var a =1
	},
	exportYml(){
		this.now_pipeline_save();
		var qq = this.pipeline_yml
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
		// console.log("dddd")
		// console.log(json2yaml(data));
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
		if(arr_position==null){
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
			return true
	},
	checkMove(e){
		this.move_before_index=e.draggedContext.index
		this.move_after_index=e.draggedContext.futureIndex
		
		this.move_flag=true
	},
	arr_swap(){
		var temp = this.passed_pipeline[this.move_before_index]
		this.passed_pipeline[this.move_before_index] = this.passed_pipeline[this.move_after_index]
		this.passed_pipeline[this.move_after_index] = temp
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
		// console.log(resource_arr)
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
					delete this.pipeline_jobs[index].plan[0].aggregate[i]['trigger']
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
						delete this.pipeline_jobs[index][j].plan[0].aggregate[i]['trigger']
					}
				}
			}
		}

	},
	link_job(index){
		this.link_dialog=true;
		this.passed_index=index;
	},
	save_pass(index){
		console.log(typeof(this.passed_pipeline[index][0]))
		//수정한대로 변경하는버튼
		if(typeof(this.passed_pipeline[index][0])=='number'){
			console.log(this.pipeline_jobs[index-1].name)
			for(let i=0;i<this.passed_check.length;i++){
				if(this.passed_check[i]==true){
					var res = this.passed_pipeline[index][i];
					console.log(typeof(this.passed_pipeline[index-1][0]))
					if(typeof(this.passed_pipeline[index-1][0])=='number'||typeof(this.passed_pipeline[index-1][0])=='string'){
						console.log("qqqqqq")
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
			console.log("notsingle")
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
						console.log(self.pipeline_jobs[index])
					}
				})
			})
		}

		//링크라고 표시버튼 지워주는부분
		if(typeof(this.passed_pipeline[index][0])=='number'){
			this.passed_pipeline[index]='not'
		}else{
			this.passed_pipeline[index]=['not','not']
		}
		this.link_dialog=false;
		this.passed_check=[]
		this.trigger_check=[]
		this.passed_check_double=[[],[]]
		this.trigger_check_double=[[],[]]
	},
	add_pipeline(){
		this.$router.push({ name: 'add_pipeline'})
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