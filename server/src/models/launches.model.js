const launches =new Map();

let latestFlightNumber=100;

const launch={
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket:  'Explorer IS1',
    launchDate:  new Date( 'December 27, 2030'),
    target: 'Kepler-442-b',
    customer: ['Z', 'NASA' ],
    upcoming: true, 
    success: true,
}

launches.set(launch.flightNumber,launch);

function existLaunchWithId(launchId) {
    return launches.has(launchId);
}

function getAllLauches(){
    return (Array.from(launches.values()));
}

function addNewLaunch(launch){
   latestFlightNumber+=1;
   launches.set(
    latestFlightNumber,
    Object.assign(launch,{
        success: true, 
        upcoming: true,
    customers: ['Zero to Mastery','NASA'],
    flightNumber: latestFlightNumber,
    })
    );

}

function abortLaunchById(launchId){
    const aborted = launches.get(launchId);
    aborted.success=false;
    aborted.upcoming=false;
    return aborted;
}

module.exports={
    launches,
    existLaunchWithId,
    getAllLauches,
    addNewLaunch,
    abortLaunchById
}