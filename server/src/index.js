const http=require('http')
const mongoose=require('mongoose')
const {app}=require('./app')
const server=http.createServer(app);

const PORT=process.env.PORT || 8080;

const MONGO_URl='mongodb+srv://jhapiyush2305:Tcnn2AnVkWFTCylh@cluster0.2pknp2v.mongodb.net/nasa?retryWrites=true&w=majority';

const {loadPlanetsData}=require('./models/planets.model');
const {loadLaunchesData}=require('./models/launches.model');

mongoose.connection.once('open',()=>{
    console.log("MongoDb connected");
});

mongoose.connection.on('error',(err)=>{
    console.error(err);
})

async function startServer(){

    await mongoose.connect(MONGO_URl,{
        // useFindAndModify: false,
        // useCreateIndex: true,    //From mongoose v6 these values are by default..
        useNewUrlParser: true,
        useUnifiedTopology: true,

    })

    await loadPlanetsData();

    await loadLaunchesData();
 


    //load data before server starts to listen....
    server.listen(PORT,()=>{
        console.log(`Server running on ${PORT}`);
    })
}

startServer();


