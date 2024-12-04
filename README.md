# SnapSum - Web Page Summarizer & Fact-Checker

SnapSum is a Google Chrome extension that allows users to generate offline summaries of web pages using Google’s AI Summarizer API. With SnapSum, users can easily:
- Summarize the content of any web page.
- Check facts within the generated summary.
- Copy the summary to the clipboard or download it in a .txt format.

## Key Features

1. **Summarization**: Quickly condense web page content into concise summaries.
2. **Fact-Checker**: Automatically check facts in the generated summary for accuracy, based on reputable sources.
3. **Export Options**: Copy the summary to your clipboard or download it as a text file.
4. **Offline Functionality**: Works entirely offline using on-device AI models, ensuring fast and private processing.

## API USED 

1. **Summarization**: Summaruze API 
2. **Fact-Checker**: Write API

This extension requires:
- **Browser**: Google Chrome Canary.
- **Operating Systems**:
    - **Windows**: 10 or 11
    - **Mac**: macOS 13 or higher

## Prerequisites

To use SnapSum, you need to enable specific Chrome flags and update certain Chrome components.

### Required Chrome Flags

1. **Optimization Guide On Device Model**  
   URL: `chrome://flags/#optimization-guide-on-device-model`  
   • Set this flag to **Enabled BypassPerfRequirement**.

2. **Summarization API for Gemini Nano**  
   URL: `chrome://flags/#summarization-api-for-gemini-nano`  
   • Set this flag to **Enabled**.

3. **Toolbar Pinning**  
   URL: `chrome://flags/#toolbar-pinning`  
   • Set this flag to **Enabled**.

4. **Customize Chrome Side Panel Extensions Card**  
   URL: `chrome://flags/#customize-chrome-side-panel-extensions-card`  
   • Set this flag to **Enabled**.

5. **Translation API without Language Pack Limit**  
   URL: `chrome://flags/#translation-api`  
   • Set this flag to **Enabled**.

### Required Chrome Components Update

Visit `chrome://components/` and ensure the following component is up-to-date:
- **Optimization Guide On Device Model**

If it is not updated, use the “Check for update” button.

## Installation

### Steps to Install the Extension

1. Clone the repo to your local machine.
2. Open Google Chrome Canary.
3. Navigate to `chrome://extensions/`.
4. Enable **Developer Mode** (toggle switch at the top-right corner).
5. Click **Load unpacked** and select the folder containing the extension.
6. The extension should now appear in your extensions list.

## How to Use

### Summarizing a Web Page

1. Open a web page you want to summarize.
2. Click on the SnapSum icon in the toolbar to open the Summarizer interface.
3. Click the **Summarize** button.
4. Wait for the loading screen to complete. Once done, the summary will appear on the next screen.

### Fact-Checking the Summary

1. On the summary page, click the **Check Facts** button.
2. SnapSum will analyze the summary and highlight any claims that may need fact-checking, comparing them against reliable sources.
3. Fact-checked results will be shown with sources cited, helping you identify which parts of the summary may be inaccurate or misleading.

### Exporting the Summary

1. **Copy to Clipboard**: Click the **Copy** button to copy the summary text.
2. **Download as Text File**: Click the **Download** button to save the summary as a `.txt` file.

## Troubleshooting

If Summarization or Fact-Checking Fails:

1. Ensure you are using Google Chrome Canary.
2. Verify your operating system meets the requirements (Windows 10/11 or macOS 13+).
3. Double-check the required flags are properly enabled:
    • Visit `chrome://flags/` and ensure the necessary settings are applied.
4. Confirm the **Optimization Guide On Device Model** component is up-to-date:
    • Go to `chrome://components/` and check for updates.

## Known Limitations

1. **Browser Restriction**: The extension works only in Google Chrome Canary.
2. **Platform Restriction**: It requires Windows 10/11 or macOS 13+.
3. **Flag Dependency**: The summarization and fact-checking features depend on specific Chrome flags being enabled and up-to-date.

## FAQ

1. **Why does the extension require Google Chrome Canary?**

   Chrome Canary supports experimental features and APIs that are unavailable in the stable version of Chrome.

2. **Does the extension work offline?**

   Yes, SnapSum works entirely offline using on-device AI models, ensuring fast and private processing.

3. **What is the Fact-Checker feature?**

   The Fact-Checker automatically checks facts within the generated summary by comparing them with reliable external sources. It highlights potentially inaccurate statements and provides reference links for further verification.

4. **Why do I need to enable so many Chrome flags?**

    These flags enable experimental features and remove certain limitations required for the extension to function properly.
