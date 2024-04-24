const express = require("express");
const bodyParser = require("body-parser");
const eventRepo = require("./repositories/repository.event");
const dotenv = require("dotenv").config();

const port = 9422;
const app = express();
app.use(bodyParser.json());

app.post('/events', eventRepo.addEvent);
app.get('/events', eventRepo.getAllEvents);
app.put('/events/:id', eventRepo.updateEvent);
app.delete('/events/:id', eventRepo.deleteEvent);
app.post('/events/bulk', eventRepo.addRecord);
app.get('/events/country', eventRepo.addCountry);
app.get('/events/paginate', eventRepo.paginate);


app.listen(port, () => {
    console.log("Server is running and listening on port", port);
});