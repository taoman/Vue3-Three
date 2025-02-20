// javascript-astar 0.4.1
// http://github.com/bgrins/javascript-astar
// Freely distributable under the MIT License.
// Implements the astar search algorithm in javascript using a Binary Heap.
// Includes Binary Heap (with modifications) from Marijn Haverbeke.
// http://eloquentjavascript.net/appendix2.html
;(function (definition) {
  /* global module, define */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = definition()
  } else if (typeof define === 'function' && define.amd) {
    define([], definition)
  } else {
    var exports = definition()
    window.astar = exports.astar
    window.Graph = exports.Graph
  }
})(function () {
  // 从目标节点回溯路径到起始节点，生成路径
  // 沿着每个节点的 parent（父节点）回溯，直到回到起始节点，将路径依次放入 path 数组，并返回最终路径
  function pathTo(node) {
    var curr = node
    var path = []
    while (curr.parent) {
      path.unshift(curr)
      curr = curr.parent
    }
    return path
  }
  // 返回一个基于 f 值（总代价）的二叉堆（BinaryHeap）。该堆用于从开启的节点列表中高效地选择下一个要处理的节点
  //   二叉堆是一种完全二叉树，支持对最小值（这里是 f 值）进行高效的插入、删除和更新操作。
  function getHeap() {
    return new BinaryHeap(function (node) {
      return node.f
    })
  }

  var astar = {
    /**
    * Perform an A* Search on a graph given a start and end node.
    * @param {Graph} graph 节点的集合
    * @param {GridNode} start 起始节点
    * @param {GridNode} end 目标节点
    * @param {Object} [options] 可选参数，指定启发式函数
    * @param {bool} [options.closest] Specifies whether to return the
               path to the closest node if the target is unreachable.
    * @param {Function} [options.heuristic] Heuristic function (see
    *          astar.heuristics).
    */
    search: function (graph, start, end, options) {
      graph.cleanDirty() // 清除脏数据
      options = options || {}
      var heuristic = options.heuristic || astar.heuristics.manhattan
      var closest = options.closest || false

      var openHeap = getHeap()
      var closestNode = start // set the start node to be the closest if required

      start.h = heuristic(start, end) //计算起始节点的启发式 h 值，h 表示从当前节点到目标节点的预估代价。
      graph.markDirty(start)

      openHeap.push(start) //将起始节点标记为“脏点”并推入优先队列（堆）中，开始搜索

      while (openHeap.size() > 0) {
        // 从堆中取出 f 值最小的节点进行处理。堆会根据 f 值自动排序，保证每次取出的是当前代价最小的节点。
        // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
        var currentNode = openHeap.pop()

        // End case -- result has been found, return the traced path.
        // 如果当前节点是目标节点，表示搜索完成，调用 pathTo(currentNode) 回溯路径并返回
        if (currentNode === end) {
          return pathTo(currentNode)
        }

        // Normal case -- move currentNode from open to closed, process each of its neighbors.
        // 将当前节点标记为已处理（closed），然后获取当前节点的所有邻点。
        currentNode.closed = true

        // Find all neighbors for the current node.
        var neighbors = graph.neighbors(currentNode)

        for (var i = 0, il = neighbors.length; i < il; ++i) {
          var neighbor = neighbors[i]
          // 如果邻居节点已经被处理过，或者是障碍物节点（isWall()），则跳过
          if (neighbor.closed || neighbor.isWall()) {
            // Not a valid node to process, skip to next neighbor.
            continue
          }

          // 计算从起始节点到当前邻居节点的 g 值。

          var gScore = currentNode.g + neighbor.getCost(currentNode)
          var beenVisited = neighbor.visited
          // 如果该邻居节点未被访问过，或者通过当前节点到达该邻居的路径更短（gScore < neighbor.g），则更新邻居节点的信息：
          if (!beenVisited || gScore < neighbor.g) {
            // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
            neighbor.visited = true
            neighbor.parent = currentNode
            neighbor.h = neighbor.h || heuristic(neighbor, end)
            neighbor.g = gScore
            neighbor.f = neighbor.g + neighbor.h
            graph.markDirty(neighbor)
            if (closest) {
              // 如果启用了 closest 选项，则在发现新的邻居时，检查是否它比当前最接近目标的节点更接近目标节点。如果是，则将其设置为新的最接近节点。
              if (
                neighbor.h < closestNode.h ||
                (neighbor.h === closestNode.h && neighbor.g < closestNode.g)
              ) {
                closestNode = neighbor
              }
            }
            // 如果邻居节点之前未访问过，则将其加入到开放列表（openHeap）；如果邻居节点已经访问过但其得分（f）发生变化，则需要重新计算其在堆中的位置，更新其优先级。
            if (!beenVisited) {
              // Pushing to heap will put it in proper place based on the 'f' value.
              openHeap.push(neighbor)
            } else {
              // Already seen the node, but since it has been rescored we need to reorder it in the heap
              openHeap.rescoreElement(neighbor)
            }
          }
        }
      }
      // 如果没有找到目标节点，且启用了 closest 选项，返回离目标节点最近的路径。如果没有找到路径，返回空数组。
      if (closest) {
        return pathTo(closestNode)
      }

      // No result was found - empty array signifies failure to find path.
      return []
    },
    // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
    heuristics: {
      manhattan: function (pos0, pos1) {
        var d1 = Math.abs(pos1.x - pos0.x)
        var d2 = Math.abs(pos1.y - pos0.y)
        return d1 + d2
      },
      diagonal: function (pos0, pos1) {
        var D = 1
        var D2 = Math.sqrt(2)
        var d1 = Math.abs(pos1.x - pos0.x)
        var d2 = Math.abs(pos1.y - pos0.y)
        return D * (d1 + d2) + (D2 - 2 * D) * Math.min(d1, d2)
      }
    },
    cleanNode: function (node) {
      node.f = 0
      node.g = 0
      node.h = 0
      node.visited = false
      node.closed = false
      node.parent = null
    }
  }

  /**
   * A graph memory structure
   * @param {Array} gridIn 2D array of input weights
   * @param {Object} [options]
   * @param {bool} [options.diagonal] Specifies whether diagonal moves are allowed
   */
  function Graph(gridIn, options) {
    options = options || {}
    this.nodes = []
    this.diagonal = !!options.diagonal
    this.grid = []
    for (var x = 0; x < gridIn.length; x++) {
      this.grid[x] = []

      for (var y = 0, row = gridIn[x]; y < row.length; y++) {
        var node = new GridNode(x, y, row[y])
        this.grid[x][y] = node
        this.nodes.push(node)
      }
    }
    this.init()
  }

  Graph.prototype.init = function () {
    this.dirtyNodes = []
    for (var i = 0; i < this.nodes.length; i++) {
      astar.cleanNode(this.nodes[i])
    }
  }

  Graph.prototype.cleanDirty = function () {
    for (var i = 0; i < this.dirtyNodes.length; i++) {
      astar.cleanNode(this.dirtyNodes[i])
    }
    this.dirtyNodes = []
  }

  Graph.prototype.markDirty = function (node) {
    this.dirtyNodes.push(node)
  }

  Graph.prototype.neighbors = function (node) {
    var ret = []
    var x = node.x
    var y = node.y
    var grid = this.grid

    // West
    if (grid[x - 1] && grid[x - 1][y]) {
      ret.push(grid[x - 1][y])
    }

    // East
    if (grid[x + 1] && grid[x + 1][y]) {
      ret.push(grid[x + 1][y])
    }

    // South
    if (grid[x] && grid[x][y - 1]) {
      ret.push(grid[x][y - 1])
    }

    // North
    if (grid[x] && grid[x][y + 1]) {
      ret.push(grid[x][y + 1])
    }

    if (this.diagonal) {
      // Southwest
      if (grid[x - 1] && grid[x - 1][y - 1]) {
        ret.push(grid[x - 1][y - 1])
      }

      // Southeast
      if (grid[x + 1] && grid[x + 1][y - 1]) {
        ret.push(grid[x + 1][y - 1])
      }

      // Northwest
      if (grid[x - 1] && grid[x - 1][y + 1]) {
        ret.push(grid[x - 1][y + 1])
      }

      // Northeast
      if (grid[x + 1] && grid[x + 1][y + 1]) {
        ret.push(grid[x + 1][y + 1])
      }
    }

    return ret
  }

  Graph.prototype.toString = function () {
    var graphString = []
    var nodes = this.grid
    for (var x = 0; x < nodes.length; x++) {
      var rowDebug = []
      var row = nodes[x]
      for (var y = 0; y < row.length; y++) {
        rowDebug.push(row[y].weight)
      }
      graphString.push(rowDebug.join(' '))
    }
    return graphString.join('\n')
  }

  function GridNode(x, y, weight) {
    this.x = x
    this.y = y
    this.weight = weight
  }

  GridNode.prototype.toString = function () {
    return '[' + this.x + ' ' + this.y + ']'
  }

  GridNode.prototype.getCost = function (fromNeighbor) {
    // Take diagonal weight into consideration.
    if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
      return this.weight * 1.41421
    }
    return this.weight
  }

  GridNode.prototype.isWall = function () {
    return this.weight === 0
  }

  function BinaryHeap(scoreFunction) {
    this.content = []
    this.scoreFunction = scoreFunction
  }

  BinaryHeap.prototype = {
    push: function (element) {
      // Add the new element to the end of the array.
      this.content.push(element)

      // Allow it to sink down.
      this.sinkDown(this.content.length - 1)
    },
    pop: function () {
      // Store the first element so we can return it later.
      var result = this.content[0]
      // Get the element at the end of the array.
      var end = this.content.pop()
      // If there are any elements left, put the end element at the
      // start, and let it bubble up.
      if (this.content.length > 0) {
        this.content[0] = end
        this.bubbleUp(0)
      }
      return result
    },
    remove: function (node) {
      var i = this.content.indexOf(node)

      // When it is found, the process seen in 'pop' is repeated
      // to fill up the hole.
      var end = this.content.pop()

      if (i !== this.content.length - 1) {
        this.content[i] = end

        if (this.scoreFunction(end) < this.scoreFunction(node)) {
          this.sinkDown(i)
        } else {
          this.bubbleUp(i)
        }
      }
    },
    size: function () {
      return this.content.length
    },
    rescoreElement: function (node) {
      this.sinkDown(this.content.indexOf(node))
    },
    sinkDown: function (n) {
      // Fetch the element that has to be sunk.
      var element = this.content[n]

      // When at 0, an element can not sink any further.
      while (n > 0) {
        // Compute the parent element's index, and fetch it.
        var parentN = ((n + 1) >> 1) - 1
        var parent = this.content[parentN]
        // Swap the elements if the parent is greater.
        if (this.scoreFunction(element) < this.scoreFunction(parent)) {
          this.content[parentN] = element
          this.content[n] = parent
          // Update 'n' to continue at the new position.
          n = parentN
        }
        // Found a parent that is less, no need to sink any further.
        else {
          break
        }
      }
    },
    bubbleUp: function (n) {
      // Look up the target element and its score.
      var length = this.content.length
      var element = this.content[n]
      var elemScore = this.scoreFunction(element)

      while (true) {
        // Compute the indices of the child elements.
        var child2N = (n + 1) << 1
        var child1N = child2N - 1
        // This is used to store the new position of the element, if any.
        var swap = null
        var child1Score
        // If the first child exists (is inside the array)...
        if (child1N < length) {
          // Look it up and compute its score.
          var child1 = this.content[child1N]
          child1Score = this.scoreFunction(child1)

          // If the score is less than our element's, we need to swap.
          if (child1Score < elemScore) {
            swap = child1N
          }
        }

        // Do the same checks for the other child.
        if (child2N < length) {
          var child2 = this.content[child2N]
          var child2Score = this.scoreFunction(child2)
          if (child2Score < (swap === null ? elemScore : child1Score)) {
            swap = child2N
          }
        }

        // If the element needs to be moved, swap it, and continue.
        if (swap !== null) {
          this.content[n] = this.content[swap]
          this.content[swap] = element
          n = swap
        }
        // Otherwise, we are done.
        else {
          break
        }
      }
    }
  }

  return {
    astar: astar,
    Graph: Graph
  }
})
