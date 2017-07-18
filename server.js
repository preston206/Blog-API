
// init project
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {BlogPosts} = require('./models');

// adding test blog
BlogPosts.create('testTitle', 'lorem ipsum lor em ipsum lorem ip sum', 'testAuthor', Date.now());

app.use(express.static('public'));

app.get('/blog-posts', (req, res) => {
    res.json(BlogPosts.get());
})

app.post('/blog-posts', jsonParser, (req, res) => {
  let requiredFields = ["title", "content", "author"];
  for (let i = 0; i < requiredFields.length; i++) {
    let field = requiredFields[i];
    if (!(field in req.body)) {
      let message = `${field} is missing from the request body.`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  
  let blog = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(blog);
})

app.put('/blog-posts/:id', jsonParser, (req, res) => {
  let requiredFields = ["title", "content", "author"];
  for (let i = 0; i < requiredFields.length; i++) {
    let field = requiredFields[i];
    if (!(field in req.body)) {
      let message = `${field} is missing from the request body.`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  
  console.log(`Updating blog post for \`${req.params.id}\``);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    author: req.body.author
  });
  res.status(204).end();
})

app.delete('/blog-posts/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`deleted ${req.params.id}`);
  res.status(204).end();
})



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
