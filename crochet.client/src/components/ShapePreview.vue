<script setup>
import { computed, ref } from 'vue'
const props = defineProps({
  shape: String,
  sizeX: String, // grid columns
  sizeY: String, // grid rows
  zoom: Number,
  gridStitches: Array, // 2D array of stitch types
  updateGridStitch: Function // handler to update stitch type
})

const gridCountX = computed(() => {
  const n = parseInt(props.sizeX)
  return isNaN(n) || n < 1 ? 8 : n // default to 8 if invalid
})
const gridCountY = computed(() => {
  const n = parseInt(props.sizeY)
  return isNaN(n) || n < 1 ? 8 : n // default to 8 if invalid
})

const shapeStyle = computed(() => {
  const countX = gridCountX.value
  const countY = gridCountY.value
  const zoom = props.zoom || 1
  let width = countX * 10 * zoom, height = countY * 10 * zoom, borderRadius = '0%'
  switch (props.shape) {
    case 'Circle':
      borderRadius = '50%'
      break
    case 'Triangle':
      break
    case 'Rectangle':
      break
    case 'Square':
      width = height = Math.min(width, height)
      break
    default:
      break
  }
  return { width, height, borderRadius }
})

const gridLines = computed(() => {
  const { width, height } = shapeStyle.value
  const countX = gridCountX.value
  const countY = gridCountY.value
  const lines = []
  for (let i = 1; i < countX; i++) {
    // Vertical lines
    lines.push({ x1: (width / countX) * i, y1: 0, x2: (width / countX) * i, y2: height })
  }
  for (let i = 1; i < countY; i++) {
    // Horizontal lines
    lines.push({ x1: 0, y1: (height / countY) * i, x2: width, y2: (height / countY) * i })
  }
  return lines
})

// Panning logic
const containerRef = ref(null)
let isPanning = false
let startX = 0, startY = 0, scrollLeft = 0, scrollTop = 0

function onMouseDown(e) {
  if (e.button !== 2) return // Only right mouse button
  isPanning = true
  startX = e.clientX
  startY = e.clientY
  const container = containerRef.value
  scrollLeft = container.scrollLeft
  scrollTop = container.scrollTop
  document.body.style.cursor = 'grab'
  e.preventDefault()
}
function onMouseMove(e) {
  if (!isPanning) return
  const container = containerRef.value
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  container.scrollLeft = scrollLeft - dx
  container.scrollTop = scrollTop - dy
}
function onMouseUp(e) {
  if (e.button !== 2) return
  isPanning = false
  document.body.style.cursor = ''
}
function onContextMenu(e) {
  // Prevent default context menu on right click
  e.preventDefault()
}

// Drag logic for stitch placement
const isPlacing = ref(false)

// Helper to get the selected type from window or props
function getSelectedType() {
  if (typeof window !== 'undefined' && window.selectedType && window.selectedType.value) {
    return window.selectedType.value
  }
  return undefined
}

function handleSquareMouseDown(row, col, e) {
  if (e.button !== 0) return // Only left mouse button
  isPlacing.value = true
  const selected = getSelectedType()
  if (selected !== undefined) {
    props.updateGridStitch(row, col, selected)
  } else {
    props.updateGridStitch(row, col, 'empty')
  }
}
function handleSquareMouseEnter(row, col) {
  if (isPlacing.value) {
    const selected = getSelectedType()
    if (selected === 'No Stitch') {
      props.updateGridStitch(row, col, 'empty')
    } else if (selected !== undefined) {
      props.updateGridStitch(row, col, selected)
    } else {
      props.updateGridStitch(row, col, 'empty')
    }
  }
}
// Ensure mouseup on document also ends placing
if (typeof window !== 'undefined') {
  window.addEventListener('mouseup', () => { isPlacing.value = false })
}
function handleSvgMouseUp() {
  isPlacing.value = false
}
function handleSvgMouseLeave() {
  isPlacing.value = false
}

