const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');  // MongoClient allows Node.js to connect to MongoDB. ObjectId is useful when working with MongoDB document IDs.
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./authMiddleware');

require('dotenv').config();  // This allows us to use variables from your .env file.

const app = express();  // This creates our Express application.
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({storage: storage});

app.use(cors());  // Allow requests from other origins.
app.use(express.json());  // This tells Express to understand JSON request bodies.
app.use('/uploads', express.static('uploads'));

const client = new MongoClient(process.env.MONGO_URI);  // This creates a MongoDB client using your connection string.

async function startServer() {

    try {

        await client.connect();

        console.log('MongoDB connected successfully');

        const db = client.db('ImageGalleryApp');
        const imagesCollection = db.collection('images');
        const usersCollection = db.collection('users');

        app.get('/api/dashboard', authMiddleware, async (req,res) => {
            try{
                const userId = req.userId;
                const images = await imagesCollection.find({userId: userId}).toArray();
                res.json({
                    totalImages: images.length,
                    images: images
                });
            } catch(error) {
                console.log(error)
                res.statusCode(500).json({
                    message: 'Failed to get dashboard data'
                })
            }
        })
        app.get('/api/images', async(req,res)=> {
            try{
                const images = await imagesCollection.find().toArray();

                res.json(images);
            } catch (error){
                console.log(error);
                res.status(500).json({
                    message: 'Failed to get images'
                });
            };
        });

        app.delete('/api/images/:id', async (req, res) => {
            try{
                const id = req.params.id;
                const image = await imagesCollection.findOne({
                    _id: new ObjectId(id)
                });
                if (!image) {
                    return res.status(404).json({
                        message: 'Image not found'
                    });
                }
                const result = await imagesCollection.deleteOne({
                    _id: new ObjectId(id)
                });
                const filepath = `.${image.imageUrl}`;
                if (fs.existsSync(filepath)) {
                    fs.unlinkSync(filepath)
                }
                res.json({
                    message: 'Image deleted successfully',
                    result: result
                });
            } catch(error) {
                console.log(error)
                res.status(500).json({
                    message: 'Failed to delete message'
                });
            }
        });

        app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Please provide name, email and password'
            });
        }

        const existingUser = await usersCollection.findOne({
            email: email
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            name: name,
            email: email,
            password: hashedPassword
        };

        const result = await usersCollection.insertOne(user);

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertedId
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: 'Failed to register user'
        });
    }
});


        app.post('/api/login', async (req, res) => {
            try{
                const { email, password } = req.body; // extracts info from frontend
                if(!email || !password) {
                    return res.status(400).json ({
                        message: 'Please Provide email and Password'
                    }); 
                }
                const user = await usersCollection.findOne({
                    email: email
                });
                if(!user){
                    return res.status(404).json({
                        message: 'User does not exist'
                    });
                }
                const passwordMatch = await bcrypt.compare(password, user.password);
                if(!passwordMatch) {
                    return res.status(404).json({
                        message: 'HAHA wrong Password'
                    });
                }
               const token  = jwt.sign(
                    {
                        userId: user._id.toString()
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '1h'
                    }
                );

                res.json({
                    message: 'Login Successful',
                    token: token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }

                });
            } catch (error){
                console.log(error);

                res.status(500).json({
                    message: 'Failed to login'
                });
            }
        });

        app.post('/api/images', authMiddleware ,upload.single('image'), async (req, res) => {

    try {

        console.log(req.file);
        console.log(req.body);

        const image = {
            title: req.body.title,
            author: req.body.author,
            uploadcategory: req.body.uploadcategory,
            userId: req.userId, 
            imageUrl: `/uploads/${req.file.filename}`,

        };

        const result = await imagesCollection.insertOne(image);

        res.json(result);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Failed to save image'
        });
    }
});

    app.put('/api/images/:id',authMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        const { title, author, uploadcategory } = req.body;

        const image = await imagesCollection.findOne({
            _id: new ObjectId(id)
        });

        if(!image){
            return res.status(401).json({
                message: 'Image not found'
            });
        }

        if(image.userId !== req.userId){
            return res.status(401).json({
                message: 'You are not allowed to edit this image'
            });
        }

        const result = await imagesCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    title: title,
                    author: author,
                    uploadcategory: uploadcategory
                }
            }
        );
        res.json({
            message: 'Image updated successfully',
            result: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to update image'
        });
    }
});

        app.listen(5000, () => {
            console.log('Server running on port 5000');
        });

    } catch (error) {

        console.log('MongoDB connection failed');
        console.log(error);

    }

}

startServer();