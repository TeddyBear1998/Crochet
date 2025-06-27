<script setup>
import { computed, toRefs, ref } from 'vue'
const props = defineProps({
  crochetTypes: Array,
  crochetShapes: Array,
  selectedType: String,
  selectedShape: String,
  itemSize: String,
  zoom: Number
})
const emit = defineEmits(['update:selectedType', 'update:selectedShape', 'update:itemSize', 'update:zoom'])

const { selectedType, selectedShape, itemSize, zoom } = toRefs(props)

function updateType(e) {
  emit('update:selectedType', e.target.value)
}
function updateShape(e) {
  emit('update:selectedShape', e.target.value)
}
function updateSize(e) {
  emit('update:itemSize', e.target.value)
}
function updateZoom(e) {
  emit('update:zoom', Number(e.target.value))
}
</script>

<template>
  <aside class="side-panel">
    <h2>Crochet Project Setup</h2>
    <div class="form-group">
      <label for="crochet-type">Crochet Type</label>
      <select id="crochet-type" :value="selectedType" @input="updateType">
        <option v-for="type in crochetTypes" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>
    <div class="form-group">
      <label for="crochet-shape">Crochet Shape</label>
      <select id="crochet-shape" :value="selectedShape" @input="updateShape">
        <option v-for="shape in crochetShapes" :key="shape" :value="shape">{{ shape }}</option>
      </select>
    </div>
    <div class="form-group">
      <label for="item-size">Grid Items Per Row</label>
      <input id="item-size" :value="itemSize" @input="updateSize" type="number" min="1" placeholder="e.g. 8 for 8x8 grid" />
      <small>Default grid square size is 10x10 pixels.</small>
    </div>
    <div class="form-group">
      <label for="zoom">Zoom</label>
      <input id="zoom" type="range" min="1" max="8" step="0.1" :value="zoom" @input="updateZoom" />
      <span>{{ zoom }}x</span>
    </div>
  </aside>
</template>

<style scoped>
.side-panel {
  padding: 1rem;
  background: #f8f8f8;
  border-radius: 8px;
  width: 250px;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: bold;
  color: #222831;
}
h2 {
  color: #1769aa;
  margin-bottom: 1rem;
}
select, input[type="number"] {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
input[type="range"] {
  width: 100%;
}
small {
  color: #666;
}
</style>
