const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendWelcomeEmail,sendCancelationEmail } = require("../emails/account");
const sharp = require('sharp');
const router = express.Router();
const multer = require('multer');


router.post("/users", async (req, res) => {
  const user = new User(req.body);
  
    try{
     // await user.save();
      const token = await user.getAuthToken();
      sendWelcomeEmail(user.email, user.name);
      res.status(201).send({user,token});
    } catch (e) {
      res.status(500).send(e);
  }
      // user
      // .then((result) => {
      //   res.send(result);
      // })
      // .catch((err) => {
      //   res.status(400).send(err);
      // });
});
  
router.post('/users/login',async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.getAuthToken();
    res.status(200).send({ user ,token});
          } catch (e) {
    res.status(400).send(e);
          }
 })

 router.post('/users/logout',auth,async (req,res)=>{
   try {
     
     req.user.tokens = req.user.tokens.filter((token) => {
       return token.token !== req.token;
     });
     await req.user.save();
     res.send(req.user);
   } catch (e) {
     res.status(500).send("Error hai error");
  }
   
 })
router.post('/users/logout-all', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send("KUCH GOALMAL HAI BHAI");
  }
 })
const upload = multer({
  limits: {
    fileSize:1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return cb(new Error("Please upload a image file of about "));
    }
    cb(undefined, true);
  }

});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ height: 250, width: 250 }).png().toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.send(req.user);    
}, (error, req, res,next) => {
  res.status(400).send({ error: error.message });
}) 


  router.get("/users/me",auth,async (req, res) => {
    res.send(req.user);
    // try {
    //    const f=await User.find({});
    //   res.status(201).send(f);  
    // } catch (e) {
    //   res.status(500).send(e);
    //  }
   
    // User.find({})
    //   .then((result) => {
    //     res.send(result);
    //   })
    //   .catch((err) => {
    //     res.status(500).send(err);
    //   });
  });
  // router.get("/users/:id", async (req, res) => {
  //   const _id = req.params.id;
  //   try {
  //     const f= await User.findById(_id);
  //     res.status(200).send(f);
  //   } catch (e) {
  //     res.status(500).send(e);
  //   }
  
  //   // User.findById(_id)
  //   //   .then((result) => {
  //   //     if (!result) {
  //   //       res.status(400).send();
  //   //     }
  //   //     res.status(200).send(result);
  //   //   })
  //   //   .catch((err) => {
  //   //     res.status(500).send(err);
  //   //   });
  // });
router.get('/users/:id/avatar', async (req, res) => {
    
  try {
    const user = await User.findById(req.params.id);
    if (!user.avatar) {
      throw new Error();
    }  
  
    res.set('Content-Type', 'image/jpg');
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
  })
  router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isValidUpdate = updates.every((t) => allowedUpdates.includes(t));
    if (!isValidUpdate) {
      return res.status(400).send("Invalid update to  be done");
    }
    try {
     // const user = await User.findById(req.user._id);
      updates.forEach((u) => {
        req.user[u] = req.body[u];})
      await req.user.save();
     // const f = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      res.send(req.user);
    } catch (e) {
      res.status(404).send(e);
    }
  
  })
  router.delete('/users/me',auth, async (req, res) => {
       
    try {
      // const f = await User.findByIdAndDelete(req.params.id);
      // if (!f) {
      //  return  res.status(404).send("not found bro");
      // }
      await req.user.remove();
      sendCancelationEmail(req.user.email, req.user.name);
      res.send(req.user);
    } catch (e) {
      res.status(400).send(e);
    }    
  })

router.delete('/users/me/avatar', auth, async (req, res) => {
     
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send(req.user);
    }catch (e) {
      res.status(400).send("error");
  }
  })  
module.exports = router;