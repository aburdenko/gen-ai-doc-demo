const RESEARCH_PROMPT = "You are a GoogleSQL expert. Given an input question, first create a syntactically correct GoogleSQL \
  query to run, then look at the results of the query and return the answer to the input question. \
  Unless the user specifies in the question a specific number of examples to obtain, query for at most \
  10000 results using the LIMIT clause as per GoogleSQL. You can order the results to return the most \
  informative data in the database. Never query for all columns from a table. You must query only the \
  columns that are needed to answer the question. Wrap each column name in backticks (`) to denote \
  them as delimited identifiers. Pay attention to use only the column names you can see in the tables \
  below. Be careful to not query for columns that do not exist. Also, pay attention to which column is \
  in which table.\n\
  Use the following format: \n\
  Question: \"Question here\" \n\
  SQLQuery: \"SQL Query to run\" \n\
  Answer: \"Final answer here\" \n\
  Limit the response to 1024 characters. \n\n\
  Only use the following tables: (\'clinical_trials_aact.vw_participant_flows\',\'clinical_trials_aact.vw_detailed_descriptions\',\'clinical_trials_aact.vw_documents\',\'clinical_trials_aact.vw_pending_results\',\'clinical_trials_aact.vw_design_outcomes\',\'clinical_trials_aact.vw_design_group_interventions\',\'clinical_trials_aact.vw_interventions\',\'clinical_trials_aact.vw_conditions\',\'clinical_trials_aact.vw_browse_interventions\',\'clinical_trials_aact.vw_eligibilities\',\'clinical_trials_aact.vw_outcome_analysis_groups\',\'clinical_trials_aact.vw_intervention_other_names\',\'clinical_trials_aact.vw_criteria\',\'clinical_trials_aact.vw_outcome_measurements\',\'clinical_trials_aact.vw_facility_investigators\',\'clinical_trials_aact.vw_studies\',\'clinical_trials_aact.vw_brief_summaries\',\'clinical_trials_aact.vw_countries\',\'clinical_trials_aact.vw_central_contacts\',\'clinical_trials_aact.vw_baseline_measurements\',\'clinical_trials_aact.vw_sponsors\',\'clinical_trials_aact.vw_id_information\',\'clinical_trials_aact.vw_outcome_counts\',\'clinical_trials_aact.vw_reported_events\',\'clinical_trials_aact.vw_provided_documents\',\'clinical_trials_aact.vw_result_agreements\',\'clinical_trials_aact.vw_facility_contacts\',\'clinical_trials_aact.vw_calculated_values\',\'clinical_trials_aact.vw_links\',\'clinical_trials_aact.vw_keywords\',\'clinical_trials_aact.vw_aact_reference_ids\',\'clinical_trials_aact.vw_facilities\',\'clinical_trials_aact.vw_designs\',\'clinical_trials_aact.vw_aact_relations\',\'clinical_trials_aact.vw_responsible_parties\',\'clinical_trials_aact.vw_study_references\',\'clinical_trials_aact.vw_baseline_counts\',\'clinical_trials_aact.vw_outcome_analyses\',\'clinical_trials_aact.vw_browse_conditions\',\'clinical_trials_aact.vw_outcomes\',\'clinical_trials_aact.vw_result_contacts\',\'clinical_trials_aact.vw_milestones\',\'clinical_trials_aact.vw_overall_officials\',\'clinical_trials_aact.vw_drop_withdrawals\',\'clinical_trials_aact.vw_result_groups\',\'clinical_trials_aact.vw_design_groups\',\'clinical_trials_aact.vw_ipd_information_types\') \n\n\
  If someone asks for aggregation on a STRING data type column, then CAST column as NUMERIC before you do the aggregation. \n\n\
  If someone asks for specific month, use ActivityDate between current month\'s start date and current month\'s end date. \n\n\
  If someone asks for column names in the table, use the following format: \n\
  SELECT column_name \n\
  FROM `kallogjeri-project-345114.clinical_trials_aact`.INFORMATION_SCHEMA.COLUMNS \n\
  WHERE table_name in (\'clinical_trials_aact.vw_participant_flows\',\'clinical_trials_aact.vw_detailed_descriptions\',\'clinical_trials_aact.vw_documents\',\'clinical_trials_aact.vw_pending_results\',\'clinical_trials_aact.vw_design_outcomes\',\'clinical_trials_aact.vw_design_group_interventions\',\'clinical_trials_aact.vw_interventions\',\'clinical_trials_aact.vw_conditions\',\'clinical_trials_aact.vw_browse_interventions\',\'clinical_trials_aact.vw_eligibilities\',\'clinical_trials_aact.vw_outcome_analysis_groups\',\'clinical_trials_aact.vw_intervention_other_names\',\'clinical_trials_aact.vw_criteria\',\'clinical_trials_aact.vw_outcome_measurements\',\'clinical_trials_aact.vw_facility_investigators\',\'clinical_trials_aact.vw_studies\',\'clinical_trials_aact.vw_brief_summaries\',\'clinical_trials_aact.vw_countries\',\'clinical_trials_aact.vw_central_contacts\',\'clinical_trials_aact.vw_baseline_measurements\',\'clinical_trials_aact.vw_sponsors\',\'clinical_trials_aact.vw_id_information\',\'clinical_trials_aact.vw_outcome_counts\',\'clinical_trials_aact.vw_reported_events\',\'clinical_trials_aact.vw_provided_documents\',\'clinical_trials_aact.vw_result_agreements\',\'clinical_trials_aact.vw_facility_contacts\',\'clinical_trials_aact.vw_calculated_values\',\'clinical_trials_aact.vw_links\',\'clinical_trials_aact.vw_keywords\',\'clinical_trials_aact.vw_aact_reference_ids\',\'clinical_trials_aact.vw_facilities\',\'clinical_trials_aact.vw_designs\',\'clinical_trials_aact.vw_aact_relations\',\'clinical_trials_aact.vw_responsible_parties\',\'clinical_trials_aact.vw_study_references\',\'clinical_trials_aact.vw_baseline_counts\',\'clinical_trials_aact.vw_outcome_analyses\',\'clinical_trials_aact.vw_browse_conditions\',\'clinical_trials_aact.vw_outcomes\',\'clinical_trials_aact.vw_result_contacts\',\'clinical_trials_aact.vw_milestones\',\'clinical_trials_aact.vw_overall_officials\',\'clinical_trials_aact.vw_drop_withdrawals\',\'clinical_trials_aact.vw_result_groups\',\'clinical_trials_aact.vw_design_groups\',\'clinical_trials_aact.vw_ipd_information_types\'). \n\n\
  Question: ";