// SVG symbol renderers for each stitch type
function renderStitchSymbol(stitch, x, y, size) {
  // Accepts a stitch object: { type, color }
  if (!stitch || stitch.type === 'empty' || !stitch.type) return ''
  const type = stitch.type
  const color = stitch.color || '#222'
  const cx = x + size / 2
  const cy = y + size / 2
  const half = size / 2
  const quarter = size / 4
  switch (type) {
    case 'No Stitch':
      // White dot in the center
      return `<circle cx="${cx}" cy="${cy}" r="${size * 0.22}" fill="#fff" stroke="#bbb" stroke-width="1.2" />`
    case 'Chain Stitch (ch)':
      return `<ellipse cx="${cx}" cy="${cy}" rx="${half * 0.4}" ry="${half * 0.7}" fill="none" stroke="${color}" stroke-width="1.2" />`
    case 'Slip Stitch (sl st)':
      return `<ellipse cx="${cx}" cy="${cy}" rx="${half * 0.4}" ry="${half * 0.7}" fill="none" stroke="${color}" stroke-width="1.2" /><line x1="${cx - quarter * 0.7}" y1="${cy}" x2="${cx + quarter * 0.7}" y2="${cy}" stroke="${color}" stroke-width="1.2" />`
    case 'Single Crochet (sc)':
      return `<line x1="${cx}" y1="${y + size * 0.2}" x2="${cx}" y2="${y + size * 0.8}" stroke="${color}" stroke-width="1.5" /><line x1="${cx - quarter}" y1="${y + size * 0.5}" x2="${cx + quarter}" y2="${y + size * 0.5}" stroke="${color}" stroke-width="1.5" />`
    case 'Half Double Crochet (hdc)':
      return `<line x1="${cx}" y1="${y + size * 0.2}" x2="${cx}" y2="${y + size * 0.8}" stroke="${color}" stroke-width="1.5" />` +
             `<line x1="${cx - quarter}" y1="${y + size * 0.2}" x2="${cx + quarter}" y2="${y + size * 0.2}" stroke="${color}" stroke-width="1.5" />`
    case 'Double Crochet (dc)':
      return `<line x1="${cx}" y1="${y + size * 0.2}" x2="${cx}" y2="${y + size * 0.8}" stroke="${color}" stroke-width="1.5" />` +
             `<line x1="${cx - quarter}" y1="${y + size * 0.2}" x2="${cx + quarter}" y2="${y + size * 0.2}" stroke="${color}" stroke-width="1.5" />` +
             `<line x1="${cx - quarter * 0.8}" y1="${y + size * 0.35}" x2="${cx + quarter * 0.8}" y2="${y + size * 0.65}" stroke="${color}" stroke-width="1.2" />`
    case 'Treble (Triple) Crochet (tr)':
      return `<line x1="${cx}" y1="${y + size * 0.2}" x2="${cx}" y2="${y + size * 0.8}" stroke="${color}" stroke-width="1.5" />` +
             `<line x1="${cx - quarter}" y1="${y + size * 0.2}" x2="${cx + quarter}" y2="${y + size * 0.2}" stroke="${color}" stroke-width="1.5" />` +
             `<line x1="${cx - quarter * 0.8}" y1="${y + size * 0.35}" x2="${cx + quarter * 0.8}" y2="${y + size * 0.65}" stroke="${color}" stroke-width="1.2" />` +
             `<line x1="${cx - quarter * 0.8}" y1="${y + size * 0.5}" x2="${cx + quarter * 0.8}" y2="${y + size * 0.8}" stroke="${color}" stroke-width="1.2" />`
    case 'Double Turning Chain': {
      const spacing = size * 0.22
      return `<ellipse cx="${cx}" cy="${cy - spacing/2}" rx="${half * 0.4}" ry="${half * 0.7 * 0.7}" fill="none" stroke="${color}" stroke-width="1.2" />` +
             `<ellipse cx="${cx}" cy="${cy + spacing/2}" rx="${half * 0.4}" ry="${half * 0.7 * 0.7}" fill="none" stroke="${color}" stroke-width="1.2" />`
    }
    case 'Triple Turning Chain': {
      const spacing = size * 0.22
      return `<ellipse cx="${cx}" cy="${cy - spacing}" rx="${half * 0.4}" ry="${half * 0.7 * 0.7}" fill="none" stroke="${color}" stroke-width="1.2" />` +
             `<ellipse cx="${cx}" cy="${cy}" rx="${half * 0.4}" ry="${half * 0.7 * 0.7}" fill="none" stroke="${color}" stroke-width="1.2" />` +
             `<ellipse cx="${cx}" cy="${cy + spacing}" rx="${half * 0.4}" ry="${half * 0.7 * 0.7}" fill="none" stroke="${color}" stroke-width="1.2" />`
    }
    case 'Quadruple Turning Chain': {
      const spacing = size * 0.16
      return `<ellipse cx="${cx}" cy="${cy - spacing * 1.5}" rx="${half * 0.4}" ry="${half * 0.7 * 0.7}" fill="none" stroke="${color}" stroke-width="1.2" />` +
             `<ellipse cx="${cx}" cy="${cy - spacing * 0.5}" rx="${half * 0.4}" ry="${half * 0.7 * 0.7}" fill="none" stroke="${color}" stroke-width="1.2" />` +
             `<ellipse cx="${cx}" cy="${cy + spacing * 0.5}" rx="${half * 0.4}" ry="${half * 0.7 * 0.7}" fill="none" stroke="${color}" stroke-width="1.2" />` +
             `<ellipse cx="${cx}" cy="${cy + spacing * 1.5}" rx="${half * 0.4}" ry="${half * 0.7 * 0.7}" fill="none" stroke="${color}" stroke-width="1.2" />`
    }
    default:
      return ''
  }
}

