export function embed(text, CONFIG) {
  return mockEmbed(text, CONFIG.embedding.dimensions);
}

function mockEmbed(text, dim) {
  const vector = new Array(dim).fill(0);
  const words = text.toLowerCase().split(/\s+/);

  for (let word of words) {
    const index = hash(word) % dim;
    vector[index] += 1;
  }

  return normalize(vector);
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function normalize(vec) {
  const mag = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
  return vec.map(v => (mag === 0 ? 0 : v / mag));
}