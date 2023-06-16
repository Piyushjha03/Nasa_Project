const {getAllLauches,addNewLaunch,existLaunchWithId, abortLaunchById}= require('../../models/launches.model')

function httpGetAllLauches (req,res){

    return res.status(200).json(getAllLauches())
}
function httpAddNewLaunch (req,res){
    const launch=req.body;

    if (!launch.mission || !launch. rocket || !launch.launchDate
        || !launch.target) {
        return res.status(400).json ( {
        error: 'Missing required launch property',
        })
        }

launch.launchDate = new Date(launch.launchDate);

    if(isNaN(launch.launchDate)){
        return res.status(400).json ( {
            error: 'Invalid Date format',
            })
    }

    addNewLaunch(launch);

    return res.status(201).json(launch);
}

function httpAbortLaunch(req,res){
    const launchId=+req.params.id;//+ coverts string to number...

    if(!existLaunchWithId(launchId)){

        return res.status(404).json(
            {
                error:"Id not found!"
            }
        )
    }
    
    const aborted=abortLaunchById(launchId);

    return res.status(200).json(aborted);

}

module.exports={
    httpGetAllLauches,
    httpAddNewLaunch,
    httpAbortLaunch
}