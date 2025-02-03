# FireWatch 🔥
## SAP Challenge Winner 🏆- ConUHacks 2025 
Challenge: Create a platform to optimize the deployment of firefighting resources.
- Part 1: Minimize the total cost and the number of high severity missed responses. Contraints include the cost per unit deployment, cost of missing a fire, the severity of the fire.
- Part 2: Use machine learning to predict future fires based on historical environmental and wildfire data. The model should be able to predict the severity of the fire and the location of the fire. We want to easily visualize the predictions on a map.

Submission Project: https://devpost.com/software/firewatch-qn4yap
### Frontend Setup
Prerequisite: Node.js

- Run `cp .env.example .env` 
- Fill the `.env` file with the required information
- Run `npm install`
- Run `npm run dev`
- Naviguate to `http://localhost:5173`

### Backend Setup
Prerequisite: Python

- Open a new terminal
- Run `cd backend`
- Run `python -m venv venv`
- Run 
  - On Windows: `venv\Scripts\activate`
  - On Mac/Linux: `source venv/bin/activate`
- Run `pip install -r requirements.txt`
- Run `python main.py` (or maybe `python3 main.py`)
- API is now running on `http://localhost:5000`

### Team Members
- Mohamed Amine Elarabi
- Mohammed Larbi Turki
- Abdul Rahman Zahid
- James Brutus