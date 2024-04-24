const { Pool } = require("pg");
const dotenv = require("dotenv").config();

const pool = new Pool ({
    user: process.env.DBUser,
    password: process.env.DBPassword,
    host: process.env.DBHost,
    database: process.env.DBName,

    ssl: {
        require: true,
    },
});

pool.connect().then(() => {
    console.log("Connected to PostgreSQL database");
});

async function addEvent(req, res) {
    const { title, description, year, period, month, day, country, city } = req.body;

    try {
    const result = await pool.query(
        'INSERT INTO historical_events (title, description, year, period, month, day, country, city) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [title, description, year, period, month, day, country, city]
    );
    const newEvent = result.rows[0];
    res.status(201).json(newEvent);
    } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    }
}


async function getAllEvents(req, res) {
    try {
      const result = await pool.query('SELECT * FROM historical_events');
    res.status(200).json(result.rows);
    } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    }
}

async function updateEvent(req, res) {
    const { id } = req.params;
    const { title, description, year, period, month, day, country, city } = req.body;
    
    try {
    const result = await pool.query(
        'UPDATE historical_events SET title = $1, description = $2, year = $3, period = $4, month = $5, day = $6, country = $7, city = $8 WHERE id = $9 RETURNING *',
        [title, description, year, period, month, day, country, city, id]
    );
    if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
    } else {
        res.status(404).json({ message: "Event not found" });
    }
    } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    }
}

async function deleteEvent(req, res) {
    const { id } = req.params;
    
    try {
      const result = await pool.query('DELETE FROM historical_events WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount > 0) {
        res.status(200).json({ message: "Event deleted", eventId: id });
    } else {
        res.status(404).json({ message: "Event not found" });
    }
    } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    }
}

async function addRecord(req, res){
    const { title, description, year, period, month, day, country, city } = req.body;
    try {
        let check = title.length + description.length + year.length + period.length + month.length + day.length + country.length + city.length;
        if(check % 8 == 0){
            for(let x = 0; x < title.length; x++){
                await pool.query(
                    'INSERT INTO historical_events (title, description, year, period, month, day, country, city) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                    [title[x], description[x], year[x], period[x], month[x], day[x], country[x], city[x]]);
            }
        }else{
            res.status(500).json({ error: "Not Enough Variable"});
        }
        res.status(201).json(req.body);
        } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        }
}

async function addCountry(req, res){
    const{country} = req.body;
    try{
        const result = await pool.query(
            'SELECT * FROM historical_events WHERE country = $1', [country]
        );
        const newEvent = result;
        res.status(200).json(newEvent);
    }catch(error){
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function paginate(req, res){
    const{page, pageSize} = req.body;
    try{
        let counterPage = page * pageSize;
        const result = await pool.query(
            'SELECT * FROM historical_events OFFSET $1 LIMIT $2',
            [counterPage, pageSize]
        );
        const newEvent = result;
        res.status(200).json(newEvent); 
    }catch (error){
        res.status(500).json({ error: "Internal Server Error" });  
    }
}
module.exports = {
    addEvent,
    getAllEvents,
    updateEvent,
    deleteEvent,
    addRecord,
    addCountry,
    paginate
};