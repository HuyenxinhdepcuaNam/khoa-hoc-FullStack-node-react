import express from "express";
import homeController from '../controllers/homeController'
let router = express.Router()

let initWebRoutes = (app) => {

    router.get('/', homeController.getHomePage)
    // get('link', go to homeController and call getHomePage)

    router.get('/about', homeController.getAboutPage)
    return app.use('/', router)
}

module.exports = initWebRoutes

