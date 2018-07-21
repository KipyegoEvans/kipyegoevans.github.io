
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
 
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('currency-list', {'keyPath' : 'id'});
    case 1:
      upgradeDB.createObjectStore('my-conversions', {'keyPath' : 'name'});
  }
});

//get currency list for user to select
const currencylist = () =>{

  
  let from = document.getElementById('from');
  let to = document.getElementById('to');
  let currlist;

//fetch from database or from net if its a very first time

dbPromise.then(db =>{
      
      return db.transaction('currency-list','readwrite').objectStore('currency-list').getAll();

        }).then(list =>{
            if (list.length === 0) {
              fetchCurr().then(fetchList =>{
                currlist = Object.values(fetchList.results);
                dbPromise.then(db =>{

                    const tx = db.transaction('currency-list','readwrite');
                    tx.objectStore('currency-list').put(currlist);
                    return tx.complete;
                });
              });
            }
            else{
              currlist = list;
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
              let item = {
                name: `'${query}'`,
                rate: val
              }


              dbPromise.then(db =>{
                return db.transaction('my-conversions', 'readwrite')
                .objectStore('my-conversions').put(item);
              })


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