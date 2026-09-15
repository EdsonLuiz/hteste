## Weather CLI APP

The goal of this application is to create a console application that asks us to enter a city. At the end, we will generate an executable binary.

### Options:

- Enter the name of a city.
- Save the default city.
- Register several other cities to check the weather in those cities.

## Stack

- Bun.js
- OpenMeteo

## HTTP Request Example:

1. Step 1: Geocoding API.
2. Step 2: OpenMeteo API.

https://geocoding-api.open-meteo.com/v1/search?name=Ottawa&count=1&language=es&format=json
https://api.open-meteo.com/v1/forecast?latitude=45.41117&longitude=-75.69812&current=temperature_2m

## Initialize Project

bun init

### Menu Example

This is the appearance we want to create:

════════════════════════════════════════
         WEATHER CLI
════════════════════════════════════════
  1. Default city weather
  2. Weather for all cities (1)
  3. Search and add city
  4. Remove city
  5. Set default city
  8. Settings (°C)
  9. Exit
════════════════════════════════════════
  Select an option: 5