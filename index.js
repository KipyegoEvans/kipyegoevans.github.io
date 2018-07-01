
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
  return fetch(url).then(res=>{
    return res.json();
  })

}


//get currency list for user to select
const currencylist = () =>{

  
  let from = document.getElementById('from');
  let to = document.getElementById('to');

    fetchCurr().then(data=>{

      for(key in data.results) {
        option = `<option> ${key} </option>`;
        to.innerHTML += option;
        from.innerHTML += option;
      }
    })
  }

      
if ('indexedDB' in window) {
      let request = indexedDB.open('myConversions', 1);

      request.onupgradeneeded = ()=>{
          let db = request.result;
          let store = db.createObjectStore('currency',{autoIncreament: true});

          };

      request.onsuccess = ()=>{
          db = request.result;
    };

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
              let val = jsondata[query];
              var item = {
                name: query,
                rate: val
              }
              db.transaction('currency','readwrite').objectStore('currency').add(item);

              if (val != undefined) {
                  let total = parseFloat(val) * parseFloat(amount);
                  if (total !== NaN) {
                    result.value = total;
                  }
                  
              } else {
                  var err = new Error("Value not found for " + query);
                  console.log(err);
              }

          })
        });
      }