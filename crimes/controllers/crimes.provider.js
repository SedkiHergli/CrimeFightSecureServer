const CrimesModel = require('../models/crimes.model');
const crypto = require('crypto');
const fs = require('fs');
const moment = require('moment');
const mdq = require('mongo-date-query');
const json2csv = require('json2csv').parse;
const path = require('path')
const fields = ['_id', 'caseNumber', 'arrest', 'date', 'description', 'locationDescription', 'type', 'lat', 'lng', 'createdAt', 'updatedAt'];
// We need this to build our post string
var querystring = require('querystring');
var http = require('http');
//var fs = require('fs');
var request = require('request');


exports.insert = (req, res) => {
    CrimesModel.createCrimes(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        }).catch(function (error) {
            console.error(error);
          });    
};


exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    CrimesModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        }).catch(function (error) {
            console.error(error);
          });
};

exports.listcsv = (req, res) => {
    CrimesModel.listcsv()
        .then((result) => {
            let csv
      try {
        csv = json2csv(result, { fields });
      } catch (err) {
        return res.status(500).json({ err });
      }
      const dateTime = moment().format('YYYYMMDDhhmmss');
      const filePath = path.join(__dirname, "../..", "public", "exports", "tunisia_Crimes-2019" +".csv");
      fs.writeFile(filePath, csv, function (err) {
        if (err) {
          return res.json(err).status(500);
        }
        else {
          /*setTimeout(function () {
            fs.unlinkSync(filePath); // delete this file after 30 seconds
          }, 30000);*/
          return res.json("/exports/tunisia_Crimes-2019" + ".csv");
        }
      });
        }).catch(function (error) {
            res.status(500).json({ error });
          });
};

exports.getById = (req, res) => {
    CrimesModel.findById(req.params.crimeId)
        .then((result) => {
            res.status(200).send(result);
        }).catch(function (error) {
            console.error(error);
          });
};

exports.putById = (req, res) => {
            CrimesModel.putCrimes(req.params.crimeId, req.body)
            .then((result)=>{
            req.status(204).send({});
        }).catch(function (error) {
            console.error(error);
          });  
};

exports.patchById = (req, res) => {
    CrimesModel.patchCrimes(req.params.crimeId, req.body).then((result) => {
        res.status(204).send(result);
    }).catch(function (error) {
        res.status(404).send(error);
      });
};

exports.removeById = (req, res) => {
            CrimesModel.removeById(req.params.crimeId)
            .then((result)=>{
            res.status(204).send({});
        }).catch(function (error) {
            console.error(error);
          });
   
};


exports.pridict = (req, res) => {
    request.post(
        'http://localhost:5000/input',
        { json: req.body },
        function (error, response, resp) {
            if (!error && response.statusCode == 200) {
                if(resp["result"]=="invalid"){
                    res.send({"error":"No pridiction"});}
                else{
                    res.send(resp); 
                }       
            }
        }
    );
};