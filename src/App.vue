<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useBpmn } from './composables/useBpmn.js'

const canvasRef = ref(null)
const {
  shareUrl, error,
  init, destroy,
  fitView, zoom, undo, redo,
  newDiagram, downloadBpmn, openFile,
} = useBpmn(canvasRef)

const dragging  = ref(false)
const showAbout = ref(false)
const copiedUrl = ref(false)
let cleanupFn = null

// ── URL size ──────────────────────────────────────────────────────────────────
const urlBytes = computed(() => new Blob([shareUrl.value]).size)
const urlKb    = computed(() => (urlBytes.value / 1024).toFixed(1))
const sizeLevel = computed(() => {
  if (urlBytes.value < 4000) return 'good'
  if (urlBytes.value < 8000) return 'warn'
  return 'bad'
})

onMounted(async () => { cleanupFn = await init() })
onBeforeUnmount(() => { destroy(cleanupFn) })

// ── Share ─────────────────────────────────────────────────────────────────────
async function copyUrl() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = shareUrl.value
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  copiedUrl.value = true
  setTimeout(() => { copiedUrl.value = false }, 1400)
}

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  e.target.value = ''
  openFile(file)
}

function onDrop(e) {
  e.preventDefault()
  dragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) openFile(file)
}
</script>

<template>
  <div class="app">

    <!-- ── Toolbar ─────────────────────────────────────────────────────────── -->
    <header class="toolbar">
      <div class="toolbar__brand">
        <svg class="brand-icon" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L22 12L12 22L2 12L12 2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M8 12H16M12 8V16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <span class="brand-name">BPMN <strong>Fiddle</strong></span>
      </div>

      <div class="toolbar__sep" />

      <div class="toolbar__group">
        <button class="btn" title="New diagram" @click="newDiagram">
          <fa-icon :icon="['fas', 'file-circle-plus']" /><span>New</span>
        </button>
        <label class="btn" title="Open .bpmn file">
          <fa-icon :icon="['fas', 'folder-open']" /><span>Open</span>
          <input type="file" accept=".bpmn,.xml" style="display:none" @change="onFileChange" />
        </label>
      </div>

      <div class="toolbar__sep" />

      <div class="toolbar__group">
        <button class="btn btn--icon" title="Undo (Ctrl+Z)" @click="undo">
          <fa-icon :icon="['fas', 'rotate-left']" />
        </button>
        <button class="btn btn--icon" title="Redo (Ctrl+Y)" @click="redo">
          <fa-icon :icon="['fas', 'rotate-right']" />
        </button>
      </div>

      <div class="toolbar__sep" />

      <div class="toolbar__group">
        <button class="btn btn--icon" title="Zoom out" @click="zoom('out')">
          <fa-icon :icon="['fas', 'magnifying-glass-minus']" />
        </button>
        <button class="btn btn--icon" title="Fit diagram" @click="fitView">
          <fa-icon :icon="['fas', 'expand']" />
        </button>
        <button class="btn btn--icon" title="Zoom in" @click="zoom('in')">
          <fa-icon :icon="['fas', 'magnifying-glass-plus']" />
        </button>
      </div>

      <div class="toolbar__sep" />

      <div class="toolbar__group">
        <button class="btn" title="Download .bpmn file" @click="downloadBpmn">
          <fa-icon :icon="['fas', 'download']" /><span>Download</span>
        </button>
      </div>

      <div class="toolbar__sep" />

      <!-- ── Share group with size badge ── -->
      <div class="toolbar__group share-group">
        <div class="size-badge" :class="`size-badge--${sizeLevel}`" :title="`URL size: ${urlBytes} bytes`">
          <fa-icon v-if="sizeLevel !== 'good'" :icon="['fas', 'triangle-exclamation']" class="size-badge__icon" />
          {{ urlKb }} KB
        </div>
        <button class="btn btn--share" @click="copyUrl" title="Copy share URL">
          <fa-icon :icon="copiedUrl ? ['fas', 'check'] : ['fas', 'share-nodes']" />
          <span>{{ copiedUrl ? 'Copied!' : 'Share' }}</span>
        </button>
      </div>

      <div class="toolbar__spacer" />

      <button class="btn btn--icon btn--muted" title="About & licenses" @click="showAbout = true">
        <fa-icon :icon="['fas', 'circle-info']" />
      </button>
    </header>

    <div v-if="error" class="error-banner">{{ error }}</div>

    <!-- ── Canvas ─────────────────────────────────────────────────────────── -->
    <div
      class="canvas-wrap"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop="onDrop"
    >
      <div ref="canvasRef" class="bpmn-canvas" />
      <div class="drop-hint" :class="{ 'drop-hint--visible': dragging }">
        <fa-icon :icon="['fas', 'folder-open']" style="margin-right:10px" />
        Drop .bpmn file here
      </div>
    </div>

    <!-- ── About modal ─────────────────────────────────────────────────────── -->
    <Transition name="fade">
      <div v-if="showAbout" class="modal-backdrop" @click.self="showAbout = false">
        <div class="modal">
          <div class="modal__header">
            <div class="modal__brand">
              <svg class="modal__logo" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L22 12L12 22L2 12L12 2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                <path d="M8 12H16M12 8V16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              <div>
                <div class="modal__title">BPMN Fiddle</div>
                <div class="modal__subtitle">Browser-based BPMN editor — no backend, no login</div>
              </div>
            </div>
            <button class="modal__close" @click="showAbout = false">
              <fa-icon :icon="['fas', 'xmark']" />
            </button>
          </div>
          <div class="modal__body">
            <p class="modal__desc">
              Diagrams are stored entirely in the URL using LZ compression.
              Share a link and anyone can open and continue editing the exact same diagram.
            </p>
            <h3 class="modal__section-title">Open-source libraries</h3>
            <div class="modal__libs">
              <a class="lib-card" href="https://bpmn.io" target="_blank" rel="noopener">
                <div class="lib-card__name">bpmn-js</div>
                <div class="lib-card__desc">BPMN 2.0 rendering &amp; editing toolkit by <strong>bpmn.io / Camunda</strong></div>
                <div class="lib-card__meta">
                  <span class="badge badge--mit">MIT</span>
                  <span class="lib-card__url">bpmn.io</span>
                </div>
              </a>
              <a class="lib-card" href="https://vuejs.org" target="_blank" rel="noopener">
                <div class="lib-card__name">Vue 3</div>
                <div class="lib-card__desc">Progressive JavaScript framework for building user interfaces</div>
                <div class="lib-card__meta">
                  <span class="badge badge--mit">MIT</span>
                  <span class="lib-card__url">vuejs.org</span>
                </div>
              </a>
              <a class="lib-card" href="https://fontawesome.com" target="_blank" rel="noopener">
                <div class="lib-card__name">Font Awesome Free</div>
                <div class="lib-card__desc">Icon toolkit — icons used under Creative Commons Attribution 4.0</div>
                <div class="lib-card__meta">
                  <span class="badge badge--cc">CC BY 4.0</span>
                  <span class="lib-card__url">fontawesome.com</span>
                </div>
              </a>
              <a class="lib-card" href="https://github.com/pieroxy/lz-string" target="_blank" rel="noopener">
                <div class="lib-card__name">lz-string</div>
                <div class="lib-card__desc">LZ-based compression for storing diagrams in the URL hash</div>
                <div class="lib-card__meta">
                  <span class="badge badge--mit">MIT</span>
                  <span class="lib-card__url">github.com/pieroxy/lz-string</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Toolbar ───────────────────────────────────────────────────────────────── */
.toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 14px;
  height: 52px;
  background: #fff;
  border-bottom: 1px solid #e2e4e8;
  flex-shrink: 0;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: visible;
}

.toolbar__brand {
  display: flex;
  align-items: center;
  gap: 9px;
  padding-right: 6px;
  white-space: nowrap;
  user-select: none;
}
.brand-icon { width: 22px; height: 22px; color: #5b6cf8; flex-shrink: 0; }
.brand-name { font-size: 15px; font-weight: 400; letter-spacing: -0.2px; color: #1a1a1a; }
.brand-name strong { font-weight: 700; }

.toolbar__sep { width: 1px; height: 22px; background: #e2e4e8; margin: 0 8px; flex-shrink: 0; }
.toolbar__spacer { flex: 1; }
.toolbar__group { display: flex; align-items: center; gap: 3px; }

.btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 0 12px; height: 34px;
  border: 1px solid transparent; border-radius: 7px;
  background: transparent; color: #3a3a3a;
  cursor: pointer; font-size: 13px; font-weight: 500;
  white-space: nowrap; transition: background 0.1s, border-color 0.1s;
  flex-shrink: 0;
}
.btn:hover { background: #f0f1f5; border-color: #e2e4e8; }
.btn:active { background: #e5e7ec; }
.btn--icon { padding: 0; width: 34px; justify-content: center; color: #555; }
.btn--muted { color: #bbb; }
.btn--muted:hover { color: #555; }
.btn--share { background: #5b6cf8; color: #fff; border-color: #5b6cf8; }
.btn--share:hover { background: #4a5be8; border-color: #4a5be8; }
.btn--share:active { background: #3a4bd8; }

/* ── Size badge ────────────────────────────────────────────────────────────── */
.size-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 0 8px; height: 22px; border-radius: 11px;
  font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums;
  border: 1px solid; margin-right: 8px;
  transition: background 0.3s, color 0.3s, border-color 0.3s;
}
.size-badge__icon { font-size: 10px; }
.size-badge--good { background: #f0fdf4; color: #15803d; border-color: #86efac; }
.size-badge--warn { background: #fffbeb; color: #b45309; border-color: #fcd34d; }
.size-badge--bad  { background: #fef2f2; color: #b91c1c; border-color: #fca5a5; }

/* ── Error ─────────────────────────────────────────────────────────────────── */
.error-banner {
  padding: 8px 14px; background: #fef2f2;
  border-bottom: 1px solid #fca5a5; color: #991b1b;
  font-size: 13px; flex-shrink: 0;
}

/* ── Canvas ────────────────────────────────────────────────────────────────── */
.canvas-wrap { flex: 1; position: relative; min-height: 0; background: #f7f8fa; }
.bpmn-canvas { width: 100%; height: 100%; }
:deep(.bjs-container) { background: #f7f8fa; }

.drop-hint {
  position: absolute; inset: 0;
  border: 3px dashed #5b6cf8; background: rgba(91,108,248,0.05);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: #5b6cf8;
  pointer-events: none; opacity: 0; transition: opacity 0.2s; z-index: 20;
}
.drop-hint--visible { opacity: 1; }

/* ── Modal ─────────────────────────────────────────────────────────────────── */
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; padding: 16px;
  backdrop-filter: blur(2px);
}

.modal {
  background: #fff; border-radius: 14px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  width: 100%; max-width: 480px; overflow: hidden;
}

.modal__header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 12px; padding: 20px 20px 16px;
  border-bottom: 1px solid #f0f0f0;
}
.modal__brand { display: flex; align-items: center; gap: 12px; }
.modal__logo { width: 36px; height: 36px; color: #5b6cf8; flex-shrink: 0; }
.modal__title { font-size: 17px; font-weight: 700; color: #111; letter-spacing: -0.3px; }
.modal__subtitle { font-size: 12px; color: #888; margin-top: 2px; }
.modal__close {
  width: 28px; height: 28px; border: none; background: #f5f5f5;
  border-radius: 6px; cursor: pointer; color: #666;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: background 0.1s;
}
.modal__close:hover { background: #ebebeb; color: #333; }

.modal__body { padding: 18px 20px 20px; display: flex; flex-direction: column; gap: 16px; }
.modal__desc { font-size: 13px; color: #555; line-height: 1.6; }
.modal__section-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #999; }
.modal__libs { display: flex; flex-direction: column; gap: 8px; }

.lib-card {
  display: block; padding: 12px 14px;
  border: 1px solid #ebebeb; border-radius: 10px;
  text-decoration: none; color: inherit;
  transition: border-color 0.15s, background 0.15s;
}
.lib-card:hover { border-color: #5b6cf8; background: #fafbff; }
.lib-card__name { font-size: 14px; font-weight: 600; color: #111; margin-bottom: 3px; }
.lib-card__desc { font-size: 12px; color: #666; line-height: 1.5; margin-bottom: 8px; }
.lib-card__meta { display: flex; align-items: center; gap: 8px; }
.lib-card__url { font-size: 11px; color: #aaa; font-family: monospace; }

.badge { display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 11px; font-weight: 600; }
.badge--mit { background: #ecfdf5; color: #065f46; }
.badge--cc  { background: #eff6ff; color: #1e40af; }

/* ── Transitions ───────────────────────────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