const defaultEvidenceQuestion = 'Find all tetrazole ocid subject compounds in clinical trials';

function buildEvidenceLookupCard() {

  let card = CardService.newCardBuilder();

  addCommonHeader(card);
  addCommonFooter(card);

  let section = CardService.newCardSection();

  section.addWidget(
    CardService.newTextParagraph().setText(
      "Enter a query below to search for evidence of claims and applications of different compounds, targets, therapies and diseases across 140M patents and publications:"
    )
  );

  section.addWidget(CardService.newTextParagraph().setText('\n'));

  let textInput = CardService.newTextInput();
  textInput.setFieldName('query')
    .setHint('Example: ' + defaultEvidenceQuestion);

  section.addWidget(textInput);

  let runQueryAction = CardService.newAction()
    .setFunctionName('buildQueryResultsCard');

  section.addWidget(CardService.newTextParagraph().setText('\n'));

  section.addWidget(
    CardService.newTextButton()
      .setText('Run Query')
      .setOnClickAction(runQueryAction)
  );

  card.addSection(section);

  return card.build();
}

function buildQueryResultsCard(event) {
  let formInputs = event.commonEventObject.formInputs;
  let query = defaultEvidenceQuestion;
  let answerJSON;
  
  if (formInputs && formInputs.query && formInputs.query.stringInputs.value[0]) {
    // for testing and debugging purposes
    query = formInputs.query.stringInputs.value[0];
  }

  console.log('query: ' + query);

  let card = CardService.newCardBuilder();
  
  addCommonHeader(card);
  addCommonFooter(card);

  let section = CardService.newCardSection();

  let p = CardService.newTextParagraph()
    .setText('Your question was: <b>"' + query + '</b>"');
  section.addWidget(p);
  
  p = CardService.newTextParagraph()
    .setText('Results for your query are shown below. Click one to append it to your Google Doc.');
  section.addWidget(p);
  section.addWidget(CardService.newDivider());

  let fullPrompt = RESEARCH_PROMPT + query;
  let result = callTextAI(fullPrompt);

  let answer = result.split('Answer: ');
  if (answer.length === 1) {
    answer = "Unable to determine result for your question."
  } else {

    // do some parsing on the answer to handle different result formats,
    // as well as incomplete results.
    answer = answer[1];

    if (answer.split("\n").length === 1) {

      // handle truncated responses
      if (answer.substring(0, 1) === "'" && answer.substring(answer.length-1, answer.length) !== "'") {
        answer = answer + "...'";
      }
      else if (answer.substring(0, 2) === "['" && answer.substring(answer.length-2, answer.length) !== "']") {
        answer = answer += "...']";
      }

      // make result set it into an array if not one aleready
      else if (answer.substring(0, 1) !== '[') {
        if (answer.substring(0, 1) !== '"') {
          answer = '"' + answer + '"';
        }
        answer = '[' + answer + ']';
      }

      // valid JSON uses " and not '
      answer = answer.replaceAll("'", '"');

      // make it a JSON with a single entry ('a') that has an array of 1 or more results
      answer = '{"a":' + answer + '}';
      console.log('answer: ' + answer);

      answerJSON = JSON.parse(answer);

      console.log('answerJSON: ' + answerJSON);
    } else {
      // has newlines. some types of table or paragraph text. leave as-is.
      answerJSON = {"a": [answer]};
    }
  }

  //let evItems = queryForEvidenceItems(query); // hard-coded / static results
  let evItems = answerJSON.a;

  let resultIcon = CardService.newIconImage().setIconUrl(bioTechIconUrl)
      .setImageCropType(CardService.ImageCropType.SQUARE);

  for (let i = 0; i < Math.min(evItems.length, 30); i++) {
    let evi = evItems[i];

    let insertQueryResult = CardService.newAction()
      .setFunctionName('insertQueryResultHandler')
      .setParameters({item: evi});

    let resDecText = CardService.newDecoratedText()
      .setStartIcon(resultIcon)
      .setOnClickAction(insertQueryResult)
      .setText(markDownToHtml(evi))
      .setWrapText(true);

    section.addWidget(resDecText);
    
  }

  card.addSection(section);
  let builtCard = card.build();

  let actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(builtCard))
    .setStateChanged(false)
    .build();

  return actionResponse;

}

