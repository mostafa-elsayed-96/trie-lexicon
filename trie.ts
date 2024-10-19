import { TrieNode } from "./types/trie-node";

export class CompressedTrie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let currentNode = this.root;
    let i = 0;

    while (i < word.length) {
      for (let [segment, childNode] of currentNode.children) {
        const remainingWord = word.slice(i);
        const commonLength = this.longestCommonPrefixLength(
          remainingWord,
          segment
        );

        if (commonLength > 0) {
          if (commonLength < segment.length) {
            const existingChild = childNode;
            const newChildSegment = segment.slice(commonLength);
            const newChildNode = new TrieNode(newChildSegment);
            newChildNode.children = existingChild.children;
            newChildNode.isEndOfWord = existingChild.isEndOfWord;

            existingChild.segment = segment.slice(0, commonLength);
            existingChild.children = new Map<string, TrieNode>();
            existingChild.children.set(newChildSegment, newChildNode);
            existingChild.isEndOfWord = false;
          }

          currentNode = currentNode.children.get(segment)!;
          i += commonLength;
          continue;
        }
      }

      const newSegment = word.slice(i);
      const newNode = new TrieNode(newSegment);
      newNode.isEndOfWord = true;
      currentNode.children.set(newSegment, newNode);
      break;
    }
  }

  search(word: string): boolean {
    let currentNode = this.root;
    let i = 0;

    while (i < word.length) {
      let found = false;

      for (let [segment, childNode] of currentNode.children) {
        if (word.startsWith(segment, i)) {
          currentNode = childNode;
          i += segment.length;
          found = true;
          break;
        }
      }

      if (!found) {
        return false;
      }
    }

    return currentNode.isEndOfWord;
  }

  printTrie() {
    this.printTrieTraversed(this.root);
  }

  getDictionaryWords() {
    const listOfWords: string[] = [];
    this.getDictionaryWordsTraversed(this.root, listOfWords);
    console.log(listOfWords);
  }

  private longestCommonPrefixLength(s1: string, s2: string): number {
    let index = 0;
    while (index < s1.length && index < s2.length && s1[index] === s2[index]) {
      index++;
    }
    return index;
  }

  private printTrieTraversed(
    node: TrieNode,
    indent: string = "",
    leaf: boolean = true
  ) {
    if (node === null) {
      return;
    }

    const prefix = indent + (leaf ? "└─ " : "├─ ");
    const segment = node.segment + (leaf ? `*` : '');
    console.log(prefix + segment);
    indent += leaf ? "   " : "│  ";
    for (const [segment, childNode] of node.children) {
      this.printTrieTraversed(childNode, indent, childNode.isEndOfWord);
    }
  }

  private getDictionaryWordsTraversed(
    node: TrieNode,
    list: string[] = [],
    currentWord: string = ""
  ) {
    currentWord+= node.segment;
    if(node.isEndOfWord) {
        list.push(currentWord);
        if(node.children.size <= 0){
            currentWord = "";
            return;
        }
    }
    
    for (const [_, childNode] of node.children) {
        this.getDictionaryWordsTraversed(childNode, list, currentWord);
    }

  }


}
