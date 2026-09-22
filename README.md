# Cloud9 — NER Logistics Intelligence Platform

AI-powered logistics and accessibility intelligence platform for India's
**North Eastern Region (NER)**.

Cloud9 combines geospatial intelligence, machine-learning-based landslide
risk assessment, road accessibility analysis, route-risk evaluation,
vehicle/delivery monitoring, field incident reporting, and real-time alerts
to support safer and more informed logistics operations in the NER.

---

## 🎯 Problem

The North Eastern Region faces difficult terrain, extreme weather,
landslides, floods, road disruptions, connectivity limitations, and
infrastructure challenges.

Cloud9 is designed to provide a unified platform for:

- Monitoring road and transport accessibility
- Assessing landslide and road-related risks
- Evaluating safer alternative routes
- Tracking vehicles and deliveries
- Reporting geo-tagged road incidents
- Generating alerts for critical disruptions
- Providing operational dashboards for authorities and logistics teams

---

## 🏗️ System Architecture

Cloud9 consists of three major application layers:

```text
                    ┌─────────────────────┐
                    │     React + Vite    │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                         REST / Socket.IO
                               │
                    ┌──────────▼──────────┐
                    │   Node.js + Express │
                    │      Backend        │
                    └──────┬───────┬──────┘
                           │       │
                    MongoDB Atlas  │
                           │       │
                    ┌──────▼───┐   │
                    │ Database │   │
                    └──────────┘   │
                                   │
                           ┌───────▼────────┐
                           │ Python/FastAPI │
                           │  Risk Engine   │
                           └───────┬────────┘
                                   │
                           Random Forest ML

Cloud9/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   └── vite-project/
│       ├── public/
│       ├── src/
│       ├── package.json
│       └── vite.config.js
│
├── risk-engine/
│   ├── main.py
│   ├── requirements.txt
│   └── ...
│
├── datasets/
│   ├── DEM.tif
│   ├── landslide_model.pkl
│   └── landslide_points.csv
│
├── Cloud9ipynb.ipynb
├── PROJECT_DOCUMENTATION.md
├── package.json
└── README.md

🛠️ Technology Stack
Frontend
React
Vite
JavaScript
Leaflet
Socket.IO Client
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
Socket.IO
Risk Engine
Python
FastAPI
Scikit-learn
Random Forest
Rasterio
GeoPandas
PyProj
NumPy
Pandas
Geospatial & Routing
OpenStreetMap (OSM)
OSRM
Nominatim
GeoJSON
MongoDB 2dsphere indexes
NetworkX
Deployment / Infrastructure
Cloud-based deployment
MongoDB Atlas
REST APIs
WebSocket-based real-time communication
🧠 Core Features
1. GIS-Based Logistics Dashboard

The platform provides a map-based operational view containing:

Road network
Road segments
Vehicles
Incidents
Risk zones
Route paths
Critical roads
GPS locations

Leaflet is used for interactive geospatial visualization.

2. Landslide Risk Prediction

The Python risk engine uses a Random Forest classifier to estimate
landslide probability.

The model uses the following features:

elevation
slope
aspect
dist_to_road
rainfall

The output includes a landslide probability which is converted into a
risk percentage and risk category.

Risk Categories
Risk Percentage	Category
0–20%	Very Low
20–40%	Low
40–60%	Moderate
60–80%	High
80–100%	Very High

The risk engine is exposed through a Python/FastAPI service and is
integrated with the Node.js backend.

🗺️ Risk-Aware Route Planning

Cloud9 does not evaluate routes only by distance.

The route planner uses OSRM to obtain candidate routes and evaluates
their potential hazard exposure.

For candidate routes, the system:

Generates alternative routes using OSRM.
Samples points along each route.
Obtains risk information for those points.
Calculates route-level hazard information.
Identifies high-risk stretches.
Compares candidate routes.
Selects a safer route based on the calculated risk.

This allows route planning to consider both transportation efficiency and
hazard exposure.

🚨 Dynamic Re-Routing

Cloud9 supports disruption-aware re-routing.

A typical operational flow is:

Planned Route
      ↓
Vehicle Monitoring
      ↓
Critical Incident Detected
      ↓
Road Blocked / High Risk
      ↓
Alert Generated
      ↓
Alternative Routes Evaluated
      ↓
Safer Route Selected
      ↓
Dynamic Re-Route Applied

The system can therefore respond to a critical road disruption instead of
continuing to follow the original route.

🚗 Vehicle & GPS Tracking

Vehicle locations can be monitored using browser/device GPS.

The frontend uses:

navigator.geolocation.watchPosition()

for continuous location updates.

The system can detect when a vehicle moves significantly away from its
planned route. The implemented off-route logic uses a distance threshold
and consecutive location updates before triggering a re-routing workflow.

🛣️ Critical Road Analysis

Cloud9 also performs network-level road analysis using NetworkX.

The road network can be represented as:

G = (V, E)

where:

V = junctions / settlements
E = road connections

The system can identify important network connections whose failure may
disconnect parts of the network and rank critical roads based on their
potential effect on settlement connectivity.

This is different from landslide probability:

Physical Risk
    → How likely is a hazard?

Network Risk
    → What happens to connectivity if a road fails?
📍 Field Incident Reporting

Field officers can submit geo-tagged incident reports containing:

GPS location
Incident information
Photographs
Severity information
Road-related details

The backend processes the incident and:

Verifies the request.
Stores the uploaded image.
Finds the nearest road.
Creates the incident record.
Calculates risk information.
Creates an alert when appropriate.
Updates relevant road information.
Broadcasts the event through Socket.IO.
🤖 Image-Based Incident Analysis

When the required Gemini API configuration is available, uploaded incident
photographs can also be analysed using Gemini Vision.

The system can classify hazards such as:

Landslide
Flood
Road damage
Rockfall
Fallen tree

The analysis can provide information such as:

Severity
Whether the road is blocked
Debris coverage
Confidence
Incident description

This complements the numerical landslide-risk model with field-image
intelligence.

📡 Real-Time Communication

Cloud9 uses Socket.IO to broadcast operational updates without
requiring users to manually refresh the dashboard.

Real-time events can be used for:

Vehicle updates
Incident updates
Alerts
Road status changes
Rerouting events
Operational notifications

This allows different users such as administrators, field officers and
vehicle operators to receive current information.

🔐 Authentication & Security

The backend provides authentication and protected application workflows.

Implemented technologies include:

JWT-based authentication
Password hashing
Role-based application access
Protected API workflows
Environment-based configuration
MongoDB-backed user management

Sensitive configuration values such as database credentials and API keys
should be stored in environment variables rather than committed to Git.

🗄️ Database

MongoDB is used for operational data storage.

The backend maintains data related to entities such as:

Users
Vehicles
Roads
Road segments
Incidents
Alerts
Deliveries
Risk predictions
Reroute events
Settings
Conversations and messages

Geospatial collections use 2dsphere indexes where required for
location-based queries.

🌦️ Data & Geospatial Sources

The system combines multiple types of geospatial and environmental data.

Terrain

Digital Elevation Model (DEM) data is used to derive terrain-related
features such as:

Elevation
Slope
Aspect
Road Network

OpenStreetMap provides road and geographic network information.

Routing

OSRM is used to generate candidate routes and obtain:

Distance
Travel duration
Route geometry
Turn-by-turn route information
Weather / Rainfall

Weather and rainfall information is used as an environmental feature for
risk assessment.

Historical / Incident Information

Historical and field incident information can be used for operational
analysis and risk-related workflows.

🔄 End-to-End Operational Flow

The major intelligence flow of Cloud9 can be summarized as:

PREDICT
   ↓
Understand Risk & Impact
   ↓
PLAN
   ↓
MONITOR
   ↓
ALERT
   ↓
REROUTE
   ↓
DELIVER

The platform brings together:

Geographical Intelligence
        +
Predictive Intelligence
        +
Ground/Field Intelligence
        +
Logistics Intelligence

🔌 Backend API Overview
Endpoint	Methods	Description
/api/auth/*	POST/GET	Authentication and user management
/api/vehicles	GET/POST/PATCH/DELETE	Vehicle management
/api/roads	GET/POST/PATCH/DELETE	Road management
/api/incidents	GET/POST/PATCH/DELETE	Incident management
/api/deliveries	GET/POST/PATCH/DELETE	Delivery management
/api/alerts	GET/POST/DELETE	Alert management
/api/landslide	GET	Landslide risk engine integration
/api/route-risk	POST	Route risk assessment
/api/geocode	GET	Geocoding
/api/settings	GET/PATCH	Application settings

The exact available endpoints and request formats are implemented in the
backend/routes/ directory.

🧪 Fallback Risk Calculation

The backend also contains a fallback risk-calculation mechanism.

If the external Python risk engine is temporarily unavailable, the
backend can continue operating using its fallback risk calculation for
relevant workflows.

This improves application resilience by avoiding complete dependence on
the separate ML service.

📊 Example Operational Scenario

A typical disruption workflow is:

1. Vehicle starts on a planned route
             ↓
2. Vehicle location is monitored
             ↓
3. A critical road incident is reported
             ↓
4. Incident is associated with the nearby road
             ↓
5. Risk information is calculated
             ↓
6. Alert is generated
             ↓
7. Original route is identified as hazardous/blocked
             ↓
8. Alternative routes are evaluated
             ↓
9. Safer alternative route is selected
             ↓
10. Vehicle continues through the updated route

This demonstrates the integration between field intelligence, risk
assessment, route planning, vehicle monitoring and alerting.

👥 Team Contributions

Cloud9 is a team project developed for Smart India Hackathon 2026 —
Problem Statement 26002.

Backend — Sounak Ghosh

My primary contribution was the backend and system integration layer,
including:

Node.js and Express backend
REST API development
MongoDB integration
Authentication workflows
Vehicle and delivery management APIs
Road and incident management
Alert management
Geospatial backend functionality
Route-risk backend integration
Backend support for field incident workflows

Risk Engine / ML — Dipti Singh
Python/FastAPI risk engine
Random Forest landslide prediction
Terrain and rainfall feature processing
ML model integration


Frontend — Masoom
React/Vite application
GIS dashboard
Map visualization
Route planner
Vehicle and incident interfaces
Operational dashboards

The repository contains the complete integrated team project. The
backend listed above represents my primary individual contribution.

📌 Project Information

Project: Cloud9 — NER Logistics Intelligence Platform

Hackathon: Smart India Hackathon 2026

Problem Statement: SIH26002

Domain: Smart Automation / Transportation & Logistics

Region: North Eastern Region of India

Primary Goal: Disaster-aware logistics intelligence, accessibility
monitoring and safer route decision support for the NER.