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

    // pierce all shadow doms
    function findInShadowRoots(selector, root = document) {
      const element = root.querySelector(selector);
      if (element) {
        return element;
      }
    
      // if not found, look for shadow roots in the current root
      const shadowHosts = root.querySelectorAll("*");
      for (const host of shadowHosts) {
        if (host.shadowRoot) {
          const found = findInShadowRoots(selector, host.shadowRoot);
          if (found) {
            return found;
          }
        }
      }
    
      return null;
    }
    
    const adGroupsInput = findInShadowRoots("input[placeholder='Search']");
    
    if (!adGroupsInput) {
      alert("Ad groups input field not found");
      return;
    }
    adGroupsInput.click();

    for (const groupId of groupIds) {
      adGroupsInput.focus();
      adGroupsInput.value = ""; // Clear the input field
      adGroupsInput.dispatchEvent(new Event("input", { bubbles: true })); // Trigger input event

      for (const char of groupId) {
        adGroupsInput.value += char;
        adGroupsInput.dispatchEvent(new Event("input", { bubbles: true }));
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const siblingDiv = findInShadowRoots(
        "div[id='slot-pop-{}'][slot='content']".replace("{}", groupId),
      );
      const parent = siblingDiv.parentElement;
      const firstResult = parent.querySelector("li[class='dropdown-menu__list-item']");
      console.log("first result");
      console.log(firstResult);
      firstResult.focus();
      firstResult.click();

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("Automation completed.");
  })();
}
