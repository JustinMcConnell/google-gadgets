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

/**
 * _IG_Tabs.addDynamicTab
 */

function igt_a(a, b) {
  if (typeof b != "function") {
    throw new Error("The second argument to addDynamicTab must be a function, not a '" + typeof b + "'");
  }
  return this.addTab(a, "", b, arguments[2]);
}

/**
 * _IG_Tabs.addTab
 */
function igt_b(a, b, e) {
  var mid = _args()["mid"];
  var tabArgs = {};

  // user passed tab args in place of the tab content's id
  if(typeof b == "object") {
    tabArgs = arguments[1];
    b = "";
  }
  // user passed tab args in place of the tab's callback function
  if(typeof e == "object") {
    tabArgs = arguments[2];
    e = function() {};
  }
  else if(typeof arguments[3] == "object")
    tabArgs = arguments[3]

  var c;
  if (!b || b == "") {
    c = "tl_" + this.numTabs + "_" + this.moduleId;
  }
  else {
    c = b;
  }
  if (!this.domIdFilter.exec(c)) {
    throw new Error("addTab(): the parameter containing the DOM ID contains invalid characters.");
  }
  var d = _gel(c);
  if (!d) {
    var i = document.createElement("div");
    i.style.display = "none";
    i.id = c; this.boundingBox.appendChild(i);
  }
  else {
    d.style.display = "none";
  }

  var f = this.tabContainer.rows[0];
  if (this.numTabs > 0) {
    var j = document.createElement("td");
    j.className = this.cascade("tablib_spacerTab");
    j.appendChild(document.createTextNode(" "));
    f.insertBefore(j, f.cells[f.cells.length - 1]);
  }
  var h = document.createElement("td");

  h.appendChild(document.createTextNode(a));
  h.className = this.cascade("tablib_unselected");
  h.onclick = igt_(this, c);

  /**
   * Start changes
   */

  // replace the tab's text content with HTML
  if(tabArgs.html)
    h.innerHTML = tabArgs.html;

  // tab title
  if(tabArgs.title)
    h.title = tabArgs.title;

  // tab CSS class
  // _IG_Tabs.setSelectedTab clobbers className so will have to override that to make this work
  if(0 && tabArgs.className)
    h.className += " " + tabArgs.className + mid;

  // CSS properties
  if(tabArgs.style) {
    for(var cssProp in tabArgs.style) {
      h.style[cssProp] = tabArgs.style[cssProp];
    }
  }

  /**
   * End changes
   */


  f.insertBefore(h, f.cells[f.cells.length - 1]);
  var g = this.numTabs;
  this.tabs.push(h);
  this.tabNames.push(a);
  this.tabIds.push(c);
  this.callbacks.push(e);
  this.tabIdsToNumber[c] = g;
  this.numTabs++;
  if (isNaN(parseInt(this.selectedTab))) {
    if (!this.defaultTabName || this.defaultTabName == "") {
      if (g == 0) {
        this.setSelectedTab(g);
      }
    }
    else if (this.defaultTabName == a) {
      this.setSelectedTab(g);
    }
  }
  else if (parseInt(this.selectedTab) == g) {
    this.setSelectedTab(g);
  }
  return c;
}

function _IG_PostContent(url, callback, data) {
  _IG_PostBackend(url, callback, data, false);
}
function _IG_PostXmlContent(url, callback, data) {
  _IG_PostBackend(url, callback, data, true);
}
function _IG_PostBackend(url, callback, data, xml) {
  var d = "/ig/proxy?url=" + escape(url);
  if (_et != "") {
    d += "&et=" + _et;
  }
  _sendx(d, callback, xml, data);
}
