const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()
const express = require('express')
const app = express()
const port = 8000
const hostname = '127.0.0.1'
// lisätään express kirjasto, jotta voidaan
// helpottaa http-pyyntöjen käsittelyä

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message)
  } else {
    console.log('Connected to the SQLite database.')
    initializeDatabase()
  }
})

function initializeDatabase () {
  const createScript = fs.readFileSync('./sql/create.sql', 'utf8')
  db.exec(createScript, (err) => {
    if (err) {
      console.log('Error initializing database schema:', err.message)
      // Keskeytetään, jos virhe ilmenee skeeman luonnissa
    } else {
      console.log('Initialized the database schema.')
    }
  })

  // Skeeman luonnin jälkeen suoritetaan insert.sql
  const insertScript = fs.readFileSync('./sql/insert.sql', 'utf8')
  db.exec(insertScript, (err) => {
    if (err) {
      console.log('Error executing insert statements:', err.message)
      // Keskeytetään, jos virhe ilmenee insert-lauseiden suorittamisessa
    } else {
      console.log('Executed insert statements successfully.')
    }
  })
}

app.use(express.json())

// tarkistetaan, minkä nimisiä tauluja on tietokannassa
// -> mitä voidaan käyttää resurssina (resource)
function getValidResources (callback) {
  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
    if (err) {
      callback(err, null)
    } else {
      const resources = rows.map(row => row.name)
      callback(null, resources)
    }
  })
}

// Reitti, joka käsittelee pyynnöt ilman ID:tä
// Myös AND- ja OR-operaatiot.
app.get('/api/v1/:resource', (req, res) => {
  const { resource } = req.params

  getValidResources((err, validResources) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    // Vain olemassa olevat taulut, poislukien sqlite_sequence kelpaavat.
    if (!validResources.includes(resource) || resource === 'sqlite_sequence') {
      res.status(404).json({ error: 'Resource not found' })
      return
    }

    let sql = ''
    const params = []
    const conditions = []
    let useAND = true

    if (Object.keys(req.query).length === 0) {
      sql = `SELECT * FROM ${resource}`
      if(resource==='employee'){
        sql = `SELECT 
        e.fname || ' ' || e.lname AS fullname,
        e.phone,
        e.email,
        p.projectName,
        p.pDescription,
        s.ehours,
        s.salaryPerHour
     FROM employee e
     INNER JOIN salary s
        ON e.id = s.employeeId
     INNER JOIN project p
        ON e.projectWorkingOn = p.id`
      }
    } else {
      sql = `SELECT * FROM ${resource} WHERE `
    }

    for (const key in req.query) {
      if (req.query[key].includes(',')) {
        useAND = false
        const values = req.query[key].split(',')
        const orConditions = values.map((value) => {
          params.push(value)
          return `LOWER(${key}) = LOWER(?)`
        })
        conditions.push(`(${orConditions.join(' OR ')})`)
      } else {
        conditions.push(`LOWER(${key}) = LOWER(?)`)
        params.push(req.query[key])
      }
    }

    // jos käytetään and tai or hakua käytetään sitä operaatiota
    if (Object.keys(req.query).length !== 0) {
      sql += conditions.join(useAND ? ' AND ' : ' OR ')
    }

    console.log()
    console.log('req.params: ', req.params)
    console.log('req.query: ', req.query)
    console.log('sql, params: ', sql, params)

    // Tulostetaan data, kun sql koodi määritetty
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' })
      } else {
        res.status(200).json({ data: rows })
      }
    })
  })
})

app.get('/api/v1/:resource/:id', (req, res) => {
  const { resource, id } = req.params

  // Noudetaan sallitut resurssit tietokannasta
  getValidResources((err, validResources) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    // Tarkistetaan, onko pyydetty resurssi (taulu) sallittujen listalla
    if (!validResources.includes(resource)) {
      res.status(400).json({ error: 'Invalid resource requested' })
      return
    }

    const sql = `SELECT * FROM ${resource} WHERE id = ?`
    console.log()
    console.log('req.params: ', req.params)
    console.log('sql, params: ', sql)

    db.get(sql, [id], (err, row) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' })
      } else if (row) {
        res.status(200).json({ data: row })
      } else {
        res.status(404).json({ error: 'Resource Not Found' })
      }
    })
  })
})

