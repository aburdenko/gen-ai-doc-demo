function onDemoConfig() {
  let staticDemoModeEnabled = getIsStaticDemoModeEnabled();
  let isMedPalmEnabled = getIsMedPalmEnabled();

  let card = CardService.newCardBuilder();
  let cardHeader = CardService.newCardHeader()
    .setTitle('Configure Demo')
    .setImageStyle(CardService.ImageStyle.SQUARE)
    .setImageUrl('https://www.gstatic.com/images/icons/material/system/1x/science_black_24dp.png');

  card.setHeader(cardHeader);

  let section = CardService.newCardSection();

  let p = CardService.newTextParagraph()
    .setText('Use the fields below to configure this demo.');

  section.addWidget(p);
  
  //let swAction = CardService.newAction().setFunctionName('handleStaticModeSwitchToggle');
  let staticDemoModeSwitch = CardService.newSwitch()
    .setControlType(CardService.SwitchControlType.SWITCH)
    .setFieldName('staticModeSwitch')
    .setValue('test')
    .setSelected(staticDemoModeEnabled);

  let staticDemoModeWidget = CardService.newDecoratedText()
    .setSwitchControl(staticDemoModeSwitch)
    .setText('Static Demo Mode');

  let useMedPalmSwitch = CardService.newSwitch()
    .setControlType(CardService.SwitchControlType.SWITCH)
    .setFieldName('useMedPalmSwitch')
    .setValue('test')
    .setSelected(isMedPalmEnabled);

  let useMedPalmWidget = CardService.newDecoratedText()
    .setSwitchControl(useMedPalmSwitch)
    .setText('Use MedPaLM');

  section.addWidget(staticDemoModeWidget);
  section.addWidget(useMedPalmWidget);


  let saveConfigAction = CardService.newAction()
    .setFunctionName('saveConfig');

  section.addWidget(
    CardService.newTextButton()
      .setText('Save Config')
      .setOnClickAction(saveConfigAction)
  );

  card.addSection(section);

  return card.build();
}

function saveConfig(event) {
  let formInputs = event.commonEventObject.formInputs;

  if (!formInputs) {
    setStaticDemoModeState(false);
    setMedPalmEnabled(false);
  } else {

    if (formInputs.staticModeSwitch) {
      setStaticDemoModeState(true);
    } else {
      setStaticDemoModeState(false);
    }

    if (formInputs.useMedPalmSwitch) {
      setMedPalmEnabled(true);
    } else {
      setMedPalmEnabled(false);
    }
    
  }
 
  let card = buildMainInterface();

  let actionResponse = CardService.newActionResponseBuilder()
   .setNavigation(CardService.newNavigation().updateCard(card))
   .setStateChanged(false)
   .build();

  return actionResponse;
}

function getIsStaticDemoModeEnabled() {
  let dp = PropertiesService.getDocumentProperties();

  let staticDemoModeEnabled = dp.getProperty(DOC_PROP_STATIC_DEMO_MODE);
  if (!staticDemoModeEnabled) {
    return false;
  } 
  
  return true;
}

function setStaticDemoModeState(state) {
  let dp = PropertiesService.getDocumentProperties();

  if (state) {
    dp.setProperty(DOC_PROP_STATIC_DEMO_MODE, 'true');
  } else {
    dp.deleteProperty(DOC_PROP_STATIC_DEMO_MODE);
  }
}

function getIsMedPalmEnabled() {
  let dp = PropertiesService.getDocumentProperties();

  let medPalmEnabled = dp.getProperty(DOC_PROP_USE_MED_PALM);
  if (!medPalmEnabled) {
    return false;
  } 
  
  return true;
}

function setMedPalmEnabled(state) {
  let dp = PropertiesService.getDocumentProperties();

  if (state) {
    dp.setProperty(DOC_PROP_USE_MED_PALM, 'true');
  } else {
    dp.deleteProperty(DOC_PROP_USE_MED_PALM);
  }
}
