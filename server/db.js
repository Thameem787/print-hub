import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set in .env');
  process.exit(1);
}

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅  MongoDB Atlas connected');
  } catch (err) {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

// ─── User Model ───────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['customer', 'vendor', 'admin'], default: 'customer' },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);

// ─── Vendor Model ─────────────────────────────────────────────────────────────

const vendorSchema = new mongoose.Schema({
  user_id:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  shop_name:      { type: String, required: true },
  description:    { type: String, default: '' },
  address:        { type: String, required: true },
  city:           { type: String, required: true },
  latitude:       { type: Number, default: null },
  longitude:      { type: Number, default: null },
  materials:      { type: [String], default: [] },
  colors:         { type: [String], default: [] },
  price_per_gram: { type: Number, required: true, default: 0.5 },
  is_available:   { type: Boolean, default: true },
}, { timestamps: true });

export const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);

// ─── Order Model ──────────────────────────────────────────────────────────────

const orderSchema = new mongoose.Schema({
  customer_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor_id:       { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', default: null },
  file_name:       { type: String, required: true },
  file_size_mb:    { type: Number, default: 0 },
  material:        { type: String, default: 'PLA' },
  color:           { type: String, default: 'White' },
  quantity:        { type: Number, default: 1 },
  estimated_grams: { type: Number, default: 50 },
  delivery_type:   { type: String, enum: ['pickup', 'delivery'], default: 'pickup' },
  delivery_address:{ type: String, default: '' },
  material_cost:   { type: Number, default: 0 },
  print_cost:      { type: Number, default: 0 },
  delivery_cost:   { type: Number, default: 0 },
  total_cost:      { type: Number, default: 0 },
  status:          { type: String, enum: ['pending','accepted','printing','ready','delivered','cancelled'], default: 'pending' },
  notes:           { type: String, default: '' },
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
