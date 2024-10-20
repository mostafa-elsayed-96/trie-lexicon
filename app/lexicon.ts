import { TriePathsCompressed } from "./trie-path-compressed";
export class Lexicon {
  private trie: TriePathsCompressed;
  constructor() {
    this.trie = new TriePathsCompressed();
  }
  insertMultipleWords(list: string[]) {
    for (const word of list) {
      this.trie.insert(word);
    }
  }
  searchDictionary(word: string) {
    if(this.trie.search(word)){
        console.log(`${word} is existing`);
    }
    else{
        console.log(`${word} is not existing`);
    } 
  }
  printTrie(){
    this.trie.printTrie();
  }
}
