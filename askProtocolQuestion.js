const medQuestionPrompt ='You are a helpful medical knowledge assistant. Provide useful, complete and scientifically-grounded answers to queries. Question: ';
const defaultMedQuestion = 'What are the main steps in Phase 2 clinical trials?';


function buildMedQuestionCard() {

  let card = CardService.newCardBuilder();

  addCommonHeader(card);
  addCommonFooter(card);

  let section = CardService.newCardSection();

  section.addWidget(
    CardService.newTextParagraph().setText(
      "Ask a question about clinical trial protocol adherence below:"
    )
  );

  section.addWidget(CardService.newTextParagraph().setText('\n'));

  let textInput = CardService.newTextInput();
  textInput.setFieldName('query')
    .setHint('Example: ' + defaultMedQuestion);

  section.addWidget(textInput);

  section.addWidget(CardService.newTextParagraph().setText('\n'));

  let runMedQuestionAction = CardService.newAction()
    .setFunctionName('buildMedQuestionResultsCard');

  section.addWidget(
    CardService.newTextButton()
      .setText('Ask Question')
      .setOnClickAction(runMedQuestionAction)
  );

  card.addSection(section);

  return card.build();
}


function buildApproveCard(){

  let card = CardService.newCardBuilder();

  addCommonHeader(card);
  addCommonFooter(card);

  let section = CardService.newCardSection();

  section.addWidget(
    CardService.newTextParagraph().setText(
      "Enter the email of the next approver for this document below:"
    )
  );

  section.addWidget(CardService.newTextParagraph().setText('\n'));

  let textInput = CardService.newTextInput();
  textInput.setFieldName('appEmail');

  section.addWidget(textInput);

  section.addWidget(CardService.newTextParagraph().setText('\n'));

  section.addWidget(
    CardService.newTextButton()
      .setText('Send Email')
      .setOnClickAction(buildApprovalResultCard)
  );

  card.addSection(section);

  return card.build();
}

var buildApprovalResultCard = CardService.newAction().setFunctionName('runSendApprovalAction');
CardService.newTextButton().setText('Open Link').setOnClickOpenLinkAction(buildApprovalResultCard);


function runSendApprovalAction(event) {

  let approverEmail = "";
  let emailInputs = event.commonEventObject.formInputs;
  if (emailInputs && emailInputs.query && emailInputs.query.stringInputs.value[0]) {
    approverEmail = emailInputs.query.stringInputs.value[0];
  }

  //approverEmail = emailInputs.query.stringInputs.value[0];
  console.log("Approver Email Captured! " + event + "***");


  var docLink = DocumentApp.getActiveDocument().getUrl();

  var constructEmail = "mailto:aburdenko@google.com?subject=Please Approve this document &body=Hi there, %0D%0DThere's a document pending your approval, please check in the system, or find it using this link:%0D%0D" + docLink;

  return CardService.newActionResponseBuilder()
      .setOpenLink(CardService.newOpenLink()
          .setUrl(constructEmail))
      .build();

}

/*
function buildApprovalResultCard(event){
  //let emailInputs = event.commonEventObject.formInputs;
  //let appEmail = "emilydu@google.com";
  //let emailMessage = "Hi there, \n there's a document pending your approval, please check in the system, or find it using this link:\n https://docs.google.com/document/d/1RQOpkNEbExG5GXnJe48gTCgUw3sI3gat8OHMyYDkeW4/edit?resourcekey=0-936PbmlUIzVs7kB5fZ6STQ. \n\n*auto-generated system message*"

  //MailApp.sendEmail("emilydu@google.com", "A document is pending your approval.", emailMessage);
}
*/

function storeSecrets() {
  PropertiesService.getScriptProperties().setProperties({
      'toolName': 'SOP Document Assistant',
      'companyName': 'Moderna',
      'companyLogoUrl': 'mySecretApiKey'      
  })
}

function buildMedQuestionResultsCard(event) {
  let formInputs = event.commonEventObject.formInputs;
  let query = defaultMedQuestion;
  
  if (formInputs && formInputs.query && formInputs.query.stringInputs.value[0]) {
    query = formInputs.query.stringInputs.value[0];
  }
  
  let response = runMedicalQuery(query);
  let responseParagraphs = response.split('\n');

  let card = CardService.newCardBuilder();
  
  addCommonHeader(card);
  addCommonFooter(card);

  let section = CardService.newCardSection();

  let p = CardService.newTextParagraph()
    .setText('Your question was: <b>"' + query + '</b>"');
  section.addWidget(p);

  p = CardService.newTextParagraph()
    .setText('An AI generated response is shown below. Click on individual paragrapms to append them to your Google Doc.');
  section.addWidget(p);
  section.addWidget(CardService.newDivider());

  for (const rp of responseParagraphs) {
    let insertQueryResult = CardService.newAction()
        .setFunctionName('insertQueryResultHandler')
        .setParameters({item: rp});

    rpdt = CardService.newDecoratedText()
      .setOnClickAction(insertQueryResult)
      .setText(markDownToHtml(rp))
      .setWrapText(true)
    section.addWidget(rpdt);
  }

  card.addSection(section);
  let builtCard = card.build();

  let actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(builtCard))
    .setStateChanged(false)
    .build();

  return actionResponse;
}

function runMedicalQuery(query) {
  query = medQuestionPrompt + query;
  result = callTextAI(query);

  return result;
}