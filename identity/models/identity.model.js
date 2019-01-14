const mongoose = require('mongoose');
const config = require('../../env.config');
mongoose.connect(config.server_url,{useCreateIndex: true,useNewUrlParser: true});
const Schema = mongoose.Schema;

var crimeSchema = new Schema({
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
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
}, {
    timestamps: true
});


const identiySchema = new Schema({
    fullName: {type:String,required:true},
    email: {type:String,required:true,unique:true},
    password: {type:String,required:true},
    phone:{type:String,required:true},
    sexe:{type:String,required:true},
    stype:{type:String,default:"User"},
    crimeReports:[crimeSchema],
    permissionLevel: {type:Number,required:true}
    },
    {timestamps: true
});

identiySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
identiySchema.set('toJSON', {
    virtuals: true
});

identiySchema.findById = function (cb) {
    return this.model('Users').find({id: this.id}, cb);
};

const Identity = mongoose.model('Users', identiySchema);


exports.findByEmail = (email) => {
    return Identity.find({email: email});
};

exports.findById = (id) => {
    return Identity.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createIdentity = (userData) => {
    const user = new Identity(userData);
    return user.save();
};

exports.createIdentityc = (userData,user) => {
    var d = {date:"",type:"",lat:"",lng:"",arrest:"",description:"",locationDescription:""};
    d["author"]=user._id;
    user.crimeReports=[d];
    return user.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Identity.find()
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

exports.putIdentity = (email,identityData) => {
    return new Promise((resolve, reject) => {
        Identity.findOneAndUpdate({email: email},{ $set:userData}, function (err, user) {
            if (err) reject(err);
            resolve(user);
        });
    });
};

exports.patchIdentity = (email, userData) => {
    return new Promise((resolve, reject) => {
        Identity.findOneAndUpdate({email: email},{ $set:userData}, function (err, user) {
            if (err) reject(err);
            resolve(user);
            
        });
    });
};

exports.patchIdentityc = (user, userData) => {
    if(!userData.validation){
        userData.data["author"]=user[0]._id;
        var d = [];
        user[0]["crimeReports"].push(userData.data);
    }
    else{
        var d = {date:"",type:"",lat:"",lng:"",arrest:false,description:"",locationDescription:""};
        d["author"]=user._id;
        user[0]["crimeReports"]=[d];
}
    return user[0].save();
};

exports.removeById = (email) => {
    return new Promise((resolve, reject) => {
        Identity.deleteOne({email: email}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
});
};

