class JournalEntry {
  constructor(date, feelings, temperature) {
    this.key = Date.parse(new Date()); //date stored in msec. To convert it to a date object: var d = new Date(key);
    this.date = date;
    this.feelings = feelings;
    this.temperature = temperature;
  }
}

/* Global Variables */
let baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=77eb9eb366ce5b4d72d4edb6560b06f6';
let units = '&units=imperial';

let temperature = 0;

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();

document.getElementById('generate').addEventListener('click', performAction);

//Handle getting user input from UI and logging journal entry on server and updating UI
function performAction(e) {
  const newZip = document.getElementById('zip').value;
  const feelings = document.getElementById('feelings').value;

  if ((newZip != null) && (newZip !== "")) {
    getWeatherInfo(baseURL, newZip, units, apiKey)
      .then(w => { addJournalEntry(new JournalEntry(newDate, feelings, w.main.temp)) })
      .catch(error => { alert(`error caught:${error.message}`); });
  }
  else {
    alert('Zipcode field must have a valid entry.');
  }
}

//Add journal entry on the server then retreive all entries from the server and display the latest entry
function addJournalEntry(journalEntry) {
  postData('http://localhost:3000/entry', journalEntry)
    .then(retrieveData('http://localhost:3000/all')
      .then(d => {
        //sort all jounal entries in descending order (key is based on date/time) and get the first one (latest entry)
        const latestJournalEntry = Object.entries(d).sort((a, b) => b[0].localeCompare(a[0]))[0][1];
        updateUILatestJournalEntry(latestJournalEntry);
      })
    );
}

//Get the weather info from OpenWeatherMap.com 
const getWeatherInfo = async (baseURL, zip, key, units) => {
  try {
    const response = await fetch(baseURL + zip + units + key)
    if (response.ok) {
      return response.json();;
    }
    else {
      return Promise.reject({ message: `url: ${new URL(response.url).pathname} status: ${response.status} ${response.statusText}` });
    }
  } catch (error) {
    alert(error);
  }
}

function updateUILatestJournalEntry(journalEntry) {
  document.getElementById('date').innerHTML = `Date: ${journalEntry.date}`;
  document.getElementById('temp').innerHTML = `Temperature: ${journalEntry.temperature} \xB0F`;
  document.getElementById('content').innerHTML = `Entry: ${journalEntry.feelings}`;
}