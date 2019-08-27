<template>
	<div style="padding-top:15px;">
        <!-- 오브젝트면서 배열이 아닐경우는???? -->
        <div v-for="(item,index) in Object.keys(yml_json)" :key=index>
            <bind_box :data=yml_json[item] :title="Array.isArray(item)? '':item"></bind_box>
        </div>
	</div>
</template>

<script>
import draggable from 'vuedraggable'
import json2yaml from 'json2yaml'
import bind_box from '../components/bind_box'
export default {
	name: 'mgmt_main',
  data() {
	return {
		yml_json:'',
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
  },
  methods: {

  }
}
</script>

<style>

</style>