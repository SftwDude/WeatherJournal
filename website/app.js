class JournalEntry {
  constructor(date, feelings, temperature) {
    this.key = Date.parse(new Date()); //date stored in msec. convert it to a date object: var d = new Date(key);
    this.date = date;
    this.feelings = feelings;
    this.temperature = temperature;
  }
  key;
}

/* Global Variables */
let baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
let apiKey = '&appid=77eb9eb366ce5b4d72d4edb6560b06f6';
let units = '&units=imperial';

let temperature = 0;

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

document.getElementById('generate').addEventListener('click', performAction);

function performAction(e) {
  const newZip = document.getElementById('zip').value;
  const feelings = document.getElementById('feelings').value;
  
  getWeatherInfo(baseURL, newZip, units, apiKey)
  .then(w => { addJournalEntry(new JournalEntry(newDate, feelings, w.main.temp)) })
  .catch(error => { alert(`error caught:${error.message}`); });
}
function addJournalEntry(journalEntry) {
  postData('http://localhost:3000/entry', journalEntry)
    .then(retrieveData('http://localhost:3000/all')
      .then(d => updateUILatestJournalEntry(new JournalEntry(d[d.length - 1].date,
        d[d.length - 1].feelings,
        d[d.length - 1].temperature))));
}

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