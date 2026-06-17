import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import qcRoutes from './routes/qcRoutes.js';
import artisanRoutes from './routes/artisanRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import clipRoutes from './routes/clipRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import rawMaterialRoutes from './routes/rawMaterialRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import hrRoutes from './routes/hrRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import workOrderRoutes from './routes/workOrderRoutes.js';
import productionRoutes from './routes/productionRoutes.js';
import bespokeDesignRoutes from './routes/bespokeDesignRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import settingRoutes from './routes/settingRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// **Important: Uploaded Videos Serve Karne ke liye**
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/raw-materials', rawMaterialRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/qc', qcRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/artisans', artisanRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/clips', clipRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/work-orders', workOrderRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/bespoke-designs', bespokeDesignRoutes);

// Basic Route for testing
app.get('/', (req, res) => {
  res.send('Shoe Manufacturing API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
