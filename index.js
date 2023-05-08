const express = require("express");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.pr3rbd0.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const chocolateCollection = client
      .db("chocolateDB")
      .collection("chocolate");

    //get all chocolate
    app.get("/chocolates", async (req, res) => {
      const cursor = chocolateCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //get one chocolate

    app.get("/chocolates/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await chocolateCollection.findOne(query);
      res.send(result);
    });

    //post chocolate
    app.post("/chocolates", async (req, res) => {
      const newChocolate = req.body;
      const result = await chocolateCollection.insertOne(newChocolate);
      res.send(result);
      console.log(result);
    });

    //update chocolate

    app.put("/chocolates/:id", async (req, res) => {
      const id = req.params.id;
      const chocolateItem = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updateChocolate = {
        $set: {
          photo: chocolateItem.photo,
          name: chocolateItem.name,
          country: chocolateItem.country,
          category: chocolateItem.category,
        },
      };

      const result = await chocolateCollection.updateOne(filter,updateChocolate,options);
      res.send(result)
    });

    //delete chocolate
    app.delete("/chocolates/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await chocolateCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`chocolate server running in ${port}`);
});
