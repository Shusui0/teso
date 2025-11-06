# traffic-violation-system/frontend/README.md

# Smart Traffic Violation Detection and Reporting System

This project is a full-stack web application designed for detecting and reporting traffic violations using image uploads. It consists of a backend built with FastAPI and a frontend developed with React.

## Project Structure

```
traffic-violation-system
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   ├── config.ts
│   │   └── app.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
└── frontend
    ├── src
    │   ├── components
    │   ├── services
    │   ├── types
    │   ├── App.tsx
    │   └── index.tsx
    ├── package.json
    ├── tsconfig.json
    └── README.md
```

## Frontend Features

- **File Upload**: Users can upload images of traffic violations.
- **Violation List**: Displays a list of detected violations with details.
- **Map Integration**: Shows violation locations on a map.

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the frontend directory:
   ```
   cd traffic-violation-system/frontend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

## API Integration

The frontend communicates with the backend API to upload images and retrieve violation reports. Ensure the backend server is running before testing the frontend.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.