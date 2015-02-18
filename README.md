# psdQuery
Javascript library to query Photoshop documents

# Ejemplos

````
/* Selecciona todas las capas y las oculta */
$$("*").hide()
```

````
/* Oculta todas las capas de texto con menos del 10% de opacidad */
$$("textLayers").filter(function(){
    return $$(this).opacity() < 10;
}).hide();
```
