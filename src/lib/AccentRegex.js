/* eslint-disable no-return-assign */
/**
 * Detect with a string have a accent and return a RegEx to detect accents
 * @param {string} string
 * @returns {string} RegEx to detect accents
 */
export default function AccentRegex(string) {
  const strArray = string.split('');

  const regexArray = strArray.map(char => {
    switch (char) {
      case 'a':
        return (char = '[a|à|á|â|ã|ä|å|æ]');

      case 'c':
        return (char = '[c|ç]');

      case 'e':
        return (char = '[e|è|é|ê|ë|æ]');

      case 'i':
        return (char = '[i|ì|í|î|ï]');

      case 'n':
        return (char = '[n|ñ]');

      case 'o':
        return (char = '[o|ò|ó|ô|õ|ö|ø]');

      case 's':
        return (char = '[s|ß]');

      case 'u':
        return (char = '[ù|ú|û|ü]');

      case 'y':
        return (char = '[y|ÿ]');

      default:
        return char;
    }
  });

  return regexArray.join('').toString();
}
