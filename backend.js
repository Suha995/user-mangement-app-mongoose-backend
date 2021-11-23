import express from "express";
// import mongodb, { MongoClient } from 'mongodb';
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3016;
// const mongoConnectString = process.env.MONGODB_URI;
const mongoConnectString = process.env.MONGODB_URI;
// const client = new MongoClient(mongoConnectString);
mongoose.connect(mongoConnectString);

app.use(express.json());
app.use(cors());



const userSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
});
const UserModel = mongoose.model("User", userSchema, "users100");

app.get("/", async (req, res) => {
  const users = await UserModel.find({}).select("name username email");
  res.json(users);
});

app.delete("/deleteuser/:id", async (req, res) => {
  const id = req.params.id;
  const deleteResult = await UserModel.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
  });
  res.json({
    result: deleteResult,
  });
});

app.post("/insertuser", (req, res) => {
  const user = req.body.user;
  const user1 = new UserModel(user);
  user1.save(err => {
      if (err) {
          res.status(500).send({ err })
      } else {
          res.json({
              userAdded: user1
          });
      }
  });
});

app.patch("/edituseremail/:id", async (req, res) => {
  const email = req.body.email;
  const id = req.params.id;
  const updateResult = await UserModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { $set: { email } }, { new: true });
res.json({
    result: updateResult
});
});

app.listen(port, () => {
  console.log(`listen on port ${port}`);
});
