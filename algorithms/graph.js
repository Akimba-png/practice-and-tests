// алгоритм поиска в ширину в графе
{
const graph = {
  a: ['b', 'c'],
  b: ['f'],
  c: ['d', 'e'],
  d: ['f'],
  e: ['f'],
  f: ['g'],
};

function breadthSearch(graph, start, end) {
  const queue = [];
  queue.push(start);
  while(queue.length) {
    const node = queue.shift();
    if (!graph[node]) { graph[node] = [] }
    if (graph[node].includes(end)) { return true }
    queue.push(...graph[node]);
  }
  return false;
}

const result = breadthSearch(graph, 'a', 'g');
console.log(result);
}


// dijkstra Search для поиска минимального пути в графе
const graph = {
  a: {b: 7, c: 2},
  b: {f: 5},
  c: {d: 4, e: 1},
  d: {f: 3},
  e: {f: 2},
  f: {g: 1},
  g: {},
};

function dijkstraSearch(graph, start) {
  const costTable = {};
  const processed = [];
  let neighbour = {};

  Object.keys(graph).forEach((node) => {
    if (node !== start) {
      costTable[node] = graph[start][node] ?? Infinity;
    }
  });

  let cheapestNode = getCheapestNode(costTable, processed);

  while (cheapestNode) {
    neighbour = graph[cheapestNode];
    Object.keys(neighbour).forEach((node) => {
      costTable[node] = costTable[cheapestNode] + neighbour[node];
    });
    processed.push(cheapestNode);
    cheapestNode = getCheapestNode(costTable, processed);
  }

  return costTable;
}

function getCheapestNode(costTable, processed) {
  let cheapestNode;
  let cheapestCost = Infinity;
  Object.keys(costTable).forEach((node) => {
    if (costTable[node] < cheapestCost && !processed.includes(node)) {
      cheapestNode = node;
      cheapestCost = costTable[node];
    }
  });
  return cheapestNode;
}

const result = dijkstraSearch(graph, 'a');
console.log(result);
