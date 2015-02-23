/*
*   File: psdQuery.js
*   Version: 0.1
*   Release Date: 2015-??-??
*   Copyright: © 2014-2015 Francis Vega
*   Licence: GPL <http://www.gnu.org/licenses/gpl.html>
*
*   This program is free software: you can redistribute it and/or modify it
*   under the terms of the GNU General Public License as published by the Free
*   Software Foundation, either version 3 of the License, or (at your option)
*   any later version.
*
*   This program is distributed in the hope that it will be useful, but WITHOUT
*   ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
*   FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
*   more details.
*
*   You should have received a copy of the GNU General Public License along with
*   this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
*   @filetype psdQuery core
*   @name psdQuery.js
*   @author Francis Vega
*/

/*
*   <javascriptresource>
*   <name>psdQuery</name>
*   </javascriptresource>
*/

//@includepath "~/JSONActionManager/"
//@include "jamEngine.jsxinc"

//@include "jamActions.jsxinc"
//@include "jamColors.jsxinc"
//@include "jamHelpers.jsxinc"
//@include "jamJSON.jsxinc"
//@include "jamLayers.jsxinc"
//@include "jamShapes.jsxinc"
//@include "jamStyles.jsxinc"
//@include "jamText.jsxinc"
//@include "jamUtils.jsxinc"

//@include "prototypes.js"
//@include "AMLibrary.js"

var psdQuery, $$;

