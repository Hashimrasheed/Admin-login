const { MongoStore } = require('connect-mongo');
const router = require('./routes/homerouters');
const adminrouter = require('./routes/admin');

const express    = require('express'),
      path       = require('path'),
      mongoose   = require('mongoose'),
      session    = require('express-session'),
      homeRouter = require('./routes/homerouters'),
      bodyParser = require('body-parser'),
      mongoStore = require('connect-mongo')(session),
      methodeoverride = require('method-override'),
      flash    = require('connect-flash'),
      adminrout   = require('./routes/admin');


const uri = 'mongodb://localhost/admin-db';
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connected");
})

const app = express();
const PORT = process.env.PORT || 9000;
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(flash());

app.set('view engine', 'ejs');
app.use(methodeoverride('_methode'));
app.set(express.static('public'));

app.use(session({
    name: 'sid',
    secret: 'secret',
    store: new mongoStore({mongooseConnection: mongoose.connection}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*60*24}

}));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

app.use('/', homeRouter);
app.use('/admin', adminrout);



app.listen(PORT, () => console.log(`server is running at ${PORT}`));