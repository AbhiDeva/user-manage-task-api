import mongoose from "mongoose";

const dbConnection = async () => {
 

     try {
        mongoose.connection.on('connected', ()=> console.log('Database Connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/taskmanage`)
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
};

export default dbConnection;
