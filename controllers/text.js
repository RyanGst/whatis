const algorithmia = require("algorithmia");
const sentenceBoundaryDetection = require("sbd");
const algorithmiaApiKey = "simoEvxoxRGbJQgnk4SzTcjx/Hr1";

const state = require("./state.js");

async function robot() {
  const content = state.load();

  await fetchContentFromWikipedia(content);
  sanitizeContent(content);
  breakContentIntoSentences(content);
  limitMaximumSentences(content);
  addSentencesToString(content)
  delete content.sourceContentOriginal;
  delete content.sourceContentSanitized;
  state.save(content);

  async function fetchContentFromWikipedia(content) {
    const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey);
    const wikipediaAlgorithm = algorithmiaAuthenticated.algo(
      "web/WikipediaParser/0.1.2"
    );
    const input = {
      articleName: content.searchTerm,
      lang: content.lang,
    };

    const wikipediaResponse = await wikipediaAlgorithm.pipe(input);
    const wikipediaContent = wikipediaResponse.get();

    content.sourceContentOriginal = wikipediaContent.content;
    console.log("> Fetching done!");
  }

  function sanitizeContent(content) {
    const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(
      content.sourceContentOriginal
    );
    const withoutDatesInParentheses = removeDatesInParentheses(
      withoutBlankLinesAndMarkdown
    );

    content.sourceContentSanitized = withoutDatesInParentheses;

    function removeBlankLinesAndMarkdown(text) {
      const allLines = text.split("\n");

      const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
        if (line.trim().length === 0 || line.trim().startsWith("=")) {
          return false;
        }

        return true;
      });
      return withoutBlankLinesAndMarkdown.join(" ");
    }

    function removeDatesInParentheses(text) {
      return text
        .replace(/\((?:\([^()]*\)|[^()])*\)/gm, "")
        .replace(/  /g, " ");
    }
  }
  function breakContentIntoSentences(content) {
    content.sentences = [];

    const sentences = sentenceBoundaryDetection.sentences(
      content.sourceContentSanitized
    );
    sentences.forEach((sentence) => {
      content.sentences.push(sentence);
    });
  }

  function limitMaximumSentences(content) {
    content.sentences = content.sentences.slice(0, content.maximumSentences);
  }

  function addSentencesToString(content) {
    let sentenceText = "";
    content.finalSentence = []

    for (sentence in content.sentences) {
      sentenceText += " " + content.sentences[sentence];
    }
    content.finalSentence.push(sentenceText);

    console.log(sentenceText);
    
  }
}

module.exports = robot;
