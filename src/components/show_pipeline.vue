<template>
  <div>
      <v-list two-line>
          <template v-for="(item, index) in items">
            <v-subheader
              v-if="item.header"
              :key="item.header"
            >
              {{ item.header }}
            </v-subheader>

            <v-divider
              v-else-if="item.divider"
              :key="index"
              :inset="item.inset"
            ></v-divider>

            <v-list-tile
              v-else
              :key="item.title"
              avatar
              @click=""
            >

              <v-list-tile-content>
                <v-list-tile-title v-html="item.name"></v-list-tile-title>
                <v-list-tile-sub-title v-for="item2 in item.jobs" v-html="item2.name"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
  </div>
</template>

<script>
import jsyaml from 'js-yaml'
export default {
  name: 'show_pipeline',
  data() {
    return {
      items: [],
    }
  },
  created(){
    this.items = JSON.parse(localStorage.getItem('pipeline_deck') || "[]")
    console.log(this.items)
  },
  methods: {
  }
}
</script>