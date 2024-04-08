const express = require ('express');
const router = express.Router()
const usercontroler = require ('../controler/control.js')

router.post('/post',usercontroler.create)
router.post('/login',usercontroler.login)
router.post('/logout',usercontroler.logout)


module.exports = router