// http://www.svendtofte.com/code/date_format/
Array.prototype.exists = function (x) { for (var i = 0; i < this.length; i++) { if (this[i] == x) return true;} return false;}
Date.prototype.formatDate = function (input,time) { var switches = ["a", "A", "B", "d", "D", "F", "g", "G", "h", "H", "i", "j", "l", "L", "m", "M", "n", "o", "O", "r", "s", "S", "t", "U", "w", "W", "y", "Y", "z"]; var daysLong = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; var daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; var monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; var monthsLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; var daysSuffix = ["st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st"];
 function a() { return self.getHours() > 11? "pm" : "am";}
 function A() { return self.getHours() > 11? "PM" : "AM";}
 function B(){ var off = (self.getTimezoneOffset() + 60)*60; var theSeconds = (self.getHours() * 3600) + (self.getMinutes() * 60) + self.getSeconds() + off; var beat = Math.floor(theSeconds/86.4); if (beat > 1000) beat -= 1000; if (beat < 0) beat += 1000; if ((""+beat).length == 1) beat = "00"+beat; if ((""+beat).length == 2) beat = "0"+beat; return beat;}
 function d() { return new String(self.getDate()).length == 1? "0"+self.getDate() : self.getDate();}
 function D() { return daysShort[self.getDay()];}
 function F() { return monthsLong[self.getMonth()];}
 function g() { if(self.getHours() == 0) return self.getHours()+12; return self.getHours() > 12? self.getHours()-12 : self.getHours();}
 function G() { return self.getHours();}
 function h() { if (self.getHours() > 12) { var s = new String(self.getHours()-12); return s.length == 1?
 "0"+ (self.getHours()-12) : self.getHours()-12;} else { var s = new String(self.getHours()); return s.length == 1? "0"+self.getHours() : self.getHours();}}
 function H() { return new String(self.getHours()).length == 1? "0"+self.getHours() : self.getHours();}
 function i() { return new String(self.getMinutes()).length == 1? "0"+self.getMinutes() : self.getMinutes();}
 function j() { return self.getDate();}
 function l() { return daysLong[self.getDay()];}
 function L() { var y_ = Y(); if ( (y_ % 4 == 0 && y_ % 100 != 0) || (y_ % 4 == 0 && y_ % 100 == 0 && y_ % 400 == 0) ) { return 1;} else { return 0;}}
 function m() { return self.getMonth() < 9? "0"+(self.getMonth()+1) : self.getMonth()+1;}
 function M() { return monthsShort[self.getMonth()];}
 function n() { return self.getMonth()+1;}
 function O() { var os = Math.abs(self.getTimezoneOffset()); var h = ""+Math.floor(os/60); var m = ""+(os%60); h.length == 1? h = "0"+h:1; m.length == 1? m = "0"+m:1; return self.getTimezoneOffset() < 0 ? "+"+h+m : "-"+h+m;}
 function o() { var answer = O(); answer = answer.substring(0,1) + answer.substring(2,3); return answer;}
 function r() { var r; r = D() + ", " + j() + " " + M() + " " + Y() + " " + H() + ":" + i() + ":" + s() + " " + O(); return r;}
 function S() { return daysSuffix[self.getDate()-1];}
 function s() { return new String(self.getSeconds()).length == 1? "0"+self.getSeconds() : self.getSeconds();}
 function t() { if (n()-1 == 1) return 28 + L(); switch ((n()-1) % 2) { case 0 : return 31; break; default : return 30;}}
 function U() { return Math.round(self.getTime()/1000);}
 function W() { var beforeNY = 364+L() - z(); var afterNY = z(); var weekday = w()!=0?w()-1:6; if (beforeNY <= 2 && weekday <= 2-beforeNY) { return 1;} var ny = new Date("January 1 " + Y() + " 00:00:00"); var nyDay = ny.getDay()!=0?ny.getDay()-1:6; if ( (afterNY <= 2) && (nyDay >=4) && (afterNY >= (6-nyDay)) ) { var prevNY = new Date("December 31 " + (Y()-1) + " 00:00:00"); return prevNY.formatDate("W");} if (nyDay <= 3) { return 1 + Math.floor( ( z() + nyDay ) / 7 );} else { return 1 + Math.floor( ( z() - ( 7 - nyDay ) ) / 7 );}}
 function w() { return self.getDay();}
 function Y() { if (self.getFullYear) { var newDate = new Date("January 1 2001 00:00:00 +0000"); var x = newDate.getFullYear(); if (x == 2001) { return self.getFullYear();}} var x = self.getYear(); var y = x % 100; y += (y < 38) ? 2000 : 1900; return y;}
 function y() { var y = Y()+""; return y.substring(y.length-2,y.length);}
 function z() { var t = new Date("January 1 " + Y() + " 00:00:00"); var diff = self.getTime() - t.getTime(); return Math.floor(diff/1000/60/60/24);} var self = this; if (time) { var prevTime = self.getTime(); self.setTime(time);} var ia = input.split(""); var ij = 0; while (ia[ij]) { if (ia[ij] == "\\") { ia.splice(ij,1);} else { if (switches.exists(ia[ij])) { ia[ij] = eval(ia[ij] + "()");}} ij++;} if (prevTime) { self.setTime(prevTime);} return ia.join("");}
