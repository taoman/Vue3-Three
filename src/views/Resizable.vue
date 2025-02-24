<template>
  <div style="display: flex; justify-content: center">
    <!-- 水平布局 -->
    <ResizeableContainer direction="horizontal" style="height: 100vh">
      <ResizeablePanel style="min-width: 150px; background: #ffe0b2">Left</ResizeablePanel>
      <ResizeableSplitter />
      <ResizeablePanel :style="middleStyle">
        <!-- 嵌套垂直布局 -->
        <ResizeableContainer direction="vertical">
          <ResizeablePanel style="min-height: 150px">Top</ResizeablePanel>
          <ResizeableSplitter style="background: #000" />
          <ResizeablePanel style="height: 200px; min-height: 150px">center</ResizeablePanel>
          <ResizeableSplitter />
          <ResizeablePanel style="height: 300px; min-height: 50px; border: 1px solid #ccc"
            >Bottom</ResizeablePanel
          >
        </ResizeableContainer>
      </ResizeablePanel>
      <ResizeableSplitter />
      <ResizeablePanel :style="rightStyle">Right</ResizeablePanel>
      <ResizeableSplitter />
      <ResizeablePanel :style="rightStyle">Right1</ResizeablePanel>
    </ResizeableContainer>
  </div>
</template>

<script setup>
const rightStyle = {
  width: '500px',
  minWidth: '150px',
  border: '1px solid #ccc'
}
const middleStyle = {
  width: '500px',
  minWidth: '150px',
  border: '1px solid #ccc',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden'
}
</script>
