function onDocsFileScopeGranted() {
  return buildMainInterface();
}


function onDocsHomepage(e) {
  if (e.docs.addonHasFileScopePermission) {
    return buildMainInterface();
  }

  return buildFilePermissionCard();
}

function buildMainInterface() {
  buildProperties();
  
  let card = CardService.newCardBuilder();

  addCommonHeader(card);
  addCommonFooter(card);

  let section = CardService.newCardSection();

  section.addWidget(
    CardService.newTextParagraph().setText(
      "Select an action below:"
    )
  );
  card.addSection(section);


  let section3 = CardService.newCardSection();
  let reviewCommsAction = CardService.newAction().setFunctionName(
    'buildCorrespondenceCard'
  );
  let rcIcon = CardService.newIconImage().setIconUrl(reviewCommsUrl)
    .setImageCropType(CardService.ImageCropType.SQUARE)
  rcDecText = CardService.newDecoratedText()
    .setStartIcon(rcIcon)
    .setOnClickAction(reviewCommsAction)
    .setText('Review My Document')
    //.setText('Summarize');
  section3.addWidget(rcDecText);
  card.addSection(section3);
  
  let section2 = CardService.newCardSection();
  let evidenceLookupAction = CardService.newAction().setFunctionName(
    'buildEvidenceLookupCard'
  );
  let evIcon = CardService.newIconImage().setIconUrl(evidenceUrl)
    .setImageCropType(CardService.ImageCropType.SQUARE);
  evDecText = CardService.newDecoratedText()
    .setStartIcon(evIcon)
    //.setOnClickAction(evidenceLookupAction)
//    .setTopLabel(' against published claims')
    .setText('See Document Metrics')
    .setOpenLink(
      CardService.newOpenLink()
        .setUrl('https://lookerstudio.google.com/s/p-dFx8SvN-c')
    );
  section2.addWidget(evDecText);
  card.addSection(section2);

  let section4 = CardService.newCardSection();
  let medQuestionAction = CardService.newAction().setFunctionName(
    'buildMedQuestionCard'
  );
  let mqIcon = CardService.newIconImage().setIconUrl(medQuestionUrl)
    .setImageCropType(CardService.ImageCropType.SQUARE)
  mqDecText = CardService.newDecoratedText()
    .setStartIcon(mqIcon)
    .setOnClickAction(medQuestionAction)
    .setText('Ask a Question \n about this document')
    //.setText('Summarize');
  section4.addWidget(mqDecText);
  card.addSection(section4);

  let section5 = CardService.newCardSection();
  let approveAction = CardService.newAction().setFunctionName(
    'buildApproveCard'
  );
  let apIcon = CardService.newIconImage().setIconUrl(approveUrl).setImageCropType(CardService.ImageCropType.SQUARE)
  apText = CardService.newDecoratedText().setStartIcon(apIcon).setOnClickAction(approveAction).setText('Send for approval');
  section5.addWidget(apText);
  card.addSection(section5);

  let section6 = CardService.newCardSection();
  let cardSection1SelectionInput1 = CardService.newSelectionInput()
        .setFieldName('documentStage')
        .setTitle('Document Stage')
        .setType(CardService.SelectionInputType.DROPDOWN)
        .addItem('Draft', 'Draft', true)
        .addItem('Ready For Review', 'ReadyforReview', false)
        .addItem('Under Review', 'UnderReview', false);

  section6.addWidget(cardSection1SelectionInput1);
  card.addSection(section6);

  return card.build();
}

/**
 * Constructs card to request user grant Add-on to editor file that is open.
 *
 * @return {CardService.Card}
 */
function buildFilePermissionCard() {
  // If the add-on does not have access permission, add a button that
  // allows the user to provide that permission on a per-file basis.
  var card = CardService.newCardBuilder();
  let cardSection = CardService.newCardSection();

  cardSection.addWidget(
    CardService.newTextParagraph().setText(
      "The Add-on needs permission to access this file's contents."
    )
  );
  let buttonAction = CardService.newAction().setFunctionName(
    'onRequestFileScopeButtonClicked'
  );
  let button = CardService.newTextButton()
    .setText('Grant permission')
    .setOnClickAction(buttonAction);

  cardSection.addWidget(button);
  return card.addSection(cardSection).build();
}


/**
 * Callback function for a button action. Instructs Docs to display a
 * permissions dialog to the user, requesting `drive.file` scope for the
 * current file on behalf of this add-on.
 *
 * @param {Object} e The parameters object that contains the document’s ID
 * @return {editorFileScopeActionResponse}
 */
function onRequestFileScopeButtonClicked(e) {
  return CardService.newEditorFileScopeActionResponseBuilder()
    .requestFileScopeForActiveDocument()
    .build();
}

function addCommonHeader(card) {
   let cardHeader = CardService.newCardHeader()
    .setTitle(toolName)
    .setSubtitle(companyName)
    .setImageUrl(companyLogoUrl);
   // .setImageStyle(CardService.ImageStyle.);        

  card.setHeader(cardHeader);
}

function addCommonFooter(card) {

  let footerButton = CardService.newTextButton()
      .setText('Built by and for ' + companyName)
      .setOpenLink(
        CardService.newOpenLink()
          .setUrl('https://www.modernatx.com/')
      );

  let footer = CardService.newFixedFooter()
    .setPrimaryButton(footerButton);

  card.setFixedFooter(footer);
}



function buildProperties() {
  PropertiesService.getScriptProperties().setProperties({            
      'toolName': 'Moderna Document Review Assistant',
      'companyName': 'Moderna',
      'companyLogoUrl': 'https://logo.clearbit.com/www.modernatx.com',
      'bioTechIconUrl': 'https://www.gstatic.com/images/icons/material/system/1x/biotech_black_24dp.png',
      'summarizeIconUrl': 'https://www.gstatic.com/images/icons/material/system/1x/summarize_black_24dp.png',
      'virusIconUrl': 'https://www.gstatic.com/images/icons/material/system/1x/microbiology_black_24dp.png',
      'evidenceUrl': 'https://www.gstatic.com/images/icons/material/system/1x/feature_search_black_24dp.png',
      'reviewCommsUrl': 'https://www.gstatic.com/images/icons/material/system/1x/edit_note_black_24dp.png',
      'medQuestionUrl': 'https://www.gstatic.com/images/icons/material/system/1x/psychology_alt_black_24dp.png',

      'DOC_PROP_STATIC_DEMO_MODE': 'DOC_PROP_STATIC_DEMO_MODE',
      'DOC_PROP_USE_MED_PALM': 'DOC_PROP_USE_MED_PALM',      
      'defaultMedQuestion': 'What is this document about?'
  })
}

function setProperty( propName, propValue ) {
  PropertiesService.getScriptProperties().setProperty( propName,  propValue);
}

function getProperty( propName ) {
  return PropertiesService.getScriptProperties().getProperty( propName )  
}

