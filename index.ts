import { Lexicon } from "./app/lexicon";
import { UrlReader } from "./dictionary-readers/url-reader";
import { FileReader } from "./dictionary-readers/file-reader";

const chunkCount = 50;
const mainUrlReader = async () => {
  const url =
    "https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words.txt";
  const dict = new UrlReader(url, chunkCount);
  await dict.run();
  const lexicon = new Lexicon();
  for (const chunk of dict.getChunks()) {
    console.log(chunk.data);
    lexicon.insertMultipleWords(chunk.data);
  }
  lexicon.searchDictionary("ACE");
  lexicon.searchDictionary("textss");
//   lexicon.printTrie();
};

const mainFileReader = async () => {
  const dict = new FileReader("dictionary.txt", chunkCount);
  await dict.run();
  const lexicon = new Lexicon();
  for (const chunk of dict.getChunks()) {
    lexicon.insertMultipleWords(chunk.data);
  }
  lexicon.searchDictionary("ACE");
  lexicon.searchDictionary("textss");
//   lexicon.printTrie();
};

mainFileReader();