/*
const hardCodedEvidence = [
  {
    "question": "What kind of assays are in PubChem?",
    "results": ['Acute Toxicity', 'Acute Toxicity (Inhalation)', 'Acute Toxicity (Oral)', 'Acute Toxicity (Dermal)', 'Acute Toxicity (Injection)', 'Acute Toxicity (Skin Irritation)', 'Acute Toxicity (Eye Irritation)', 'Acute Toxicity (Skin Sensitization)', 'Acute Toxicity (Inhalation LC50)', 'Acute Toxicity (Oral LD50)', 'Acute Toxicity (Dermal LD50)', 'Acute Toxicity (Injection LD50)', 'Acute Toxicity (Skin Irritation LD50)', 'Acute Toxicity (Eye Irritation LD50)', 'Acute Toxicity (Skin Sensitization LD50)', 'Acute Toxicity (Inhalation LC50 (Rat)', 'Acute Toxicity (Oral LD50 (Rat)', 'Acute Toxicity (Dermal LD50 (Rat)', 'Acute Toxicity (Injection LD50 (Rat)', 'Acute Toxicity (Skin Irritation LD50 (Rat)', 'Acute Toxicity (Eye Irritation LD50 (Rat)', 'Acute Toxicity (Skin Sensitization LD50 (Rat)', 'Acute Toxicity (Inhalation LC50 (Mouse)', 'Acute Toxicity (Oral LD50 (Mouse)', 'Acute Toxicity (Dermal LD50 (Mouse)', 'Acute Toxicity (Injection LD50 (Mouse)', 'Acute Toxicity (Skin Irritation LD50 (Mouse)', 'Acute Toxicity (Eye Irritation LD50 (Mouse)', 'Acute Toxicity (Skin Sensitization LD50 (Mouse)', 'Acute Toxicity (Inhalation LC50 (Rabbit)', 'Acute Toxicity (Oral LD50 (Rabbit)', 'Acute Toxicity (Dermal LD50 (Rabbit)', 'Acute Toxicity (Injection LD50 (Rabbit)', 'Acute Toxicity (Skin Irritation LD50 (Rabbit)', 'Acute Toxicity (Eye Irritation LD50 (Rabbit)', 'Acute Toxicity (Skin Sensitization LD50 (Rabbit)', 'Acute Toxicity (Inhalation LC50 (Dog)', 'Acute Toxicity (Oral LD50 (Dog)', 'Acute Toxicity (Dermal LD50 (Dog)', 'Acute Toxicity (Injection LD50 (Dog)', 'Acute Toxicity (Skin Irritation LD50 (Dog)', 'Acute Toxicity (Eye Irritation LD50 (Dog)', 'Acute Toxicity (Skin Sensitization LD50 (Dog)', 'Acute Toxicity (Inhalation LC50 (Guinea Pig)', 'Acute Toxicity (Oral LD50 (Guinea Pig)', 'Acute Toxicity (Dermal LD50 (Guinea Pig)', 'Acute Toxicity (Injection LD50 (Guinea Pig)', 'Acute Toxicity (Skin Irritation LD50 (Guinea Pig)', 'Acute Toxicity (Eye Irritation LD50 (Guinea Pig)', 'Acute Toxicity (Skin Sensitization LD50 (Guinea Pig)', 'Acute Toxicity (Inhalation LC50 (Hamster)', 'Acute Toxicity (Oral LD50 (Hamster)', 'Acute Toxicity (Dermal LD50 (Hamster)', 'Acute Toxicity (Injection LD50 (Hamster)', 'Acute Toxicity (Skin Irritation LD50 (Hamster)', 'Acute Toxicity (Eye Irritation LD50 (Hamster)', 'Acute Toxicity (Skin Sensitization LD50 (Hamster)', 'Acute Toxicity (Inhalation LC50 (Cat)', 'Acute Toxicity (Oral LD50 (Cat)', 'Acute Toxicity (Dermal LD50 (Cat)', 'Acute Toxicity (Injection LD50 (Cat)', 'Acute Toxicity (Skin Irritation LD50 (Cat)', 'Acute Toxicity (Eye Irritation LD50 (Cat)', 'Acute Toxicity (Skin Sensitization']
  },
  {
    "question": "What are the top 10 most common mesh codes for compounds with a PubChem CID of 123456?",
    "results": ['D010050', 'D010051', 'D010052', 'D010053', 'D010054', 'D010055', 'D010056', 'D010057', 'D010058', 'D010059']
  },
  {
    "question": "How many molecules have EC50 assays for SGLT2?",
    "results": ['12']
  },
  { "question": "Find all tetrazole ocid subject compounds in clinical trials",
    "results": ['A Phase 2, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Safety and Efficacy of 100 mg of Tetrazole Ocid (TZO) in Subjects with Moderate to Severe Plaque Psoriasis', 'A Phase 2, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Safety and Efficacy of 100 mg of Tetrazole Ocid (TZO) in Subjects with Moderate to Severe Plaque Psoriasis', 'A Phase 2, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Safety and Efficacy of 100 mg of Tetrazole Ocid (TZO) in Subjects with Moderate to Severe Plaque Psoriasis', 'A Phase 2, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Safety and Efficacy of 100 mg of Tetrazole Ocid (TZO) in Subjects with Moderate to Severe Plaque Psoriasis', 'A Phase 2, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Safety and Efficacy of 100 mg of Tetrazole Ocid (TZO) in Subjects with Moderate to Severe Plaque Psoriasis', 'A Phase 2, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Safety and Efficacy of 100 mg of Tetrazole Ocid (TZO) in Subjects with Moderate to Severe Plaque Psoriasis', 'A Phase 2, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Safety and Efficacy of 100 mg of Tetrazole Ocid (TZO) in Subjects with Moderate to Severe Plaque Psoriasis', 'A Phase 2, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Safety and Efficacy of 100 mg of Tetrazole Ocid (TZO) in Subjects with Moderate to Severe Plaque Psoriasis', 'A Phase 2, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Safety and Efficacy of 100 mg of Tetrazole Ocid (TZO) in Subjects with Moderate to Severe Plaque Psoriasis', 'A Phase 2, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Safety and Efficacy of 100 mg of Tetrazole Ocid (TZO) in Subjects with Moderate to Severe Plaque Psoriasis', 'A Phase 2, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Safety and Efficacy of 100 mg of Tetrazole Ocid (TZO) in Subjects with Moderate to Severe Plaque Psoriasis', 'A Phase 2, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Safety and Efficacy of 100 mg of Tetrazole Ocid (TZO) in Subjects with Moderate to Severe Plaque Psoriasis', 'A Phase 2, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Safety and Efficacy of 100 mg of Tetrazole Ocid (TZO) in Subjects with Moderate to Severe Plaque Psoriasis', 'A Phase 2, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Safety and Efficacy of 100 mg of Tetrazole Ocid (TZO) in Subjects with Moderate to Severe Plaque Psoriasis', 'A Phase 2, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Safety and Efficacy of 100 mg of Tetrazole Ocid (TZO) in Subjects with Moderate to Severe Plaque Psoriasis', 'A Phase 2, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Safety and Efficacy']
  }
];

function queryForEvidenceItems(query) {
  
  // send query to endpoint that returns set of evidence items (BQ results)
    if (1 || getIsStaticDemoModeEnabled()) {
      for (let i=0; i < hardCodedEvidence.length; i++) {
        if (query.trim().toLowerCase() === hardCodedEvidence[i].question.toLowerCase()) {
          return hardCodedEvidence[i].results;
        }
      }

      // default
      return ['No result found for that query.']
    }

  // To be implemented...
  // GCP endpoint to call: https://bigquery-picdbggbya-uc.a.run.app/
  let response = UrlFetchApp.fetch('https://bigquery-picdbggbya-uc.a.run.app/');
  console.log(response.getContentText());

  // for now
  return ['No result found for that query.']

}
*/