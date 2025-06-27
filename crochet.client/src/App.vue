<script setup>
import { ref } from 'vue'
import SidePanel from './components/SidePanel.vue'
import ShapePreview from './components/ShapePreview.vue'

const crochetTypes = [
  'Tunisian Crochet',
  'Filet Crochet',
  'Granny Square',
  'Corner-to-Corner (C2C)',
  'Overlay Crochet',
  'Mosaic Crochet',
  'Tapestry Crochet',
  'Broomstick Lace',
  'Hairpin Lace',
  'Irish Crochet'
]
const crochetShapes = ['Square', 'Circle', 'Rectangle', 'Triangle', 'Custom']

const selectedType = ref(crochetTypes[0])
const selectedShape = ref(crochetShapes[0])
const itemSize = ref('')
const zoom = ref(2)
</script>

<template>
  <main class="main-layout">
    <aside class="side-panel-wrapper">
      <SidePanel
        :crochetTypes="crochetTypes"
        :crochetShapes="crochetShapes"
        v-model:selectedType="selectedType"
        v-model:selectedShape="selectedShape"
        v-model:itemSize="itemSize"
        v-model:zoom="zoom"
      />
    </aside>
    <section class="main-content">
      <ShapePreview :shape="selectedShape" :size="itemSize" :zoom="zoom" />
    </section>
  </main>
</template>
