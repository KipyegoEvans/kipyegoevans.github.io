
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

const currConv = (url)=>{
  return fetch(url).then(res=>{
    return res.json();  
  })
}

const dbPromise = idb.open('currency-store', 2, upgradeDB => {
  // Note: we don't use 'break' in this switch statement,
  // the fall-through behaviour is what we want.
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('currency-list');
    case 1:
      upgradeDB.createObjectStore('my-conversions');
  }
});

//get currency list for user to select
const currencylist = () =>{

  
  let from = document.getElementById('from');
  let to = document.getElementById('to');


//fetch from database or from net if its a very first time
  let data = dbPromise.then(db =>{
    return db.transaction('currency-list').objectStore('currency-list').getAll()
    }).then(list =>{
      return list
  }) || fetchCurr();

    data.then(data=>{

      dbPromise.then(db =>{
        db.transaction('currency-list').objectStore('currency-list', 'readwrite').put(data);
        return tx.complete();
      })

      for(key in data.results) {
        option = `<option> ${key} </option>`;
        to.innerHTML += option;
        from.innerHTML += option;
      }
    })
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


    currConv(url).then((jsondata) => {
              let val = jsondata[query];
              var item = {
                name: `'${query}'`,
                rate: val
              }

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
      }