const mongoose = require("mongoose");
mongoose.set('strictQuery', false); // suppress deprecation warning

module.exports = async () => {
    try {
        const connectionParams = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        await mongoose.connect(
            "mongodb://localhost:27017/tasks",
            connectionParams
        );
        console.log("Connected to database.");
    } catch (error) {
        console.log("Could not connect to database.", error);
    }
};
