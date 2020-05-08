/** Will contain the GEDCOM contents when it's fetched. */
var gedcom = null;
/** Set to true when the iframe has signaled it is ready to receive data. */
var ready = false;

/** The ID of the iframe that has Topola Viewer loaded. */
var topolaFrameId;

/**
 * Send GEDCOM file to iframe if the iframe is ready to receive data and
 * the GEDCOM to send is ready.
 */
function maybeSendData() {
  if (!ready || !gedcom) {
    return;
  }
  var frame = document.getElementById(topolaFrameId);
  frame.contentWindow.postMessage({message: 'gedcom', gedcom}, '*');
}

function onMessage(message) {
  if (message.data.message === 'ready') {
    ready = true;
    maybeSendData();
  }
}

// Initialize in onload to ensure the iframe has been created.
function loadData(url, frameId) {
  topolaFrameId = frameId;
  var frame = document.getElementById(topolaFrameId);
  // Listen to messages from the iframe.
  window.addEventListener('message', onMessage);
  // Signal the iframe that we are ready to receive messages.
  frame.contentWindow.postMessage({message: 'parent_ready'}, '*');

  // Fetch GEDCOM data.
  window.fetch(url)
      .then(response => response.text())
      .then(data => {
        gedcom = data;
        maybeSendData();
      });
}
