import cryptoJs from "crypto-js";

export default {
    createSignature: async (message: any, secret: any) => {

        const signature = cryptoJs.HmacSHA1(JSON.stringify(message), secret).toString();

        return signature;
    }
};