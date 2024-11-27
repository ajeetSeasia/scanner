const express = require('express');
const { getSystemInfo, systemInstalledApps, globalInstallPackages,getOpenPorts } = require('../controllers/systemInfo');
const {main} = require('../controllers/systemController');

const router = express.Router()



//routes

router.get("/system/info", getSystemInfo);
router.get("/system/apps", systemInstalledApps);
router.get("/global/packages",globalInstallPackages );
router.get("/global/port",getOpenPorts );
router.post("/scan", main);

module.exports = router;