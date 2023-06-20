const axios=require('axios')

const { error } = require('console');
const launchesDatabase=require('./launches.mongo')
const planets=require('./planets.mongo')


const DEFAULT_FLIGHT_NUMBER=100;
const SPACEX_URL='https://api.spacexdata.com/v4/launches/query';

const launch={
    flightNumber: 1000,
    mission: 'Kepler Exploration X',
    rocket:  'Explorer IS1',
    launchDate:  new Date( 'December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['Z', 'NASA' ],
    upcoming: true, 
    success: true,
}

saveLaunch(launch);

async function populateLaunches(){
    const response=  await axios.post(SPACEX_URL,{
        query:{},
        options:{
            pagination:false,
            populate:[
                {
                    path:'rocket',
                    select:{
                        'name':1
                    }
                },
                {
                    path:'payloads',
                    select:{
                        'customers':1
                    }
                }
                ]
        }
    })

    if(response.status !==200){
        throw new Error("Problem downloading data...")
    }

    const launchDocs = response.data.docs;
    
    for (const launchDoc of launchDocs) {
        const payloads=launchDoc['payloads'] 
        const customer=payloads.flatMap(payload=>{ 
            return payload['customers']
        })

    const launch = {
        flightNumber: launchDoc ['flight_number'],
        mission: launchDoc ['name'],
        rocket: launchDoc ['rocket'] ['name'],
        launchDate: launchDoc ['date_local'], 
        upcoming: launchDoc ['upcoming'], 
        success: launchDoc ['success'], 
        customer
    }
    saveLaunch(launch)

}
}

async function loadLaunchesData(){

    const firstLauch=await findLaunch({
        flightNumber:1,
        rocket: 'Falcon 1' ,
        mission: 'FalconSat'
    })

    if(firstLauch){
        console.log("LOG DATA ALREADY EXIST IN DB..");
    }
    else{
        await populateLaunches()
    }

    

}

async function findLaunch(filter){
    return await launchesDatabase.findOne(filter);
}

async function existLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber:launchId
    })
}

async function getLatestFlightNumber(){
    const latestLaunch= await launchesDatabase
    .findOne({})
    .sort('-flightNumber') //the - sign changes the order to highest->lowest

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber
}

async function getAllLauches(){
    return (await launchesDatabase.find({},{
        'id':0,
       '__v':0
    }));
}

async function saveLaunch(launch){

 

    await launchesDatabase.findOneAndUpdate({
        flightNumber:launch.flightNumber
    },
    launch,{
        upsert:true
    })
}

async function addNewLaunch(launch){

    const planet=await planets.findOne({
        keplerName:launch.target
    });

    if(!planet){
        throw new Error("Not a Valid Planet..")
    }

    const newFlightNumber=await getLatestFlightNumber() +1;

    const newLaunch= Object.assign(launch,
        {
            success: true, 
            upcoming: true,
            customers: ['Zero to Mastery','NASA'],
            flightNumber: newFlightNumber,
        })


       await saveLaunch(newLaunch);
}


async function abortLaunchById(launchId){


   const aborted= await launchesDatabase.updateOne({
        flightNumber:launchId,   
    },
    {
        upcoming:false,
        success:false,
    })

    return aborted.matchedCount===1 && aborted.acknowledged===true
}

module.exports={
    loadLaunchesData,
    existLaunchWithId,
    getAllLauches,
    addNewLaunch,
    abortLaunchById
}