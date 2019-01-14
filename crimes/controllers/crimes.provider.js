const CrimesModel = require('../models/crimes.model');
const crypto = require('crypto');

exports.insert = (req, res) => {
    CrimesModel.createCrimes(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        }).catch(function (error) {
            console.error(error)
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
            console.error(error)
          });
};

exports.getById = (req, res) => {
    CrimesModel.findById(req.params.crimeId)
        .then((result) => {
            res.status(200).send(result);
        }).catch(function (error) {
            console.error(error)
          });
};

exports.putById = (req, res) => {
            CrimesModel.putCrimes(req.params.crimeId, req.body)
            .then((result)=>{
            req.status(204).send({});
        }).catch(function (error) {
            console.error(error)
          });  
};

exports.patchById = (req, res) => {
    CrimesModel.patchCrimes(req.params.crimeId, req.body).then((result) => {
        res.status(204).send(result);
    }).catch(function (error) {
        console.error(error)
      });
};

exports.removeById = (req, res) => {
            CrimesModel.removeById(req.params.crimeId)
            .then((result)=>{
            res.status(204).send({});
        }).catch(function (error) {
            console.error(error)
          });
   
};