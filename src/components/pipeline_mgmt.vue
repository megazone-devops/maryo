<template>
	<div>
    <!-- 박스 그려주는 부분 -->
		<!-- resource 부분 -->
		<h1>
			RESOURCES
		</h1>
		<h2>
			<b-badge variant="success" class="resourcePosition" v-for="(item, index) in pipeline_resources" :item="item" @click="resource_info(index)">{{item.name}}</b-badge>
		</h2>
		<!-- pipeline 부분 -->
		<h1 class="topGrayLine"> 
			PIPE LINE
		</h1>
		<draggable v-model="pipeline_jobs" ghost-class="ghost" group="pipeline" @start="drag=true" @end="drag=false">
			<div v-for="(item,index) in pipeline_jobs" key="index" style="float:left;">
				<div v-if="item.overlap=='first'">
					<div style="width:140px;height:50px">
						<div v-if="index!=0" class="splitLineSize" :style="item.plan[0].aggregate[item.triggerIndex].trigger? 'border:3px solid green;':'border:3px solid red;'" @click="triggerChange(index,item.triggerIndex)">
						</div>
						<div class="splitBoxSize" @click="showInfo(index)">
						<br>{{item.name}}
						</div>
						<div v-if="index!=0" class="splitLineSize" :style="pipeline_jobs[index+1].plan[0].aggregate[item.triggerIndex].trigger? 'border:3px solid green;':'border:3px solid red;'" @click="triggerChange(index+1,pipeline_jobs[index+1].triggerIndex)">
						</div>
						<div class="splitBoxSize" @click="showInfo(index+1)">
							<br>{{pipeline_jobs[index+1].name}}
						</div>
					</div>
					</div>
				<div v-else-if="item.overlap!='second'">
					<div v-if="index!=0" class="fullLineSize" :style="item.plan[0].aggregate[item.triggerIndex].trigger? 'border:3px solid green;':'border:3px solid red;'" @click="triggerChange(index,item.triggerIndex)">
					</div>
					<div class="fullBoxSize"  @click="showInfo(index)">
						<br>{{item.name}}
					</div>
				</div>
			</div>
		</draggable>

		<div class="addBoxSize">
			<br><br>+
		</div>

		<!-- 버튼부분 -->
		<!-- <button type="button" class="btn btn-primary" @click="allCheck" style="float:right;">All Check</button>
		<button type="button" class="btn btn-primary" @click="name_dialog=true" style="float:right;">Save Job</button> -->
		<button type="button" class="btn btn-primary" @click="exportYml" style="float:right;">export data</button>
		<!-- 저장 다이얼로그 -->
		<b-modal v-model="name_dialog" @ok="saveCheck" title="Pipeline 명을 입력해주세요">
			<b-form-input v-model="pipeline_name" placeholder="Enter job name"></b-form-input>
		</b-modal>
		<!-- 저장 다이얼로그 끝 -->
		<!-- job info 다이얼로그 -->
		<b-modal v-model="pipeline_info_dialog" :title="pipeline_jobs[now_pipeline_index].name">
			<h2>Aggregate</h2>
			<h3>
				<b-badge variant="success" v-for="item in pipeline_jobs[now_pipeline_index].plan[0].aggregate" :key="item.get" style="margin-right:15px;">{{item.get}}</b-badge>
			</h3>
			<div v-if="pipeline_jobs[now_pipeline_index].plan.length>1">
			<h2>Image resource</h2>
			<h3>
				<b-badge variant="success" v-if="pipeline_jobs[now_pipeline_index].plan[1].config.image_resource.type" style="margin-right:15px;">type : {{pipeline_jobs[now_pipeline_index].plan[1].config.image_resource.type}}</b-badge>
				<b-badge variant="success" v-for="source in Object.keys(pipeline_jobs[now_pipeline_index].plan[1].config.image_resource.source)" style="margin-right:15px;">{{source}} : {{pipeline_jobs[now_pipeline_index].plan[1].config.image_resource.source[source]}}</b-badge>
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
			
		</b-modal>
		<!-- job info 다이얼로그 끝 -->

		<!-- resource info 다이얼로그 -->
		<b-modal v-model="resource_info_dialog" title="Resource">
			<div v-for="item in Object.keys(pipeline_resources[now_resource_index])">
				<div v-if="typeof(pipeline_resources[now_resource_index][item])!='object'">
					<h3>{{item}} :</h3><b-form-input :value="pipeline_resources[now_resource_index][item]" disabled></b-form-input>
				</div>
				<div v-else>
					<h3>{{item}} : </h3>
					<div v-for="item2 in Object.keys(pipeline_resources[now_resource_index][item])">
					<h4>&nbsp;&nbsp;&nbsp;&nbsp;{{item2}} :</h4><b-form-input :value="pipeline_resources[now_resource_index][item][item2]" disabled></b-form-input>
					</div>
				</div>
			</div>
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
	  pipeline_name:'',
	  load_pipeline_deck:[],
	  checkBox:[],
	  name_dialog:false,
	  resource_info_dialog:false,
	  pipeline_info_dialog:false,
	  now_pipeline_index:0,
	  now_resource_index:0
    }
  },
  created(){
      this.pipeline_yml=this.$route.params.pipeline_yml
	  this.pipeline_jobs=this.pipeline_yml.jobs
	  this.pipeline_resources=this.pipeline_yml.resources
      var beforePassed=''
      //trigger부분
      for(let i=0;i<this.pipeline_jobs.length;i++){
		var plan = this.pipeline_jobs[i].plan[0]
		this.checkBox[i]=false
        for(let j=0;j<plan.aggregate.length;j++){
          //trigger찾기
          if(plan.aggregate[j].trigger!=null){
            this.pipeline_jobs[i].triggerIndex=j
          }
          //passed 찾기
          if(plan.aggregate[j].passed!=null){
            this.pipeline_jobs[i].passedIndex=j
            if(beforePassed==plan.aggregate[j].passed[0]){
              this.pipeline_jobs[i].overlap='second'
              this.pipeline_jobs[i-1].overlap='first'
            }else{
              beforePassed=plan.aggregate[j].passed[0]
            }
          }
        }        
      }
  },
  methods: {
    triggerChange(index,triggerIndex){
      this.pipeline_jobs[index].plan[0].aggregate[triggerIndex].trigger = !this.pipeline_jobs[index].plan[0].aggregate[triggerIndex].trigger
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
	saveCheck(){
		//로컬스토리지 불러오고 검사하는 부분
		if(!localStorage.getItem('pipeline_deck')){
			var arr=[]
			localStorage.setItem('pipeline_deck',JSON.stringify(arr))
		}
		this.load_pipeline_deck=JSON.parse(localStorage.getItem('pipeline_deck') || "[]");
		console.log(this.load_pipeline_deck)
		//중복검사부분
		for(let i=0;i<this.load_pipeline_deck.length;i++){
		}
		var append_arr=[]
		//저장할 job 만드는부분
		for(let i=0;i<this.pipeline_jobs.length;i++){
			if(this.checkBox[i]==true)
				append_arr.push(this.pipeline_jobs[i])
		}
		this.load_pipeline_deck.push({
			name:this.pipeline_name,
			jobs:append_arr
		})
		
		localStorage.setItem('pipeline_deck',JSON.stringify(this.load_pipeline_deck))
		this.name_dialog=false
	},
	showInfo(index){
		this.now_pipeline_index=index
		this.pipeline_info_dialog=true
	},
	resource_info(index){
		this.now_resource_index=index	
		this.resource_info_dialog=true
	},
	exportYml(){
		this.pipeline_yml.jobs = this.pipeline_jobs
		this.pipeline_yml.resources = this.pipeline_resources
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
	width:100px;height:100px;border:1px solid black; margin-left:20px;float:left;text-align:center
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>