// POST-metodi, joka toimii geneerisesti kaikille tauluille.
app.post('/api/v1/:resource', (req, res) => {
  const { resource } = req.params

  getValidResources((err, validResources) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }
    // Vain olemassa olevat taulut, poislukien sqlite_sequence kelpaavat.
    if (!validResources.includes(resource) || resource === 'sqlite_sequence') {
      res.status(404).json({ error: 'Resource not found' })
      return
    }

    const keys = Object.keys(req.body)
    const values = Object.values(req.body)

    const sql = `INSERT INTO ${resource} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`

    db.run(sql, values, function (err) {
      if (err) {
        console.log(err.message)
        res.status(400).json({ error: err.message })
        return
      }
      res.status(201).json({
        id: this.lastID,
        message: `Uusi rivi on lisätty tauluun ${resource}.`
      })
    })

    console.log()
    console.log('sql: ', sql)
    console.log('req.body: ', req.body)
  })
})

// esimerkki curlit
// post project-taululle
// curl -X POST "http://localhost:8000/api/v1/project" -H "Content-Type: application/json" -d "{\"projectName\": \"projectBlue\", \"pDescription\": \"Making email software for team\", \"price\": 15000.00}"

// post employee-taululle
// curl -X POST "http://localhost:8000/api/v1/employee" -H "Content-Type: application/json" -d "{\"fname\": \"Esa\", \"lname\": \"Junnila\", \"phone\": \"0401234567\", \"email\": \"esa@example.com\", \"projectWorkingOn\": 1}"
// {"id":71,"message":"Uusi rivi on lisätty tauluun employee."}

// post salary-taululle
// curl -X POST "http://localhost:8000/api/v1/salary" -H "Content-Type: application/json" -d "{\"employeeId\": 6, \"fname\": \"Esa\", \"lname\": \"Junnila\", \"ehours\": 160, \"salaryPerHour\": 28.00}"
// {"id":6,"message":"Uusi rivi on lisätty tauluun salary."}

app.put('/api/v1/:resource', (req, res) => {
  const { resource } = req.params

  getValidResources((err, validResources) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }
    if (!validResources.includes(resource) || resource === 'sqlite_sequence') {
      res.status(404).json({ error: 'Resource not found' })
      return
    }

    const keys = Object.keys(req.body)
    const values = Object.values(req.body)

    // Oletetaan, että id on osa runkoa ja se poistetaan ennen SQL-lauseen muodostamista
    const id = req.body.id
    if (!id) {
      return res.status(400).json({ error: 'ID is required for update' })
    }
    const indexId = keys.indexOf('id')
    if (indexId > -1) {
      keys.splice(indexId, 1)
      values.splice(indexId, 1)
    }

    // Muodostetaan SET-osio SQL-lauseeseen
    const setClause = keys.map(key => `${key} = ?`).join(', ')

    const sql = `UPDATE ${resource} SET ${setClause} WHERE id = ?`

    // Lisätään 'id' arvojen loppuun käytettäväksi WHERE ehdossa
    values.push(id)

    db.run(sql, values, function (err) {
      if (err) {
        console.log(err.message)
        res.status(400).json({ error: err.message })
        return
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'No rows updated' })
      } else {
        res.status(200).json({
          message: `Row(s) updated in ${resource}.`,
          changes: this.changes
        })
      }
    })
  })
})

// curl -X PUT "http://localhost:8000/api/v1/employee" -H "Content-Type: application/json" -d "{\"id"\:1\"fname\": \"Petri\", \"lname\": \"Peterson\", \"phone\": \"0401234567\", \"email\": \"petri@example.com\", \"projectWorkingOn\": 2}"

// muutetaan vain osa datasta:
// curl -X PUT "http://localhost:8000/api/v1/employee" -H "Content-Type: application/json" -d "{\"id\": 1, \"phone\": \"0409876543\", \"projectWorkingOn\": 2}"
// {"message":"Row(s) updated in employee.","changes":1}

app.delete('/api/v1/:resource/:id', (req, res) => {
  const { resource, id } = req.params

  getValidResources((err, validResources) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }
    if (!validResources.includes(resource) || resource === 'sqlite_sequence') {
      res.status(404).json({ error: 'Resource not found' })
      return
    }

    // Rakennetaan SQL-lause poistamaan rivi annetun ID:n perusteella
    const sql = `DELETE FROM ${resource} WHERE id = ?`

    db.run(sql, id, function (err) {
      if (err) {
        console.log(err.message)
        res.status(400).json({ error: err.message })
        return
      }
      if (this.changes === 0) {
        // Jos yhtään riviä ei poistettu, se tarkoittaa, ettei annetulla ID:llä löytynyt riviä
        res.status(404).json({ error: 'No rows deleted' })
      } else {
        // Onnistunut poisto
        res.status(200).json({
          message: `Row deleted from ${resource}.`,
          changes: this.changes // Kuinka monta riviä poistettiin
        })
      }
    })
  })
})

// esimerkki poistot salary- ja employee-tauluista
// curl -X DELETE "http://localhost:8000/api/v1/salary/1"
// curl -X DELETE "http://localhost:8000/api/v1/employee/1"

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
