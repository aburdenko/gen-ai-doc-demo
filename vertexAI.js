// Set up prompt configuration
var API_ENDPOINT="us-central1-aiplatform.googleapis.com"; // Change it only if your model is deployed on a different region
var PROJECT_ID="1078703032628"; //Your project ID

// default models
var TEXT_MODEL_ID="text-bison-32k";
//var TEXT_MODEL_ID="text-bison";
var CHAT_MODEL_ID="chat-bison@001";

var batchModuleURL = "";
var batchSize = 35000;


/**
 * Configures the service.
 */
function getGCPService() {
  return OAuth2.createService('GCP')
    // Set the endpoint URL.
    .setTokenUrl('https://accounts.google.com/o/oauth2/token')

    // Set the private key and issuer.
    .setPrivateKey(SERVICE_ACCOUNT_PRIVATE_KEY)
    .setIssuer(SERVICE_ACCOUNT_EMAIL)

    // Set the property store where authorized tokens should be persisted.
    .setPropertyStore(PropertiesService.getScriptProperties())

    // Set the scope. This must match one of the scopes configured during the
    // setup of domain-wide delegation.
    .setScope(['https://www.googleapis.com/auth/cloud-platform']);
}


function callTextAI(id, prompt, noContentPrompt) {
  console.log('callTextAI: Prompt: '+ noContentPrompt);
  
  // check for number of tokens/chars
  if (prompt.length > batchSize) {
    return 'Sorry, this document is too large to analyze. :('
  }
  

  var service = getGCPService();
  if (!service.hasAccess()) {
    console.log(service.getLastError());
    return 'Sorry, something went wrong accessing GCP.';
  }

  var accessToken = service.getAccessToken();

  if (getIsMedPalmEnabled()) {
    TEXT_MODEL_ID="medpalm2@experimental";
  }

  var apiUrl = "https://"+API_ENDPOINT+"/v1/projects/"+PROJECT_ID+"/locations/us-central1/publishers/google/models/"+TEXT_MODEL_ID+":predict";

    
  if (null == (r = getProperty(id + ":" + prompt))){    
    try {
      var r = UrlFetchApp.fetch(apiUrl, {
          method: "post",
          contentType: 'application/json',
          muteHttpExceptions:true,
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          payload: JSON.stringify( {
        "instances":  [{
        "content": prompt
        }],
        "parameters": {
          "temperature": 0.1,
          "maxOutputTokens": 8192,
          "topP": 1.0,
          "topK": 40
        }
      })
      });
      setProperty( id + ":" + prompt, r.toString() );
    } catch(e){
      console.error(e);
      return 'Sorry, something went wrong calling the LLM Text API.';
    }
  }

  // For troubleshooting
  //console.log("response: " + r.toString());
  var responseAll = JSON.parse(r.toString());
  console.log( responseAll ); 
  var response = responseAll.predictions[0].content;

  console.log('callTextAI(): Response: ' + response);
  return response;
}


function callChatAI(id, context, message) {  
  console.log( "In callChatAI..." )
  // console.log("context: " + context);
  // console.log("message: " + message);
  
  // check for number of tokens/chars
  if (message.length > batchSize) {
    return 'Sorry, this document is too large to analyze. :('
  }

  var service = getGCPService();
  if (!service.hasAccess()) {
    console.log(service.getLastError());
    return 'Sorry, something went wrong accessing GCP.';
  }

  var accessToken = service.getAccessToken();

  //var apiUrl = "https://"+API_ENDPOINT+"/v1/projects/"+PROJECT_ID+"/locations/us-central1/publishers/google/models/"+TEXT_MODEL_ID+":predict";
  var apiUrl = "https://"+API_ENDPOINT+"/v1/projects/"+PROJECT_ID+"/locations/us-central1/publishers/google/models/"+CHAT_MODEL_ID+":predict";
  console.log("context: " + context);

  payload = JSON.stringify( {
    "instances":  [{
      "context": context,
      "messages": [
        {
          "author": "user",
          "content": message,
        }],
      }],
    "parameters": {
      "temperature": 0.1,
      "maxOutputTokens": 1024,
      "topP": 1.0,
      "topK": 40
    }
  });
  
  console.log("Get Property key is: " + id);
  console.log("Get Property val is: " + getProperty(id));

  var r;
  if (null == (r = getProperty(id))){    
    try {
      r = UrlFetchApp.fetch(apiUrl, {
          method: "post",
          contentType: 'application/json',
          muteHttpExceptions:true,
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          payload: payload
      });      
    } catch(e){
      console.log(e);
      return 'Sorry, something went wrong calling the LLM Chat API.';
    }
    setProperty( id, r.toString() );
  }

  // For troubleshooting
  
  console.log("response: " + r.toString());
  var responseAll = JSON.parse(r.toString());
  var response = responseAll.predictions[0].candidates[0].content;

  console.log('callChatAI(): Response: ' + response);
  return response;
}
















