const {getAllLauches,addNewLaunch,existLaunchWithId, abortLaunchById}= require('../../models/launches.model')

async function httpGetAllLauches (req,res){

    return res.status(200).json(await getAllLauches())
}
async function httpAddNewLaunch (req,res){
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

   await addNewLaunch(launch);

    return res.status(201).json(launch);
}

async function httpAbortLaunch(req,res){
    const launchId=+req.params.id;//+ coverts string to number...

   const existLaunch=await existLaunchWithId(launchId)

    if(!existLaunch){

        return res.status(404).json(
            {
                error:"Id not found!"
            }
        )
    }
    
    const aborted=await abortLaunchById(launchId);

    if(!aborted){
        return res.status(400).json({
            error:"Something went Wrong..."
        });

    }

    return res.status(200).json({
        ok:true,
    });

}

module.exports={
    httpGetAllLauches,
    httpAddNewLaunch,
    httpAbortLaunch
}