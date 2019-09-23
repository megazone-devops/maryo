<template>
	<div class="box_style" :style="color">
		{{address}}
		<div class="box_header" v-if="title">
			<div class="menu_bar">
				<b-button v-if="title!='' || typeof(data)=='string'" variant="outline-primary" class="header_button" @click="flag=!flag">{{flag==true? '-':'+'}}</b-button>
				<div class="right_button_box">
					<b-button variant="outline-primary" class="right_button" @click="cut_item">CUT</b-button>
					<b-button variant="outline-primary" class="right_button" @click="copy_item">COPY</b-button>
					<b-button variant="outline-primary" class="right_button" @click="paste_item">PASTE</b-button>
					<b-button variant="outline-primary" class="right_button" @click="delete_item">DEL</b-button>
				</div>
			</div>
			<h2 >{{title}}</h2>
		</div>
		<div v-if="flag==true">
			<div v-if="typeof(data[0])=='string'&&typeof(data[1])=='string'">
				{{data[0]}} : {{data[1]}}
			</div>
			<div v-else-if="isNaN(data[0])==true && typeof(data[1])=='object'">
				<bind_box v-for="(item, index) in Object.entries(data[1])" :key="index" :title="''" :data=item :color_arr="[color_arr[0],color_arr[1]+1]" :address="address"></bind_box>
			</div>
			<div v-else>
				<div v-for="(item,index) in Object.entries(data[1])" :key="index">
					<div v-if="typeof(item[1])=='object'">
						<bind_box :data=[index,item[1]] :color_arr="[color_arr[0],color_arr[1]+1]" :title="isNaN(item[0])==true? item[0]:''" :address="isNaN(item[0])==true? address.concat([data[0],item[0]]):address"></bind_box>
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
  props: ['data','title','color_arr','address'],
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

  },
  methods: {
	copy_item() {
		this.$bvToast.toast(`Copied`, {
			title: 'Alert',
			autoHideDelay: 3000
		})
		this.$store.commit('copyData', this.address);
	},
	cut_item() {
		this.$bvToast.toast(`Cuted`, {
			title: 'Alert',
			autoHideDelay: 3000
		})
		this.$store.commit('cutData', this.address);
	},
	delete_item(){
		this.$store.commit('deleteData', this.address);
	},
	paste_item(){
		this.$store.commit('pasteData', this.address);
	}
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
	position:relative
}
.header_button{
	top:5px;
	left:5px;
	position:absolute;
	width:40px;
	height:40px;
}
.right_button_box{
	float:right;
	padding-top:5px;
	padding-right:5px;
}
.right_button{
	float:left;
}
.menu_bar{
	display: inline-block;
	width: 100%;
}
</style>