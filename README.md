# Food Scrapper

This litte script is built to get some info about 1 restaurant on differents websites

## Get started

```js
npm i
node scrapper "restaurant search query"
```

## Example

```js
➜  food-api git:(master) ✗ node scrapper "como kitchen riviere"
search for ===> "como kitchen riviere"...
1. deliveroo {
    "title": "Como kitchen - Rivière",
    "rating": "4.8",
    "count": "50",
    "url": "https://deliveroo.fr/en/menu/paris/8eme-saint-philippe-du-roule/como-kitchen"
}
2. ubereats {
    "title": "Como kitchen - Rivière",
    "rating": 4.7,
    "count": "500",
    "url": "https://www.ubereats.com/fr-en/paris/food-delivery/como-kitchen-riviere/IEEOGDzvTpSQ1zbMjj6SXw",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Paris",
        "addressRegion": "Île-de-France",
        "postalCode": "75008",
        "addressCountry": "FR",
        "streetAddress": "6 Rue du Commandant Rivière"
    }
}
3. tripadvisor {
    "title": "Como kitchen - CLOSED",
    "rating": 3.5,
    "count": 25,
    "url": "https://www.tripadvisor.com/Restaurant_Review-g187147-d17288756-Reviews-Como_kitchen-Paris_Ile_de_France.html",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "6 rue du Commandant Riviere",
        "addressLocality": "Paris",
        "addressRegion": "Ile-de-France",
        "postalCode": "75008",
        "addressCountry": {
            "@type": "Country",
            "name": "France"
        }
    }
}
```
