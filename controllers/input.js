const readline = require('readline-sync')
const state = require('./state.js')

function robot() {
  const content = {
    maximumSentences: 5
  }

  content.lang = askAndReturnLanguage()
  content.searchTerm = askAndReturnSearchTerm()
  content.prefix = askAndReturnPrefix()
  state.save(content)

  function askAndReturnLanguage() {
    const prefixes = ['pt', 'en']
    const selectedLanguageIndex = readline.keyInSelect(prefixes, 'Choose one option: ')
    const selectedLanguageText = prefixes[selectedLanguageIndex]

    return selectedLanguageText
  }

  function askAndReturnSearchTerm() {
    return readline.question('Type a Wikipedia search term: ')
  }

  function askAndReturnPrefix() {
    const prefixes = ['Who is', 'What is', 'The history of']
    const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ')
    const selectedPrefixText = prefixes[selectedPrefixIndex]

    return selectedPrefixText
  }

}

module.exports = robot