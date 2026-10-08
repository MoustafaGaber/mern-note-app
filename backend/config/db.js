import mongoose from "mongoose"

export const connectDB=async()=>{
   try {
    const conn=await mongoose.connect(process.env.MONGODBURI)
    console.log(`MongoDB connected : ${conn.connection.host}`)
   } catch (error) {
     console.log(error)
     process.exit(1)
   }
}