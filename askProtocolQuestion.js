


const toolName = 'Moderna Document \n Assistant';
const companyName = 'Cymbal Health';
const companyLogoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Moderna_logo.svg/320px-Moderna_logo.svg.png';

//const companyName = 'Moderna';
//const companyLogoUrl = 'https://logo.clearbit.com/www.modernatx.com';

const bioTechIconUrl = 'https://www.gstatic.com/images/icons/material/system/1x/biotech_black_24dp.png';
const summarizeIconUrl = 'https://www.gstatic.com/images/icons/material/system/1x/summarize_black_24dp.png';
const virusIconUrl = 'https://www.gstatic.com/images/icons/material/system/1x/microbiology_black_24dp.png';
const evidenceUrl = 'https://www.gstatic.com/images/icons/material/system/1x/feature_search_black_24dp.png';
const reviewCommsUrl = 'https://www.gstatic.com/images/icons/material/system/1x/edit_note_black_24dp.png';
const medQuestionUrl = 'https://www.gstatic.com/images/icons/material/system/1x/psychology_alt_black_24dp.png';

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
