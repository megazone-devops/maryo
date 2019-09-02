<template>
	<div class="box_style" :style="color">
		
		<div class="box_header" v-if="title">
			<h2 >{{title}}</h2>
			<b-button v-if="title!='' || typeof(data)=='string'" variant="outline-primary" class="header_button" @click="flag=!flag">{{flag==true? '-':'+'}}</b-button>
		</div>
		<div v-if="flag==true">
			<div v-if="typeof(data[0])=='string'&&typeof(data[1])=='string'">
				{{data[0]}} : {{data[1]}}
			</div>
			<div v-else-if="isNaN(data[0])==true && typeof(data[1])=='object'">
				<bind_box v-for="(item, index) in Object.entries(data[1])" :key="index" :title="isNaN(data[0])==true? data[0]:''" :data=item :color_arr="[color_arr[0],color_arr[1]+1]"></bind_box>
			</div>
			<div v-else>
				<div v-for="(item,index) in Object.entries(data[1])" :key="index">
					<div v-if="typeof(item[1])=='object'">
						<bind_box :data=[0,item[1]] :color_arr="[color_arr[0],color_arr[1]+1]" :title="isNaN(item[0])==true? item[0]:''"></bind_box>
					</div>
					<div v-else-if="isNaN(item[0])==false && typeof(item[1])=='string'">
						{{item[1]}}
					</div>
					<div v-else>
						{{item[0]}} : {{item[1]}}
					</div>
						
				</div>
			</div>
		</div>
			
	</div>
</template>

<script>
import color_set from '../assets/color_set/color_set.json'
import bind_box from './bind_box'
export default {
  name: 'bind_box',
  props: ['data','title','color_arr'],
  data() {
    return {
	  flag:true,
	  color_set:color_set,
    }
  },
  components:{
      bind_box
  },
  created(){
	this.color = "background:"+this.color_set[this.color_arr[0]][this.color_arr[1]]
	  console.log(this.color_set[this.color_arr[0]][this.color_arr[1]])
  },
  methods: {
  }
}
</script>
<style scoped>
.box_style{
  width:90%;
  border:1px solid white;
  margin:2.5%;
}
.box_header{
	width:100%;
	height:50px;
	position:relative
}
.header_button{
	top:5px;
	right:5px;
	position:absolute;
	width:40px;
	height:40px;
}
</style>