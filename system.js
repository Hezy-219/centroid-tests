import { embed } from "./embed.js";

export let centroids = [];

export function handleInput(input, CONFIG) {
  const inputVec = embed(input, CONFIG);

  let centroid = findCentroid(inputVec, CONFIG);

  if (!centroid) {
    centroid = createCentroid(input, inputVec);
  } else {
    updateCentroid(centroid, input, inputVec);
  }

  const context = buildContext(centroid, inputVec, CONFIG);

  return {
    centroid_id: centroid.id,
    context: context
  };
}

export function findCentroid(inputVec, CONFIG) {
  let best = null;
  let bestScore = 0;

  for (let c of centroids) {
    const score = cosine(inputVec, c.vector);

    if (score > CONFIG.centroid.similarity_threshold && score > bestScore) {
      best = c;
      bestScore = score;
    }
  }

  return best;
}

function createCentroid(input, vec) {
  const centroid = {
    id: "c_" + Date.now(),
    vector: vec,
    entries: []
  };

  addEntry(centroid, input, vec);

  centroids.push(centroid);

  return centroid;
}

function updateCentroid(centroid, input, vec) {
  addEntry(centroid, input, vec);
  centroid.vector = recomputeVector(centroid);
}

function addEntry(centroid, content, vec) {
  centroid.entries.push({
    content,
    vector: vec,
    timestamp: Date.now(),
    weight: 1
  });
}

function recomputeVector(centroid) {
  const dim = centroid.entries[0].vector.length;
  let sum = new Array(dim).fill(0);

  for (let e of centroid.entries) {
    for (let i = 0; i < dim; i++) {
      sum[i] += e.vector[i];
    }
  }

  return normalize(sum);
}

function cosine(a, b) {
  let dot = 0, magA = 0, magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function normalize(vec) {
  const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  return vec.map(v => (mag === 0 ? 0 : v / mag));
}

function buildContext(centroid, inputVec, CONFIG) {
  let scored = [];

  for (let entry of centroid.entries) {
    const similarity = cosine(inputVec, entry.vector);
    const recency = Math.exp(-(Date.now() - entry.timestamp) / 10000000);

    const score =
      CONFIG.retrieval.alpha * similarity +
      CONFIG.retrieval.beta * recency +
      CONFIG.retrieval.gamma * entry.weight;

    scored.push({ entry, score });
  }

  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, CONFIG.retrieval.top_k);

  return top.map(x => x.entry.content);
}