const Arr = {
  chunk(arr, len) {
    const chunks = []
    const n = arr.length;
    let i = 0
    while (i < n) { chunks.push(arr.slice(i, i += len)); }
    return chunks;
  },
}

export default Arr;
