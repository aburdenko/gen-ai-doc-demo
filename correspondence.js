const defaultTextMessage = 'Provide Feedback in list form on Target Message based on the target document. For each item in the list, be sure to quote the original sentence from the Researcher Message.';

const defaultJSONMessage = 'Provide Feedback on Target Message based on the Target Document. Structure your response as a JSON containing an array of objects with a maximum of 5 objects in the array, where each object contains the reason for your feedback (call the field "feedback"), the original sentence from the Target Message (call the field "originalText"), and the recommended text to replace the original text with (call the field "replaceWith"). Do not add commas after the last object field in each array entry. Do not hallucinate.';


const defaultContextPre2 = '\nDraft of the Target Message:\n'

/*
const defaultContextPre = 'You are a regulatory affairs investigator conducting outreach to a physician conducting a clinical trial in Germany. \n \
For context, let\'s imagine a researcher wants to share the results of a clinical trial for a new cancer drug with their colleagues via an internal communication';

const defaultContextPost = "All communications about clinical trials should: \
Not make definitive claims about the effectiveness of a treatment without providing specific data and statistics. \
Avoid language that could be interpreted as promotional or marketing-oriented. \
Use neutral language to describe trial outcomes."';
*/
////////

/*
const defaultTextMessage = 'Provide Feedback in list form on Researcher Message based on the regulatory document. For each item in the list, be sure to quote the original sentence from the Researcher Message. Refer to yourself as "' + toolName + '"';

const defaultJSONMessage = 'Provide Feedback on Researcher Message based on the Regulatory Document. Structure your response as a JSON containing an array of objects, where each object contains the reason for your feedback (call the field "feedback"), the original sentence from the Research Message (call the field "originalText"), and the recommended text to replace the original text with (call the field "replaceWith"). Do not add commas after the last object field in each array entry.';

const defaultContextPre = 'You are a regulatory affairs investigator conducting outreach to a physician conducting a clinical trial in Germany. \n \
For context, let\'s imagine a researcher wants to share the results of a clinical trial for a new cancer drug with their colleagues via an internal communication.\n \
Draft of the Researcher Message:\n'

const defaultContextPost = '\nRegulatory Document Extract:\n \
"All communications about clinical trials should: \
Not make definitive claims about the effectiveness of a treatment without providing specific data and statistics. \
Avoid language that could be interpreted as promotional or marketing-oriented. \
Use neutral language to describe trial outcomes."';
*/

function buildCorrespondenceCard() {
  userProperties = PropertiesService.getUserProperties();      
  userProperties.deleteAllProperties();    

  let card = CardService.newCardBuilder();

  addCommonHeader(card);
  addCommonFooter(card);

  let section = CardService.newCardSection();

  section.addWidget(
    CardService.newTextParagraph().setText(
      'Click the button below to have ' + toolName + ' review this document for consistency with our established rules for medical correspondence.'
    )
  );

  section.addWidget(CardService.newTextParagraph().setText('\n'));

  let runReviewCorrespondenceAction = CardService.newAction()
    .setFunctionName('buildCorrespondenceResultsCard');

  section.addWidget(
    CardService.newTextButton()
      .setText('Review My Document')
      .setOnClickAction(runReviewCorrespondenceAction)
  );

  card.addSection(section);

  return card.build();
}

function buildCorrespondenceResultsCard(event) {
  
  let aiResponseText = runCorrespondenceQuery(defaultJSONMessage);
  let aiResponseObj = parseCorrespondenceFeedback(aiResponseText);

  if (aiResponseObj) {
    return buildCorrespondenceCardJSON(aiResponseObj); 
  } else {
    // invalid JSON returned fallback to text
    aiResponseText = runCorrespondenceQuery(defaultTextMessage);
    return buildCorrespondenceCardText(aiResponseText);
  }
}

function buildCorrespondenceCardJSON(aiResponseObj) {

  let card = CardService.newCardBuilder();
  
  addCommonHeader(card);
  addCommonFooter(card);

  let hSection = CardService.newCardSection();

  p = CardService.newTextParagraph()
    .setText('One or more recommendations have been identified to help your medical correspondence be more consistent with our established rules. Please review them below.');
  hSection.addWidget(p);

  card.addSection(hSection);

  for (let i=0; i < aiResponseObj.length; i++) {
    let rSection = CardService.newCardSection();
    rSection.setCollapsible(true);
    rSection.setHeader('Recommendation #' + Number(i+1) + ': '
      + aiResponseObj[i].originalText.substring(0, 30) + '...');
    console.log('recc ' + i + ' : ' + aiResponseObj[i].feedback);

    let txtBlock = '<b>You said: </b><font color="#FF0000">"' + aiResponseObj[i].originalText + '"</font>\n\n';

    txtBlock += '<b>Feedback:</b> ' + aiResponseObj[i].feedback + '\n\n';

    txtBlock +=  '<b>Recommended language: </b><font color="#0000FF">"' + aiResponseObj[i].replaceWith + '"</font>\n';

    
    let params = {
      singleAIResponseObj: JSON.stringify(aiResponseObj[i])
    };

    let scrollDownToTextAction = CardService.newAction()
      .setFunctionName('scrollDownToText')      
      .setParameters({item: aiResponseObj[i].originalText});
    

    let applySuggestionsAction = CardService.newAction()
      .setFunctionName('applySuggestion')
      .setParameters(params);


    let deleteSuggestionsAction = CardService.newAction()
      .setFunctionName('applySuggestion')
      .setParameters(params);  

    let p = CardService.newTextParagraph().setText('\n');
    rSection.addWidget(p);

    rSection.addWidget(
      CardService.newTextButton()
        .setText('Apply this Recommendation')
        .setOnClickAction(applySuggestionsAction)
    );

    rSection.addWidget(
      CardService.newTextButton()
        .setText('Delete this Recommendation')
        .setOnClickAction(deleteSuggestionsAction)
    );

    let rp = CardService.newDecoratedText()
      .setText(txtBlock)
      .setWrapText(true)
      .setOnClickAction(scrollDownToTextAction)
    rSection.addWidget(rp);


    p = CardService.newTextParagraph().setText('\n');
    rSection.addWidget(p);

    // let cardSection1Image1 = CardService.newImage()
    //   .setImageUrl( "https://www.gstatic.com/images/icons/material/system/1x/thumb_down_black_16dp.png" )
    //       //'https://fonts.google.com/icons?selected=Material%20Symbols%20Outlined%3Athumb_down%3AFILL%400%3Bwght%40400%3BGRAD%400%3Bopsz%4024'
                
    //   .setAltText('Thumbs Down');

    // rSection.addWidget(cardSection1Image1); 

    p = CardService.newTextParagraph().setText('\n');
    rSection.addWidget(p);

    card.addSection(rSection);
  }

  let builtCard = card.build();

  let actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(builtCard))
    .setStateChanged(false)
    .build();

  return actionResponse;
}

