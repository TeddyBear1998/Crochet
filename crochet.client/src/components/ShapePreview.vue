<script setup>
import { computed, ref } from 'vue'
const props = defineProps({
  shape: String,
  size: String, // grid count
  zoom: Number
})

const gridCount = computed(() => {
  const n = parseInt(props.size)
  return isNaN(n) || n < 1 ? 8 : n // default to 8x8 if invalid
})

const shapeStyle = computed(() => {
  const count = gridCount.value
  const zoom = props.zoom || 1
  let width = count * 10 * zoom, height = count * 10 * zoom, borderRadius = '0%'
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
  const count = gridCount.value
  const lines = []
  for (let i = 1; i < count; i++) {
    // Vertical lines
    lines.push({ x1: (width / count) * i, y1: 0, x2: (width / count) * i, y2: height })
    // Horizontal lines
    lines.push({ x1: 0, y1: (height / count) * i, x2: width, y2: (height / count) * i })
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
      <svg v-if="shape === 'Square' || shape === 'Rectangle' || shape === 'Circle'" :width="shapeStyle.width" :height="shapeStyle.height" :style="{ display: 'block', margin: '0 auto' }">
        <defs>
          <clipPath id="circle-clip" v-if="shape === 'Circle'">
            <circle :cx="shapeStyle.width/2" :cy="shapeStyle.height/2" :r="Math.min(shapeStyle.width, shapeStyle.height)/2" />
          </clipPath>
        </defs>
        <rect v-if="shape !== 'Circle'" x="0" y="0" :width="shapeStyle.width" :height="shapeStyle.height" fill="#1769aa22" stroke="#1769aa" stroke-width="2" />
        <circle v-else :cx="shapeStyle.width/2" :cy="shapeStyle.height/2" :r="Math.min(shapeStyle.width, shapeStyle.height)/2" fill="#1769aa22" stroke="#1769aa" stroke-width="2" />
        <g :clip-path="shape === 'Circle' ? 'url(#circle-clip)' : undefined">
          <line v-for="(line, idx) in gridLines" :key="idx" v-bind="line" stroke="#1769aa55" stroke-width="1" />
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
          <line v-for="i in (gridCount - 1)" :key="'v'+i" :x1="(shapeStyle.width/gridCount)*i" y1="0" :x2="(shapeStyle.width/gridCount)*i" :y2="shapeStyle.height" stroke="#1769aa55" stroke-width="1" />
          <line v-for="i in (gridCount - 1)" :key="'h'+i" x1="0" :y1="(shapeStyle.height/gridCount)*i" :x2="shapeStyle.width" :y2="(shapeStyle.height/gridCount)*i" stroke="#1769aa55" stroke-width="1" />
        </g>
      </svg>
    </div>
    <div class="shape-label">{{ shape }}<span v-if="size"> ({{ size }}x{{ size }})</span></div>
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
