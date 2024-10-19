import { Lexicon } from "./lexicon";

const main = () => {
    const lexicon = new Lexicon();
    lexicon.insertMultipleWords(["cat", "cater", "cap", "dog"]);
    lexicon.printDictionary();
}

main();