



function buildMedQuestionCard() {

  let card = CardService.newCardBuilder();

  addCommonHeader(card);
  addCommonFooter(card);

  let section = CardService.newCardSection();

  section.addWidget(
    CardService.newTextParagraph().setText(
      "Ask a question about this SOP Document"
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

function buildMedQuestionResultsCard(event) {
  let formInputs = event.commonEventObject.formInputs;
  let query = defaultMedQuestion;
  
  if (formInputs && formInputs.query && formInputs.query.stringInputs.value[0]) {
    query = formInputs.query.stringInputs.value[0];
  }
  
  console.log( "query : " + query );

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
  
  if (null == (result = getProperty(query))){    
    let doc = DocumentApp.getActiveDocument();
    let docContentPrompt = doc.getBody().getText();

    preQuery = "Using the following document: ";
    preQuery += docContentPrompt + "\n";
    query = preQuery + "\n" + query;

    console.log("Prompt is: " + query);

    result = callTextAI(query);    
    setProperty( query, result );
  }

  return result;
}
