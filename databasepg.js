const {Client} = require('pg')

const client = new Client({
    host:"localhost",
    user: "postgres",
    port: 5432,
    password: "aayush",
    database:"testDB",
});
client.connect();

const query = `
CREATE TABLE blogs
(
   id SERIAL UNIQUE, 
   blog VARCHAR(90),
   body VARCHAR(200)
);
`;


client.query(query, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Datatable setup done');
    client.end();
});