var SERVICE_ACCOUNT_EMAIL = 'sa-for-vertex-genai@tldr-smartchip-demo.iam.gserviceaccount.com'; 
var SERVICE_ACCOUNT_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCsbVpM4HFH13jT\n0+fM1hWWYIPtmmwrbvsxe74A4iQGGf4YrehpuaZIlJ6HBalgvjfuW1M4U2IYrvlb\n+M5lS9PcdCdLwtq8BgcqzatWXKDe6RqBMMr1b6q1f1xv+RzrFnFbwja8GcnCTdMV\n3qCIlFbcfRKJIrUQebie0TOpJOgk2RnJKKRzbfgfYOg02ijt/ZaQ2EPpiZLF03gS\nVCdeEhb+Vt2tqMWtmmhDc5nAcsmsJYTLChigCwi5YXwWqVsjZ9nj1zoKCR9kX8ab\nmEeYEXKH2+F0Ojv1iZCfwYH76RUuM+8iAHP9CGB4ymwM9pl9NukP49Kc2lYPkzNE\nasdSt+rrAgMBAAECggEAVDC6sCHAvhrT+N4VZvs7JCcxE5FccqKoTQOGBQlmHIKR\ngnxbqE/JBNRoSTY2+zE1vxDhY/W2xqWcxM8J/ATXx+MBEulsAvWQh1JP8AWfWOgJ\nlH3+A3QILsGmoVfJynG1XN/J+PNAg7qbMCj5SmbfuJ3rMIF9VjOQtR8hsdt+7Ao1\nso4YyChenLMHimMCdVjK1UHHfCS+ZZzEq9rfsaUc0IC0zCTNqFchh8DnL3Lwb7hl\nPotimhDbE81w1yElxOUPN8mOmAtHaT6OTbOndrRdGfr/g6XIIl2MhHYc/D8OICES\nwc9DtX2i9liFR4bngRDXcRAl7le5rMJ4CR6+WwARdQKBgQDc6H+vQ/QI8YiMHZzP\nkuikxKLe86nfQBEAuo1h6OCXO4Khs2cyAMJiEeJCp4aQURkM5yceE0ii5j3XKY8O\nxlRMLCoWEx+S/eXk7Aydn4eXkhw80bkeiQk4LAf0Hrwrsg9Jxa0LcCMptpg/MTwu\nNFLHKwlZu98UxcWyhfaLOeKbHwKBgQDH0VA6y+fRXryeDGk8Jwj1ejPP+o5bDN5Q\n/DwSoHi5eRiBRJGKKXCB8s+wj1f2b/VYIExtXCq8/SXSuOsCp3JpAIwZ1eWUqxHG\njBfllb0Df3Iqes4sg8/vic/nJoY14XJ30yrhLqWqUAGgHqbawjrzHzrHGaIS0NDS\nEpCr4HYCtQKBgCBuDViYfDnX43jWXA/o/Dg8GcDrOnPovtZBjMHj4xywgtPkN3ES\nxXaKM5Ifb9S94xSO1qJGqHIppMhydGrx2Kw6C4+kDQ2SMm6x7IQzSD+LFpQjIa8G\n5RCW/i/rVyp/AFmPKIE2XCMiiCU2wCP0UHamrb+7ods10XkMy43S2J53AoGAJad+\nFPZj4wKVTLtOAXXhrFCw/tpahTHxmxVNRL1Uwq7dPU7sljqk5vgYx07b5qbGdyru\n/BTIQQD7ZbBPKRrg5oSh4iR6tP9fxCiWQD9tdQFJRFQMEjtsrdksgoSx+elYJth2\nViTyNxwIkmH0U3kSnsody3M7JYyQLWYuORV9Z5kCgYATL1WlzdN0puOJ5hJwCGod\nVb+BH3K9NCGLl3TJ+tcYYHUprMwKhNlqAfmtb3OCjt59UJtD1XWybY1HjIsYPK3H\n9M1v3ZAVT3IgJVVyEb8b4rvaVkudHZyyC4++MRs7OhgYM9k6GKT2YT1Yvibjf/O9\nOtron95jRYYUNnYEPT0pyA==\n-----END PRIVATE KEY-----\n';