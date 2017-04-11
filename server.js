const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'))

app.get('/', (req, res) => {
	res.sendFile(path.resolve('./public/views/index.html'));
});

app.listen(3000, function () {
  console.log('Sierpinski is listening on port 3000!')
});