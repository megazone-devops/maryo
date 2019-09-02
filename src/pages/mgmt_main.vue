<template>
	<div style="padding-top:15px;">
        <!-- 오브젝트면서 배열이 아닐경우는???? -->
        <div v-for="(item,index) in Object.entries(yml_json)" :key=index>
            <bind_box :data="item" :color_arr="[index%(color_set.length-1),0]" :title="typeof(item[0])=='string'? item[0]:''"></bind_box>
        </div>
	</div>
</template>

<script>
import draggable from 'vuedraggable'
import json2yaml from 'json2yaml'
import bind_box from '../components/bind_box'
import color_set from '../assets/color_set/color_set.json'
export default {
	name: 'mgmt_main',
  data() {
	return {
    yml_json:'',
    color_set:color_set,
    color_size:'',
    }
  },
  components:{
      bind_box
  },
  watch:{
  },
  created(){
    if(this.$route.params.yml_json){
      this.yml_json=this.$route.params.yml_json
          localStorage.setItem("yml_json", JSON.stringify(this.yml_json));
    }else{
        this.yml_json=JSON.parse(localStorage.getItem("yml_json"));
    }
    // this.color_size=this.color_set.lnegth;
    console.log(this.color_set.length)
  },
  methods: {

  }
}
</script>

<style>

</style>