import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const connection = async () => {

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
      
    });
    console.log('🎉🎉Conectado correctamente a la DB de VortexVanguard🎉🎉');
  } catch (error) {
    console.error('Error de conexión a la base de datos!: ❌❌', error.message);
    process.exit(1);
  }
};
export default connection;