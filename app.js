const express = require("express")

const mongoose = require("mongoose")




const connect = () => {
    return mongoose.connect("mongodb://localhost:27017/books");
  };



  const sectionSchema = new mongoose.Schema({
    name: {type: String, required: true}
},{
    versionKey: false,
    timestamps: true
})

const Section = mongoose.model("section", sectionSchema)
 

// author crud



const AuthorSchema = new mongoose.Schema({
    first_name: {type:String, required: true},
    last_name: {type:String, required: true},
},{
    versionKey: false,
    timestamps: true
})
const Author = mongoose.model("author", AuthorSchema)
const BookSchema = mongoose.Schema({
    name: {type: String, required: true},
    body:{type: String, required: true},
    section_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "section",
        required: "true"
    },
    author_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "author",
        required: "true"
    }]
    

},
    {
        versionKey: false,
        timestamps: true
    }
)

const Book = mongoose.model("book", BookSchema)



const checkoutSchema = mongoose.Schema({
    Book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "book",
        required: true
    }
},{
    versionKey: false,
    timestamps: true
}
)

const Checkout = mongoose.model("checkout", checkoutSchema)







const app = express();
app.use(express.json());





// author crud operation



app.post("/author", async (req, res) => {
    try{
    const author = await Author.create(req.body)
    return res.status(201).send(author)
    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
});


app.get("/author", async (req, res) => {
    try{

        const author = await Author.find().lean().exec();
       return res.send(author);

    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})

app.get("/author/:id", async (req, res) => {
    try{
    const author = await Author.findById(req.params.id).lean().exec()
    return res.status(201).send(author)
    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})
app.patch("/author/:id", async (req, res) => {
    try{
        const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        }).lean().exec()
        res.status(201).send(author)
    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})

app.delete("/author/:id", async (req, res) => {
    try{
        const author = await Author.findByIdAndDelete(req.params.id).lean().exec()
        res.status(201).send(author)
    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})


//section

app.post("/section", async (req, res) => {
    try {
    const section = await Section.create(req.body)
    return res.status(201).send(section)
    }catch(e) {
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})

app.get("/section", async (req, res) => {
    try{
        const section = await Section.find().lean().exec()
        res.status(201).send(section)
    }catch(e) {
        res.status(500).json({message: e.message, status: "Failed"})
    }
})



app.get("/section/:id", async (req, res) => {
    try{

        const section = await Section.findById(req.params.id).lean().exec()
       return res.status(201).send(section)

    }catch(e) {
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})


app.patch("/section/:id", async (req, res) => {
    try{
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    }).lean().exec()
    return res.status(201).send(section)
}catch(e) {
    return res.status(500).json({message: e.message, status: "Failed"})
}

})



app.delete("/section/:id", async (req, res) => {
    try{
        const section = await Section.findByIdAndDelete(req.params.id).lean().exec()
        res.status(201).send(section)

    }catch(e) {
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})





//book crud operation


app.post("/books", async (req, res) => {
    try{
    const book = await Book.create(req.body)
    res.status(201).send(book)
    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
});

app.get("/books", async (req, res) => {
    try{

        const book = await Book.find().populate({path:"author_id", select: "first_name last_name"}).populate({path: "section_id", select: "name"}).lean().exec()
       return res.status(201).send(book)

    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})

app.get("/books/:id", async (req, res) => {
    try{
    const book = await Book.findById(req.params.id).populate({path:"author_id", select: "first_name last_name"}).populate({path: "section_id", select: "name"}).lean().exec()
    return res.status(201).send(book)
    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})

app.patch("/books/:id", async (req, res) => {
    try{
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        }).lean().exec()
        res.status(201).send(book)
    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})

app.delete("/books/:id", async (req, res) => {
    try{
        const book = await Book.findByIdAndDelete(req.params.id).lean().exec()
        res.status(201).send(book)
    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})


// checkout

app.post("/checkouts", async (req, res) => {
    try{
    const checkout = await Checkout.create(req.body)
  //  const book = await Book.findByIdAndDelete(checkout.book_id)
    res.status(201).send(checkout)
    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
});

app.get("/checkouts", async (req, res) => {
    try{

        const checkout = await Checkout.find().populate({path: "book_id", select: "name body"}).lean().exec()
       return res.status(201).send(checkout)

    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})

app.get("/checkouts/:id", async (req, res) => {
    try{
    const checkout = await Checkout.findById(req.params.id).populate({path: "book_id", select: "name body"}).lean().exec()
    return res.status(201).send(checkout)
    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})

app.patch("/checkouts/:id", async (req, res) => {
    try{
        const checkout = await Checkout.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        }).lean().exec()
        res.status(201).send(checkout)
    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})

app.delete("/checkouts/:id", async (req, res) => {
    try{
        const checkout = await Checkout.findByIdAndDelete(req.params.id).lean().exec()
        res.status(201).send(checkout)
    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})



// .....................................
app.get("/checkedout", async (req, res) => {
    try{

        const checked = await Checkout.find().populate({path: "book_id"}).lean().exec()
        res.status(201).send(checked)
    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})

app.get("/author/:id/books", async(req, res) => {
    try{

        const author = await Author.findById(req.params.id).lean().exec()
        const books  = await Book.find({author_id: author._id}).lean().exec()
        res.send({books})

    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})

app.get("/section/:id/books", async(req, res) => {
    try{

        const section = await Section.findById(req.params.id).lean().exec()
        const books  = await Book.find({section_id: section._id}).lean().exec()
        res.send({books})

    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})





app.get("/section/:sectionid/:authorid", async(req, res) => {
    try{

        const section = await Section.findById(req.params.sectionid).lean().exec()
        const author = await Author.findById(req.params.authorid).lean().exec()
        const books  = await Book.find({section_id: section._id, author_id: author._id}).lean().exec()
        res.send(books)

    }catch(e){
        return res.status(500).json({message: e.message, status: "Failed"})
    }
})

app.listen(3000, async() =>{
    await connect();
    console.log("listening the port 5000");
})