import { ref, readonly } from 'vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import LZString from 'lz-string'

// Tutorial diagram: shows the 4-step share workflow with annotations
export const DEFAULT_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">

  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="Start_1" name="Open&#10;BPMN Fiddle" />

    <bpmn:task id="Task_Edit"  name="1. Edit Diagram" />
    <bpmn:task id="Task_Save"  name="2. URL saves&#10;automatically" />
    <bpmn:task id="Task_Share" name="3. Click Share&#10;&amp; send URL" />
    <bpmn:task id="Task_Open"  name="4. Recipient opens&#10;URL &amp; edits" />

    <bpmn:endEvent id="End_1" name="Done" />

    <bpmn:sequenceFlow id="Flow_1" sourceRef="Start_1"    targetRef="Task_Edit" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_Edit"  targetRef="Task_Save" />
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Task_Save"  targetRef="Task_Share" />
    <bpmn:sequenceFlow id="Flow_4" sourceRef="Task_Share" targetRef="Task_Open" />
    <bpmn:sequenceFlow id="Flow_5" sourceRef="Task_Open"  targetRef="End_1" />

    <bpmn:textAnnotation id="Ann_1">
      <bpmn:text>Use the palette on the left. Drag shapes onto the canvas and connect them with arrows.</bpmn:text>
    </bpmn:textAnnotation>
    <bpmn:textAnnotation id="Ann_2">
      <bpmn:text>Every change auto-saves to the URL hash. Press Ctrl+S to force-save at any time.</bpmn:text>
    </bpmn:textAnnotation>
    <bpmn:textAnnotation id="Ann_3">
      <bpmn:text>Click the Share button to copy the full URL to your clipboard and send it.</bpmn:text>
    </bpmn:textAnnotation>
    <bpmn:textAnnotation id="Ann_4">
      <bpmn:text>The URL encodes the complete diagram. Anyone with the link can view and continue editing.</bpmn:text>
    </bpmn:textAnnotation>

    <bpmn:association id="Assoc_1" sourceRef="Task_Edit"  targetRef="Ann_1" />
    <bpmn:association id="Assoc_2" sourceRef="Task_Save"  targetRef="Ann_2" />
    <bpmn:association id="Assoc_3" sourceRef="Task_Share" targetRef="Ann_3" />
    <bpmn:association id="Assoc_4" sourceRef="Task_Open"  targetRef="Ann_4" />
  </bpmn:process>

  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">

      <bpmndi:BPMNShape id="Start_1_di" bpmnElement="Start_1">
        <dc:Bounds x="132" y="202" width="36" height="36" />
        <bpmndi:BPMNLabel><dc:Bounds x="118" y="245" width="64" height="27" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="Task_Edit_di" bpmnElement="Task_Edit">
        <dc:Bounds x="220" y="180" width="130" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Save_di" bpmnElement="Task_Save">
        <dc:Bounds x="410" y="180" width="130" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Share_di" bpmnElement="Task_Share">
        <dc:Bounds x="600" y="180" width="130" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Open_di" bpmnElement="Task_Open">
        <dc:Bounds x="790" y="180" width="130" height="80" />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNShape id="End_1_di" bpmnElement="End_1">
        <dc:Bounds x="982" y="202" width="36" height="36" />
        <bpmndi:BPMNLabel><dc:Bounds x="985" y="245" width="30" height="14" /></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>

      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="168" y="220" /><di:waypoint x="220" y="220" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="350" y="220" /><di:waypoint x="410" y="220" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
        <di:waypoint x="540" y="220" /><di:waypoint x="600" y="220" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_4_di" bpmnElement="Flow_4">
        <di:waypoint x="730" y="220" /><di:waypoint x="790" y="220" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_5_di" bpmnElement="Flow_5">
        <di:waypoint x="920" y="220" /><di:waypoint x="982" y="220" />
      </bpmndi:BPMNEdge>

      <!-- Annotations above the flow -->
      <bpmndi:BPMNShape id="Ann_1_di" bpmnElement="Ann_1">
        <dc:Bounds x="210" y="60" width="150" height="68" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Ann_2_di" bpmnElement="Ann_2">
        <dc:Bounds x="400" y="60" width="150" height="68" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Ann_3_di" bpmnElement="Ann_3">
        <dc:Bounds x="590" y="60" width="150" height="68" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Ann_4_di" bpmnElement="Ann_4">
        <dc:Bounds x="780" y="60" width="150" height="68" />
      </bpmndi:BPMNShape>

      <bpmndi:BPMNEdge id="Assoc_1_di" bpmnElement="Assoc_1">
        <di:waypoint x="285" y="128" /><di:waypoint x="285" y="180" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Assoc_2_di" bpmnElement="Assoc_2">
        <di:waypoint x="475" y="128" /><di:waypoint x="475" y="180" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Assoc_3_di" bpmnElement="Assoc_3">
        <di:waypoint x="665" y="128" /><di:waypoint x="665" y="180" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Assoc_4_di" bpmnElement="Assoc_4">
        <di:waypoint x="855" y="128" /><di:waypoint x="855" y="180" />
      </bpmndi:BPMNEdge>

    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`

// ── URL encoding (LZ-compressed, URL-safe) ────────────────────────────────────

export function encodeXml(xml) {
  return LZString.compressToEncodedURIComponent(xml)
}

export function decodeXml(encoded) {
  return LZString.decompressFromEncodedURIComponent(encoded)
}

export function getXmlFromUrl() {
  try {
    const url  = new URL(window.location.href)
    const hash = url.hash.startsWith('#xml=') ? url.hash.slice(5) : ''
    const encoded = hash || url.searchParams.get('xml')
    if (!encoded) return null
    return decodeXml(encoded) || null
  } catch {
    return null
  }
}

export function setXmlToUrl(xml, replace = true) {
  const encoded = encodeXml(xml)
  const url = new URL(window.location.href)
  url.searchParams.delete('xml')
  url.hash = `xml=${encoded}`
  if (replace) window.history.replaceState({}, '', url.toString())
  else window.history.pushState({}, '', url.toString())
  return url.toString()
}

// ── Composable ────────────────────────────────────────────────────────────────

export function useBpmn(containerRef) {
  const xml      = ref('')
  const draftXml = ref('')
  const shareUrl = ref(window.location.href)
  const error    = ref('')
  const isDirty  = ref(false)

  let modeler   = null
  let saveTimer = null

  async function syncUrl(replace = true) {
    if (!modeler) return
    try {
      const { xml: nextXml } = await modeler.saveXML({ format: true })
      const nextUrl  = setXmlToUrl(nextXml, replace)
      xml.value      = nextXml
      draftXml.value = nextXml
      shareUrl.value = nextUrl
      isDirty.value  = false
      error.value    = ''
    } catch (err) {
      error.value = err?.message ?? 'Failed to serialize BPMN XML'
    }
  }

  async function importXml(nextXml, replace = true) {
    if (!modeler) return
    try {
      await modeler.importXML(nextXml)
      fitView()
      const importedUrl  = setXmlToUrl(nextXml, replace)
      xml.value          = nextXml
      draftXml.value     = nextXml
      shareUrl.value     = importedUrl
      isDirty.value      = false
      error.value        = ''
    } catch (err) {
      error.value = err?.message ?? 'Failed to import BPMN XML'
    }
  }

  function fitView() {
    if (!modeler) return
    const canvas = modeler.get('canvas')
    canvas.zoom('fit-viewport')
    // Use inner (actual content bounds) as anchor so padding is always relative
    // to the diagram elements, not the pre-padded viewport edge.
    const { scale, inner } = canvas.viewbox()
    const padLeft = 120 / scale  // clear bpmn-js palette (~46px) + breathing room
    const pad     =  40 / scale
    canvas.viewbox({
      x:      inner.x - padLeft,
      y:      inner.y - pad,
      width:  inner.width  + padLeft + pad,
      height: inner.height + pad * 2,
    })
  }

  function zoom(direction) {
    if (!modeler) return
    const canvas  = modeler.get('canvas')
    canvas.zoom(direction === 'in' ? canvas.zoom() * 1.2 : canvas.zoom() / 1.2)
  }

  function undo() { modeler?.get('commandStack').undo() }
  function redo() { modeler?.get('commandStack').redo() }

  async function applyDraftXml() { await importXml(draftXml.value, false) }
  async function newDiagram()    { await importXml(DEFAULT_XML, false) }

  async function downloadBpmn() {
    if (!modeler) return
    const { xml: currentXml } = await modeler.saveXML({ format: true })
    const blob = new Blob([currentXml], { type: 'application/xml;charset=utf-8' })
    const a    = document.createElement('a')
    a.href     = URL.createObjectURL(blob)
    a.download = 'diagram.bpmn'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(a.href)
  }

  async function openFile(file) {
    try {
      const text = await file.text()
      await importXml(text, false)
    } catch (err) {
      error.value = 'Could not read file: ' + err.message
    }
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  async function init() {
    modeler = new BpmnModeler({
      container: containerRef.value,
      keyboard: { bindTo: window },
    })

    const onChange = () => {
      isDirty.value = true
      clearTimeout(saveTimer)
      saveTimer = setTimeout(() => syncUrl(true), 400)
    }

    modeler.on('commandStack.changed', onChange)

    const initialXml = getXmlFromUrl() ?? DEFAULT_XML
    await importXml(initialXml, true)

    const onPopState = () => {
      const nextXml = getXmlFromUrl()
      if (nextXml) importXml(nextXml, true)
    }
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault()
        syncUrl(false)
      }
    }

    window.addEventListener('popstate', onPopState)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      clearTimeout(saveTimer)
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('keydown', onKeyDown)
    }
  }

  function destroy(cleanup) {
    cleanup?.()
    clearTimeout(saveTimer)
    modeler?.destroy()
    modeler = null
  }

  return {
    xml: readonly(xml), draftXml, shareUrl: readonly(shareUrl),
    error: readonly(error), isDirty: readonly(isDirty),
    init, destroy,
    fitView, zoom, undo, redo,
    newDiagram, downloadBpmn, openFile, applyDraftXml,
  }
}
