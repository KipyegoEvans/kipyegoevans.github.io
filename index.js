
self.addEventListener('load', (e)=>{

  currencylist();

})

if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg)=>{

      console.log('Service worker registered successfully');

    }).catch((err)=>{
      console.log('Ooops' ,err);
    })
}

//fetch currency list from net

const fetchCurr = () =>{
  const url = 'https://free.currencyconverterapi.com/api/v5/currencies';
  fetch(url).then(res=>{
    return res.json();
  })

}

if ('indexedDB' in window) {
      let request = indexedDB.open('currencylist', 1);

      request.onupgradeneeded = ()=>{
          let db = request.result;
          let store = db.createObjectStore('currency', {keyPath: 'id', autoIncreament: true});
          const data = fetchCurr();

          store.put(data.results);

          };



      request.onsuccess = ()=>{
          db = request.result;
    };

}


//get currency list for user to select
const currencylist = () =>{

  
  let from = document.getElementById('from');
  let to = document.getElementById('to');

  //Check if database exist 
  //if it exists fetch data and use it for the page
  //if !exist Fetch data from net and store it on IndexedDB
  //And fetch data for use on the page

    data = fetchCurr();

      for(key in data.results) {
        option = `<option> ${key} </option>`;
        to.innerHTML += option;
        from.innerHTML += option;
      }
    }


//convert currency
const convertCurrency = () => {

    let fromCurrency = document.getElementById('from').value;
    let toCurrency = document.getElementById('to').value;
    let amount = document.getElementById('amount').value;
    let result = document.getElementById('result');

    fromCurrency = encodeURIComponent(fromCurrency);
    toCurrency = encodeURIComponent(toCurrency);
    const query = fromCurrency + '_' + toCurrency;

    const url = 'https://free.currencyconverterapi.com/api/v5/convert?q='
              + query + '&compact=ultra';

    fetch(url).then((res) => {
              res.json().then((jsondata) => {
              console.log(jsondata)
              let val = jsondata[query];

              if (val != undefined) {
                  let total = parseFloat(val) * parseFloat(amount);
                  result.innerHTML = total;
              } else {
                  var err = new Error("Value not found for " + query);
                  console.log(err);
              }

          })
        });
      }
