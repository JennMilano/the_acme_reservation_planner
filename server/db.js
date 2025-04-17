const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_reservation_planner_db');
const uuid = require('uuid');
require('dotenv');

const createTables = async()=> {
    const SQL = `
        DROP TABLE IF EXISTS reservations;
        DROP TABLE IF EXISTS customers;
        DROP TABLE IF EXISTS restaurants;
        CREATE TABLE customers(
            id UUID PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE
        );
        CREATE TABLE restaurants(
            id UUID PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE
        );
        CREATE TABLE reservations(
            id UUID PRIMARY KEY,
            date DATE NOT NULL,
            party_count INT NOT NULL,
            customer_id UUID REFERENCES customers(id) NOT NULL,
            restaurant_id UUID REFERENCES restaurants(id) NOT NULL
        );
    `;
    
    await client.query(SQL);
};

async function createCustomer(name) {
  const SQL = `INSERT INTO customers(id, name) VALUES($1, $2) RETURNING *`;
  const dbResponse = await client.query(SQL, [uuid.v4(), name]);
  return dbResponse.rows[0];
}

async function fetchCustomers() {
  const SQL = `SELECT * FROM customers;`;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
}

async function createRestaurant(name) {
  const SQL = `INSERT INTO restaurants(id, name) VALUES($1, $2) RETURNING *`;
  const dbResponse = await client.query(SQL, [uuid.v4(), name]);
  return dbResponse.rows[0];
}

async function fetchRestaurants() {
  const SQL = `SELECT * FROM restaurants;`;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
}

async function createReservation({ date, party_count, customer_id, restaurant_id }) {
  console.log("inside create res function");
  const SQL = `INSERT INTO reservations(id, date, party_count, customer_id, restaurant_id) 
               VALUES($1, $2, $3, $4, $5) RETURNING *`;
  const dbResponse = await client.query(SQL, [
      uuid.v4(),
      date,
      party_count,
      customer_id,
      restaurant_id
  ]);
  console.log("db response", dbResponse);
  return dbResponse.rows[0];
}

async function fetchReservations() {
  const SQL = `SELECT * FROM reservations;`;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
}

async function destroyReservation(id, customer_id) {
  const SQL = `DELETE FROM reservations WHERE id=$1 AND customer_id=$2`;
  await client.query(SQL, [id, customer_id]);
}

module.exports = {
  client,
  createTables,
  createCustomer,
  fetchCustomers,
  createRestaurant,
  fetchRestaurants,
  createReservation,
  fetchReservations,
  destroyReservation,
};