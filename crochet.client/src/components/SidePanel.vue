<script setup>
import { computed, toRefs } from 'vue'
const props = defineProps({
  crochetTypes: Array,
  crochetShapes: Array,
  selectedType: String,
  selectedShape: String,
  itemSizeX: String,
  itemSizeY: String,
  zoom: Number,
  selectedColor: String // new prop
})
const emit = defineEmits([
  'update:selectedType',
  'update:selectedShape',
  'update:itemSizeX',
  'update:itemSizeY',
  'update:zoom',
  'resetGridStitches',
  'exportGridToJson',
  'importGridFromJson',
  'update:selectedColor' // new emit
])

const { selectedType, selectedShape, itemSizeX, itemSizeY, zoom, selectedColor } = toRefs(props)

function updateType(e) {
  emit('update:selectedType', e.target.value)
}

function updateShape(e) {
  emit('update:selectedShape', e.target.value)
}

function updateSizeX(e) {
  emit('update:itemSizeX', e.target.value)
}

function updateSizeY(e) {
  emit('update:itemSizeY', e.target.value)
}

function updateZoom(e) {
  emit('update:zoom', Number(e.target.value))
}

function resetGrid() {
  emit('resetGridStitches')
}

function exportGrid() {
  emit('exportGridToJson')
}

function importGrid() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,application/json'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const text = await file.text()
    try {
      const data = JSON.parse(text)
      emit('importGridFromJson', data)
    } catch (err) {
      alert('Invalid JSON file.')
    }
  }
  input.click()
}

function updateColor(e) {
  emit('update:selectedColor', e.target.value)
}
</script>

<template>
  <aside class="side-panel">
    <h2>Crochet Project Setup</h2>
    <div class="form-group">
      <label for="crochet-type">Stitch Type</label>
      <select id="crochet-type" :value="selectedType" @input="updateType">
        <option v-for="type in crochetTypes" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>
    <div class="form-group">
      <label for="color-picker">Stitch Color</label>
      <input id="color-picker" type="color" :value="selectedColor" @input="updateColor" style="width:100%;height:2.5rem;padding:0;border:none;" />
    </div>
    <div class="form-group">
      <label for="crochet-shape">Crochet Shape</label>
      <select id="crochet-shape" :value="selectedShape" @input="updateShape">
        <option v-for="shape in crochetShapes" :key="shape" :value="shape">{{ shape }}</option>
      </select>
    </div>
    <div class="form-group">
      <label>Grid Size</label>
      <div style="display: flex; gap: 0.5rem; align-items: center;">
        <input id="item-size-x" :value="itemSizeX" @input="updateSizeX" type="number" min="1" placeholder="X (cols)" style="width: 4rem;" />
        <span>x</span>
        <input id="item-size-y" :value="itemSizeY" @input="updateSizeY" type="number" min="1" placeholder="Y (rows)" style="width: 4rem;" />
      </div>
      <small>Default grid square size is 10x10 pixels.</small>
    </div>
    <div class="form-group">
      <label for="zoom">Zoom</label>
      <input id="zoom" type="range" min="1" max="8" step="0.1" :value="zoom" @input="updateZoom" />
      <span>{{ zoom }}x</span>
    </div>
    <div class="form-group">
      <button @click="resetGrid" style="width:100%;padding:0.5rem;background:#1769aa;color:#fff;border:none;border-radius:4px;cursor:pointer;">Reset Grid</button>
    </div>
    <div class="form-group">
      <button @click="exportGrid" style="width:100%;padding:0.5rem;background:#1769aa;color:#fff;border:none;border-radius:4px;cursor:pointer;">Export JSON</button>
    </div>
    <div class="form-group">
      <button @click="importGrid" style="width:100%;padding:0.5rem;background:#1769aa;color:#fff;border:none;border-radius:4px;cursor:pointer;">Import JSON</button>
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
select {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
input[type="range"] {
  width: 100%;
}
span {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #222831;
}
button {
  font-size: 1rem;
}
small {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #555;
}
</style>
