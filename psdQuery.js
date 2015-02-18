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

// Personal modules
//@include "layerfxconstants.js"
//@include "extends.js"

#target photoshop

var zen, $$;
var doc = app.activeDocument;

(function() {

    var kind = {
        "BLACKANDWHITE":LayerKind.BLACKANDWHITE,
        "BRIGHTNESSCONTRAST":LayerKind.BRIGHTNESSCONTRAST,
        "CHANNELMIXER":LayerKind.CHANNELMIXER,
        "COLORBALANCE":LayerKind.COLORBALANCE,
        "COLORLOOKUP":LayerKind.COLORLOOKUP,
        "CURVES":LayerKind.CURVES,
        "EXPOSURE":LayerKind.EXPOSURE,
        "GRADIENTFILL":LayerKind.GRADIENTFILL,
        "GRADIENTMAP":LayerKind.GRADIENTMAP,
        "HUESATURATION":LayerKind.HUESATURATION,
        "INVERSION":LayerKind.INVERSION,
        "LEVELS":LayerKind.LEVELS,
        "NORMAL":LayerKind.NORMAL,
        "PATTERNFILL":LayerKind.PATTERNFILL,
        "PHOTOFILTER":LayerKind.PHOTOFILTER,
        "POSTERIZE":LayerKind.POSTERIZE,
        "SELECTIVECOLOR":LayerKind.SELECTIVECOLOR,
        "SMARTOBJECT":LayerKind.SMARTOBJECT,
        "SOLIDFILL":LayerKind.SOLIDFILL,
        "TEXT":LayerKind.TEXT,
        "THRESHOLD":LayerKind.THRESHOLD,
        "LAYER3D":LayerKind.LAYER3D,
        "VIBRANCE":LayerKind.VIBRANCE,
        "VIDEO":LayerKind.VIDEO
    };

    zen = $$ = function(selector) {
        return new Zen(selector);
    };

    var L = [];
    var oldFillArray = function(selector) {

           var layerArray = selector.layers;
           var len = layerArray.length;
           for (var i=0; i<len; i++) {

             if (layerArray[i].typename == "LayerSet") {
                 L.push(layerArray[i]);
                 oldFillArray(layerArray[i]);
             } else {
                 L.push(layerArray[i]);
             }
         }


    };

    var fillArray = function(layer, prueba) {
        L.push(layer);
    };

    var fillArrayWithLayers = function(layer, layer_kind) {
        if (layer.kind == layer_kind) {
            L.push(layer);
        }
    }

    var traverseLayersAMFlat = function(ftn, theKindOfLayer) {

        //select just this layer
        function _selectLayerById(ID) {
            var ref = new ActionReference();
            ref.putIdentifier(charIDToTypeID('Lyr '), ID);
            var desc = new ActionDescriptor();
            desc.putReference(charIDToTypeID('null'), ref);
            desc.putBoolean(charIDToTypeID('MkVs'), false);
            executeAction(charIDToTypeID('slct'), desc, DialogModes.NO);
        }//_selectLayerById

        //how many layers are there in this document?
        var ref = new ActionReference();
        ref.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
        var count = executeActionGet(ref).getInteger(charIDToTypeID('NmbL'));

        //traverse the list backwards (does parents first)
        for (var i = count; i >= 1; i--) {
            ref = new ActionReference();
            ref.putIndex(charIDToTypeID('Lyr '), i);
            var desc = executeActionGet(ref);   //access layer index #i
            var layerID = desc.getInteger(stringIDToTypeID('layerID'));   //ID for selecting by ID #
            var layerSection = typeIDToStringID(desc.getEnumerationValue(stringIDToTypeID('layerSection')));
            if (layerSection != 'layerSectionEnd') {   //do this layer
                _selectLayerById(layerID);
                ftn(app.activeDocument.activeLayer, theKindOfLayer);    //apply function to this layer
            }
        }//for i-- countdown

        try {   //if there is a magic background layer, process it, too
            app.activeDocument.activeLayer = app.activeDocument.backgroundLayer;
            ftn(app.activeDocument.backgroundLayer, theKindOfLayer);
        } catch (e) {;}
    }







    /*
        Prototype
    */

    var Zen = function(selector) {

        this.layers = [];
        this.version = "1.0";
        this.autor = "Francis Vega";

        var _docs = [];
        var _layers = [];

        // String selector
        if (typeof selector === "string") {
            // Adjustement
            if (selector == "adjustementLayers") {
                // Fill array
                traverseLayersAMFlat(fillArray);

                // Filter by adjustement
                var _layers = [];
                var len = L.length;
                for (var i=0; i<len; i++) {
                    if (this.__isAdjustementLayer(L[i])) {
                        _layers.push(L[i]);
                    }
                }
            }

            // All
            if (selector == "*") {
                // Fill array
                traverseLayersAMFlat(fillArray);
                // copy array
                var _layers = L.slice()
            }

            if (selector == "*2") {
                // Fill array
                oldFillArray(app.activeDocument);
                // copy array
                var _layers = L.slice()
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
                // Fill array L
                traverseLayersAMFlat(fillArray);
                // Filter art layers
                _layers = [];
                var len = L.length;
                for (var i=0; i<len; i++) {
                    if(this.__isArtLayer(L[i])) {
                        _layers.push(L[i]);
                    }
                }
            }

            // Text layers
            if (selector == "textLayers") {
                // Fill array L
                traverseLayersAMFlat(fillArray);
                // Filter text layers
                _layers = [];
                var len = L.length;
                for (var i=0; i<len; i++) {
                    if(this.__isTextLayer(L[i])) {
                        _layers.push(L[i]);
                    }
                }
            }

            // Paragraph text layers
            if (selector === "paragraphTextLayers") {
                // Fill array L
                traverseLayersAMFlat(app.activeDocument, fillArray);
                // Filter paragraph text layers
                _layers = [];
                var len = L.length;
                for (var i=0; i<len; i++) {
                    if(this.__isParagraphTextLayer(L[i])) {
                        _layers.push(L[i]);
                    }
                }
            }

            // Point text layers
            if (selector === "pointTextLayers") {
                // Fill array L
                traverseLayersAMFlat(fillArray);
                // Filter point text layers
                _layers = [];
                var len = L.length;
                for (var i=0; i<len; i++) {
                    if(this.__isPointTextLayer(L[i])) {
                        _layers.push(L[i]);
                    }
                }
            }

            // Vector layers
            if (selector == "vectorLayers") {
                // Fill array L
                traverseLayersAMFlat(fillArray);
                // Filter vector layers
                _layers = [];
                var len = L.length;
                for (var i=0; i<len; i++) {
                    if(this.__isVectorLayer(L[i])) {
                        _layers.push(L[i]);
                    }
                }
            }

            // Adjustement layers
            if (selector == "adjustementLayers") {
                // Fill array L
                traverseLayersAMFlat(fillArray);
                // Filter adjustement layers
                _layers = [];
                var len = L.length;
                for (var i=0; i<len; i++) {
                    if(this.__isAdjustementLayer(L[i])) {
                        _layers.push(L[i]);
                    }
                }
            }

            // Groups
            if (selector == "groups2") {
                // Fill array L
                traverseLayersAMFlat(fillArray);
                // Filter groups
                _layers = [];
                var len = L.length;
                for (var i=0; i<len; i++) {
                    if(this.__isLayerSet(L[i])) {
                        _layers.push(L[i]);
                    }
                }
            }

            // Groups
            if (selector == "groups") {
                // Fill Array with groups
                traverseLayersAMFlat(fillArrayWithLayers, "LayerSet")
                _layers = L.slice();
            }

            // Smartobjects
            if (selector == "smartObjects") {
                // Fill array L with smart objects layers
                traverseLayersAMFlat(fillArrayWithLayers, LayerKind.SMARTOBJECT);
                _layers = L.slice();
            }

        }

        // Object selector
        if (typeof selector == "object") {
            var _layers = [];
            _layers.push(selector);
        }

        // Copy into 'this'
        this.layers = _layers.slice();
        this.length = this.layers.length;

        // Return self object
        return this;

    };



    /*
        API Plugins
    */

    zen.fn = Zen.prototype = {

        /*
        Special methods
        */

        // Each function
        each: function(callback) {
            for(var i = 0; i < this.layers.length; ++i) {
                callback.call(this.layers[i], i);
            }
            return this;
        },

        filter: function(callback) {
            var r = [];
            var k;

            for(var i = 0; i < this.layers.length; ++i) {
                k = callback.call(this.layers[i], i);
                if (k){
                    r.push(this.layers[i])
                }
            }

            this.layers = r.slice();
            this.length = this.layers.length
            return this;
        },

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


        /*
        Layer kind
        */

        // Adjustement layers
        __isAdjustementLayer: function(layer) {
            if (
                layer.kind == kind.BLACKANDWHITE ||
                layer.kind == kind.BRIGHTNESSCONTRAST ||
                layer.kind == kind.CHANNELMIXER ||
                layer.kind == kind.COLORBALANCE ||
                layer.kind == kind.COLORLOOKUP ||
                layer.kind == kind.CURVES ||
                layer.kind == kind.EXPOSURE ||
                layer.kind == kind.GRADIENTFILL ||
                layer.kind == kind.GRADIENTMAP ||
                layer.kind == kind.HUESATURATION ||
                layer.kind == kind.INVERSION ||
                layer.kind == kind.LEVELS ||
                layer.kind == kind.PATTERNFILL ||
                layer.kind == kind.PHOTOFILTER ||
                layer.kind == kind.POSTERIZE ||
                layer.kind == kind.SELECTIVECOLOR ||
                layer.kind == kind.SOLIDFILL ||
                layer.kind == kind.THRESHOLD ||
                layer.kind == kind.VIBRANCE
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
        __isSmartObject: function(layer) {
            if (layer.kind == kind.SMARTOBJECT) {
                return true;
            } else {
                return false;
            }
        },

        __bitmapLayerBoundsZero: function(layer) {
            var bounds = layer.bounds;
            if (bounds[0] == 0 && bounds[1] == 0 && bounds[2] == 0 && bounds[3] == 0) {
                return true;
            } else {
                return false;
            }
        },


        /*
        Filter Methods
        */

        // Return empty groups and layers
        isEmpty: function(neg) {


            // Aquí guardaremos el resultado
            var _output = [];

            for (var i=0; i<this.length; i++) {
                // Si es tipo bitmap (NORMAL) y tiene los bounds a cero
                if (this.layers[i].kind == LayerKind.NORMAL && this.__bitmapLayerBoundsZero(this.layers[i])) {
                    _output.push(this.layers[i]);
                }


                // Si es de tipo TEXT y no tiene contenido
                if (this.layers[i].kind == LayerKind.TEXT && this.layers[i].textItem.contents.length == 0) {
                    _output.push(this.layers[i]);
                }
            }

            this.layers = _output.slice();
            this.length = this.layers.length;
            return this;
        },

        // Return locked groups and layers
        // if @parameter neg == false, return non-locked layers
        isLocked: function(neg) {

            if (neg === undefined) neg = true;
            var _layers = [];

            for (var i=0; i<this.length; i++) {

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
            this.length = this.layers.length;
            return this;
        },

        // Return empty groups
        isEmptyGroup: function() {
            var _layers = [];

            for (var i=0; i<this.length; i++) {
                if (this.layers[i].typename == "LayerSet") {
                    if(this.layers[i].layers.length < 1) {
                        _layers.push(this.layers[i]);
                    }
                }
            }

            this.layers = _layers.slice();
            this.length = this.layers.length;

            return this;
        },

        // Return hidden groups and layers
        isHidden: function() {
            var _layers = [];

            for (var i=0; i<this.length; i++) {
                if (this.layers[i].visible === false) {
                    _layers.push(this.layers[i]);
                }
            }
            this.layers = _layers.slice();
            this.length = this.layers.length;

            return this;
        },


        /*
        Action Methods
        */

        // Select layers in Photoshop
        UISelect: function() {
                
        },

        // Show groups and layers
        show: function() {
            for (var i=0; i<this.length; i++) {
                this.layers[i].visible = true;
            }
            return this;
        },

        // Hide groups and layers
        hide: function() {
            for (var i=0; i<this.length; i++) {
                try {
                    this.layers[i].visible = false;
                } catch(e){}
            }
            return this;
        },

        // Lock groups and layers
        lock: function() {
            for (var i=0; i<this.length; i++) {
                this.layers[i].allLocked = true;
            }
            return this;
        },

        // Unlock groups and layers
        unlock: function() {
            for (var i=0; i<this.length; i++) {
                this.layers[i].allLocked = false;
            }
            return this;
        },

        // Rename groups and layers
        rename: function(name) {
            for (var i=0; i<this.length; i++) {
                this.layers[i].name = name;
            }
            return this;
        },

        // Delete groups and layers
        remove: function() {
            for (var i=0; i<this.length; i++) {
                try {
                    this.layers[i].remove();
                } catch(e) {}
            }

            this.layers = [];
            this.length = 0;
        },

        // Set opacity of groups and layers
        setOpacity: function(opacity) {
            for (var i=0; i<this.length; i++) {
                try {
                    this.layers[i].opacity = opacity;
                } catch(e) {
                    // Locked layers...
                }
            }
            return this;
        },

        opacity: function() {
            return this.layers[0].opacity;
        },

        /*
        Documents related methods
        */

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
            if (docObj != undefined && typeof docObj === "object" && docObj.typename === "Document") {
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
            for (var i=0; i<this.length; i++) {

                app.activeDocument.activeLayer = this.layers[i];
                layerStyleObj = jamStyles.getLayerStyle();
                layerEffectsObj = layerStyleObj["layerEffects"];
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
                            for (prop in fxs[fx]) {

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
                                };

                                /*
                                    Comprobamos si las propiedades indicadas por
                                    el query son iguales que las existentes en
                                    la capa.
                                    Si la propiedad es un SolidColor, usamos una
                                    funcion.
                                */
                                if (prop == "color") {
                                    if (Zen.prototype.compareColors(inputPropValue, layerPropValue)) {
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
                    _layers.push(this.layers[i])
                }
            }

            this.layers = _layers.slice();
            this.length = this.layers.length;

            return this;
        },

        setLayerFX: function(fxs) {

            var layerFXObject = {
                "layerEffects":{
                }
            }

            // Layer by layer
            for(var i=0; i<this.length; i++) {

                // LayerFX by LayerFX
                for (var fx in fxs) {
                    if (fx != "length") {
                        for(prop in fxs[fx]) {
                            try {
                                layerFXObject.layerEffects[fx] = fxs[fx]
                                layerFXObject.layerEffects[fx][prop] = fxs[fx][prop]
                            } catch(e) {}
                        }
                    }
                }

                app.activeDocument.activeLayer = this.layers[i];
                jamStyles.setLayerStyle(layerFXObject)
            }

            return this;
        }

    };

}());
