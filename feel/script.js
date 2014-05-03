/**
 * Todo
 *  - Re-implement vertical list animation.  This looks better but also is a usability
 *    issue because the lower posts are stationary as the current one scrolls horizontally.
 */

/**
 * feelings - An array of objects, each object representing a feeling from a single blog post.
 * [
 *   { born     : "1942",
 *     city     : "Oxford",
 *     country  : "United Kingdom",
 *     feeling  : "smart",
 *     gender   : "0",
 *     lat      : "51.752434",
 *     lon      : "-1.2558",
 *     postdate : "2007-01-07",
 *     posttime : "1168330660578",
 *     sentance : "I feel smart",
 *     state    : ""
 *   },
 *   ...
 * ]
 **/
var feelings = [];

var prefs = new _IG_Prefs();

var current = 0;

var paused = false;

var writing = false;

var options  = {
  data : {
    display      : "xml",
    returnfields : "feeling,sentence,posttime,postdate,posturl,gender,born,country,state,city,lat,lon,conditions",
    feeling      : "",
    gender       : -1,
    agerange     : "",
    conditions   : "",
    country      : "",
    state        : "California",
    city         : "",
    postyear     : "",
    postmonth    : "", //(Math.floor(Math.random()*12)+1),
    postdate     : "",
    limit        : 200
  },

  getUrl : function() {
    var url = "http://api.wefeelfine.org:8080/ShowFeelings?encode=1&"+
      (this.data.display       ? "&display="      + this.data.display       : "")+
      (this.data.returnfields  ? "&returnfields=" + this.data.returnfields  : "")+
      (this.data.feeling       ? "&feeling="      + this.data.feeling       : "")+
      (this.data.gender >= 0   ? "&gender="       + this.data.gender        : "")+
      (this.data.agerange      ? "&agerange="     + this.data.agerange      : "")+
      (this.data.conditions    ? "&conditions="   + this.data.conditions    : "")+
      (this.data.country       ? "&country="      + this.data.country       : "")+
      (this.data.state         ? "&state="        + this.data.state         : "")+
      (this.data.city          ? "&city="         + this.data.city          : "")+
      (this.data.limit         ? "&limit="        + this.data.limit         : "");

    if (this.data.postdate) {
      url += "&postdate=" + this.data.postyear +"-"+ datePad(this.data.postmonth+1) +"-"+ datePad(this.data.postdate);
    } else {
      if (this.data.postyear) {
        url += "&postyear=" + this.data.postyear;
      } if (this.data.postmonth || (typeof this.data.postmonth == "number" && this.data.postmonth === 0)) {
        url += "&postmonth=" + datePad(this.data.postmonth+1);
      }
    }

    return url;
  },

  // No feelings found from [gender] aged [age range] who feel [feeling] on Jan 15, 2007 when it's [conditions]
  // No feelings found from [gender] aged [age range] who feel [feeling] in Jan 2007 when it's [conditions]
  // No feelings found from [gender] aged [age range] who feel [feeling] in 2007 when it's [conditions] in [location]
  // No more feelings ""

  getDesc : function() {
    var prefix = arguments[0] || "";
    var suffix = arguments[1] || "";
    var str    = "";

    str += prefix + " from ";

    if (this.data.gender >= 0) {
      str += genders[this.data.gender].toLowerCase() + "s ";
    } else {
      str += "people ";
    }

    if (this.data.agerange) {
      str += "aged " + this.data.agerange + " ";
    }

    if (this.data.feeling) {
      str += "who feel " + this.data.feeling + " ";
    }

    if (this.data.postdate) {
      str += "on " + monthNamesShort[this.data.postmonth] + " " + this.data.postdate + ", " + this.data.postyear + " ";
    } else {
      if ((this.data.postmonth || (this.data.postmonth === 0 && this.data.postmonth !== "")) && this.data.postyear) {
        str += "in " + monthNamesShort[this.data.postmonth] + " " + this.data.postyear + " ";
      } else if (this.data.postyear) {
        str += "in " + this.data.postyear + " ";
      }
    }

    if (this.data.conditions) {
      str += "when its " + conditions[this.data.conditions].toLowerCase() + " ";
    }

    if (this.data.city || this.data.state || this.data.country) {
      str += "in ";
    }
    if (this.data.city) {
      str += this.data.city + " ";
    }
    if (this.data.state) {
      str += this.data.state + " ";
    }
    if (this.data.country) {
      str += this.data.country + " ";
    }
    str += suffix;

    return str;
  }
};

window.onload = function() {
  loadFeelings();
  _IG_Analytics("UA-51692-4", "/wefeelfine");
};

function loadFeelings() {
  // set the current feeling back to the start
  current = 0;

  // remove current feelings
  _gel("list").innerHTML = "";

  // hide the status div
  setStatus("");

  // fetch and display new data
  _IG_FetchXmlContent(options.getUrl(),
                      _IG_Callback(xmlToJson,
                                   function() {
                                     setTimeout(function() {playPause("play");}, 1000);
                                     //loadingOff();
                                     nextFeeling();
                                   }));
}

