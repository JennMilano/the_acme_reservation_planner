const express = require("express");
const morgan = require("morgan");

const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  destroyReservation
} = require('./db');

const server = express();
client.connect();

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`listening on port ${port}`));

server.use(morgan("dev"));
server.use(express.json());

server.get("/api/customers", async (req, res, next) => {
    try {
        const customers = await fetchCustomers();
        res.send(customers);
    } catch (error) {
        next(error);
    }
});

server.get("/api/restaurants", async (req, res, next) => {
    try {
        const restaurants = await fetchRestaurants();
        res.send(restaurants);
    } catch (error) {
        next(error);
    }
});

server.get("/api/reservations", async (req, res, next) => {
    try {
        const reservations = await fetchReservations();
        res.send(reservations);
    } catch (error) {
        next(error);
    }
});

server.post("/api/customers/:id/reservations", async (req, res, next) => {
    try {
        console.log("hit endpoint");
        const reservation = await createReservation({
            date: req.body.date,
            party_count: req.body.party_count,
            customer_id: req.params.id,
            restaurant_id: req.body.restaurant_id
        });
        console.log(reservation);
        res.status(201).send(reservation);
    } catch (error) {
        next(error);
    }
});

server.delete("/api/customers/:customer_id/reservations/:id", async (req, res, next) => {
    try {
        await destroyReservation(req.params.id, req.params.customer_id);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});


server.use((err, req, res) => {
    res.status(err.status || 500).send({ error: err.message || err });
});