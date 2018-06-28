
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


//get currency list for user to select
const currencylist = () =>{

  const url = 'https://free.currencyconverterapi.com/api/v5/currencies';
  let from = document.getElementById('from');
  let to = document.getElementById('to');

  fetch(url).then( (res) =>{
    res.json().then((data)=>{
      for(key in data.results) {
        
        option = `<option> ${key} </option>`;
        to.innerHTML += option;
        from.innerHTML += option;

      };

    });

  });

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
              let val = jsondata[fromCurrency];

              if (val != undefined) {
                  let total = parseFloat(val) * parseFloat(amount);
              } else {
                  var err = new Error("Value not found for " + query);
              }

          })
        }
      }
