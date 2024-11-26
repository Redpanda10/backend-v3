// server.js

const express = require('express');
const db = require('./db'); // MongoDB connection
const Car = require('./models/car'); // Car model
const bodyParser = require('body-parser'); // Import body-parser

// Create an express application
const app = express();

// Define a port
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json()); // Parse JSON bodies for POST requests

// Connect to MongoDB
// db(); // Call the connectDB function from db.js

// Set up a simple route to test the server
app.get('/', (req, res) => {
  res.send('Hello, world! Welcome to your car dealership app!');
});

// Add a route to create a new car entry
// CREATE: Add a new car
app.post('/add-car', async (req, res) => {
  try {
    // Get data from the request body
    const data = req.body;

    // Create a new car instance using the data from the body
    const newCar = new Car(data);

    // Save the new car to the database
    await newCar.save();
    res.status(201).send('Car added successfully!');
  } catch (error) {
    res.status(500).send('Error adding car: ' + error.message);
  }
});

// READ: Get all cars
app.get('/cars', async (req, res) => {
    try {
      const cars = await Car.find();
      res.status(200).json(cars);
    } catch (error) {
      res.status(500).send('Error fetching cars: ' + error.message);
    }
  });
  
  // READ: Get a single car by ID
  app.get('/car/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const car = await Car.findById(id);
      if (!car) {
        return res.status(404).send('Car not found');
      }
      res.status(200).json(car);
    } catch (error) {
      res.status(500).send('Error fetching car: ' + error.message);
    }
  });
  
  // UPDATE: Update a car by ID
  app.put('/update-car/:id', async (req, res) => {
    const { id } = req.params;
    const { make, model, year, price, color, isAvailable } = req.body;
  
    try {
      const updatedCar = await Car.findByIdAndUpdate(
        id,
        { make, model, year, price, color, isAvailable },
        { new: true } // Return the updated car object
      );
  
      if (!updatedCar) {
        return res.status(404).send('Car not found');
      }
      res.status(200).json(updatedCar);
    } catch (error) {
      res.status(500).send('Error updating car: ' + error.message);
    }
  });
  
  // DELETE: Delete a car by ID
  app.delete('/delete-car/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deletedCar = await Car.findByIdAndDelete(id);
      if (!deletedCar) {
        return res.status(404).send('Car not found');
      }
      res.status(200).send('Car deleted successfully');
    } catch (error) {
      res.status(500).send('Error deleting car: ' + error.message);
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
