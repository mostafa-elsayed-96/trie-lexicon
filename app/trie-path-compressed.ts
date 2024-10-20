import { TrieNode } from "./types/trie-node";

export class TriePathsCompressed {
  private root: TrieNode;
  private isFound: boolean = false;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    this.insertRecursive(this.root, word);
  }

  search(word: string) {
    this.searchRecursive(this.root, word);
    const textFound = this.isFound;
    this.isFound = false;
    return textFound;
  }

  printTrie() {
    this.printTrieTraversed(this.root);
  }
  
  // Helper method to find the longest common prefix length between two strings.
  private longestCommonPrefixLength(s1: string, s2: string): number {
    let index = 0;
    while (index < s1.length && index < s2.length && s1[index] === s2[index]) {
      index++;
    }
    return index;
  }

  private getNodeWithLongestCommonPrefix(nodes: TrieNode[], str: string) {
    const longestNode: {count: number, node: TrieNode| null} = {
      count: 0,
      node: null
    }
    nodes.forEach((item: TrieNode) => {
      const longestCommon = this.longestCommonPrefixLength(str, item.segment);
      if(longestCommon > longestNode.count){
        longestNode.count = longestCommon;
        longestNode.node = item;
      }
    });
    return longestNode;
  }

  private insertRecursive(node: TrieNode, segment: string) {
    if(node.children.length > 0) {
      const {count: longestCount, node: longestNode} = this.getNodeWithLongestCommonPrefix(node.children, segment);
      if(longestCount > 0 && longestNode) {
        // example longestCommon = an (2) and node is ang
        if(longestCount < longestNode.segment.length) {
        // Need to split the node
          const oldSegment = longestNode.segment.slice(0, longestCount);
          const newSegment = longestNode.segment.slice(longestCount);
          const reminderOfOriginalSegment = segment.slice(longestCount);
          const nodeOldChildren = [...longestNode.children];
          longestNode.children = [];
          longestNode.children.push(new TrieNode(newSegment, nodeOldChildren, true, longestNode));
          longestNode.isEndOfWord = false;
          longestNode.segment = oldSegment;
          this.insertRecursive(longestNode, reminderOfOriginalSegment);
        }
        else {
            // No need to split just move pointer to child and remove common part from segment
            segment = segment.slice(longestCount);
            this.insertRecursive(longestNode, segment);
        }
      }
      else {
        node.children.push(new TrieNode(segment, [], true, node));
        return;
      }
    }
    else {
      node.children.push(new TrieNode(segment, [], true, node));
      return;
    }
  }

  private searchRecursive(node: TrieNode, word: string) {
    if(node.children.length > 0) {
      const {count: longestCount, node: longestNode} = this.getNodeWithLongestCommonPrefix(node.children, word);
      if(longestCount > 0 && longestNode) {
        if(longestCount === word.length) {
          this.isFound = longestNode.isEndOfWord;
          return longestNode.isEndOfWord;
        }
        else{
          word = word.slice(longestCount);
          this.searchRecursive(longestNode, word);
        } 
      }
      else {
        return false;
      }
    }
    else{
      return false;
    }
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
    const segment = node.segment + (leaf ? `*` : "");
    console.log(prefix + segment);
    indent += leaf ? "   " : "│  ";
    for (const childNode of node.children) {
      this.printTrieTraversed(childNode, indent, childNode.isEndOfWord);
    }
  }
}
