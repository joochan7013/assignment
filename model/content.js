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