<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import SidePanel from './components/SidePanel.vue'
import ShapePreview from './components/ShapePreview.vue'

const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function handleClickOutside(event) {
  // Only close if menu is open and click is outside the side panel and hamburger
  if (!isMobileMenuOpen.value) return
  const aside = document.querySelector('.side-panel-wrapper')
  const hamburger = document.querySelector('.hamburger')
  if (
    aside && !aside.contains(event.target) &&
    hamburger && !hamburger.contains(event.target)
  ) {
    isMobileMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('touchstart', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('touchstart', handleClickOutside)
})

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
    <!-- Hamburger for mobile -->
    <button class="hamburger" @click="toggleMobileMenu" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
    <aside
      class="side-panel-wrapper"
      :class="{ 'mobile-hidden': !isMobileMenuOpen }"
    >
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
      <button class="close-menu" @click="toggleMobileMenu" aria-label="Close menu">×</button>
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

<style scoped>
.hamburger {
  display: none;
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  width: 2.5rem;
  height: 2.5rem;
  background: #1769aa;
  border: none;
  border-radius: 6px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
}
.hamburger span {
  display: block;
  width: 1.6rem;
  height: 0.3rem;
  background: #fff;
  border-radius: 2px;
}
.close-menu {
  display: none;
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #1769aa;
  z-index: 1002;
  cursor: pointer;
}
@media (max-width: 700px) {
  .hamburger {
    display: flex;
  }
  .side-panel-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 80vw;
    max-width: 340px;
    height: 100vh;
    z-index: 1000;
    background: #f8f8f8;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(.4,0,.2,1);
    box-shadow: 2px 0 12px #0002;
  }
  .side-panel-wrapper.mobile-hidden {
    transform: translateX(-100%);
    pointer-events: none;
  }
  .side-panel-wrapper:not(.mobile-hidden) {
    transform: translateX(0);
    pointer-events: auto;
  }
  .close-menu {
    display: block;
  }
}
</style>
