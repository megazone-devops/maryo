<template>
	<div class="box_style" :style="color">
		
		<div class="box_header">
			<h2 v-if="title!=null" style="text-align:left;float:left;">{{title}}</h2>
			<b-button v-if="title!='' || typeof(data)=='string'" variant="outline-primary" class="header_button" @click="flag=!flag">{{flag==true? '-':'+'}}</b-button>
		</div>

		<div v-if="flag==true">
			<div v-if="typeof(data)=='object'">
				<div v-for="item in Object.keys(data)">
					<div v-if="typeof(data[item])=='object'">
						<bind_box :data=data[item] :title="Array.isArray(data)? '':item" :color_arr="[color_arr[0],color_arr[1]+1]"></bind_box>
					</div>
					<div v-else>
						<span v-if="!Array.isArray(data)">{{item}} : </span>{{data[item]}}
					</div>
				</div>
			</div>
			
			<div v-else>
				{{title}} : {{data}}
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