function buildCorrespondenceCardText(aiResponseText) {
  let card = CardService.newCardBuilder();
  
  addCommonHeader(card);
  addCommonFooter(card);

  let section = CardService.newCardSection();

  p = CardService.newTextParagraph()
    .setText('One or more recommendations have been identified to help your medical correspondence be more consistent with our established rules. Please review them below.');
  section.addWidget(p);

  section.addWidget(CardService.newDivider());

  let rp = CardService.newDecoratedText()
      .setText(markDownToHtml(aiResponseText))
      .setWrapText(true)
  section.addWidget(rp);

  
  card.addSection(section);

  let builtCard = card.build();

  let actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(builtCard))
    .setStateChanged(false)
    .build();

  return actionResponse;
}

function runCorrespondenceQuery(message) {
  console.log("in runCorrespondenceQuery...");
  let doc = DocumentApp.getActiveDocument();
  let id = doc.getId();

  let correspondence = doc.getBody().getText();

  let contextStrings = loadContextStringsFromSheet();
  let defaultContextPre = contextStrings[0];
  let defaultContextPost = contextStrings[1];

  let context = defaultContextPre + defaultContextPre2 
    + correspondence + '\nTarget Document Extract:\n' + defaultContextPost;

  let contextWithoutDoc = defaultContextPre + defaultContextPre2 
    + "<DOCUMENT HERE>" + '\nTarget Document Extract:\n' + defaultContextPost;


  console.log("context: " + contextWithoutDoc); 
  console.log("message: " + message); 
  result = callChatAI(id, context, message);


  //result = callTextAI(id, context + "\n" + message, contextWithoutDoc + "\n" + message);
  return result;
}

function parseCorrespondenceFeedback(aiResponseTxt) {
  let aiResponseObj;

  // extract the array
  let regex = /.*(\[.*\]).*/s;
  let found = aiResponseTxt.match(regex);

  if (!found || found.length !== 2) {
    console.log('Unexpected response from correspondence query');
    return null;
  }

  aiResponseTxt = found[1];

  aiResponseTxt = aiResponseTxt.replaceAll('\r', '');
  aiResponseTxt = aiResponseTxt.replaceAll('\n', '');

  aiResponseTxt = aiResponseTxt.replaceAll('",  }', '"}');
  aiResponseTxt = aiResponseTxt.replaceAll('},]', '}]');

  try {
    aiResponseObj = JSON.parse(aiResponseTxt);

  } catch (e) {
    console.log('Failed to format JSON response from AI');
    console.log(e);
    return null;
  }
  
  for (let i=0; i < aiResponseObj.length; i++) { 
    aiResponseObj[i].feedback = aiResponseObj[i].feedback.replace(/The sentence '.+' /g, "This sentence ");
    aiResponseObj[i].feedback = aiResponseObj[i].feedback.replace(/The statement '.+' /g, "This statement ")
  }

  return aiResponseObj;

}

function applySuggestion(params) {
  let singleAIResponseObj = JSON.parse(params.parameters.singleAIResponseObj);

  let doc = DocumentApp.getActiveDocument();
  let body = doc.getBody();
  body.replaceText(
    singleAIResponseObj.originalText,
    singleAIResponseObj.replaceWith);
}

function deltetSuggestion(params) {  
  // todo
}

function loadContextStringsFromSheet() {
  let defaultContextPre = '';
  let defaultContextPost = '';

  const spreadsheetId = '1OCIaPKclN_AAurSgX0cyq0gKW8b2AHpEH6TFz_izB7g';
  const sheetName = 'Prompts';
  let found = false;

  let ss = SpreadsheetApp.openById(spreadsheetId);
  let sheet = ss.getSheetByName(sheetName);

  let range = sheet.getRange(2, 1, sheet.getMaxRows(), 3);
  let allRows = range.getValues();

  for (let i=0; i < allRows.length; i++) {
    let rowData = allRows[i];

    if (rowData[0] !== "") {
      // found selected row!
      defaultContextPre = rowData[1];
      defaultContextPost = rowData[2];
      found = true;
      break;
    }
  }

  if (!found) {
    console.log("Did not find any prompt data in the sheet!!!!");
    return null;
    
  }

  console.log(`found prompt data: ${defaultContextPre} + ${defaultContextPost}`);
  return [defaultContextPre, defaultContextPost];
}
