# psdQuery
Javascript library to query Photoshop documents

# Dependencias
JSONActionManager
http://www.tonton-pixel.com/blog/json-photoshop-scripting/json-action-manager/

# Ejemplos

````javascript
/* Selecciona todas las capas y las oculta */
$$("*").hide()
```

````
/* Oculta todas las capas de texto con menos del 10% de opacidad */
$$("textLayers").filter(function(){
    return $$(this).opacity() < 10;
}).hide();
```

````
/* Renombra las capas de smartObjects */
$$("textLayers").each(function(idx){
    $$(this).rename("Smart Object Layer number " + idx);
});
```
