const express = require('express');
const { getSystemInfo, systemInstalledApps, globalInstallPackages,getOpenPorts } = require('../controllers/systemInfo');
const {main} = require('../controllers/systemController');
const {userController} = require('../controllers/userController');

const router = express.Router()



//routes

router.get("/system/info", getSystemInfo);
router.get("/system/apps", systemInstalledApps);
router.get("/global/packages",globalInstallPackages );
router.get("/global/port",getOpenPorts );
router.post("/scan", main);
router.post("/adduser",userController.addUser);
router.get("/getuser",userController.getUser);
router.delete("/deleteuser/:id",userController.deleteUser);
router.put("/updateuser/:id",userController.updateUser);
router.get("/getusers",userController.getUsers);


module.exports = router;