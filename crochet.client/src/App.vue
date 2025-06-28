<script setup>
import { ref, watch, computed } from 'vue'
import SidePanel from './components/SidePanel.vue'
import ShapePreview from './components/ShapePreview.vue'

// Substitute with 6 basic crochet stitch types
const crochetTypes = [
  'No Stitch',
  'Chain Stitch (ch)',
  'Slip Stitch (sl st)',
  'Single Crochet (sc)',
  'Half Double Crochet (hdc)',
  'Double Crochet (dc)',
  'Treble (Triple) Crochet (tr)',
  'Double Turning Chain',
  'Triple Turning Chain',
  'Quadruple Turning Chain'
]
const crochetShapes = ['Square', 'Circle', 'Rectangle', 'Triangle', 'Custom']

const selectedType = ref(crochetTypes[0])
const selectedShape = ref(crochetShapes[0])
const itemSizeX = ref('')
const itemSizeY = ref('')
const zoom = ref(2)
const selectedColor = ref('#1769aa') // default blue

// Step 1: State management for grid stitches (store type, not color)
const defaultGridSizeX = computed(() => {
  const n = parseInt(itemSizeX.value)
  return isNaN(n) || n < 1 ? 8 : n
})
const defaultGridSizeY = computed(() => {
  const n = parseInt(itemSizeY.value)
  return isNaN(n) || n < 1 ? 8 : n
})

function createGridStitches(x, y) {
  // 2D array for grid stitches, default to { type: 'empty', color: '' }
  return Array.from({ length: y }, () => Array(x).fill({ type: 'empty', color: '' }))
}

const gridStitches = ref(createGridStitches(defaultGridSizeX.value, defaultGridSizeY.value))

let importing = false

// Watch for grid size changes and reset gridStitches accordingly
watch([defaultGridSizeX, defaultGridSizeY], ([newX, newY], [oldX, oldY]) => {
  if (importing) {
    importing = false
    return
  }
  gridStitches.value = createGridStitches(newX, newY)
})

// Step 7: Reset/Clear Functionality
function resetGridStitches() {
  gridStitches.value = createGridStitches(defaultGridSizeX.value, defaultGridSizeY.value)
}

// Step 2: Handler to update a grid square's stitch type
function updateGridStitch(row, col, type) {
  if (
    row >= 0 && row < gridStitches.value.length &&
    col >= 0 && col < gridStitches.value[row].length
  ) {
    gridStitches.value[row][col] = { type, color: selectedColor.value }
  }
}

function exportGridToJson() {
  // Gather all relevant data
  const data = {
    version: 1,
    shape: selectedShape.value,
    sizeX: defaultGridSizeX.value,
    sizeY: defaultGridSizeY.value,
    zoom: zoom.value,
    gridStitches: gridStitches.value
  }
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `crochet-grid-${selectedShape.value || 'pattern'}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function importGridFromJson(data) {
  // Defensive: check for required fields
  if (!data || !data.gridStitches || !data.shape || !data.sizeX || !data.sizeY || !data.zoom) {
    alert('Invalid or incomplete grid JSON.')
    return
  }
  importing = true
  selectedShape.value = data.shape
  itemSizeX.value = String(data.sizeX)
  itemSizeY.value = String(data.sizeY)
  zoom.value = data.zoom
  gridStitches.value = data.gridStitches
}
</script>

<template>
  <main class="main-layout">
    <aside class="side-panel-wrapper">
      <SidePanel
        :crochetTypes="crochetTypes"
        :crochetShapes="crochetShapes"
        v-model:selectedType="selectedType"
        v-model:selectedShape="selectedShape"
        v-model:itemSizeX="itemSizeX"
        v-model:itemSizeY="itemSizeY"
        v-model:zoom="zoom"
        v-model:selectedColor="selectedColor"
        @resetGridStitches="resetGridStitches"
        @exportGridToJson="exportGridToJson"
        @importGridFromJson="importGridFromJson"
      />
    </aside>
    <section class="main-content">
      <ShapePreview
        :shape="selectedShape"
        :sizeX="itemSizeX"
        :sizeY="itemSizeY"
        :zoom="zoom"
        :gridStitches="gridStitches"
        :updateGridStitch="(row, col) => updateGridStitch(row, col, selectedType)"
      />
    </section>
  </main>
</template>
