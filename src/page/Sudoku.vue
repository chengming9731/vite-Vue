<template>
  <div class="sudoku-container">
    <h1>数独游戏</h1>

    <div class="controls">
      <select v-model="difficulty" @change="initGame" class="difficulty-select">
        <option value="easy">简单</option>
        <option value="medium">中等</option>
        <option value="hard">困难</option>
      </select>

      <button @click="initGame" class="new-game-btn">新游戏</button>
    </div>

    <div class="game-info">
      <span>错误：{{ mistakes }}/3</span>
      <span>时间：{{ displayTime }}</span>
    </div>

    <div class="sudoku-board">
      <div
        v-for="(row, rowIndex) in board"
        :key="rowIndex"
        class="board-row"
      >
        <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          class="cell"
          :class="{
            'selected': selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex,
            'initial': initialBoard[rowIndex][colIndex] !== 0,
            'thick-right': (colIndex + 1) % 3 === 0 && colIndex !== 8,
            'thick-bottom': (rowIndex + 1) % 3 === 0 && rowIndex !== 8
          }"
          @click="selectCell(rowIndex, colIndex)"
        >
          {{ cell !== 0 ? cell : '' }}
        </div>
      </div>
    </div>

    <div class="number-pad" v-if="selectedCell && !isComplete">
      <button
        v-for="num in 9"
        :key="num"
        @click="fillNumber(num)"
        class="number-btn"
      >
        {{ num }}
      </button>
      <button @click="clearCell" class="clear-btn">清除</button>
    </div>

    <div v-if="isComplete" class="complete-message">
      🎉 恭喜完成！🎉
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'Sudoku' })
import { ref, reactive, computed, inject } from 'vue'

// 游戏状态
const board = ref([])
const solution = ref([])
const initialBoard = ref([])
const selectedCell = ref(null)
const difficulty = ref('medium')
const mistakes = ref(0)
const isComplete = ref(false)
const timer = ref(0)
let timerInterval = null

// 难度设置
const difficultySettings = {
  easy: 30,
  medium: 40,
  hard: 50
}

// 初始化游戏
const initGame = () => {
  generateSudoku()
  mistakes.value = 0
  timer.value = 0
  isComplete.value = false
  selectedCell.value = null

  if (timerInterval) {
    clearInterval(timerInterval)
  }
  timerInterval = setInterval(() => {
    timer.value++
  }, 1000)
}

// 生成数独
const generateSudoku = () => {
  // 创建空白的 9x9 数独板
  const newBoard = Array(9).fill(null).map(() => Array(9).fill(0))

  // 生成完整的数独解
  generateSolution(newBoard)
  solution.value = newBoard.map(row => [...row])

  // 根据难度移除数字
  const cellsToRemove = difficultySettings[difficulty.value]
  board.value = removeNumbers(newBoard, cellsToRemove)
  initialBoard.value = board.value.map(row => [...row])
}

// 生成完整的数独解决方案
const generateSolution = (board) => {
  const emptyCell = findEmptyCell(board)
  if (!emptyCell) return true

  const [row, col] = emptyCell
  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])

  for (let num of numbers) {
    if (isValidPlacement(board, row, col, num)) {
      board[row][col] = num
      if (generateSolution(board)) {
        return true
      }
      board[row][col] = 0
    }
  }
  return false
}

// 查找空白单元格
const findEmptyCell = (board) => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        return [i, j]
      }
    }
  }
  return null
}

// 检查数字放置是否有效
const isValidPlacement = (board, row, col, num) => {
  // 检查行
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false
  }

  // 检查列
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) return false
  }

  // 检查 3x3 宫格
  const boxRow = Math.floor(row / 3) * 3
  const boxCol = Math.floor(col / 3) * 3
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) return false
    }
  }

  return true
}

// 移除数字
const removeNumbers = (board, count) => {
  const newBoard = board.map(row => [...row])
  let removed = 0

  while (removed < count) {
    const row = Math.floor(Math.random() * 9)
    const col = Math.floor(Math.random() * 9)
    if (newBoard[row][col] !== 0) {
      newBoard[row][col] = 0
      removed++
    }
  }

  return newBoard
}

// 洗牌算法
const shuffle = (array) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// 选择单元格
const selectCell = (row, col) => {
  if (initialBoard.value[row][col] !== 0 || isComplete.value) return
  selectedCell.value = { row, col }
}

// 填入数字
const fillNumber = (num) => {
  if (!selectedCell.value || isComplete.value) return

  const { row, col } = selectedCell.value
  const correctNum = solution.value[row][col]

  if (num !== correctNum) {
    mistakes.value++
    if (mistakes.value >= 3) {
      alert('游戏结束！你已经犯了 3 次错误。')
      clearInterval(timerInterval)
    }
  } else {
    board.value[row][col] = num
    checkCompletion()
  }

  selectedCell.value = null
}

// 检查是否完成
const checkCompletion = () => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board.value[i][j] !== solution.value[i][j]) {
        return
      }
    }
  }
  isComplete.value = true
  clearInterval(timerInterval)
  setTimeout(() => {
    alert(`恭喜你完成了数独游戏！\n用时：${formatTime(timer.value)}\n错误：${mistakes.value} 次`)
  }, 100)
}

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 清除数字
const clearCell = () => {
  if (!selectedCell.value || initialBoard.value[selectedCell.value.row][selectedCell.value.col] !== 0) return
  board.value[selectedCell.value.row][selectedCell.value.col] = 0
}

// 格式化显示时间
const displayTime = computed(() => formatTime(timer.value))

// 生命周期
initGame()
</script>

<style scoped>
.sudoku-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.difficulty-select {
  padding: 8px 16px;
  font-size: 16px;
  border: 2px solid #3498db;
  border-radius: 5px;
  background: white;
  cursor: pointer;
}

.new-game-btn {
  padding: 8px 24px;
  font-size: 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.new-game-btn:hover {
  background: #2980b9;
}

.game-info {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #555;
}

.sudoku-board {
  display: inline-block;
  border: 3px solid #333;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.board-row {
  display: flex;
}

.cell {
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.cell:hover {
  background: #e8f4f8;
}

.cell.selected {
  background: #ffeaa7;
}

.cell.initial {
  color: #333;
  background: #f8f9fa;
  cursor: not-allowed;
}

.cell:not(.initial):hover {
  background: #d5e8f7;
}

.thick-right {
  border-right: 3px solid #333;
}

.thick-bottom {
  border-bottom: 3px solid #333;
}

.number-pad {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-top: 20px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.number-btn {
  padding: 15px;
  font-size: 20px;
  font-weight: bold;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
}

.number-btn:hover {
  background: #2980b9;
  transform: scale(1.05);
}

.clear-btn {
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  grid-column: span 5;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #c0392b;
}

.complete-message {
  text-align: center;
  font-size: 32px;
  color: #27ae60;
  margin-top: 20px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@media (max-width: 500px) {
  .cell {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .number-pad {
    grid-template-columns: repeat(5, 1fr);
    gap: 5px;
  }

  .number-btn {
    padding: 10px;
    font-size: 18px;
  }
}
</style>
