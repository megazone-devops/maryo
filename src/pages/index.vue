<template>
  <div>
    <section class="logo-container" role="logo">
      <i class="logo-image">
        <img src="img/maryo-logo.svg" alt="MARYO" style="width: 180px" />
      </i>
      <h3 class="logo-desc">
        Visualized YAML editor for pipeline
      </h3>
    </section>
    <div v-if="recent">
      <ul class="recent-list">
        <li
          v-for="file in recent"
          :key="file.name"
          @click="loadYAML(file.name)"
        >
          <span>{{ file.name }}</span>
          <span>{{ file.timestamp | toLocaleDate }}</span>
        </li>

        <li class="add-btn" aria-label="Upload New YAML File">
          <upload-file-btn @upload="loadFromFile"
            ><span>+</span></upload-file-btn
          >
        </li>
      </ul>
    </div>
    <div class="pipeline-input"></div>
  </div>
</template>

<script>
import PipelineInput from '@/components/pipeline_input.vue';
import UploadFileBtn from '@/components/upload-file-btn.vue';
import jsyaml from 'js-yaml';
import YAMLStorage, { getPureFileName } from '../lib/YAMLStorage.js';

const keys = YAMLStorage.getLists();

export default {
  components: {
    PipelineInput,
    UploadFileBtn,
  },
  data() {
    return {
      recent: YAMLStorage.getLists(),
    };
  },
  methods: {
    loadYAML(key) {
      const yml_json = YAMLStorage.load(key);
      this.goToMgmtMain(yml_json);
    },
    loadFromFile(e) {
      const { target } = e;
      const { files, value: filepath } = target;
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const yml_json = jsyaml.load(fileReader.result);
        YAMLStorage.save(getPureFileName(filepath), yml_json);
        this.goToMgmtMain(yml_json);
      };
      fileReader.readAsText(files[0]);
    },
    goToMgmtMain(yml_json) {
      this.$router.push({
        name: 'mgmt_main',
        params: { yml_json },
      });
    },
  },
  filters: {
    toLocaleDate(date) {
      const _d = new Date(date);
      return `${_d.getFullYear()}/${_d.getMonth()}/${_d.getDate()}`;
    },
  },
};
</script>

<style scoped>
.logo-container {
  margin: 4rem 0;
  display: flex;
  flex-direction: column;
}
.logo-image {
  margin: 0.8rem 0;
}
.logo-desc {
  font-family: 'Overpass', sans-serif;
}
.recent-list {
  width: 80vw;
  text-align: left;
  padding: 0;
  margin: 0 auto;
}
.recent-list li {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  text-align: center;
  width: 10rem;
  height: 10rem;
  margin: 0.5rem;
  vertical-align: middle;
  box-shadow: 1px 1px 1px 1px #000000;
  transition: all 120ms;
}
.recent-list li:hover {
  cursor: pointer;
  background-color: var(--gray);
  color: var(--white);
}

.recent-list li.add-btn {
  background-color: var(--blue);
  color: var(--white);
  font-size: 3rem;
}

.recent-list li.add-btn:hover {
  background-color: var(--light);
  color: var(--blue);
  font-size: 6rem;
}
</style>
