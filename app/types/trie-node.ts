export class TrieNode {
  segment: string;
  children: TrieNode[];
  isEndOfWord: boolean;
  parent: TrieNode | null;

  constructor(
    segment: string = "",
    children: TrieNode[] = [],
    isEndOfWord: boolean = false,
    parent: TrieNode | null = null
  ) {
    this.segment = segment;
    this.children = children;
    this.isEndOfWord = isEndOfWord;
    this.parent = parent;
  }
}
