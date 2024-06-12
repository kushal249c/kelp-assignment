const { Client } = require('pg');


async function databaseConn(jsonData){;

    const client = new Client( // connecting to db 
    {
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT // Optional, default is 5432
    });
    
    
      try {
        await client.connect();
        console.log('Connected to PostgreSQL database!');
    
        await insertData(jsonData, client); // function to insert data to db
        
        let dist = await calculateAgeDistribution(client);
        return dist;
      } catch (error) {
        console.error('Connection error:', error);
      } 
      
    
    }
    
    async function insertData(jsonData, client) { // function to insert to db
      for (const data of jsonData) {
        const { name: { firstName, lastName }, age, address } = data;
        const fullName = `${lastName} ${firstName}`;
        const addressLine1 = address.line1.replace(/"/g, ''); 
        const addressLine2 = address.line2.replace(/"/g, ''); 
        const fullAddress = JSON.stringify({
          line1:addressLine1,
          line2:addressLine2,
          city:address.city,
          state:address.state
        })
        
        let obj = {...data}; //making json object for additional_info field in DB
        delete obj.name ;
        delete obj.age;
        delete obj.address;
    
      
        const query = `
          INSERT INTO public.users (name, age, address, additional_info)
          VALUES ($1, $2, $3, $4)
        `;
    
        const bindings = [fullName, age, fullAddress,obj];
    
        try {
          await client.query(query, bindings);
          
        } catch (err) {
          console.error(`Error inserting data: ${err}`);
        }
      }
    }
    
    
    
    
async function calculateAgeDistribution(client) { //function to calculate age distribution percentages
    const ageGroups = {
        "< 20": 0,
        "20 to 40": 0,
        "40 to 60": 0,
        "> 60": 0,
    };
    
    const query = 'SELECT age FROM public.users';
    const res = await client.query(query);
    
      for (const row of res.rows) {
        const age = parseInt(row.age, 10);
        if (age < 20) {
          ageGroups["< 20"]++;
        } else if (age >= 20 && age < 40) {
          ageGroups["20 to 40"]++;
        } else if (age >= 40 && age < 60) {
          ageGroups["40 to 60"]++;
        } else {
          ageGroups["> 60"]++;
        }
      }
    
    const totalUsers = res.rows.length;
    const distribution = {};
    
    for (const group in ageGroups) {
        const count = ageGroups[group];
        const percentage = (count / totalUsers * 100).toFixed(2);
        distribution[group]=`${percentage} %`;
        
      }
      console.log(distribution);
      return distribution
    };

module.exports = databaseConn;