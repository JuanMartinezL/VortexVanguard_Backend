import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    description: {
        type: String,
        trim: true
    },
    images: [String],
    category: {
        type: String,
        trim: true
    },
    stock: { 
        type: Number, 
        required: true, 
        default: 0 
    },
    seller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
