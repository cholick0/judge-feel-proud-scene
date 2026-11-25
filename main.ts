import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Gate from competition.yaml: /output/entry.txt is UTF-8 text of
// 1 to 280 characters, not only white space, one or two lines.
const MIN_CHARS = 1;
const MAX_CHARS = 280;
const MAX_LINES = 2;
const OUTPUT_PATH = "/output/entry.txt";

const ENTRY =
  "Dad still carves the Sunday roast like he's defusing a bomb, Grandma grades every slice out loud, and somehow — with all of us squeezed around the same small table — it tastes like the best meal in the world.";

function validateEntry(entry: string): void {
  if (entry.length < MIN_CHARS || entry.length > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${entry.length}`,
    );
  }
  if (entry.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  const lines = entry.split("\n");
  if (lines.length > MAX_LINES) {
    throw new Error(`entry must be at most ${MAX_LINES} lines, got ${lines.length}`);
  }
}

validateEntry(ENTRY);

mkdirSync("/output", { recursive: true });
writeFileSync(OUTPUT_PATH, ENTRY, "utf8");

// Byte-level read-back: what landed on disk must be exactly the entry.
const onDisk = readFileSync(OUTPUT_PATH);
if (!Buffer.from(ENTRY, "utf8").equals(onDisk)) {
  throw new Error("read-back mismatch: /output/entry.txt differs from the entry");
}
console.log(
  `Wrote entry (${ENTRY.length} characters, ${onDisk.length} bytes, verified byte-for-byte) to ${OUTPUT_PATH}`,
);
