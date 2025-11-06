# Traffic Violation Detection and Reporting System - Backend

## Overview
The Traffic Violation Detection and Reporting System is a full-stack web application designed to detect and report traffic violations using image processing and geolocation data. The backend is built with TypeScript and FastAPI, providing a robust API for handling violation reports.

## Features
- Upload images for violation detection.
- Retrieve violation reports with detailed information.
- Integration with a frontend application for a seamless user experience.

## Project Structure
```
backend
├── src
│   ├── controllers        # Contains request handling logic
│   ├── models             # Defines data models
│   ├── routes             # API route definitions
│   ├── services           # Business logic and services
│   ├── utils              # Utility functions
│   ├── config.ts          # Configuration settings
│   └── app.ts             # Main application setup
├── package.json           # Project dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the backend directory:
   ```
   cd traffic-violation-system/backend
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Running the Application
To start the backend server, run:
```
npm start
```
The server will be running on `http://localhost:8000`.

## API Endpoints
- `POST /detect_violation`: Upload an image to detect violations.
- `GET /violations`: Retrieve a list of violation reports.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for details.