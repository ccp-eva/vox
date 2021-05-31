// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR GETTING THE PREFERRED BROWSER LANGUAGE
// ---------------------------------------------------------------------------------------------------------------------
export default () => {
  let lang;

  // get the most preferred browser language
  for (let i = 0; i < navigator.languages.length; i++) {
    if (navigator.languages[i].includes('de')) {
      lang = 'de';
      break;
    }
    if (navigator.languages[i].includes('en')) {
      lang = 'en';
      break;
    }
  }

  // if neither de nor en is preferred, use english as default language
  if (lang == null) lang = 'en';

  // TODO!!! after testing, delete this!!
  lang = 'de';
  return lang;
};
