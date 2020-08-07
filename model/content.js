const mongoose = require("mongoose");
mongoose
    .connect(process.env.MONGO_DB_URL, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    
const Schema = mongoose.Schema;

const contentSchema = new Schema({

    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
})

const contentModel = mongoose.model("Content", contentSchema);
module.exports = contentModel;

const content=
{
    fakeDB:[],

    init()
    {

        this.fakeDB.push({image: '/img/Pick_1.gif',title:'Pick', description: 'Choose from diverse menus'});
        
        this.fakeDB.push({image: '/img/heat.gif',title:'Heat', description: 'Cooked and Delivered'});

        this.fakeDB.push({image: '/img/eat_1_1.gif',title:'Eat', description: 'Healty Food'});
        
        this.fakeDB.push({image: '/img/repeat---Copy.gif',title:'Repeat', description: 'Repeat Process'});

    },

    getAllContent()
    {
        return this.fakeDB;
    },

}

content.init();
module.exports=content; 