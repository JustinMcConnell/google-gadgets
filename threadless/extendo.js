/**
 * extendo.js
 * Extend and override Google functions
 */


function _IFPC_AdjustIFrameHeight() {
  var mid = _args()["mid"];
  var h = ifpc_height;
  var el = document.getElementById("remote_"+mid);
  if (el) {
    var sh = el.scrollHeight;
    var oh = el.offsetHeight;
    h = sh > oh ? sh : oh;
    h += 5;
  }
  if (ifpc_height != h) {
    _IFPC.call("remote_iframe_"+mid, "resize_iframe", ["remote_iframe_"+mid, h], "http://www.google.com/ig/ifpc_relay", null, "");
    ifpc_height = h;
  }
}

