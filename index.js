const { readFileSync, write } = require('fs');
const http = require('http');
const { url } = require('inspector');
const URL = require('url').URL;


// top level code to read & parse.
const cardTemplate = readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const overviewTemplate = readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const productTemplate = readFileSync(`${__dirname}/templates/product.html`, 'utf-8'); 
const data = readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const json00 = JSON.parse(data);


let replaceHtmlPlaceholders = function(template, jsonObj) {
   let html = template.replace(/{%strTitle}/g, jsonObj.productName);
   html = html.replace(/{%imgItem}/g, jsonObj.image);
   html = html.replace(/{%strVitamin}/g, jsonObj.nutrients);
   html = html.replace(/{%intPrice}/g, jsonObj.price);
   html = html.replace(/{%strDescription}/g, jsonObj.description);
   html = html.replace(/{%intQuantity}/g, jsonObj.quantity);
   html = html.replace(/{%intId}/g, jsonObj.id);
   html = html.replace(/{%strLocation}/g, jsonObj.from);
    
   // check if json boolean prop is false? replace & display span text. 
   if(!jsonObj.exclusive) {
      html = html.replace(/{%is_exclusive}/g, 'not-exclusive'); 
   }

   return html; 
};


// set-up server & url routing.
const server = http.createServer((request, response) => {
   let baseUrl = `http://${request.headers.host}/`; // <= retrieve hosts.
   let {pathname, searchParams} = new URL(request.url, baseUrl); // <= parse URL's

   if(pathname === '/' || pathname === '/overview.html') { // <= home page
      response.writeHead(200, {"Content-type": "text/html"});
      const cards = json00.map((element,index,array) => {
           return replaceHtmlPlaceholders(cardTemplate, element);
        }).join(); 
      const html = overviewTemplate.replace(`{%objCards}`, cards);
      response.end(html);
   }

   if(pathname === '/product/') {
    response.writeHead(200, {"Content-type": "text/html"});
    let eachjson = json00[searchParams.get('id')]; 
    let content = replaceHtmlPlaceholders(productTemplate,eachjson);
    response.end(content);
   }
   
   if(pathname === '/card.html') {
      response.writeHead(200, {"Content-type": "application/json"});
      response.end(data);
   }
  }); 
// initialize the server.  
server.listen(8000, '127.0.0.1', () => {
  console.log(`listning to request on port 8000`);
   });














