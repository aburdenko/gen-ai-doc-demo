// insert the text clicked into the Google Doc at the cursor's current location
function insertQueryResultHandler(event) {
  let params = event.parameters;

  let doc = DocumentApp.getActiveDocument();
  let paragraph = doc.getBody().appendParagraph(params.item);
  //let insertedTxt = doc.getCursor().insertText('\n' + params.item + '\n');
  let position = doc.newPosition(paragraph.getChild(0), 2);
  doc.setCursor(position);
}

function markDownToHtml(mdText) {
  mdText = mdText.toString();
  mdText = mdText.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  mdText = mdText.replace(/__(.*?)__/g, "<u>$1</u>");
  mdText = mdText.replace(/~~(.*?)~~/g, "<i>$1</i>");
  mdText = mdText.replace(/--(.*?)--/g, "<del>$1</del>");
  mdText = mdText.replace(/<<(.*?)>>/g, "<a href='$1'>Link</a>");
  mdText = mdText.replace(/you state that "(.*?)"/g, "you state that <font color=\"#FF0000\">\"$1\"</font>");
  mdText = mdText.replace(/say something like, "(.*?)"/g, "say something like, <font color=\"#0000FF\">\"$1\"</font>");
  mdText = mdText.replace(/say something like "(.*?)"/g, "say something like <font color=\"#0000FF\">\"$1\"</font>");
  mdText = mdText.replace(/such as "(.*?)"/g, "such as <font color=\"#0000FF\">\"$1\"</font>");

  return mdText;
}