(function(){

    psdQuery = $$ = function(selector) {
        return new PSDQUERY(selector);
    };

    //
    //  Helper functions
    //

    // All psd items
    var ALL_LAYERS = [];

    // Callback function to use in traverseLayersAMFlat
    var fillArray = function(layer) {
        ALL_LAYERS.push(layer);
    };

    // Return current layers selection
    var savePreviousSelectionLayers = function() {
        return getIndexFromSelectedLayers();
    };

    // Save current activeLayer
    var prevLayers = savePreviousSelectionLayers();

    // Restore layers saved from an array 'pre'
    var loadPreviousSelection = function(pre) {
        var addLayer = false;
        for (i=0; i<pre.length; i++) {
            if (i>0) { addLayer = true; }
            selectLayerByIndex(pre[i], addLayer);
        }
    };


    //
    //  psdQuery
    //

    var PSDQUERY = function(selector) {

        // psdQuery works on PIXELS
        app.preferences.typeUnits = TypeUnits.PIXELS;

        // this
        this.typename = "psdQuery";
        this.version = "1.0";
        this.autor = "Francis Vega";
        this.layers = [];

        // vars
        var _docs = [];
        var _layers = [];
        var len;
        var i;

        // String selector
        if (typeof selector === "string") {

            // All
            if (selector == "*") {
                // Fill array
                ALL_LAYERS = [];
                traverseLayersAMFlat(fillArray);
                // copy array
                _layers = ALL_LAYERS.slice();
            }

            // Document
            if (selector == "document") {
                this.activeDocument = app.activeDocument;
            }

            // App
            if (selector == "app") {
                this.app = app;
            }

            // Art layers
            if (selector == "artLayers") {
                // Fill array ALL_LAYERS
                ALL_LAYERS = [];
                traverseLayersAMFlat(fillArray);
                // Filter art layers
                _layers = [];
                len = ALL_LAYERS.length;
                for (i=0; i<len; i++) {
                    if(this.__isArtLayer(ALL_LAYERS[i])) {
                        _layers.push(ALL_LAYERS[i]);
                    }
                }
            }

            // Text layers
            if (selector == "textLayers") {
                // Fill array ALL_LAYERS
                ALL_LAYERS = [];
                traverseLayersAMFlat(fillArray);
                // Filter text layers
                _layers = [];
                len = ALL_LAYERS.length;
                for (i=0; i<len; i++) {
                    if(this.__isTextLayer(ALL_LAYERS[i])) {
                        _layers.push(ALL_LAYERS[i]);
                    }
                }
            }

            // Paragraph text layers
            if (selector === "paragraphTextLayers") {
                // Fill array ALL_LAYERS
                ALL_LAYERS = [];
                traverseLayersAMFlat(fillArray);
                // Filter paragraph text layers
                _layers = [];
                len = ALL_LAYERS.length;
                for (i=0; i<len; i++) {
                    if(this.__isParagraphTextLayer(ALL_LAYERS[i])) {
                        _layers.push(ALL_LAYERS[i]);
                    }
                }
            }

            // Point text layers
            if (selector === "pointTextLayers") {
                // Fill array ALL_LAYERS
                ALL_LAYERS = [];
                traverseLayersAMFlat(fillArray);
                // Filter point text layers
                _layers = [];
                len = ALL_LAYERS.length;
                for (i=0; i<len; i++) {
                    if(this.__isPointTextLayer(ALL_LAYERS[i])) {
                        _layers.push(ALL_LAYERS[i]);
                    }
                }
            }

            // Vector layers
            if (selector == "vectorLayers") {
                // Fill array ALL_LAYERS
                ALL_LAYERS = [];
                traverseLayersAMFlat(fillArray);
                // Filter vector layers
                _layers = [];
                len = ALL_LAYERS.length;

                for (i=0; i<len; i++) {
                    if(this.__isVectorLayer(ALL_LAYERS[i])) {
                        _layers.push(ALL_LAYERS[i]);
                    }
                }
            }

            // Bitmaps layers
            if (selector == "bitmapLayers") {
                // Fill array ALL_LAYERS
                ALL_LAYERS = [];
                traverseLayersAMFlat(fillArray);
                // Filter vector layers
                _layers = [];
                len = ALL_LAYERS.length;
                for (i=0; i<len; i++) {
                    if(this.__isNormalLayer(ALL_LAYERS[i])) {
                        _layers.push(ALL_LAYERS[i]);
                    }
                }
            }

            // Smartobjects
            if (selector == "smartObjects") {
                // Fill array ALL_LAYERS with smart objects layers
                ALL_LAYERS = [];
                traverseLayersAMFlat(fillArray);
                // Filter smartobjects layers
                _layers = [];
                len = ALL_LAYERS.length;
                for (i=0; i<len; i++) {
                    if(this.__isSmartObjectLayer(ALL_LAYERS[i])) {
                        _layers.push(ALL_LAYERS[i]);
                    }
                }
            }

            // Adjustement layers
            if (selector == "adjustementLayers") {
                // Fill array L
                ALL_LAYERS = [];
                traverseLayersAMFlat(fillArray);
                // Filter adjustement layers
                _layers = [];
                len = ALL_LAYERS.length;
                for (i=0; i<len; i++) {
                    if(this.__isAdjustementLayer(ALL_LAYERS[i])) {
                        _layers.push(ALL_LAYERS[i]);
                    }
                }
            }

            // Groups
            if (selector == "groups") {
                // Fill array ALL_LAYERS
                ALL_LAYERS = [];
                traverseLayersAMFlat(fillArray);
                // Filter groups
                _layers = [];
                len = ALL_LAYERS.length;
                for (i=0; i<len; i++) {
                    if(this.__isLayerSet(ALL_LAYERS[i])) {
                        _layers.push(ALL_LAYERS[i]);
                    }
                }
            }

            // Selected (UI) Layers
            if (selector == "selected") {
                // Index of selected layers
                var selectedLayers = getIndexFromSelectedLayers();
                _layers = [];

                // Hacemos activa la capa una por una y la vamos guardando en un array de objetos de capa
                for (i=0; i<selectedLayers.length; i++) {
                    selectLayerByIndex(selectedLayers[i]);
                    _layers.push(app.activeDocument.activeLayer);
                }

                // Restablecemos la selección original
                var add = false;
                for (i=0; i<selectedLayers.length; i++) {
                    if (i>0) { add = true; }
                    selectLayerByIndex(selectedLayers[i], add);
                }
            }
        }

        // Object selector
        if (typeof selector == "object") {
            _layers = [];
            if (selector.objectTypeOf == "psdQuery") {
                for (i=0; i<selector.length; i++) {
                    if (selector.layers[i] !== undefined) {
                        _layers.push(selector.layers[i]);
                    }
                }

            } else {
                _layers = [];
                _layers.push(selector);
            }

        }

        // Copy into 'this'
        this.layers = _layers.slice();

        // Return self object
        return this;

    };


    //
    // API Methods
    //

    psdQuery.fn = PSDQUERY.prototype = {

        //
        //  Special methods
        //

        // Each function
        each: function(callback) {
            for(var i = 0; i < this.layers.length; ++i) {
                callback.call(this.layers[i], i);
            }

            loadPreviousSelection(prevLayers);
            return this;
        },

        // Filter function
        filter: function(callback) {
            var r = [];
            var k;

            for(var i = 0; i < this.layers.length; ++i) {
                k = callback.call(this.layers[i], i);
                if (k){
                    r.push(this.layers[i]);
                }
            }

            this.layers = r.slice();
            loadPreviousSelection(prevLayers);
            return this;
        },

        // Compare colors to use in get layer FX
        compareColors: function(fromUser, fromApp) {

            var match = false;
            var appred, appgreen, appblue;
            var usrred, usrgreen, usrblue;

            appred = parseInt(fromApp.red);
            appgreen = parseInt(fromApp.green);
            appblue = parseInt(fromApp.blue);

            usrred = fromUser.red;
            usrgreen = fromUser.green;
            usrblue = fromUser.blue;

            if (appred == usrred && appgreen == usrgreen && appblue == usrblue) {
                    match = true;
            }

            return match;
        },

        //
        //  Layers kind
        //

        // Adjustement layers
        __isAdjustementLayer: function(layer) {
            if (
                layer.kind == LayerKind.BLACKANDWHITE ||
                layer.kind == LayerKind.BRIGHTNESSCONTRAST ||
                layer.kind == LayerKind.CHANNELMIXER ||
                layer.kind == LayerKind.COLORBALANCE ||
                layer.kind == LayerKind.COLORLOOKUP ||
                layer.kind == LayerKind.CURVES ||
                layer.kind == LayerKind.EXPOSURE ||
                layer.kind == LayerKind.GRADIENTFILL ||
                layer.kind == LayerKind.GRADIENTMAP ||
                layer.kind == LayerKind.HUESATURATION ||
                layer.kind == LayerKind.INVERSION ||
                layer.kind == LayerKind.LEVELS ||
                layer.kind == LayerKind.PATTERNFILL ||
                layer.kind == LayerKind.PHOTOFILTER ||
                layer.kind == LayerKind.POSTERIZE ||
                layer.kind == LayerKind.SELECTIVECOLOR ||
                layer.kind == LayerKind.SOLIDFILL ||
                layer.kind == LayerKind.THRESHOLD ||
                layer.kind == LayerKind.VIBRANCE
            ) {
                return true;
            } else {
                return false;
            }
        },

        // Groups
        __isLayerSet: function(layer) {
            if (layer.typename == "LayerSet") {
                return true;
            } else {
                return false;
            }
        },

        // Text Layers
        __isTextLayer: function(layer) {
            try {
                if (layer.textItem.kind == TextType.POINTTEXT || layer.textItem.kind == TextType.PARAGRAPHTEXT) {
                    return true;
                } else {
                    return false;
                }
            } catch(e) { return false; }
        },

        __isPointTextLayer: function(layer) {
            try {
                if (layer.textItem.kind == TextType.POINTTEXT) {
                    return true;
                } else {
                    return false;
                }
            } catch(e) { return false; }
        },

        __isParagraphTextLayer: function(layer) {
            try {
                if (layer.textItem.kind == TextType.PARAGRAPHTEXT) {
                    return true;
                } else {
                    return false;
                }
            } catch(e) { return false; }

        },

        // Vector Layers
        __isVectorLayer: function(layer) {
            if (layer.typename == "ArtLayer" && layer.kind == LayerKind.SOLIDFILL) {
                return true;
            } else {
                return false;
            }
        },

        // Art layers
        __isArtLayer: function(layer) {
            if (layer.typename == "ArtLayer") {
                return true;
            } else {
                return false;
            }
        },

        // Smart objects layers
        __isSmartObjectLayer: function(layer) {
            if (layer.kind == LayerKind.SMARTOBJECT) {
                return true;
            } else {
                return false;
            }
        },

        __isNormalLayer: function(layer) {
            if (layer.kind == LayerKind.NORMAL) {
                return true;
            } else {
                return false;
            }
        },

        __bitmapLayerBoundsZero: function(layer) {
            var bounds = layer.bounds;
            if (bounds[0] === 0 && bounds[1] === 0 && bounds[2] === 0 && bounds[3] === 0) {
                return true;
            } else {
                return false;
            }
        },

        //
        //  Filter Methods
        //

        // Return empty groups and layers
        isEmpty: function(neg) {

            // Aquí guardaremos el resultado
            var _output = [];

            for (var i=0; i<this.layers.length; i++) {
                // Si es tipo bitmap (NORMAL) y tiene los bounds a cero
                if (this.layers[i].kind == LayerKind.NORMAL && this.__bitmapLayerBoundsZero(this.layers[i])) {
                    _output.push(this.layers[i]);
                }


                // Si es de tipo TEXT y no tiene contenido
                if (this.layers[i].kind == LayerKind.TEXT && this.layers[i].textItem.contents.length === 0) {
                    _output.push(this.layers[i]);
                }
            }

            this.layers = _output.slice();
            loadPreviousSelection(prevLayers);
            return this;
        },

        // Return locked groups and layers
        // if @parameter neg == false, return non-locked layers
        isLocked: function(neg) {

            if (neg === undefined) neg = true;
            var _layers = [];

            for (var i=0; i<this.layers.length; i++) {

                if (neg) {
                    if (this.layers[i].allLocked === true) {
                        _layers.push(this.layers[i]);
                    }
                } else {
                    if (this.layers[i].allLocked === false) {
                        _layers.push(this.layers[i]);
                    }
                }

            }
            this.layers = _layers.slice();
            loadPreviousSelection(prevLayers);
            return this;
        },

        // Return empty groups
        isEmptyGroup: function() {
            var _layers = [];

            for (var i=0; i<this.layers.length; i++) {
                if (this.layers[i].typename == "LayerSet") {
                    if(this.layers[i].layers.length < 1) {
                        _layers.push(this.layers[i]);
                    }
                }
            }

            this.layers = _layers.slice();
            loadPreviousSelection(prevLayers);
            return this;
        },

        // Return hidden groups and layers
        isHidden: function() {
            var _layers = [];

            for (var i=0; i<this.layers.length; i++) {
                if (this.layers[i].visible === false) {
                    _layers.push(this.layers[i]);
                }
            }
            this.layers = _layers.slice();
            loadPreviousSelection(prevLayers);
            return this;
        },

        //
        //  Action Methods
        //

        // Show groups and layers
        show: function() {
            for (var i=0; i<this.layers.length; i++) {
                this.layers[i].visible = true;
            }
            loadPreviousSelection(prevLayers);
            return this;
        },

        // Hide groups and layers
        hide: function() {
            for (var i=0; i<this.layers.length; i++) {
                try {
                    this.layers[i].visible = false;
                } catch(e){}
            }
            loadPreviousSelection(prevLayers);
            return this;
        },

        // Lock groups and layers
        lock: function() {
            for (var i=0; i<this.layers.length; i++) {
                this.layers[i].allLocked = true;
            }
            loadPreviousSelection(prevLayers);
            return this;
        },

        // Unlock groups and layers
        unlock: function() {
            for (var i=0; i<this.layers.length; i++) {
                this.layers[i].allLocked = false;
            }
            loadPreviousSelection(prevLayers);
            return this;
        },

        // Rename groups and layers
        rename: function(name) {
            var prevLayers = savePreviousSelectionLayers();
            for (var i=0; i<this.layers.length; i++) {
                this.layers[i].name = name;
            }
            loadPreviousSelection(prevLayers);
            return this;
        },

        // Delete groups and layers
        remove: function() {
            for (var i=0; i<this.layers.length; i++) {
                try {
                    this.layers[i].remove();
                } catch(e) {}
            }

            this.layers = [];
        },

        // Set opacity of groups and layers
        setOpacity: function(opacity) {
            for (var i=0; i<this.layers.length; i++) {
                try {
                    this.layers[i].opacity = opacity;
                } catch(e) {
                    // Locked layers...
                }
            }
            loadPreviousSelection(prevLayers);
            return this;
        },

        opacity: function() {
            return this.layers[0].opacity;
        },

        fontSize: function() {
            return this.layers[0].textItem.size.as("px");
        },

        //
        //  Documents related methods
        //

        getPath: function() {
            return this.activeDocument.path;
        },

        getName: function() {
            return this.activeDocument.name;
        },

        //
        // App related methods
        //

        appName: function () {
            return this.app.name;
        },

        path: function () {
            return this.app.path;
        },

        activeDocument: function (docObj) {
            if (docObj !== undefined && typeof docObj === "object" && docObj.typename === "Document") {
                this.app.activeDocument = docObj;
                return this;
            } else {
                return this.app.activeDocument;
            }

        },

        backgroundColor: function (c) {
            if (c === undefined) {
                return this.app.backgroundColor;
            } else {
                this.app.backgroundColor = c;
                return this;
            }
        },

        foregroundColor: function (c) {
            if (c === undefined) {
                return this.app.foregroundColor;
            } else {
                this.app.foregroundColor = c;
                return this;
            }
        },

        switchBGFGColors: function () {
            var tempFGColor = this.app.foregroundColor;
            this.app.foregroundColor = this.app.backgroundColor;
            this.app.backgroundColor = tempFGColor;
            return this;
        },

        layerFX: function(fxs) {
            var layerStyleObj;
            var layerEffectsObj;

            var len = fxs.length();
            var match;
            var inputPropValue;
            var layerPropValue;

            var _layers = [];

            // Pasamos por cada capa
            for (var i=0; i<this.layers.length; i++) {

                app.activeDocument.activeLayer = this.layers[i];
                layerStyleObj = jamStyles.getLayerStyle();
                layerEffectsObj = layerStyleObj.layerEffects;
                match = false;

                // Pasamos por cada efecto indicado
                /*
                    Usamos una función anónuima para poder salir de varios loops
                    en cuanto una propiedad de false (ya sea que no existe o no
                    coincide
                */
                (function() {
                    for (var fx in fxs) {
                        if (fx == "dropShadow" || fx == "frameFX") {
                            // recorrido por propiedades indicadas en el query
                            for (var prop in fxs[fx]) {

                                try {
                                    inputPropValue = fxs[fx][prop];
                                    layerPropValue = layerEffectsObj[fx][prop];
                                } catch (e) {
                                    /*
                                        Si no existe la propiedad le asignamos
                                        -1 para que la comprobación de false y
                                        salgamos del bucle
                                    */
                                    inputPropValue = 0;
                                    layerPropValue = -1;
                                }

                                /*
                                    Comprobamos si las propiedades indicadas por
                                    el query son iguales que las existentes en
                                    la capa.
                                    Si la propiedad es un SolidColor, usamos una
                                    funcion.
                                */
                                if (prop == "color") {
                                    if (PSDQUERY.prototype.compareColors(inputPropValue, layerPropValue)) {
                                        match = true;
                                    } else {
                                        match = false;
                                        return;
                                    }
                                } else {
                                    if (inputPropValue == layerPropValue) {
                                        match = true;
                                    } else {
                                        match = false;
                                        return;
                                    }
                                }
                            }
                        }
                    }
                })();

                // Si todo ha ido bien, incluimos la capa en _layers;
                if (match) {
                    _layers.push(this.layers[i]);
                }
            }

            this.layers = _layers.slice();
            loadPreviousSelection(prevLayers);
            return this;
        },

        setLayerFX: function(fxs) {

            var layerFXObject = {
                "layerEffects":{
                }
            };

            // Layer by layer
            for(var i=0; i<this.layers.length; i++) {

                // LayerFX by LayerFX
                for (var fx in fxs) {
                    if (fx != "length") {
                        for(var prop in fxs[fx]) {
                            try {
                                layerFXObject.layerEffects[fx] = fxs[fx];
                                layerFXObject.layerEffects[fx][prop] = fxs[fx][prop];
                            } catch(e) {}
                        }
                    }
                }

                app.activeDocument.activeLayer = this.layers[i];
                jamStyles.setLayerStyle(layerFXObject);
            }
            loadPreviousSelection(prevLayers);
            return this;
        },

        style: function(style) {
            return this;
        },

        // Select layers in Photoshop
        UISelect: function() {
            var ids = [];
            var i, count, add;

            // Get Layers index
            for (i=0; i<this.layers.length; i++) {
                app.activeDocument.activeLayer = this.layers[i];
                ids.push(getIndexFromSelectedLayers());
            }

            // Select layers by index (adding)
            add = false;
            count = ids.length;
            for (i=0; i<count; i++) {
                if (i>0) { add = true; }
                selectLayerByIndex(parseInt(ids[i]), add);
            }

            return this;
        },

        // Shortcut for UISelect() :)
        s: function() {
            this.UISelect();
        },

        layersWithName: function (target, name) {
            // Fill array
            recursive(target);
            var found = [];
            for (var i=0; i<ALL_LAYERS.length; i++) {
                if (ALL_LAYERS[i].name == name) {
                    found.push(ALL_LAYERS[i]);
                }
            }
            return found;
        },

        /*
        *
        *   psdQuery Plug-in
        *   Return missing font text layers
        *
        */

        fontMissing: function() {
            var _layers = [];
            for (var i=0; i<this.layers.length; i++) {
                try {
                    if (jamUtils.fontExists(this.layers[i].textItem.font) === false) {
                        _layers.push(this.layers[i]);
                    }
                } catch(e){}
            }

            this.layers = _layers.slice();

            return this;
        },

        /*
            Group Layers
        */

        groupSelection: function (groupName) {
            groupName = groupName || undefined;

            // create new group and rename it
            var newGroup = app.activeDocument.layerSets.add();
            //$$(newGroup).rename(groupName);

            // Move groups and layers outside
            var cero = app.activeDocument.layers[0];
            for (i=0; i<this.layers.length; i++) {
                this.layers[i].move(cero, ElementPlacement.PLACEBEFORE);
            }


            // Move layers and groups into new group
            for (i=0; i<this.layers.length; i++) {
                this.layers[i].move(newGroup, ElementPlacement.INSIDE);
            }

            return this;
        },

        add: function(userInput) {

            // Primero creamos lo que viene siendo la capa de texto
            var textLayer = app.activeDocument.artLayers.add();
            textLayer.kind = LayerKind.TEXT;
            app.activeDocument.activeLayer = textLayer;

            // Construimos el objeto de style
            var layerText =
            {
                "layerText":
                {
                    "textKey": userInput.text,

                    "antiAlias": "antiAliasCrisp",
                    "textShape":
                    [
                        { "textType": userInput.textType, "orientation": "horizontal" }
                    ],

                    "textStyleRange":
                    [
                        {
                            "from": 0,
                            "to": userInput.text.length,
                            "textStyle":
                            {
                                "fontPostScriptName": userInput.font,
                                "size": userInput.size,
                                "color": userInput.color
                            }
                        }
                    ],

                    "paragraphStyleRange":
                    [
                        {
                            "from": 0,
                            "to": userInput.text.length,
                            "paragraphStyle": { "alignment": "center" }
                        }
                    ]
                },

                "typeUnit": "pixelsUnit"
            };

            // Aplicamos
            jamText.setLayerText(layerText);

            this.layers = [textLayer];
            return this;
        },

        isParagraph: function() {
            return this.__isParagraphTextLayer(this.layers[0]);
        }
    };

}
