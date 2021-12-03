/*
Author: Aden Molina
Date: 17 November 2021
Description: This is the script for the server which handles incoming requests through the various routes. 
*/

var express = require('express');
var myParser = require("body-parser");
var fs = require('fs');
var products_array = require('./products.json');

var app = express();

app.use(myParser.urlencoded({ extended: true }));





// monitor all requests
app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});


//From Assignment1_MVC_server, displays products
app.get("/store", function (request, response) {
    var contents = fs.readFileSync('./views/display_products.template', 'utf8');
    response.send(eval('`' + contents + '`')); // render template string

    function display_products() {
        str = '';

        for (i = 0; i < products_array.length; i++) {
            str += `
                <section class="item">
                    <h2>${products_array[i].brand}</h2>
                    <img src="${products_array[i].image}">
                    <h3>$${products_array[i].price}</h3>
                    <label id="quantity${i}_label"}">Quantity:</label>
                    <div class="box">
                    <input type="text" placeholder="0" name="quantity${i}" 
                    onkeyup="checkQuantityTextbox(this);">
                    </div>
                </section>
            `;
        }
        return str;
    } 
}); 


//From Assignment1_MVC_server, creates invoice
app.post("/process_invoice", function (request, response, next) {
    let POST = request.body;
    if(typeof POST['purchase_submit'] == 'undefined') {
        console.log('No purchase form data');
        next();
    } 

    console.log(Date.now() + ': Purchase made from ip ' + request.ip + ' data: ' + JSON.stringify(POST));

    var contents = fs.readFileSync('./views/invoice.template', 'utf8');
    response.send(eval('`' + contents + '`')); // render template string

    function display_invoice_table_rows() {
        subtotal = 0;
        str = '';
        for (i = 0; i < products_array.length; i++) {
            a_qty = 0;
            if(typeof POST[`quantity${i}`] != 'undefined') {
                a_qty = POST[`quantity${i}`];
            }
            if (a_qty > 0) {
                // product row
                extended_price =a_qty * products_array[i].price
                subtotal += extended_price;
                str += (`
      <tr>
        <td width="43%">${products_array[i].brand}</td>
        <td align="center" width="11%">${a_qty}</td>
        <td width="13%">\$${products_array[i].price}</td>
        <td width="54%">\$${extended_price}</td>
      </tr>
      `);
            }
        }
        // Compute tax
        tax_rate = 0.0575;
        tax = tax_rate * subtotal;

        // Compute shipping
        if (subtotal <= 50) {
            shipping = 2;
        }
        else if (subtotal <= 100) {
            shipping = 5;
        }
        else {
            shipping = 0.05 * subtotal; // 5% of subtotal
        }

        // Compute grand total
        total = subtotal + tax + shipping;
        
        return str;
    }

});




// route all other GET requests to files in public 
app.use(express.static('./public'));

// start server
app.listen(8080, () => console.log(`listening on port 8080`));


