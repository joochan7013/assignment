const meal =
{
    fakeDB:[],

    init()
    {

        this.fakeDB.push({
            image:'/img/vegan.jpg',
            title:'Vegan',price:'From $200',
            category:'Meal',
            noofmeals: 4,
            synopsis: 'Package Contains Tofu,Veggie Beef & Chicken',
            best: true
        });
        this.fakeDB.push({
            image:'/img/meal2.jpg',
            title:'Vegan Soup Cleanse',
            price:'From $150',
            category:'Soup',
            noofmeals: 5,
            synopsis:'Package Contains Vegan Diet Based Meal with soup',
            best: true
        });
        this.fakeDB.push({
            image:'/img/keto.jpg',
            title:'Keto Soup Cleanse',
            price:'From $150',
            category:'Soup',
            noofmeals: 5,
            synopsis: 'Package Contains Keto Diet Based Meal with soup',
            best: true
        });
        this.fakeDB.push({
            image:'/img/pre.jpg',
            title:'Prebiotic Soup Cleanse',
            price:'From $125',
            category:'Soup',
            noofmeals: 5,
            synopsis:'Package Contains Protein Diet Based Meal with soup',
            best: true
        });
       
    },

    getAllMeals()
    {
        return this.fakeDB;
    },
    getTopMeals()
    {
        return this.fakeDB.best;
    }

}

meal.init();
module.exports=meal;