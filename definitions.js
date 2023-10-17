const toolName = 'Moderna Document Review Assistant';


//const companyName = 'Cymbal Health';
//const companyLogoUrl = 'https://www.google.com/u/0/ac/images/logo.gif?uid=108134850221697859279&service=google_gsuite';

const companyName = 'Moderna';
const companyLogoUrl = 'https://logo.clearbit.com/www.modernatx.com';

const bioTechIconUrl = 'https://www.gstatic.com/images/icons/material/system/1x/biotech_black_24dp.png';
const summarizeIconUrl = 'https://www.gstatic.com/images/icons/material/system/1x/summarize_black_24dp.png';
const virusIconUrl = 'https://www.gstatic.com/images/icons/material/system/1x/microbiology_black_24dp.png';
const evidenceUrl = 'https://www.gstatic.com/images/icons/material/system/1x/feature_search_black_24dp.png';
const reviewCommsUrl = 'https://www.gstatic.com/images/icons/material/system/1x/edit_note_black_24dp.png';
const medQuestionUrl = 'https://www.gstatic.com/images/icons/material/system/1x/psychology_alt_black_24dp.png';
const approveUrl = 'https://www.gstatic.com/images/icons/material/system/1x/mail_black_24dp.png';

const DOC_PROP_STATIC_DEMO_MODE = 'DOC_PROP_STATIC_DEMO_MODE';
const DOC_PROP_USE_MED_PALM = 'DOC_PROP_USE_MED_PALM';


const hardCodedEvidenceItems = ['Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia', 'Acute lymphoblastic leukemia', 'Acute myeloid leukemia'];

const defaultMedQuestion = 'What is this document about?'