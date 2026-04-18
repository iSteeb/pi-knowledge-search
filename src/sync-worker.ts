#!/usr/bin/env node
import { loadConfig } from "./config";
import { createEmbedder } from "./embedder";
import { KnowledgeIndex } from "./index-store";

const config = loadConfig();
if (!config) {
  process.exit(0);
}

const embedder = createEmbedder(config.provider, config.dimensions);
const index = new KnowledgeIndex(config, embedder);
index.loadSync();

index.sync().then(({ added, updated, removed }) => {
  const result = JSON.stringify({ added, updated, removed, size: index.size() });
  process.stdout.write(result);
  process.exit(0);
}).catch((err) => {
  process.stderr.write(err.message);
  process.exit(1);
});
