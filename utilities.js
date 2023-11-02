// insert the text clicked into the Google Doc at the cursor's current location
function insertQueryResultHandler(event) {
  let params = event.parameters;
  console.log( "text: " + params.item);

  let doc = DocumentApp.getActiveDocument();
  let paragraph = doc.getBody().appendParagraph(params.item);
  //let insertedTxt = doc.getCursor().insertText('\n' + params.item + '\n');
  let position = doc.newPosition(paragraph.getChild(0), 2);
  doc.setCursor(position);
}

function scrollDownToText(event){
  // insertQueryResultHandler(event);
  let params = event.parameters;  
  testText = params.item;
  console.log(testText);
  //testText = "Clean and sanitize";
  

  let doc = DocumentApp.getActiveDocument();
  // Get the document body.
  var body = doc.getBody();  
  paragraphs = body.getParagraphs();

  var backgroundColor = backgroundColor || '#FFFF00';  // highlight yellow.
  var highlightStyle = {};
  highlightStyle[DocumentApp.Attribute.BACKGROUND_COLOR] = backgroundColor;


  var paragraph;
  for (var i = 0; i < paragraphs.length; i++) {
    paragraph = paragraphs[i]; 
    var text = paragraph.getText();
    
    var pos;    
    if (text.includes(testText)==true)     
    {    
      console.log("Found text in paragraph: " + text);
      // find the position where to insert the text
      var matchPosition = paragraph.findText(testText);     
      var startOffset = matchPosition.getStartOffset();      
      var endOffset = matchPosition.getEndOffsetInclusive();

      if (matchPosition != null && matchPosition.getStartOffset() != -1) {
        matchPosition.getElement().setAttributes(startOffset, endOffset, highlightStyle);
      }
      

      pos = doc.newPosition(paragraph.getChild(0), startOffset + 1);      
      doc.setCursor( pos );
      bookmark = doc.addBookmark(pos);      
    }
  }
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
