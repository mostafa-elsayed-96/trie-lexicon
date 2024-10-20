import axios from 'axios';
import * as readline from 'readline';
import { Readable } from 'stream';
import { Chunk } from './file-reader';
export class UrlReader {
  private chunks: Chunk[] = [];
  private url: string = "";
  private chunkCount: number = 100;

  constructor(url: string, chunkCount: number = 50) {
    this.chunkCount = chunkCount;
    this.url = url;
  }
  async readUrlInChunks(url: string, chunkCount: number) {
    try {
      const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream',
      });
  
      const rl = readline.createInterface({
        input: response.data as Readable,
        crlfDelay: Infinity,
      });
  
      let currentChunk: string[] = [];
      let currentLineCount = 0;
      let chunkIndex = 1;
      let estimatedTotalLines = 1000000;
      let linesPerChunk = Math.ceil(estimatedTotalLines / chunkCount);
  
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
  
          if (chunkIndex === chunkCount) {
            estimatedTotalLines = chunkIndex * linesPerChunk + currentLineCount;
            linesPerChunk = Math.ceil(estimatedTotalLines / chunkCount);
          }
        }
      }
  
      if (currentChunk.length > 0) {
        console.log(`Processing chunk ${chunkIndex} with ${currentChunk.length} lines...`);
        this.processChunk({
          data: currentChunk,
        }, chunkIndex);
      }
    } catch (error) {
      console.error('Error reading from URL:', error);
    }
  }
  
  processChunk(chunk: Chunk, chunkIndex: number) {
    console.log(`Chunk No. ${chunkIndex} has finished processing`)
    this.chunks.push(chunk);
  }

  async run() {
    await this.readUrlInChunks(this.url, this.chunkCount);
  }

  getChunks() {
    return this.chunks;
  }
}