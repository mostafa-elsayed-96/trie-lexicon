import { CompressedTrie } from "./trie";
export class Lexicon {
  private trie: CompressedTrie;
  constructor() {
    this.trie = new CompressedTrie();
  }
  insertMultipleWords(list: string[]) {
    for (const word of list) {
      this.trie.insert(word);
    }
  }
  searchDictionary(word: string) {
    if(this.trie.search(word)){
        console.log('Word is existing');
    }
    else{
        console.log('Word is not existing');
    } 
  }
  printDictionary() {
    return this.trie.printTrie()
  }
}
