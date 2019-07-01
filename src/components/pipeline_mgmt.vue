<template>
	<div>
    <!-- 박스 그려주는 부분 -->
		<!-- <div v-for="(item,index) in pipeline_jobs" style="float:left;">
			<div v-if="item.overlap=='first'">
				<div style="width:140px;height:50px">
					<div v-if="index!=0" style="width:20px;height:0px;float:left;margin: 6px;margin-top: 20px; cursor:pointer;border:3px solid green" :style="item.plan[0].aggregate[item.triggerIndex].trigger? 'border:3px solid green;':'border:3px solid red;'" @click="triggerChange(index,item.triggerIndex)">
					</div>
					<div style="width:100px;height:50px;border:1px solid black;float:left;text-align:center" :style="checkBox[index]==true? 'background-color:green':''" @click="boxCheck(index)">
					<br>{{item.name}}
					</div>
					<div v-if="index!=0" style="width:20px;height:0px;float:left;margin: 6px;margin-top: 20px; cursor:pointer;border:3px solid green" :style="pipeline_jobs[index+1].plan[0].aggregate[item.triggerIndex].trigger? 'border:3px solid green;':'border:3px solid red;'" @click="triggerChange(index+1,pipeline_jobs[index+1].triggerIndex)">
					</div>
					<div style="width:100px;height:50px;border:1px solid black;float:left;text-align:center" :style="checkBox[index+1]==true? 'background-color:green':''" @click="boxCheck(index+1)">
						<br>{{pipeline_jobs[index+1].name}}
					</div>
				</div>
				</div>
			<div v-else-if="item.overlap!='second'">
				<div v-if="index!=0" style="width:20px;height:0px;float:left;margin: 6px;margin-top: 41px; cursor:pointer;border:3px solid green" :style="item.plan[0].aggregate[item.triggerIndex].trigger? 'border:3px solid green;':'border:3px solid red;'" @click="triggerChange(index,item.triggerIndex)">
				</div>
				<div style="width:100px;height:100px;border:1px solid black;float:left;text-align:center" :style="checkBox[index]==true? 'background-color:green':''" @click="boxCheck(index)">
					<br>{{item.name}}
				</div>
			</div>

		</div> -->
		<div v-for="(item,index) in pipeline_jobs" style="float:left;">
			<div v-if="item.overlap=='first'">
				<div style="width:140px;height:50px">
					<div v-if="index!=0" style="width:20px;height:0px;float:left;margin: 6px;margin-top: 20px; cursor:pointer;border:3px solid green" :style="item.plan[0].aggregate[item.triggerIndex].trigger? 'border:3px solid green;':'border:3px solid red;'" @click="triggerChange(index,item.triggerIndex)">
					</div>
					<div style="width:100px;height:50px;border:1px solid black;float:left;text-align:center"  @click="showInfo(index)">
					<br>{{item.name}}
					</div>
					<div v-if="index!=0" style="width:20px;height:0px;float:left;margin: 6px;margin-top: 20px; cursor:pointer;border:3px solid green" :style="pipeline_jobs[index+1].plan[0].aggregate[item.triggerIndex].trigger? 'border:3px solid green;':'border:3px solid red;'" @click="triggerChange(index+1,pipeline_jobs[index+1].triggerIndex)">
					</div>
					<div style="width:100px;height:50px;border:1px solid black;float:left;text-align:center" @click="showInfo(index+1)">
						<br>{{pipeline_jobs[index+1].name}}
					</div>
				</div>
				</div>
			<div v-else-if="item.overlap!='second'">
				<div v-if="index!=0" style="width:20px;height:0px;float:left;margin: 6px;margin-top: 41px; cursor:pointer;border:3px solid green" :style="item.plan[0].aggregate[item.triggerIndex].trigger? 'border:3px solid green;':'border:3px solid red;'" @click="triggerChange(index,item.triggerIndex)">
				</div>
				<div style="width:100px;height:100px;border:1px solid black;float:left;text-align:center"  @click="showInfo(index)">
					<br>{{item.name}}
				</div>
			</div>

		</div>
		<div style="width:100px;height:100px;border:1px solid black; margin-left:20px;float:left;text-align:center">
			<br><br>+
		</div>

    <!-- 버튼부분 -->
	  <button type="button" class="btn btn-primary" @click="allCheck" style="float:right;">All Check</button>
	  <button type="button" class="btn btn-primary" @click="name_dialog=true" style="float:right;">Save Job</button>
      <!-- 다이얼로그 -->
		<b-modal v-model="name_dialog" @ok="saveCheck" title="Pipeline 명을 입력해주세요">
			<b-form-input v-model="pipeline_name" placeholder="Enter job name"></b-form-input>
		</b-modal>
	</div>
</template>

<script>
export default {
  name: 'pipeline_mgmt',
  props: {
    msg: String
  },
  data() {
    return {
      pipeline_yml:'',
	  pipeline_jobs:'',
	  pipeline_name:'',
	  load_pipeline_deck:[],
	  checkBox:[],
	  name_dialog:false
    }
  },
  created(){
      this.pipeline_yml=this.$route.params.pipeline_yml
      this.pipeline_jobs=this.pipeline_yml.jobs
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
		
	}
  }
}
</script>