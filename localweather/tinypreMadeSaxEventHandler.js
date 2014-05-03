// =========================================================================
//
// preMadeSaxEventHandler.js - a pre-built event handler for XML for <SCRIPT>'s SAX Parser
//
// version 3.1
//
// =========================================================================
//
// Copyright (C) 2001 - 2002 David Joham (djoham@yahoo.com)
//
// This library is free software; you can redistribute it and/or
// modify it under the terms of the GNU Lesser General Public
// License as published by the Free Software Foundation; either
// version 2.1 of the License, or (at your option) any later version.

// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.

// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//
// visit the XML for <SCRIPT> home page at xmljs.sourceforge.net
//
SAXEventHandler = function() {this.characterData = "";}
SAXEventHandler.prototype.characters = function(data, start, length) {this.characterData += data.substr(start, length);}
SAXEventHandler.prototype.endDocument = function() {this._handleCharacterData();}
SAXEventHandler.prototype.endElement = function(name) {this._handleCharacterData();}
SAXEventHandler.prototype.processingInstruction = function(target, data) {this._handleCharacterData();}
SAXEventHandler.prototype.setDocumentLocator = function(locator) {this._handleCharacterData();}
SAXEventHandler.prototype.startElement = function(name, atts) {this._handleCharacterData();}
SAXEventHandler.prototype.startDocument = function() {this._handleCharacterData();}
SAXEventHandler.prototype.comment = function(data, start, length) {this._handleCharacterData();}
SAXEventHandler.prototype.endCDATA = function() {this._handleCharacterData();}
SAXEventHandler.prototype.startCDATA = function() {this._handleCharacterData();}
SAXEventHandler.prototype.error = function(exception) {this._handleCharacterData();}
SAXEventHandler.prototype.fatalError = function(exception) {this._handleCharacterData();}
SAXEventHandler.prototype.warning = function(exception) {this._handleCharacterData();}
SAXEventHandler.prototype._fullCharacterDataReceived = function(fullCharacterData) {}
SAXEventHandler.prototype._handleCharacterData = function() {if (this.characterData != "") {this._fullCharacterDataReceived(this.characterData);}this.characterData = "";}