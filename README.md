# Travel Planner App

#### Udacity Front End Developer Nanodegree Capstone Project

## Code structure

The app consists of three main blocks: the Form, Current trip and a List of saved trips. The Current trip section is initially hidden and is made visible upon successful Form submission or after selecting a trip from the saved List.
Start typing in the desired destination and the app will display a list of suggested locations. As you type more letters the choice narrows down. Clicking on a suggested place will put it's name into the input field. The best way to use the app is to select one of the found suggestions as this saves the geoname API data for faster processing later.
After the user submits the form with saved location data the app will double check with the geonames API using the name in the input field. If it differs from what was saved, a resubmission occurs. The app then makes a call to the Visual Crossing API to fetch weather forecast. Another API call is made to shutterstock to find available location imagery. All these API calls utilize the backing node.js server to circumvent CORS-related isues. Mustache templating library is used in a couple of places to escape API data that is inserted via innerHTML. Restcountries (https://gitlab.com/amatos/rest-countries) API call is made directly from the front end.

## Setup

- Obtain your API key for [geonames](http://www.geonames.org/)
- Obtain your API key for [Visual Crossing](https://www.visualcrossing.com/)
- Obtain your API key for [Shutterstock](https://www.shutterstock.com/)
- Save all keys into ```dotenv``` file, then rename the file to ```.env```
- ```npm install```
- ```npm run build```
- ```npm start``` to start the server
- Go to ```localhost:3000```
