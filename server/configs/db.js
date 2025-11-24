import mongoose from 'mongoose';

const connectDB = async () =>{
    try {
        mongoose.connection.on('connected', ()=> console.log('Database connected'));
        const uri = process.env.MONGODB_URI;
        if(!uri){
            console.log('MONGODB_URI not set in environment - skipping DB connection');
            return;
        }

        // Use the provided connection string as-is. If you want to append a DB name,
        // set it in the URI or provide MONGODB_DB env var.
        await mongoose.connect(uri)
    } catch (error) {
        console.log(error.message);
    }
}

export default connectDB;