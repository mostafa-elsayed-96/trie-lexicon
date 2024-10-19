export class TrieNode {
    segment: string;
    children: Map<string, TrieNode>;
    isEndOfWord: boolean;
  
    constructor(segment: string = "") {
      this.segment = segment;
      this.children = new Map<string, TrieNode>();
      this.isEndOfWord = false;
    }
}