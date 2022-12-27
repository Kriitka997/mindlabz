import { VendorTokenModel } from "../routers/models/token";
import {userKeyModel} from "../routers/models/userKeysModel";
import { DataSource } from "typeorm";

export class DB {
    public appDataSource: any;
    constructor(){
        let dbConnection: any;
        const DB_NAME = "mindlabz";
        const DB_PORT = 3308;
        const DB_HOST = "localhost";
        const DB_USERNAME = "root";
        const DB_PASSWORD = "";
        dbConnection = new DataSource({
            type: 'mysql',
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB_NAME,
            entities: [VendorTokenModel, userKeyModel],
        })

        dbConnection.initialize()
            .then((client: any) => {
                console.log("Data Source has been initialized!")
                this.appDataSource = client;
            })
            .catch((err: any) => {
                console.error("Error during Data Source initialization", err)
            })
    }
    getRepo = async (model: any) => {
        return await this.appDataSource.getRepository(model); 
    };

} 