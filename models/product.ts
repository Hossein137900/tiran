import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    categoryChildren: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    properties: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    videoes: [{
        type: String
    }],
    colors: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    thumbnails: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);
