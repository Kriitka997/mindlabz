import app from "./config/express";
import env from "./config/env";


const PORT = env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`server is running on port no ${PORT}`);
});



