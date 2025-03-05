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

    function findAllInShadowRoots(selector, root = document, results = []) {
      // Check this root first
      const elements = root.querySelectorAll(selector);
      elements.forEach(el => results.push(el));
      
      // Then check all shadow roots
      const shadowHosts = root.querySelectorAll("*");
      for (const host of shadowHosts) {
        if (host.shadowRoot) {
          findAllInShadowRoots(selector, host.shadowRoot, results);
        }
      }
      
      return results;
    }

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

    function findElementWithText(text, root = document) {
      // First check if this element contains the text
      if (root.textContent && root.textContent.includes(text)) {
        // If this is a text node or has no children, return it
        if (root.nodeType === Node.TEXT_NODE || root.children.length === 0) {
          return root;
        }
        
        // Otherwise, check its children
        for (const child of root.childNodes) {
          const found = findElementWithText(text, child);
          if (found) return found;
        }
      }
      
      // Check shadow roots
      if (root.querySelectorAll) {
        const shadowHosts = root.querySelectorAll("*");
        for (const host of shadowHosts) {
          if (host.shadowRoot) {
            const found = findElementWithText(text, host.shadowRoot);
            if (found) return found;
          }
        }
      }
      
      return null;
    }
    
    // let adGroupsInput = findInShadowRoots("input[placeholder='Search']");
    
    // if (!adGroupsInput) {
    //   alert("Ad groups input field not found");
    //   return;
    // }
    // adGroupsInput.click();

    const dropdown = findElementWithText("All");
    console.log("dropdown");
    console.log(dropdown);
    dropdown.click();

    const allSearchInputs = findAllInShadowRoots("input[placeholder='Search']");
    const adGroupsInput = allSearchInputs.length > 1 ? allSearchInputs[1] : allSearchInputs[0];

    for (const groupId of groupIds) {      
      console.log("adGroupsInput");
      console.log(adGroupsInput);

      adGroupsInput.focus();
      adGroupsInput.value = ""; // Clear the input field
      adGroupsInput.dispatchEvent(new Event("input", { bubbles: true })); // Trigger input event

      for (const char of groupId) {
        adGroupsInput.value += char;
        adGroupsInput.dispatchEvent(new Event("input", { bubbles: true }));
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const siblingDiv = findInShadowRoots(
        `div[id='slot-pop-${groupId}'][slot='content']`
      );
      console.log("sibling div");
      console.log(`div[id='slot-pop-${groupId}'][slot='content']`);
      console.log(siblingDiv);
      const parent = siblingDiv.parentElement;
      console.log("parent");
      console.log(parent);
      const firstResult = parent.querySelector("li[class='dropdown-menu__list-item dropdown-menu__list-item--multiple']");
      console.log("first result");
      console.log(firstResult);
      firstResult.focus();
      firstResult.click();

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("Automation completed.");
  })();
}
