const express=require('express');

const launchesRouter=express.Router();
const {httpGetAllLauches,httpAddNewLaunch,httpAbortLaunch}=require('./launches.controller')

launchesRouter.get('/',httpGetAllLauches);
launchesRouter.post('/',httpAddNewLaunch);
launchesRouter.delete('/:id',httpAbortLaunch);



module.exports={
    launchesRouter
}