function xmlToJson(res) {
  feelings = [];

  var response = res;
  if (response === null || typeof(response) != "object" || response.firstChild === null) {
    alert("No xml data");
    return;
  }
  var c_feel;
  var feels;
  if (response.firstChild && response.firstChild.nodeName == "feelings") {
  // firefox
    feels = response.firstChild.childNodes;
  } else if (response.childNodes[2] && response.childNodes[2].nodeName == "feelings") {
  // opera
    feels = response.childNodes[2].childNodes;
  } else if (response.childNodes[1] && response.childNodes[1].nodeName == "feelings") {
  // IE
    feels = response.childNodes[1].childNodes;
  }

  for (var i=0; i<feels.length; i++) {
    if (feels[i].nodeType != 1) {
      continue;
    }
    c_feel = {};
    for (var j=0; j<feels[i].attributes.length; j++) {
      c_feel[feels[i].attributes[j].nodeName] = feels[i].attributes[j].nodeValue;
    }
    feelings.push(c_feel);
  }


  if (feelings.length === 0) {
    setStatus("No feelings found");
  }

  if (arguments[1] && typeof arguments[1] == "function") {
    arguments[1]();
  }
}

function playPause() {
  var forcePause = arguments[0] && arguments[0].toLowerCase() == "pause" ? true : false;
  var forcePlay  = arguments[0] && arguments[0].toLowerCase() == "play"  ? true : false;

  var shouldPause = forcePause || !paused;
  var shouldPlay  = forcePlay  || paused;

  var play = function() {
    paused = false;
    var pp = _gel("playpause");
    pp.title = "Pause";
    pp.innerHTML = '<img class="icon" src="http://www.talisweb.com/justin/gmodules/feel/pause.gif" alt="Pause" width="20" height="20">Pause';

    if (!writing) {
      nextFeeling();
    }
  };
  var pause = function() {
    paused = true;
    var pp = _gel("playpause");
    pp.title = "Play";
    pp.innerHTML = '<img class="icon" src="http://www.talisweb.com/justin/gmodules/feel/play.gif" alt="Play" width="20" height="20">Play';
  };
  
  var fn;
  if (forcePause && paused) {
    fn = function() {};
  } else if (forcePause && !paused) {
    fn = pause;
  } else if (forcePlay && paused) {
    fn = play;
  } else if (forcePlay && !paused) {
    fn = function() {};
  } else if (paused) {
    fn = play;
  } else if (!paused) {
    fn = pause;
  }

  fn();
}

function setStatus(str) {
  var status = _gel("status");
  if (str) {
    status.innerHTML = options.getDesc(str);
    status.style.display = "block";
  } else {
    status.innerHTML = "";
    status.style.display = "none";
  }
}

function getBlog(url) {
  if (/livejournal\.com/.test(url)) {
    return "LiveJournal";
  } else if (/blogspot\.com/.test(url)) {
    return "Blogger";
  }
  return "some random blog";
}

function nextFeeling() {
  if (current + 1 <= feelings.length) {
    addFeeling(current);
    current++;
    return true;
  }

  setStatus("No more feelings");
  return false;
}

function drawCircle(canvas, diameter, color) {
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 8, 8);
    ctx.beginPath();
    ctx.arc(4, 4, diameter, 0, Math.PI*2, false);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

