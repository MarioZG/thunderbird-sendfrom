// background.js
browser.compose.onComposeStateChanged.addListener(async (tab, state) => {
  if (state.type === "reply") {
    console.log("Reply compose opened:", tab.id);
  }

  console.debug("Reply to addon: start:");

  const details = await browser.compose.getComposeDetails(tab.id);
  console.debug("Reply to addon: details validation");
  if (!details) return;


  const identity = await browser.identities.get(details.identityId);
  const result = await browser.storage.sync.get(identity.accountId);
  console.debug(`Reply to addon: is addon enabled for account ${result}`);

  if (result[identity.accountId] === false) return;


  const originalMessage = await browser.messages.get(details.relatedMessageId);
  console.debug(`Reply to addon: originalMessage validation ${originalMessage}`);
  if (!originalMessage.recipients || originalMessage.recipients.length != 1) return;

  const originaTo = originalMessage.recipients[0]
  console.debug(`Reply to addon: originalTo:${originaTo} validation`);

  browser.compose.setComposeDetails(tab.id, { from: originaTo });
  console.log("Update from address:", identities);

}
);
