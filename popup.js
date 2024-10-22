document.getElementById("start").addEventListener("click", async () => {
  const groupIds = document.getElementById("groupIds").value.split(" ");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: automateTikTok,
      args: [groupIds],
    });
  });
});

function automateTikTok(groupIds) {
  (async () => {
    console.log("Starting automation...");

    const adGroupsInput = document.querySelector("input[placeholder='All']");
    if (!adGroupsInput) {
      alert("Ad groups input field not found");
      return;
    }
    adGroupsInput.click();

    for (const groupId of groupIds) {
      const searchInput = document.querySelector(
        "input[placeholder='Please enter']"
      );
      searchInput.focus();
      searchInput.value = ""; // Clear the input field
      searchInput.dispatchEvent(new Event("input", { bubbles: true })); // Trigger input event

      for (const char of groupId) {
        searchInput.value += char;
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const firstResult = document.querySelector(
        "div[data-testid='source-in-new-engagement-0-mst-p-0']"
      );
      console.log("first result");
      console.log(firstResult);
      firstResult.focus();
      firstResult.click();

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("Automation completed.");
  })();
}
