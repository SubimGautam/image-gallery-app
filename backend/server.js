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

async function getImageLabels(filePath) {
    try {
        const imageBuffer = fs.readFileSync(filePath);

        const credentials = Buffer.from(
            `${process.env.IMAGGA_API_KEY}:${process.env.IMAGGA_API_SECRET}`
        ).toString('base64');

        const formdata = new FormData();
        const imageBlob = new Blob([imageBuffer]);
        formdata.append('image', imageBlob, 'image.jpg');

        const response = await fetch('https://api.imagga.com/v2/tags', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${credentials}`
            },
            body: formdata
        });

        const data = await response.json();

        if (!data.result || !data.result.tags) {
            console.log('Imagga error response:', JSON.stringify(data, null, 2));
            return [];
        }

        return data.result.tags
            .slice(0, 8)
            .map((tag) => tag.tag.en.toLowerCase());

    } catch (error) {
        console.log('Imagga API error:', error);
        return [];
    }
}

async function startServer() {

    try {

        await client.connect();

        console.log('MongoDB connected successfully');

        const db = client.db('ImageGalleryApp');
        const imagesCollection = db.collection('images');
        const usersCollection = db.collection('users');
        const messagesCollection = db.collection('messages');

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

        app.get('/api/messages', authMiddleware, async (req, res) => {
            try{
                const messages = await messagesCollection.find({
                    $or: [
                        { senderId: req.userId },
                        { receiverId: req.userId }
                    ]
                }).sort({ timestamp: -1 }).toArray();

                const conversationMap = {};

                messages.forEach((msg) => {
                    const otherPersonId = msg.senderId === req.userId ? msg.receiverId : msg.senderId;

                    if(!conversationMap[otherPersonId]){
                        conversationMap[otherPersonId] = {
                            userId: otherPersonId,
                            lastMessage: msg.text,
                            timestamp: msg.timestamp
                        };
                    }
                });

                const conversations = Object.values(conversationMap);

                res.json(conversations);

            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: 'Failed to get conversations'
                });
            }
        });

        app.get('/api/images', authMiddleware ,async(req,res)=> {
            try{
                const images = await imagesCollection.find({userId: req.userId}).toArray();
                console.log("Images for the user", images)

                res.json(images);
            } catch (error){
                console.log(error);
                res.status(500).json({
                    message: 'Failed to get images'
                });
            };
        });

        app.post('/api/users/:id/follow', authMiddleware, async(req, res) => {
            try{
                const targetId = req.params.id;

                if(targetId === req.userId){
                    return res.status(400).json({
                        message: 'You cannot follow Yourself'
                    });
                }
                await usersCollection.updateOne(
                    { _id: new ObjectId(targetId)},
                    { $addToSet: {followers: req.userId}}
                );

                await usersCollection.updateOne(
                    { _id: new ObjectId(req.userId) },
                    { $addToSet: { following: targetId } }
                );

                res.json({message: 'Followed successfully'});
            } catch(error) {
                console.log(error)
                res.status(500).json({
                    message: 'Failed to follow user'
                });
            }
        });

        app.post('/api/users/:id/unfollow', authMiddleware, async (req, res) => {
            try{
                const targetId = req.params.id;

                if(targetId === req.userId){
                    return res.status(400).json({
                        message: 'You cannot unfollow yourself'
                    });
                }

                await usersCollection.updateOne(
                    { _id: new ObjectId(targetId) },
                    { $pull: { followers: req.userId } }
                );

                await usersCollection.updateOne(
                    { _id: new ObjectId(req.userId) },
                    { $pull: { following: targetId } }
                );

                res.json({ message: 'Unfollowed successfully' });
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: 'Failed to unfollow user'
                });
            }
        });

        app.post('/api/messages', authMiddleware, async (req, res) => {
            try{
                const { receiverId, text } = req.body;

                if(!receiverId || !text || text.trim() === ''){
                    return res.status(400).json({
                        message: 'receiverId and text are required'
                    });
                }

                const message = {
                    senderId: req.userId,
                    receiverId: receiverId,
                    text: text,
                    timestamp: new Date()
                };

                const result = await messagesCollection.insertOne(message);

                res.status(201).json({
                    message: 'Message sent successfully',
                    data: { ...message, _id: result.insertedId }
                });

            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: 'Failed to send message'
                });
            }
        });

        app.post('/api/images/:id/save', authMiddleware, async (req, res) => {
            try{
                const imageId = req.params.id;

                const image = await imagesCollection.findOne({
                    _id: new ObjectId(imageId)
                });

                if(!image){
                    return res.status(404).json({
                        message: 'Image not found'
                    });
                }

                await usersCollection.updateOne(
                    { _id: new ObjectId(req.userId) },
                    { $addToSet: { savedImages: imageId } }
                );

                res.json({ message: 'Image saved successfully' });
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: 'Failed to save image'
                });
            }
        });

        app.post('/api/images/:id/unsave', authMiddleware, async (req, res) => {
            try{
                const imageId = req.params.id;

                await usersCollection.updateOne(
                    { _id: new ObjectId(req.userId) },
                    { $pull: { savedImages: imageId } }
                );

                res.json({ message: 'Image unsaved successfully' });
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: 'Failed to unsave image'
                });
            }
        });

        app.get('/api/messages/:userId', authMiddleware, async (req, res) => {
            try{
                const otherUserId = req.params.userId;

                const messages = await messagesCollection.find({
                    $or: [
                        { senderId: req.userId, receiverId: otherUserId },
                        { senderId: otherUserId, receiverId: req.userId }
                    ]
                }).sort({ timestamp: 1 }).toArray();

                res.json(messages);

            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: 'Failed to get messages'
                });
            }
        });

        app.get('/api/users/:id/saved-images', authMiddleware, async (req, res) => {
            try{
                const targetId = req.params.id;

                if(targetId !== req.userId){
                    return res.status(401).json({
                        message: 'You can only view your own saved images'
                    });
                }

                const user = await usersCollection.findOne({
                    _id: new ObjectId(req.userId)
                });

                const savedIds = user.savedImages || [];
                const objectIds = savedIds.map((id) => new ObjectId(id));

                const images = await imagesCollection.find({
                    _id: { $in: objectIds }
                }).toArray();

                res.json(images);

            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: 'Failed to get saved images'
                });
            }
        });

        app.get('/api/users/search', authMiddleware, async (req, res) => {
    try{
        const query = req.query.q || '';

        if(query.trim() === ''){
            return res.json([]);
        }

        const users = await usersCollection.find({
            name: { $regex: query, $options: 'i' }
        }).limit(10).toArray();

        const results = users.map((user) => ({
            id: user._id,
            name: user.name
        }));

        res.json(results);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to search users'
        });
    }
});

        app.get('/api/users/:id', authMiddleware, async(req, res) => {
            try{
                const targetId = req.params.id;
                const user = await usersCollection.findOne({
                    _id: new ObjectId(targetId)
                });

                if(!user){
                    return res.status(404).json({
                        message: 'User not found'
                    });
                }
                const followers = user.followers || [];
                const following = user.following || [];

                res.json({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profilePicture || null,
                    followerCount: followers.length,
                    followingCount: following.count,
                    isFollowing: followers.includes(req.userId),
                    isOwnProfile: targetId === req.userId
                });

            } catch (error){
                console.log(error)
                res.status(500).json({
                    message: 'Failed to get user profile'
                });
            }
        });

        app.get('/api/users/:id/images', authMiddleware, async (req, res) => {
            try{
                const targetId = req.params.id;
                let images;

            if(targetId === req.userId){
                images = await imagesCollection.find({ userId: targetId }).toArray();
            } else {
                images = await imagesCollection.find({ userId: targetId, visibility: 'public' }).toArray();
            }

                res.json(images);
            } catch (error) {
                console.log(error);
                res.status(500).json({
                message: 'Failed to get user images'
                    });
                }
            });


        app.get('/api/images/public', authMiddleware, async(req, res) => {
            try{
                const images = await imagesCollection.find({visibility: 'public'}).toArray();
                console.log("Public images: ", images)
                res.json(images);
            } catch(error){
                console.log(error);
                res.status(500).json({
                    message: 'Failed to get public images'
                });
            };
        });

        app.delete('/api/images/:id',authMiddleware, async (req, res) => {
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
                if (image.userId !== req.userId){
                    return res.status(401).json({
                        message : 'You are not allowed to delete this image'
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

        app.post('/api/users/:id/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
            try{
                const targetId = req.params.id;

                if(targetId !== req.userId){
                    return res.status(401).json({
                        message: 'You can only update your own profile picture'
                    });
                }

                if(!req.file){
                    return res.status(400).json({
                        message: 'No image uploaded'
                    });
                }

                const profilePicture = `/uploads/${req.file.filename}`;

                await usersCollection.updateOne(
                    { _id: new ObjectId(req.userId) },
                    { $set: { profilePicture: profilePicture } }
                );

                res.json({
                    message: 'Profile picture updated successfully',
                    profilePicture: profilePicture
                });

            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: 'Failed to update profile picture'
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
            visibility: req.body.visibility || 'private',
            autoTags: autoTags,


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
        const { title, author, uploadcategory, visibility} = req.body;

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
                    uploadcategory: uploadcategory,
                    visibility: visibility
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