function addFeeling(curr) {
  var feeling       = feelings[curr];
  var feeling_text  = feeling.sentence;
  var feeling_color = "#FFFFFF";
  if (feeling.feeling && typeof cyc !== "undefined" && cyc[feeling.feeling]) {
    feeling_color = "#" + cyc[feeling.feeling].c;
  }

  // highlight the feeling in the sentence
  if (feeling.feeling) {
    var re = new RegExp("("+feeling.feeling+")", "gi");
    var style = "border-bottom-color:" + feeling_color;
    if (typeof cyc === "undefined" || !cyc[feeling.feeling]) {
      style += " font-weight:bold; font-style:italic;";
    }
    
    feeling_text = feeling_text.replace(re, "<span class='highlightedFeeling' style='"+style+"'>$1</span>");
  }

  var list = _gel("list");
  
  var item       = document.createElement("li");
  item.id        = "item"+curr;
  item.className = "item";
  
  var text         = document.createElement("a");
  text.target      = "_blank";
  text.href        = feeling.posturl;
  text.id          = "text"+curr;
  text.className   = "text";
  text.title       = "Read entire feeling on " + getBlog(feeling.posturl);
  text.innerHTML   = "&nbsp;";
  text.onmouseover = function() { this.style.color = "#CE2457"; };
  text.onmouseout  = function() { this.style.color = ""; };
  
  var meta       = document.createElement("div");
  meta.id        = "meta"+curr;
  meta.className = "meta";
  meta.innerHTML = "&nbsp;";
  
  var feelingDiv       = document.createElement("div");
  feelingDiv.className = "feeling";
  feelingDiv.id        = "feeling" + curr;
  
  feelingDiv.appendChild(text);
  feelingDiv.appendChild(meta);

  // use a canvas to draw the color-coded dots
  var canvas          = document.createElement("canvas");
  canvas.id           = "canvas"+curr;
  canvas.height       = 8;
  canvas.width        = 8;

  // pack the canvas in a div to be floated away
  var canvasDiv = document.createElement("div");
  canvasDiv.id  = "canvasDiv"+curr;
  canvasDiv.className = "dot";
  canvasDiv.appendChild(canvas);

  // add the canvas to the DOM before drawing and call some VML voodoo thanks to IE
  item.appendChild(canvasDiv);
  if (typeof G_vmlCanvasManager != "undefined") {
    G_vmlCanvasManager.initElement(canvas);
    //canvas = item.firstChild.firstChild;
    canvas = item.getElementsByTagName("canvas")[0];
  }

  item.onmouseover = function() {
    drawCircle(canvas, 3, feeling_color);
  };
  item.onmouseout = function() {
    drawCircle(canvas, 2, feeling_color);
  };
  drawCircle(canvas, 2, feeling_color);

  item.appendChild(feelingDiv);
  list.appendChild(item);
  list.insertBefore(item, list.firstChild);

  writing = true;
  writeText(
    text,
    feeling_text,
    0,
    function() {
      meta.innerHTML = getMetaInfo(curr);
      setOpacity(meta, 0);
      meta.style.visibility = "visible";
      fadeIn(meta,
             function() {
               writing = false;
               if (!paused) {
                 nextFeeling();
               }
             }
      );
    }
  );
}

function setOpacity(el, o) {
  if (!el || o < 0 || o > 1) {
    return;
  }
  if (typeof el.style.filter !== "undefined") {
    el.style.filter = "alpha(opacity=" + Math.round(o * 100) + ")";
  } else {
    el.style.opacity = o;
  }
}

function fadeIn(el, callback) {
  var o = 0;
  function f() {
    setOpacity(el, o);
    o += .1;
    if (o < 1.0) {
      setTimeout(f, 40);
    } else if (typeof callback === "function") {
      callback();
    }
  }
  f();
}

function writeText(obj, text, idx, fn) {
  if (idx <= text.length) {
    var cut1 = idx;
    var cut2 = idx;
    var pos = text.substring(cut1, cut2 + 1).indexOf("<");
    if (pos != -1) {
      cut2 = idx + text.substring(cut1).indexOf(">")+2;
    }

    obj.innerHTML = text.substring(0, cut2);
    var func = function() { writeText(obj, text, cut2+1, fn); };
    setTimeout(func, 15);
  } else if (idx > text.length) {
    if (fn) { setTimeout(function() {fn();}, 50); }
  }
}

function getMetaInfo(idx) {
  var str     = "";
  var feeling = feelings[idx];
  var nowTs   = new Date();
  var postTs  = new Date(feeling.posttime*1000);

  str += formatTime(nowTs - postTs);
  str += " / from ";
  str += feeling.born ? "a " + (nowTs.getFullYear() - feeling.born) + " year old " : "someone ";
  str += feeling.gender ? genders[feeling.gender].toLowerCase() + " " : "";
  str += feeling.city || feeling.state || feeling.country ? "in " : "";
  str += feeling.city ? feeling.city + " " : "";
  str += feeling.state ? feeling.state + " " : "";
  str += feeling.country ? feeling.country + " " : "";
  str += feeling.conditions ? "when it was " + conditions[feeling.conditions].toLowerCase() : "";

  return str;
}

function formatTime(diff) {
  diff = diff / 1000;
  
  if (diff < 60) {
    return "<1 min ago";
  } else if (diff < 60 * 2) {
    return Math.floor(diff / 60) + " min ago";
  } else if (diff < 60 * 60) {
    return Math.floor(diff / 60 ) + " mins ago";
  } else if (diff < 60 * 60 * 2) {
    return Math.floor(diff / 60 / 60) + " hours ago";
  } else if (diff < 60 * 60 * 24) {
    return Math.floor(diff / 60 / 60) + " hours ago";
  } else if (diff < 60 * 60 * 24 * 2) {
    return Math.floor(diff / 60 / 60 / 24) + " day ago";
  } else if (diff >= 60 * 60 * 24 * 2) {
    return Math.floor(diff / 60 / 60 / 24) + " days ago";
  } else {
    return Math.floor(diff) +  " seconds ago";
  }
}

function datePad(num) {
  if (num > 0 && num < 10) {
    return "0" + num;
  }
  return num;
}
