const http=require('http')

const {app}=require('./app')

const server=http.createServer(app);

const PORT=process.env.PORT || 8080;

const {loadPlanetsData , planets}=require('./models/planets.model');


async function startServer(){
    await loadPlanetsData();//load data before server starts to listen....
    server.listen(PORT,()=>{
        console.log(`Server running on ${PORT}`);
    })
}

startServer();

