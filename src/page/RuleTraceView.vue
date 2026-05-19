<template>
  <section class="rule-page">
    <div class="panel">
      <div class="panel-head">
        <h2>规则应用路径</h2>
        <span class="link">详情</span>
      </div>
      <div ref="pathCanvasRef" class="path-canvas">
        <svg
          class="path-svg"
          :viewBox="`0 0 ${canvasSize.width} ${canvasSize.height}`"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <marker id="pathArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 z" fill="#7faaf0" />
            </marker>
          </defs>
          <path
            v-for="line in pathLines"
            :key="line.key"
            :d="line.d"
            class="path-line"
            :marker-end="line.arrow ? 'url(#pathArrow)' : undefined"
          />
        </svg>

        <div class="path-grid">
          <div class="col" :class="group.maxRow === 3 ? 'col-3' : 'col-5'" v-for="group in pathGroups" :key="group.title">
            <h3 class="group-title">{{ group.title }}</h3>
            <div
              class="chip"
              v-for="item in group.items"
              :key="item.text"
              :class="`row-${item.row}`"
              :data-anchor="`${group.col}-${item.row}`"
            >
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flow-wrap">
      <div class="panel flow-left">
        <h2>流水结构(11)</h2>
        <div class="kv" v-for="row in leftRows" :key="row.label">
          <span>{{ row.label }}</span>
          <strong>{{ row.value }}</strong>
        </div>
      </div>

      <div class="panel flow-center">
        <h2>规则判断流程</h2>
        <div class="flow-canvas">
          <svg class="flow-svg" viewBox="0 0 760 640" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill="#78a5ef" />
              </marker>
              <marker id="arrowGold" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill="#e4b45a" />
              </marker>
            </defs>
            <path d="M380 120 L380 210" class="line blue" marker-end="url(#arrowBlue)" />
            <path d="M380 290 L380 385" class="line gold" marker-end="url(#arrowGold)" />
            <path d="M250 122 L86 122 L86 505 L190 505" class="line blue dashed" marker-end="url(#arrowBlue)" />
            <path d="M506 505 L676 505" class="line blue dashed" marker-end="url(#arrowBlue)" />
          </svg>

          <div class="node blue node-top">子交易选择</div>
          <div class="hint hint-1">条件满足 LOAN0201-利息计提-应计</div>
          <div class="node yellow node-middle">子交易分录行条件判断</div>
          <div class="hint hint-2">条件满足</div>
          <div class="node blue large node-bottom">子交易分录行加工规则</div>
        </div>
      </div>

      <div class="panel flow-right">
        <div class="banner">
          <div>
            <h3>凭证结构</h3>
            <p>解释说明解释说明</p>
          </div>
        </div>
        <div class="kv" v-for="row in rightRows" :key="row.label">
          <span>{{ row.label }}</span>
          <strong>{{ row.value }}</strong>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="flex justify">
        <h2>计算日志</h2>
        <span class="link">日志源码</span>
      </div>
      <div class="timeline">
        <div class="dot" v-for="log in logs" :key="log.time">
          <p class="time">{{ log.time }}</p>
          <div class="card">{{ log.text }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

defineOptions({ name: 'RuleTraceView' })

const pathLines = ref([])
const pathCanvasRef = ref(null)
const canvasSize = ref({ width: 1600, height: 280 })
let resizeTimer = null

const pathGroups = [
  { title: '业务类型', col: 1, maxRow: 5, items: [{ text: 'LN-贷款', row: 1 }] },
  { title: '交易场景', col: 2, maxRow: 5, items: [{ text: 'LOAN02-利息计提', row: 1 }] },
  {
    title: '子交易',
    col: 3,
    maxRow: 5,
    items: [
      { text: 'LOAN0201-利息计提-应计', row: 1 },
      { text: 'LOAN0202-利息计提-非应计', row: 4 },
      { text: 'LOAN0203-利息计提-核销', row: 5 },
    ],
  },
  {
    title: '子交易分录行',
    col: 4,
    maxRow: 5,
    items: [
      { text: '借 应计利息 LOAN0202', row: 1 },
      { text: '贷 利息收入 LXS', row: 2 },
      { text: '贷 销项税 TAX', row: 3 },
      { text: '借 应计利息 INT', row: 4 },
      { text: '借 应计利息 INT', row: 5 },
    ],
  },
  {
    title: '核算科目',
    col: 5,
    maxRow: 5,
    items: [
      { text: '1311020201-以摊余成本计量的个人贷款-应计利息', row: 1 },
      { text: '50010101-单位贷款利息收入', row: 2 },
      { text: '23010101-销项税', row: 3 },
      { text: '70010101-表外应收利息', row: 4 },
      { text: '70020101-已核销贷款利息', row: 5 },
    ],
  },
]

const getAnchor = (anchorKey) => {
  const canvas = pathCanvasRef.value
  const node = document.querySelector(`[data-anchor="${anchorKey}"]`)
  if (!canvas || !node) return null

  const canvasRect = canvas.getBoundingClientRect()
  const nodeRect = node.getBoundingClientRect()
  return {
    left: nodeRect.left - canvasRect.left,
    right: nodeRect.right - canvasRect.left,
    centerY: nodeRect.top - canvasRect.top + nodeRect.height / 2,
  }
}

const hLine = (key, startX, endX, y) => ({ key, d: `M${startX} ${y} L${endX} ${y}`, arrow: true })

const recomputePathLines = () => {
  const canvas = pathCanvasRef.value
  if (!canvas) return
  canvasSize.value = {
    width: canvas.clientWidth || 1600,
    height: canvas.clientHeight || 280,
  }

  const c11 = getAnchor('1-1')
  const c21 = getAnchor('2-1')
  const c31 = getAnchor('3-1')
  const c34 = getAnchor('3-4')
  const c35 = getAnchor('3-5')
  const c41 = getAnchor('4-1')
  const c44 = getAnchor('4-4')
  const c45 = getAnchor('4-5')
  const c51 = getAnchor('5-1')
  const c54 = getAnchor('5-4')
  const c55 = getAnchor('5-5')

  if (!c11 || !c21 || !c31 || !c34 || !c35 || !c41 || !c44 || !c45 || !c51 || !c54 || !c55) return

  const branchX = (c21.right + c31.left) / 2
  pathLines.value = [
    hLine('l1', c11.right, c21.left, c11.centerY),
    hLine('l2', c21.right, c31.left, c21.centerY),
    hLine('l3', c31.right, c41.left, c31.centerY),
    hLine('l4', c41.right, c51.left, c41.centerY),
    { key: 'b0', d: `M${branchX} ${c21.centerY} L${branchX} ${c35.centerY}`, arrow: false },
    hLine('b1', branchX, c34.left, c34.centerY),
    hLine('b2', branchX, c35.left, c35.centerY),
    hLine('b3', c34.right, c44.left, c34.centerY),
    hLine('b4', c35.right, c45.left, c35.centerY),
    hLine('b5', c44.right, c54.left, c44.centerY),
    hLine('b6', c45.right, c55.left, c45.centerY),
  ]
}

const onResize = () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => recomputePathLines(), 60)
}

