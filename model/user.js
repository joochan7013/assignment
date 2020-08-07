const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    lemail: {
        type: String,
        required: true,
        unique: true
    },
    lpassword: {
        type: String,
        required: true
    },
    type:
    {
        type: String,
        default: "user"
    },
    dateCreate: {
        type: Date,
        default: Date.now()
    }
});

const usermod = mongoose.model('user', userSchema);
module.exports = usermod;

module.exports.getUserByEmail = function(inEmail){
    return new Promise((resolve,reject)=>{
        
        usermod.find({email: inEmail}) //gets all and returns an array. Even if 1 or less entries
        .exec() //tells mongoose that we should run this find as a promise.
        .then((returnedUser)=>{
            if(returnedUser.length !=0 )
            //resolve(filteredMongoose(returnedStudents));
                resolve(returnedUser.map(item=>item.toObject()));
            else
                reject("No User found");
        }).catch((err)=>{
                console.log("Error Retriving User:"+err);
                reject(err);
        });
    });
}