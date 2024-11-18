const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON data

// Serve static files (HTML, CSS, etc.)
app.use(express.static('public'));

// Path to clients JSON file
const filePath = path.join(__dirname, 'data', 'clients.json');

// Route to get clients from JSON file
app.get('/api/clients', (req, res) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading client data');
        }
        res.json(JSON.parse(data));
    });
});

// Route to save a new client to the JSON file
app.post('/api/clients', (req, res) => {
    const newClient = req.body;

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading client data');
        }
        const clients = JSON.parse(data);
        clients.push(newClient);

        fs.writeFile(filePath, JSON.stringify(clients, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error saving client data');
            }
            res.status(201).send('Client added successfully');
        });
    });
});

// Route to update an existing client in the JSON file
app.put('/api/clients/:caseNumber', (req, res) => {
    const caseNumber = req.params.caseNumber;
    const updatedData = req.body;

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading client data');
        }
        const clients = JSON.parse(data);
        const clientIndex = clients.findIndex(client => client.caseNumber === caseNumber);

        if (clientIndex === -1) {
            return res.status(404).send('Client not found');
        }

        // Update the client data
        clients[clientIndex] = { ...clients[clientIndex], ...updatedData };

        fs.writeFile(filePath, JSON.stringify(clients, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error updating client data');
            }
            res.send('Client updated successfully');
        });
    });
});


// Route to delete a client by caseNumber
app.delete('/api/clients/:caseNumber', (req, res) => {
    const caseNumber = req.params.caseNumber;

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading client data');
        }

        const clients = JSON.parse(data);
        const updatedClients = clients.filter(client => client.caseNumber !== caseNumber);

        if (clients.length === updatedClients.length) {
            return res.status(404).send('Client not found');
        }

        fs.writeFile(filePath, JSON.stringify(updatedClients, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error updating client data');
            }
            res.status(200).send('Client deleted successfully');
        });
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

