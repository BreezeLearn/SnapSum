document.addEventListener("DOMContentLoaded", () => {
  const homeScreen = document.getElementById("home-screen");
  const loadingScreen = document.getElementById("loading-screen");
  const summaryScreen = document.getElementById("summary-screen");

  const summarizeBtn = document.getElementById("summarize-btn");
  const translateBtn = document.getElementById("translate-btn");
  const copyToClipboardBtn = document.getElementById("copy-btn");
  const downloadBtn = document.getElementById("download-btn");

  const screenshotImage = document.getElementById("content-image");

  const summaryText = document.getElementById("summary-text");

  summarizeBtn.addEventListener("click", async () => {
    try {
      homeScreen.classList.add("hidden");
      loadingScreen.classList.remove("hidden");

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

  translateBtn.addEventListener("click", async () => {
    try {
      const pageContent = summaryText.innerText;
      const translatedText = await translateResponse(pageContent);

      summaryText.textContent = translatedText;
      loadingScreen.classList.add("hidden");
      summaryScreen.classList.remove("hidden");
    } catch (error) {
      console.error("Error during translation:", error);
    }
  });

  copyToClipboardBtn.addEventListener("click", copySummaryToClipboard);
  downloadBtn.addEventListener("click", downloadSummary);

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

  async function translateResponse(content) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { action: "getTranslationResponse", text: content },
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

  function copySummaryToClipboard() {
    if (!summaryText) {
      console.error("Summary text element not found!");
      return;
    }

    const textContent = summaryText.innerText;

    navigator.clipboard
      .writeText(textContent)
      .then(() => {
        alert("Summary copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy summary:", err);
        alert("Failed to copy summary. Please try again.");
      });
  }

  function downloadSummary() {
    if (!summaryText) {
      console.error("Summary text element not found!");
      return;
    }

    const textContent = summaryText.innerText;

    const blob = new Blob([textContent], { type: "text/plain" });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "summary.txt";

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
