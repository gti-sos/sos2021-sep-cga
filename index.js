const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Automatically parses the requests body into a JSON
app.use(express.static('public')); // Exposes the folder public in the webapp

const realmadridAPI = require("./realmadridAPI/index.js");
app.use('/api/v1/realmadridAPI', realmadridAPI);

// ***** RUTAS APIS L07

// Carlos
app.get('/info/realmadridAPI', (req, res) => {
    res.send("<html><body><h3>realmadridAPI</h3> Estudia los datos del Real Madrid por cada temporada <br></br> <table> <tr><td><b>center &nbsp&nbsp&nbsp&nbsp</b></td> <td><b>year &nbsp&nbsp</b></td> <td><b>fixed-fees &nbsp&nbsp&nbsp&nbsp</b></td> <td><b>amounts-by-number-of-etc &nbsp&nbsp&nbsp&nbsp</b></td> <td><b>amounts-by-number-of-proffesors &nbsp&nbsp&nbsp&nbsp</b></td> <td><b>total &nbsp&nbsp&nbsp&nbsp</b></td></tr>    <tr><td>ETSII</td> <td>2018</td> <td>11.003,22</td> <td>38.717,17</td> <td>93.753,44</td> <td>143.474,00</td></tr>    <tr><td>ETSIA</td> <td>2018</td> <td>11.003,22</td> <td>30.500,00</td> <td>80.46,90</td> <td>120.500,20</td></tr>    <tr><td>FCOM</td> <td>2018</td> <td>11.003,22</td> <td>93.753,44</td> <td>50.700,59</td> <td>180.600,20</td></tr>    <tr><td>ETSI</td> <td>2018</td> <td>11.003,22</td> <td>70.600,45</td> <td>38.717,17</td> <td>143.474,00</td></tr>    <tr><td>FEFP</td> <td>2018</td> <td>11.003,22</td> <td>38.717,17</td> <td>40.090,00</td> <td>143.474,00</td></tr>    <tr><td>FPSYCHOLOGY</td> <td>2018</td> <td>11.003,22</td> <td>80.46,90</td> <td>60.800,43</td> <td>173.474,00</td></tr>    <tr><td>EPS</td> <td>2018</td> <td>11.003,22</td> <td>50.700,59</td> <td>63.435,01</td> <td>112.401,00</td></tr>    <tr><td>FBBAA</td> <td>2018</td> <td>11.003,22</td> <td>40.090,00</td> <td>30.500,00</td> <td>90.474,00</td></tr>    <tr><td>FMEDICINE</td> <td>2018</td> <td>11.003,22</td> <td>40.090,00</td> <td>70.600,45</td> <td>113.474,00</td></tr> </table></body></html>");
});

// ***** HTMLS DINÁMICOS L06

var server = app.listen(PORT, () =>{
    console.log(`Listening at http://127.0.0.1:${PORT}`);
});

module.exports = server;