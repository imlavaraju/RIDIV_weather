# Weather Application

This is the weather application which shows you 5 days weather forecast of given city .It will the another feature also which saves the favourite cities .After favourite cities shows all cities weather at the time. 

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Step 1: Clone the Repository

Clone the repository to your local machine.

### Step 2: Obtain API Key from OpenWeatherMap

1. Go to the OpenWeatherMap website at [Click Here](https://home.openweathermap.org/myservices).
2. Sign up and log in to the website. 
3. Go to your profile and navigate to "My API Keys".
4. Generate a new API key (choose the free version).
5. After obtaining the API key, navigate to the "API" section to explore different types of weather APIs available.
6. Choose the API that suits your requirements and read the documentation for a better understanding of the API responses.

### Step 3: Setup and Run the Application

1. Navigate to the cloned project directory using the command `cd RIDIV_weather`.
2. Install the necessary Node packages using the command `npm install`. after `npm i axios json-server`
3. Start the JSON server by running `json-server --watch db.json --port 5000` in one terminal.
4. Open another terminal, navigate to the project directory (if not already there), and start the application using `npm start`.

