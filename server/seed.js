const {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    destroyReservation,
    fetchReservations,
} = require("./db");

const init = async () => {
    await client.connect();
    console.log("connected to database");

    createTables();
    console.log("tables created ");

    const [Joe, Mila, Jenn, Berenatos, CucinaMassi, HootchAndBanter, Charlies] = await Promise.all([
        createCustomer("Joe"),
        createCustomer("Mila"),
        createCustomer("Jenn"),
        createRestaurant("Berenatos"),
        createRestaurant("Cucina Massi"),
        createRestaurant("Hootch and Banter"),
        createRestaurant("Charlie's"),
    ]);
    console.log("customers and restaurants created");

    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());

    const [res1] = await Promise.all([
        createReservation({
            date: "04/17/2025",
            customer_id: Joe.id,
            restaurant_id: Berenatos.id,
            party_count: "4",
        }),
        createReservation({
            date: "05/08/2025",
            customer_id: Mila.id,
            restaurant_id: CucinaMassi.id,
            party_count: "5",
        }),
    ]);
    console.log("reservations created");

    console.log(await fetchReservations());

    await destroyReservation(res1.id, Jenn.id);
    console.log("deleted reservation");

    console.log(await fetchReservations());

    await client.end();
};

init();