function exportGridToJson() {
  // Gather all relevant data
  const data = {
    version: 1,
    shape: props.shape,
    sizeX: gridCountX.value,
    sizeY: gridCountY.value,
    zoom: props.zoom,
    gridStitches: props.gridStitches
  }
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `crochet-grid-${props.shape || 'pattern'}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>
<template>
  <div class="shape-preview">
    <div
      class="shape-scroll-container"
      ref="containerRef"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
      @contextmenu="onContextMenu"
      tabindex="0"
    >
      <svg
        v-if="shape === 'Square' || shape === 'Rectangle' || shape === 'Circle'"
        :width="shapeStyle.width"
        :height="shapeStyle.height"
        :style="{ display: 'block', margin: '0 auto' }"
        @mouseup="handleSvgMouseUp"
        @mouseleave="handleSvgMouseLeave"
      >
        <defs>
          <clipPath id="circle-clip" v-if="shape === 'Circle'">
            <circle :cx="shapeStyle.width/2" :cy="shapeStyle.height/2" :r="Math.min(shapeStyle.width, shapeStyle.height)/2" />
          </clipPath>
        </defs>
        <rect v-if="shape !== 'Circle'" x="0" y="0" :width="shapeStyle.width" :height="shapeStyle.height" fill="#1769aa22" stroke="#1769aa" stroke-width="2" />
        <circle v-else :cx="shapeStyle.width/2" :cy="shapeStyle.height/2" :r="Math.min(shapeStyle.width, shapeStyle.height)/2" fill="#1769aa22" stroke="#1769aa" stroke-width="2" />
        <g :clip-path="shape === 'Circle' ? 'url(#circle-clip)' : undefined">
          <!-- Render grid squares and stitch symbols -->
          <g>
            <template v-for="row in gridCountY" :key="'row-'+(row-1)">
              <template v-for="col in gridCountX" :key="'sq-'+(row-1)+'-'+(col-1)">
                <rect
                  :x="((col-1) * shapeStyle.width / gridCountX)"
                  :y="((row-1) * shapeStyle.height / gridCountY)"
                  :width="shapeStyle.width / gridCountX"
                  :height="shapeStyle.height / gridCountY"
                  fill="transparent"
                  @mousedown="(e) => handleSquareMouseDown(row-1, col-1, e)"
                  @mouseenter="() => handleSquareMouseEnter(row-1, col-1)"
                  style="cursor:pointer;"
                />
                <g
                  v-if="props.gridStitches && props.gridStitches[row-1] && props.gridStitches[row-1][col-1]"
                  v-html="renderStitchSymbol(props.gridStitches[row-1][col-1], ((col-1) * shapeStyle.width / gridCountX), ((row-1) * shapeStyle.height / gridCountY), shapeStyle.width / gridCountX)"
                />
              </template>
            </template>
          </g>
          <line v-for="(line, idx) in gridLines" :key="'l'+idx" v-bind="line" stroke="#1769aa55" stroke-width="1" />
        </g>
      </svg>
      <svg v-else-if="shape === 'Triangle'" :width="shapeStyle.width" :height="shapeStyle.height" :viewBox="`0 0 ${shapeStyle.width} ${shapeStyle.height}`" style="display: block; margin: 0 auto;">
        <defs>
          <clipPath id="triangle-clip">
            <polygon :points="`${shapeStyle.width/2},0 ${shapeStyle.width},${shapeStyle.height} 0,${shapeStyle.height}`" />
          </clipPath>
        </defs>
        <polygon :points="`${shapeStyle.width/2},0 ${shapeStyle.width},${shapeStyle.height} 0,${shapeStyle.height}`" fill="#1769aa22" stroke="#1769aa" stroke-width="2" />
        <g :clip-path="'url(#triangle-clip)'">
          <!-- Render grid squares for triangle (optional, not implemented here) -->
          <line v-for="i in (gridCountX - 1)" :key="'v'+i" :x1="(shapeStyle.width/gridCountX)*i" y1="0" :x2="(shapeStyle.width/gridCountX)*i" :y2="shapeStyle.height" stroke="#1769aa55" stroke-width="1" />
          <line v-for="i in (gridCountY - 1)" :key="'h'+i" x1="0" :y1="(shapeStyle.height/gridCountY)*i" :x2="shapeStyle.width" :y2="(shapeStyle.height/gridCountY)*i" stroke="#1769aa55" stroke-width="1" />
        </g>
      </svg>
    </div>
    <div class="shape-label">{{ shape }}<span v-if="sizeX && sizeY"> ({{ sizeX }}x{{ sizeY }})</span></div>
  </div>
</template>
<style scoped>
.shape-preview {
  margin-top: 2rem;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.shape-scroll-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  border: 1px solid #ccc;
  margin: 0 auto;
  background: #fff;
  position: relative;
  outline: none;
  cursor: default;
  /* Remove flex and centering to allow SVG to overflow and enable scrolling */
}
.shape-label {
  margin-top: 0.5rem;
  color: #1769aa;
  font-weight: bold;
}
</style>
