const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const app = express();
const port = 3000;

// Middleware setup
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(fileUpload());

// MongoDB connection
const url = "mongodb+srv://angelsmycourses16:angel725@cluster0.51gncrh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectToDatabase = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
connectToDatabase();

// Schema & Model
const blogSchema = new mongoose.Schema({
  author: String,
  title: String,
  tags: [String],
  post: String,
  filePath: String,
  date: { type: Date, default: Date.now },
  comments: [
    {
      text: String,
      date: { type: Date, default: Date.now },
    },
  ],
});
const Blog = mongoose.model("blogs_collection", blogSchema);

// Routes
app.get("/", async (req, res) => {
  try {
    const count = await Blog.countDocuments();
    res.render("pages/index", { count });
  } catch (error) {
    res.status(500).send("Error loading homepage");
  }
});

app.get("/articles", async (req, res) => {
  try {
    const allArticles = await Blog.find().sort({ date: -1 });
    res.render("pages/articles", { articles: allArticles });
  } catch (err) {
    res.status(500).send("Error fetching articles");
  }
});

app.get("/details/:id", async (req, res) => {
  try {
    const article = await Blog.findById(req.params.id);
    if (!article) return res.status(404).send("Article not found");
    res.render("pages/details", { article });
  } catch (err) {
    res.status(500).send("Error loading article details");
  }
});

app.get("/newpost", (req, res) => {
  res.render("pages/newpost");
});

app.post("/newpost", async (req, res) => {
  try {
    const tagsArray = req.body.tags.split(",").map((tag) => tag.trim());

    const newBlog = new Blog({
      author: req.body.author,
      title: req.body.title,
      tags: tagsArray,
      post: req.body.post,
    });

    await newBlog.save();
    res.redirect("/articles");
  } catch (err) {
    res.status(500).send("Error creating the post");
  }
});

app.post("/comments/:id", async (req, res) => {
  try {
    const article = await Blog.findById(req.params.id);
    if (!article) return res.status(404).send("Article not found");

    article.comments.push({ text: req.body.text, date: new Date() });
    await article.save();
    res.redirect(`/details/${article._id}`);
  } catch (err) {
    res.status(500).send("Error posting comment");
  }
});

app.post("/edit/:id", async (req, res) => {
  try {
    const { author, title, tags, post } = req.body;

    await Blog.findByIdAndUpdate(req.params.id, {
      author,
      title,
      tags: tags.split(',').map(tag => tag.trim()),
      post,
      date: new Date()
    });

    res.redirect("/articles");
  } catch (err) {
    res.status(500).send("Error updating the post");
  }
});

app.post("/uploadImage", (req, res) => {
  if (!req.files || !req.files.uploadFile) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const image = req.files.uploadFile;

  // Check if uploads directory exists, if not, create it
  const fs = require('fs');
  const uploadsDir = __dirname + "/uploads";
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // Optional MIME check
  if (!image.mimetype.startsWith("image/")) {
    return res.status(400).json({ error: "Only image files allowed" });
  }

  const uniqueFileName = Date.now() + "-" + image.name;
  const uploadPath = `${uploadsDir}/${uniqueFileName}`;

  image.mv(uploadPath, (err) => {
    if (err) {
      console.error("Upload failed:", err);
      return res.status(500).json({ error: "Failed to save image" });
    }

    res.json({ imageUrl: `/uploads/${uniqueFileName}` });
  });
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
