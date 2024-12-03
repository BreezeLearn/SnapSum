// Ensure the side panel opens when the extension is clicked
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getAIResponse") {
    ai.summarizer
      .create()
      .then((summarizer) => {
        return summarizer.summarize(request.question);
      })
      .then((result) => {
        sendResponse({
          response:
            result || "Sorry, I couldn't summarize the content effectively.",
        });
      })
      .catch((error) => {
        console.error("Error getting AI response:", error);
        sendResponse({ response: "There was an error with the AI response." });
      });

    return true;
  }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "getTranslationResponse") {
    const languagePair = {
      sourceLanguage: "en",
      targetLanguage: "es",
    };

    console.log(ai);
    console.log(ai.translator);

    ai.translator
      .create(languagePair)
      .then((translator) => {
        return translator.translate(request.text).then((translatedText) => {
          console.log("translatedText", translatedText);
          sendResponse({
            response: translatedText,
          });
        });
      })
      .catch((error) => {
        console.error("Error getting AI response:", error);
        sendResponse({ response: "There was an error with the AI response." });
      });

    return true;
  }
});
