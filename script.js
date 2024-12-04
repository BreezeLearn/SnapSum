document.addEventListener("DOMContentLoaded", () => {
  const homeScreen = document.getElementById("home-screen");
  const loadingScreen = document.getElementById("loading-screen");
  const summaryScreen = document.getElementById("summary-screen");
  const summaryContentTab = document.getElementById("summary-content-tab");
  const factCheckContentTab = document.getElementById("fact-check-content-tab");
  const factSpinnerContainer = document.getElementById(
    "fact-spinner-container"
  );

  const summarizeBtn = document.getElementById("summarize-btn");
  // const translateBtn = document.getElementById("translate-btn");
  const summaryContentTabBtn = document.getElementById("tab-summary-btn");
  const factCheckTabBtn = document.getElementById("tab-fact-check-btn");
  const factCheckBtn = document.getElementById("fact-check-btn");
  const summaryCopyToClipboardBtn = document.getElementById("summary-copy-btn");
  const factCopyToClipboardBtn = document.getElementById("fact-copy-btn");
  const summaryCopyBtnText = document.getElementById("summary-copy-btn-text");
  const factCopyBtnText = document.getElementById("fact-copy-btn-text");
  const summaryDownloadBtn = document.getElementById("summary-download-btn");
  const factDownloadBtn = document.getElementById("fact-download-btn");

  const screenshotImage = document.getElementById("content-image");

  const summaryText = document.getElementById("summary-text");
  const factCheckText = document.getElementById("fact-check-text");

  summarizeBtn.addEventListener("click", async () => {
    try {
      homeScreen.classList.add("hidden");
      loadingScreen.classList.remove("hidden");

      summaryTabToggleFuntion();

      const pageContent = await getPageContent();
      const pageImage = await captureScreenshot();

      let summary = await sendToBackgroundScript(pageContent);

      screenshotImage.src = pageImage;
      screenshotImage.alt = "Captured Screenshot";
      summary = cleanSummaryText(summary);

      summaryText.textContent = summary;
      loadingScreen.classList.add("hidden");
      summaryScreen.classList.remove("hidden");
    } catch (error) {
      console.error("Error during summarization:", error);
    }
  });

  // translateBtn.addEventListener("click", async () => {
  //   try {
  //     const pageContent = summaryText.innerText;
  //     const translatedText = await translateResponse(pageContent);

  //     summaryText.textContent = translatedText;
  //     loadingScreen.classList.add("hidden");
  //     summaryScreen.classList.remove("hidden");
  //   } catch (error) {
  //     console.error("Error during translation:", error);
  //   }
  // });

  summaryCopyToClipboardBtn.addEventListener("click", () =>
    copySummaryToClipboard(summaryText, summaryCopyBtnText)
  );
  factCopyToClipboardBtn.addEventListener("click", () =>
    copySummaryToClipboard(factCheckText, factCopyBtnText)
  );
  summaryDownloadBtn.addEventListener("click", () =>
    downloadSummary(summaryText, "summary")
  );
  factDownloadBtn.addEventListener("click", () =>
    downloadSummary(factCheckText, "fact-check")
  );

  summaryContentTabBtn.addEventListener("click", summaryTabToggleFuntion);

  factCheckTabBtn.addEventListener("click", async () => {
    factCheckContentTab.classList.remove("hidden");
    summaryContentTab.classList.add("hidden");

    factCheckTabBtn.classList.add("active-btn-class");
    factCheckTabBtn.classList.remove("inactive-btn-class");
    summaryContentTabBtn.classList.remove("active-btn-class");
    summaryContentTabBtn.classList.add("inactive-btn-class");

    factSpinnerContainer.classList.remove("hidden");
    const factCheckedResponse = await factCheckResponse(summaryText.innerText);
    factSpinnerContainer.classList.add("hidden");
    factCheckText.innerText = cleanSummaryText(factCheckedResponse);
  });

  function summaryTabToggleFuntion() {
    summaryContentTab.classList.remove("hidden");
    factCheckContentTab.classList.add("hidden");

    summaryContentTabBtn.classList.add("active-btn-class");
    summaryContentTabBtn.classList.remove("inactive-btn-class");
    factCheckTabBtn.classList.remove("active-btn-class");
    factCheckTabBtn.classList.add("inactive-btn-class");
  }

  async function getPageContent() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            func: () => document.body.innerText,
          },
          (results) => {
            if (chrome.runtime.lastError) {
              reject("Error getting page content.");
            } else {
              resolve(results[0]?.result || "");
            }
          }
        );
      });
    });
  }

  async function captureScreenshot() {
    return new Promise((resolve, reject) => {
      chrome.tabs.captureVisibleTab(
        null, // Use the current window
        { format: "png" },
        (dataUrl) => {
          if (chrome.runtime.lastError) {
            console.error("Capture error:", chrome.runtime.lastError.message);
            reject("Error capturing screenshot.");
          } else if (!dataUrl) {
            console.error("Capture failed: No data URL returned.");
            reject("No screenshot data available.");
          } else {
            resolve(dataUrl); // Base64 encoded screenshot
          }
        }
      );
    });
  }

  async function sendToBackgroundScript(content) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { action: "getAIResponse", question: content },
        (response) => {
          if (response && response.response) {
            resolve(response.response);
          } else {
            reject("No response from AI.");
          }
        }
      );
    });
  }

  // async function translateResponse(content) {
  //   return new Promise((resolve, reject) => {
  //     chrome.runtime.sendMessage(
  //       { action: "getTranslationResponse", text: content },
  //       (response) => {
  //         if (response && response.response) {
  //           resolve(response.response);
  //         } else {
  //           reject("Unable to translate text.");
  //         }
  //       }
  //     );
  //   });
  // }

  async function factCheckResponse(content) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { action: "factCheckSummary", text: content },
        (response) => {
          if (response && response.response) {
            resolve(response.response);
          } else {
            reject("Unable to translate text.");
          }
        }
      );
    });
  }

  function copySummaryToClipboard(contentToCopy, tag) {
    if (!contentToCopy) {
      console.error("Summary text element not found!");
      return;
    }

    const textContent = contentToCopy.innerText;

    navigator.clipboard
      .writeText(textContent)
      .then(() => {
        tag.innerText = "Copied";
        setTimeout(() => {
          tag.innerText = "Copy";
        }, 5000);
      })
      .catch((err) => {
        console.error("Failed to copy summary:", err);
      });
  }

  function downloadSummary(contentToDownload, fileName) {
    if (!contentToDownload) {
      console.error("Summary text element not found!");
      return;
    }

    const textContent = contentToDownload.innerText;

    const blob = new Blob([textContent], { type: "text/plain" });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${fileName}.txt`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  function cleanSummaryText(text) {
    return (
      text
        .replace(/\*/g, "")
        .trim()
        .split(/\r?\n|\r/)
        // .map((line) => `- ${line.trim()}`)
        .join("\n")
    );
  }
});
