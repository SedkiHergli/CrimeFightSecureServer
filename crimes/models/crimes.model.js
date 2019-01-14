const mongoose = require('mongoose');
const config = require('../../env.config');
mongoose.connect(config.server_url,{useCreateIndex: true,useNewUrlParser: true,useFindAndModify:false});
const Schema = mongoose.Schema;

const crimeSchema = new Schema({
    caseNumber:  {
        type: String,
        default:""
    },
    date:  {
        type: String,
        default:""
    },
    type:  {
        type: String,
        default:""
    },
    lat:  {
        type: String,
        default:""
    },
    lng:  {
        type: String,
        default:""
    },
    arrest:  {
        type: Boolean,
        default:false
    },
    description:  {
        type: String,
        default:""
    },
    locationDescription:  {
        type: String,
        default:""
    }
}, {
    timestamps: true
});

crimeSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
crimeSchema.set('toJSON', {
    virtuals: true
});

crimeSchema.findById = function (cb) {
    return this.model('Users').find({id: this.id}, cb);
};

const Crimes = mongoose.model('Crimes', crimeSchema);

exports.findById = (id) => {
    return Crimes.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createCrimes = (userData) => {
    const user = new Crimes(userData);
    return user.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Crimes.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.putCrimes = (id,CrimesData) => {
    return new Promise((resolve, reject) => {
        Crimes.findByIdAndUpdate(id,{ $set:CrimesData}, function (err, user) {
            if (err) reject(err);
            resolve(user);
        });
    });
};

exports.patchCrimes = (id, userData) => {
    return new Promise((resolve, reject) => {
        Crimes.findOneAndUpdate({ _id: id },{ $set:userData}, function (err, user) {
            if (err) reject(err);
            resolve(user);
            
        });
    });
};

exports.removeById = (id) => {
    return new Promise((resolve, reject) => {
        Crimes.findByIdAndDelete(id, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
});
};