onMounted(async () => {
  await nextTick()
  recomputePathLines()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

const leftRows = [
  { label: '流水号', value: '202504150001' },
  { label: '账务日期', value: '2025-04-15' },
  { label: '账务机构', value: '01000-总行营业部' },
  { label: '币种', value: 'CNY-人民币' },
  { label: '业务类型', value: 'LN' },
  { label: '交易场景', value: 'LOAN02-利息计提' },
  { label: '贷款应计标识', value: 'Y' },
  { label: '产品', value: 'LOAN' },
  { label: '金额类型', value: 'LOAN202-应计利息' },
  { label: '交易金额', value: '1,250.00' },
]

const rightRows = [
  { label: '流水号', value: '202504150001' },
  { label: '账务日期', value: '2025-04-15' },
  { label: '账务机构', value: '01000-总行营业部' },
  { label: '借贷标志', value: '借方' },
  { label: '科目代码', value: '1311020201' },
  { label: '科目名称', value: '以摊余成本计量的个人贷款-应计利息' },
  { label: '金额', value: '1,250.00' },
]

const logs = [
  { time: '2025-04-15 10:00:01', text: '开始处理流水 1202504150001' },
  { time: '2025-04-15 10:00:02', text: '执行规则[子交易选择] 结果(LOAN0201)' },
  { time: '2025-04-15 10:00:03', text: '执行规则[分录行条件判断] 条件满足' },
  { time: '2025-04-15 10:00:04', text: '执行规则[分录行加工规则] 生成科目代码' },
  { time: '2025-04-15 10:00:05', text: '生成凭证分录行' },
]
</script>

<style scoped>
.rule-page {
  padding: 14px;
  background: linear-gradient(180deg, #f4f8ff 0%, #eef3fb 100%);
  color: #2e3f57;
}

.panel {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 18px rgb(56 102 194 / 10%);
  margin-bottom: 14px;
}

.panel-head,
h2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 14px;
  font-size: 16px;
  color: #27466f;
}

h3 {
  margin: 0 0 10px;
  font-size: 14px;
  color: #2d5691;
}

.link {
  color: #3b75da;
  font-size: 14px;
  cursor: pointer;
}

.path-canvas {
  position: relative;
  min-height: 280px;
}

.path-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.path-line {
  fill: none;
  stroke: #7faaf0;
  stroke-width: 1.6;
  stroke-dasharray: 6 4;
}

.path-grid {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 80px;
  grid-template-columns: 1fr 1fr 1.35fr 1.35fr 2.1fr;
}

.col {
  display: grid;
  gap: 16px;
}

.col-3 {
  grid-template-rows: 30px 46px 46px 46px;
}

.col-5 {
  grid-template-rows: 30px 46px 46px 46px 46px 46px;
}

.chip {
  background: #ecf3ff;
  border: 1px solid #d3e1fb;
  padding: 10px 12px;
  border-radius: 6px;
  color: #4f79b8;
  font-size: 13px;
  line-height: 22px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.group-title {
  position: relative;
  margin: 0;
  padding-left: 18px;
  font-size: 16px;
  line-height: 1;
  color: #2f3f58;
  font-weight: 700;
}

.group-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 2px;
  width: 5px;
  height: 14px;
  border-radius: 2px;
  background: #f2b84e;
}

.group-title::after {
  content: '';
  position: absolute;
  left: 8px;
  top: 4px;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 8px solid #7aa9eb;
}

.row-1 {
  grid-row: 2;
}

.row-2 {
  grid-row: 3;
}

.row-3 {
  grid-row: 4;
}

.row-4 {
  grid-row: 5;
}

.row-5 {
  grid-row: 6;
}

.flow-wrap {
  display: grid;
  gap: 14px;
  grid-template-columns: 2fr 3fr 2fr;
}

.kv {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  background: #f5f8ff;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 8px;
}

.kv span {
  color: #50698e;
}

.kv strong {
  color: #2f3c4f;
  font-weight: 600;
}

.flow-center {
  text-align: center;
}

.flow-canvas {
  position: relative;
  min-height: 640px;
}

.flow-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.line {
  fill: none;
  stroke-width: 3;
}

.line.blue {
  stroke: #78a5ef;
}

.line.gold {
  stroke: #e4b45a;
}

.line.dashed {
  stroke-dasharray: 8 6;
}

.node {
  width: 72%;
  border-radius: 10px;
  border: 2px solid;
  font-size: 16px;
  font-weight: 600;
}

.node.blue {
  border-color: #5f95f1;
  color: #2c63bf;
  background: #eef5ff;
}

.node.yellow {
  border-color: #e4b45a;
  color: #a16a09;
  background: #fff6e3;
}

.node.large {
  width: 86%;
}

.node-top {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
}

.node-middle {
  position: absolute;
  top: 260px;
  left: 50%;
  transform: translateX(-50%);
}

.node-bottom {
  position: absolute;
  top: 430px;
  left: 50%;
  transform: translateX(-50%);
}

.hint {
  color: #6a7692;
  margin: 8px 0 12px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px;
}

.hint-1 {
  top: 180px;
}

.hint-2 {
  top: 370px;
}

.banner {
  margin-bottom: 10px;
  border-radius: 10px;
  padding: 16px;
  color: #fff;
  background: linear-gradient(120deg, #5d93f1 0%, #3068dc 100%);
}

.banner h3 {
  color: #fff;
  font-size: 20px;
  margin-bottom: 8px;
}

.banner p {
  margin: 0;
  font-size: 13px;
  opacity: 0.9;
}

.timeline {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(120px, 1fr));
  gap: 18px;
  align-items: start;
  --track-y: 26px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  right: 10px;
  top: var(--track-y);
  border-top: 3px solid #6f9fed;
}

.timeline::after {
  content: '';
  position: absolute;
  right: 0;
  top: var(--track-y);
  transform: translateY(-44%);
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 14px solid #6f9fed;
}

.dot {
  position: relative;
}

.time {
  color: #4169a8;
  font-size: 12px;
  font-weight: 600;
  margin: 0 0 30px;
  text-align: center;
}

.card{
  background: linear-gradient(180deg, #f1f6ff 0%, #fff 100%);
  filter: drop-shadow(0 1px 3px #ddd);
  border-radius: 8px;
  min-height: 72px;
  padding: 8px;
  font-size: 13px;
  line-height: 1.45;
  &::before {
    content: '';
    position: absolute;
    top: -26px;
    left: 50%;
    transform: translateX(-50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #f2f6ff;
    border: 3px solid #5f92e6;
    box-sizing: border-box;
  }
  &::after {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 10px;
    height: 10px;
    background: #f1f6ff;
  }
}

@media (max-width: 1360px) {
  .path-grid {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }

  .path-canvas {
    min-height: auto;
  }

  .path-svg {
    display: none;
  }

  .col {
    grid-template-rows: auto;
  }

  .group-title {
    font-size: 15px;
  }

  .row-1,
  .row-2,
  .row-3,
  .row-4,
  .row-5 {
    grid-row: auto;
  }

  .flow-wrap {
    grid-template-columns: 1fr;
  }

  .flow-canvas {
    min-height: 520px;
  }

  .node {
    font-size: 14px;
  }

  .hint {
    font-size: 14px;
  }

  .node,
  .node.large {
    width: 100%;
  }

  .timeline {
    grid-template-columns: 1fr;
  }

  .node {
    display: none;
  }

  .timeline::before,
  .timeline::after {
    display: none;
  }

  .time {
    font-size: 16px;
    text-align: left;
    margin-bottom: 8px;
  }
}
</style>