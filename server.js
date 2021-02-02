const express = require('express');
const mongoose = require('mongoose')
const methodOverride = require("method-override");
const app = express();

app.use(express.json());
const articlesRouter = require('./routes/articles')
const Article = require('./models/article')

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true}))
app.use(methodOverride('_method'))

mongoose.connect("mongodb://localhost/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true,
});

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once ('open', () => console.log('database is connected ...'))

app.use("/articles", articlesRouter);

//main blog interface
app.get('/', async (req, res) =>{
    const articles = await Article.find().sort({createdAt: 'descending'})
    res.render('articles/index', {articles: articles})
})





const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}....`))