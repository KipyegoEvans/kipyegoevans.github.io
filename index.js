// var https = require('https');

function convertCurrency(amount, fromCurrency, toCurrency, cb) {
  

  fromCurrency = encodeURIComponent(fromCurrency);
  toCurrency = encodeURIComponent(toCurrency);
  const query = fromCurrency + '_' + toCurrency;

  const url = 'https://free.currencyconverterapi.com/api/v5/convert?q='
            + query + '&compact=ultra';

  fetch(url)
        .then((res) => {
            res.json()
        }).then((jsondata) => {
            console.log(jsondata)
            let val = data[fromCurrency];

            if (val != undefined) {
                let total = parseFloat(val) * parseFloat(amount);
                cb(null , total);
            } else {
                var err = new Error("Value not found for " + query);
                cb(err);
            }

        })

//uncomment to test

convertCurrency(10, 'USD', 'PHP', (err, amount)=> {
  let p = document.getElementById('convert');
  p.innerHTML += amount + 'Yes';
})
