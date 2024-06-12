const express = require('express');
const parseCSV = require('./parse_csv');
const databaseConn = require('./databaseTasks');
require('dotenv').config();



const app = express();
const port = process.env.PORT || 3002;


app.get('/',(req,res)=>{
    res.send(`hello , navigate to csv-to-json : localhost:${port}/csv-to-json`)
});

app.get('/csv-to-json', async (req, res) => {
  try {
    const csvFilePath = process.env.CSV_FILE_PATH;
    
    
    const jsonData = await parseCSV(csvFilePath);
    // console.log(jsonData);
    

    ageDistribution = await databaseConn(jsonData)
    
    res.json(ageDistribution)
    console.log("parsing to json successful");
  } catch (err) {
    console.error(err);
    res.status(500).send('Error converting CSV to JSON');
  }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


