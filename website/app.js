class JournalEntry {
  constructor(date, feelings, temperature) {
    this.date = date;
    this.feelings = feelings;
    this.temperature = temperature;
  }
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
  getWeather(baseURL, newZip, units, apiKey).then(w => { addJournalEntry(new JournalEntry(newDate, feelings, w.main.temp)) });


  retrieveData('http://localhost:3000/all').then(d => d.map(k => console.log(`retrieved:${k.date}`)));

}
function addJournalEntry(journalEntry) {
  //console.log(journalEntry);
  postData('http://localhost:3000/entry', journalEntry)
    .then(retrieveData('http://localhost:3000/all')
      .then(d => updateUILatestJournalEntry(new JournalEntry(d[d.length - 1].date,
                                                             d[d.length - 1].feelings,
                                                             d[d.length - 1].temperature))));
}
const getWeather = async (baseURL, zip, key, units) => {

  const res = await fetch(baseURL + zip + units + key)
  try {

    const data = await res.json();
    //console.log(data)
    return data;
  } catch (error) {
    console.log("error", error);
    // appropriately handle the error
  }
}

function updateUILatestJournalEntry(journalEntry) {
  console.log(`updateUILatestJournalEntry ${journalEntry}`);
  document.getElementById('date').innerHTML = `Date: ${journalEntry.date}`;
  document.getElementById('temp').innerHTML = `Temperature: ${journalEntry.temperature} \xB0F`;
  document.getElementById('content').innerHTML = `Entry: ${journalEntry.feelings}`;
}