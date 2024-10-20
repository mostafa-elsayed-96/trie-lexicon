import * as fs from "fs";
import * as readline from "readline";

export interface Chunk {
  data: string[];
}

export class FileReader {
  private chunks: Chunk[] = [];
  private filePath: string = "";
  private chunkCount: number = 100;

  constructor(filePath: string, chunkCount: number = 50) {
    this.chunkCount = chunkCount;
    this.filePath = filePath;
  }

  async readFileInChunks(filePath: string, chunkCount: number) {
    const totalLines = await this.countFileLines(filePath);
    const linesPerChunk = Math.ceil(totalLines / chunkCount);

    const readStream = fs.createReadStream(filePath, { encoding: "utf-8" });
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity,
    });

    let currentChunk: string[] = [];
    let currentLineCount = 0;
    let chunkIndex = 1;

    for await (const line of rl) {
      currentChunk.push(line.trim());
      currentLineCount++;

      if (currentLineCount >= linesPerChunk) {
        console.log(`Processing chunk ${chunkIndex} with ${currentChunk.length} lines...`);
        this.processChunk({
          data: currentChunk,
        }, chunkIndex);

        currentChunk = [];
        currentLineCount = 0;
        chunkIndex++;
      }
    }

    if (currentChunk.length > 0) {
      console.log(`Processing chunk ${chunkIndex} with ${currentChunk.length} lines...`);
      this.processChunk({
        data: currentChunk,
      }, chunkIndex);
    }
  }
  countFileLines(filePath: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      let lineCount = 0;
      const stream = fs.createReadStream(filePath);
      const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity,
      });

      rl.on("line", () => {
        lineCount++;
      });

      rl.on("close", () => {
        resolve(lineCount);
      });

      rl.on("error", (err) => {
        reject(err);
      });
    });
  }
  processChunk(chunk: Chunk, chunkIndex: number) {
    console.log(`Chunk No. ${chunkIndex} has finished processing`)
    this.chunks.push(chunk);
  }

  async run() {
    await this.readFileInChunks(this.filePath, this.chunkCount);
  }

  getChunks() {
    return this.chunks;
  }
}
