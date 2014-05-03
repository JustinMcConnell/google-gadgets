// http://www.svendtofte.com/code/date_format/
Array.prototype.exists = function (x) { for (var i = 0; i < this.length; i++) { if (this[i] == x) return true;} return false;}
Date.prototype.formatDate = function (input,time) { var switches = ["a", "A", "B", "d", "D", "F", "g", "G", "h", "H", "i", "j", "l", "L", "m", "M", "n", "o", "O", "r", "s", "S", "t", "U", "w", "W", "y", "Y", "z"]; var daysLong = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; var daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; var monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; var monthsLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; var daysSuffix = ["st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st"];
function a() { return self.getHours() > 11? "pm" : "am";}
function F() { return monthsLong[self.getMonth()];}
function g() { if(self.getHours() == 0) return self.getHours()+12; return self.getHours() > 12? self.getHours()-12 : self.getHours();}
function i() { return new String(self.getMinutes()).length == 1? "0"+self.getMinutes() : self.getMinutes();}
function j() { return self.getDate();}
function l() { return daysLong[self.getDay()];}
var self = this; if (time) { var prevTime = self.getTime(); self.setTime(time);} var ia = input.split(""); var ij = 0; while (ia[ij]) { if (ia[ij] == "\\") { ia.splice(ij,1);} else { if (switches.exists(ia[ij])) { ia[ij] = eval(ia[ij] + "()");}} ij++;} if (prevTime) { self.setTime(prevTime);} return ia.join("");}
