import express from "express";
import bodyParser from "body-parser";
import pg from 'pg'

//we want to CREATE READ UPDATE DELETE to do list items
const app = express();
const port = 3000;

//connect to db
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "LearnPostgres1",
  port: 5432,
})
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//hard coded list
// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];
let todoItems = []

app.get("/", async(req, res) => {

  try {
    const result = await db.query("SELECT * FROM items ORDER BY title ASC")
    todoItems = result.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: todoItems,
    });
  } catch (error) {
    console.log(error);
    
  }

  
});

//adding new item [action= /add, name: newItem]
app.post("/add",async (req, res) => {
  const todoItem = req.body.newItem;

  try {
    await db.query("INSERT INTO items (title) VALUES ($1)",[todoItem])
    // items.push({ title: item });
    res.redirect("/");
  } catch (error) {
    console.log(error);
    
  }

  
});

//editing todo item (action= /edit, name:updatedItemId, updatedItemtitle)
app.post("/edit", async(req, res) => {
  const todoItemId = req.body.updatedItemId
  const todoItem = req.body.updatedItemTitle

  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [todoItem,todoItemId])
    res.redirect("/") //back to default root page
  } catch (error) {
    console.log(error);
    
  }

});

//action [/delete], name= deleteItemId
app.post("/delete", async(req, res) => {
  const todoItemId = req.body.deleteItemId;

  try {
    await db.query("DELETE FROM title WHERE id = $1", [todoItemId])
    res.redirect("/");

  } catch (error) {
    console.log(error);

  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
