import { VendorTokenModel } from "../routers/models/token";
import { userKeyModel } from "../routers/models/userKeysModel";
import { DB } from "./db_connection";
const db = new DB();

export default {
    async getEntity(token: any) {
        try {
            const vendorRepo = await db.getRepo(VendorTokenModel);
            const getVendorData = await vendorRepo.findOneBy({ vendorToken: token });

            return getVendorData;
        } catch (error) {
            console.log("Error", error);
        }
    },

    async saveVendorData(vendor: any) {
        try {
            const vendorRepo = await db.getRepo(VendorTokenModel);
            const saveVendorData = await vendorRepo.save(vendor);

            return saveVendorData;
        } catch (error) {
            console.log("Error", error);
        }
    },

    async updateVendor(vendor: any) {
        try {
            const vendorRepo = await db.getRepo(VendorTokenModel);

            return await vendorRepo.save(vendor);

        } catch (error) {
            console.log("Error", error);
        }
    },

    async findVendorById(id: any) {
        try {
            const vendorRepo = await db.getRepo(VendorTokenModel);
            const vendorIdFound = await vendorRepo.findOneBy(id);

            return vendorIdFound;
        } catch (error) {
            console.log("Error", error);
        }
    },

    // users key model

    async saveusersKeys(userKeys: any) {
        try {
            const vendorRepo = await db.getRepo(userKeyModel);
            const saveUserKeysData = await vendorRepo.save(userKeys);

            return saveUserKeysData;
        } catch (error) {
            console.log("Error", error);
        }
    },

    async findConsumerKey(Key: any) {
        try {
            const vendorRepo = await db.getRepo(userKeyModel);
            const findConsumerId = await vendorRepo.findOneBy({ consumerKey: Key });

            return findConsumerId;
        } catch (error) {
            console.log("Error", error);
        }
    },

    async updateUserKeys(Keys: any) {
        try {
            const vendorRepo = await db.getRepo(userKeyModel);
            const updateUserKeys = await vendorRepo.save(Keys);

            return updateUserKeys;
        } catch (error) {
            console.log("Error", error);
        }
    },

    // async getSavedKeys() {
    //     try {
    //         const vendorRepo = await db.getRepo(userKeyModel);
    //         const getSavedKeys = await vendorRepo.find();

    //         return getSavedKeys;
    //     } catch (error) {
    //         console.log("Error", error);
    //     }
    // }
}