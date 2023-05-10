const express = require('express')
const path = require('path')

const {Client} = require('pg')

const client = new Client({
    host:"localhost",
    user: "postgres",
    port: 5432,
    password: "aayush",
    database:"testDB",
});

client.connect();

const app = express();
app.set('view engine', 'ejs');
app.listen(3000);

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use(express.urlencoded({extended:true}));

const getUsers = (req, res) => {
    client.query('SELECT * FROM blogs', (error, results) => {
      if (error) {
        throw error
      }
      res.render('index',{'array':results.rows});
      
    })
  };
  const getUpdatedUsers = (req, res) => {
    if (req.body.query == ""){
        res.redirect('/')
    } else{
        const QUERY = `SELECT * FROM blogs WHERE blog = '${req.body.query}' OR body = '${req.body.query}' OR blog LIKE '%${req.body.query}%' OR body LIKE '%${req.body.query}%'`;
        client.query(QUERY, (error, results) => {
        if (error) {
            throw error
        }
        res.render('search',{'array':results.rows, 'result':req.body.query});
      
    });
    }
    
  };

  const getDeletedUsers = (req, res) => {
    if (req.body.deleteID == ""){
        res.redirect('/')
    } else{
        const QUERY = `DELETE FROM blogs WHERE id = '${req.body.deleteID}'`;
        client.query(QUERY, (error, results) => {
        if (error) {
            throw error
        }
        res.redirect('/');
      
    });
    }
    
  };

const updateUsers = (req, res) => {
    if (req.body.updateID == ""){
        res.redirect('/')
    } else{
        const QUERY = `SELECT * FROM blogs WHERE id = '${req.body.updateID}'`;
        client.query(QUERY, (error, results) => {
        if (error) {
            throw error
        }
        res.render('update', {'blog':results.rows[0].blog, 'body':results.rows[0].body.toString(), 'id':results.rows[0].id});
      
    });
    }
    
  };

  const updateUsersConfirm = (req, res) => {
    if (req.body.updateID == ""){
        res.redirect('/')
    } else{
        const QUERY = `UPDATE blogs
        SET blog = '${req.body.title}'
        WHERE id = ${req.body.id}
        `;
        client.query(QUERY, (error, results) => {
        if (error) {
            throw error
        }
      
    });
    const QUERY1 = `UPDATE blogs
        SET body = '${req.body.body}'
        WHERE id = ${req.body.id}
        `;
        client.query(QUERY1, (error, results) => {
        if (error) {
            throw error
        }
      
    });
    res.redirect('/')
    }
    
  };

app.post('/update/confirm', updateUsersConfirm);

app.post('/update', updateUsers);

app.post('/delete', getDeletedUsers);

app.get('/', getUsers);

app.post('/search', getUpdatedUsers);

app.get('/blogs/create', (req,res)=>{
    res.render('create');
});

app.post('/blogs',  (req,res)=>{
    console.log(req.body);
    const query = `
INSERT INTO blogs (blog, body)
VALUES ('${req.body.title}', '${req.body.body}')
`;
client.query(query, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Data insert successful');
});
    res.redirect('/blogs/create');
});

app.use((req, res) => {
    res.status(404).render('404');
});