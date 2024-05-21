const express = require("express")
const path = require("path")
const app = express()
const LogInCollection = require("./mongodb.js")
const port = process.env.PORT || 3000

const templatePath = path.join(__dirname, '../public/templates') 
const publicPath = path.join(__dirname, '../public')


app.set('view engine', 'hbs')
app.set('views', templatePath)


app.use(express.static(publicPath))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/', (req, res) => {
    res.render('login')
})

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    }

    const checking = await LogInCollection.findOne({ name: req.body.name })

    try {
        if (checking && checking.password === req.body.password) {
            res.send("User details already exist.")
        } else {
            await LogInCollection.insertMany([data])
            res.status(201).render("home", {
                naming: req.body.name
            })
        }
    } catch {
        res.send("Wrong inputs.")
    }
})

app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check && check.password === req.body.password) {
            res.status(201).render("home", { naming: req.body.name })
        } else {
            res.send("Incorrect password.")
        }
    } catch (e) {
        res.send("Wrong details.")
    }
})

app.listen(port, () => {
    console.log('Port connected.')
})
