import Vue from 'vue'
import Vuex from 'vuex'
import { stat } from 'fs';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ymlData:{a:'123123'},
    copyData:''
  },
  mutations: {
    initData: function (state, payload) {
      state.ymlData = payload;
    },
    cutData: function (state, payload) {
      let tempData = JSON.parse(JSON.stringify(state.ymlData))
      let addresData=payload;
      let nowData=tempData
      for(let i=0;i<payload.length;i++){
        if(i==payload.length-1){
          if(isNaN(addresData[i])){
            state.copyData=[addresData[i],nowData[addresData[i]]]
            delete nowData[addresData[i]];   
          }         
          else{
            state.copyData=nowData.indexOf(addresData[i]);
            state.copyData=[addresData[i], nowData.indexOf(addresData[i])];
          }
            
        }
        else
          nowData = nowData[addresData[i]];
      }
      state.ymlData = tempData;
    },
    copyData: function (state, payload) {
      let tempData = JSON.parse(JSON.stringify(state.ymlData))
      let addresData=payload;
      let nowData=tempData
      for(let i=0;i<payload.length;i++){
        if(i==payload.length-1){
          if(isNaN(addresData[i]))
          //이부분은 질문할것
            state.copyData=[addresData[i],nowData[addresData[i]]]
          else
            state.copyData=[addresData[i], nowData.indexOf(addresData[i])];
            
        }
        else
          nowData = nowData[addresData[i]];
      }
    },
    deleteData: function (state, payload) {
      let tempData = JSON.parse(JSON.stringify(state.ymlData))
      let addresData=payload;
      let nowData=tempData
      for(let i=0;i<payload.length;i++){
        if(i==payload.length-1){
          if(isNaN(addresData[i]))
            delete nowData[addresData[i]];
          else
            nowData.splice(nowData.indexOf(addresData[i]),1);
        }
        else
          nowData = nowData[addresData[i]];
      }
      state.ymlData = tempData;
    },
    pasteData: function (state, payload) {
      let tempData = JSON.parse(JSON.stringify(state.ymlData))
      let addresData=payload;
      let nowData=tempData
      for(let i=0;i<payload.length;i++){
        console.log(nowData)
        console.log(addresData[i])
          nowData = nowData[addresData[i]];
      }
      console.log(nowData)
      nowData[state.copyData[0]]=state.copyData[1]
      state.ymlData = tempData;
    },
  },
  actions: {

  }
})
