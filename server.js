const db = require('./db/connection');
const { startSearch } = require('./db/queries');
// const inquirer = require('inquirer');
// npm install console.table --save
// const cTable = require('console.table');
// npm install figlet for styling intro copy
var figlet = require('figlet');

figlet.text('Employee Tracker!', {
  font: 'Slant',
  horizontalLayout: 'default',
  verticalLayout: 'default',
  width: 100,
  whitespaceBreak: true
}, function(err, data) {
  if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
  }
  console.log(data);
  console.log("\n");
  startSearch();
});

