// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR CONVERTING RECTS INTO FOREIGNOBJECTS
// ---------------------------------------------------------------------------------------------------------------------
export default (elem) => {
// remove filling color
  elem.removeAttribute('fill');
  // get HTML of rect
  let { outerHTML } = elem;
  // replace rect tag by foreign object tag
  outerHTML = outerHTML.replace('<rect', '<foreignObject');
  outerHTML = outerHTML.replace('</rect>', '</foreignObject>');
  // replace html
  elem.outerHTML = outerHTML;
};
