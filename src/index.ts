import {app} from './app'
import {SETTINGS} from './settings'
import dotenv from 'dotenv'
import {runDB} from "./db/db";
dotenv.config()

const startApp = async () => {
    await runDB(SETTINGS.MONGO_URL)
    app.listen(SETTINGS.PORT, () => {
        console.log(`Server started on port: ${SETTINGS.PORT}`)
    })
}
startApp().catch((err) => {
    console.error("Failed to start the application:", err);
});


