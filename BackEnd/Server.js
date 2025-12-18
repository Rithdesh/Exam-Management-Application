const CORS = require('cors')

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

//ROUTES
const UserRoutes = require('./Routes/UserRoutes');
const ExaminationRoutes = require('./Routes/ExaminationRoutes');
const SubjectRoutes = require('./Routes/SubjectRoutes');
const HallRoutes = require('./Routes/HallRoutes');
const SeatingPlanRoutes = require('./Routes/SeatingPlanRoutes')


const app = express();
const PORT = process.env.PORT;

const allowedOrigins = [
  "http://localhost:3000",                 // local dev      // prod frontend
  "https://examination-management-application.netlify.app/"       // if you use Netlify
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS 😤"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

app.get('/', (req, res) => {
    res.send('Welcome to the Examination Allocation System API');
});

//REGISTER ROUTES
app.use('/users', UserRoutes);
app.use('/examination', ExaminationRoutes);
app.use('/subject', SubjectRoutes);
app.use('/halls', HallRoutes);
app.use('/SeatingPlan',SeatingPlanRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Backend is alive 🫀" });
});
