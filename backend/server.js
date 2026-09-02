const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const multer = require('multer');
const fs = require('fs');
const bcrypt = require('bcrypt');
// const { use } = require('react');

require('dotenv').config();

const app = express();
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({storage: storage});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const client = new MongoClient(process.env.MONGO_URI);

async function startServer() {

    try {

        await client.connect();

        console.log('MongoDB connected successfully');
        const db = client.db('ImageGalleryApp');
        const imagesCollection = db.collection('images');
        const usersCollection = db.collection('users');

        app.get('/api/dashboard', async(req,res) => {
            try{
                const totalImages = imagesCollection.countDocuments();
                res.json({
                    totalImages: totalImages
                });
            } catch(error){
                console.log(error)
                res.status(500).json({
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
                const { email, password } = req.body;
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
                res.json({
                    message: 'Login Successful',
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

        app.post('/api/images', upload.single('image'), async (req, res) => {

    try {

        console.log(req.file);
        console.log(req.body);

        const image = {
            title: req.body.title,
            author: req.body.author,
            uploadcategory: req.body.uploadcategory,
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

    app.put('/api/images/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { title, author, uploadcategory } = req.body;
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