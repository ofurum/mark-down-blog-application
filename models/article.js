const mongoose = require('mongoose');
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const {JSDOM} = require('jsdom')
const jsdomWindow = new JSDOM().window;
const DOMPurify = createDomPurify(jsdomWindow);

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,  
  },
  markdown: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  sanitizedHTML: {
    type: String,
    required: true,
  }

});

ArticleSchema.pre('validate', function(next){
  if(this.title){
     this.slug = slugify(this.title, {lower: true, strict: true})
  }

  if(this.markdown){
    this.sanitizedHTML = DOMPurify.sanitize(marked(this.markdown))
  }
  next()
})

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;