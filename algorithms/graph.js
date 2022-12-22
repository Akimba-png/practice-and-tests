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
