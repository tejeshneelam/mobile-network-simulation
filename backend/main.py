from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from core_logic import NetworkList, Network, User
from fastapi.middleware.cors import CORSMiddleware




app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000"] for stricter security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

networkList = NetworkList()
active_network = None

class TowerRequest(BaseModel):
    name: str
    x: int
    y: int
    height: int

class UserRequest(BaseModel):
    name: str
    number: int
    x: int
    y: int

class CallRequest(BaseModel):
    number1: int
    number2: int

@app.post("/create-network/{name}")
def create_network(name: str):
    global active_network
    network = Network(name)
    networkList.addNetwork(network)
    active_network = network
    return {"message": f"Network '{name}' created and set as active."}

@app.post("/add-tower")
def add_tower(tower: TowerRequest):
    if not active_network:
        raise HTTPException(status_code=400, detail="No active network selected.")
    active_network.insert_vertex(tower.name, tower.x, tower.y, tower.height)
    return {"message": f"Tower '{tower.name}' added successfully."}

@app.post("/add-user")
def add_user(user: UserRequest):
    if not active_network:
        raise HTTPException(status_code=400, detail="No active network selected.")
    u = active_network.addUser(user.name, user.number, user.x, user.y)
    return {"message": f"User '{user.name}' added and registered to network."}

@app.post("/make-call")
def make_call(call: CallRequest):
    if not active_network:
        raise HTTPException(status_code=400, detail="No active network selected.")
    result = active_network.makeCall(networkList, call.number1, call.number2)
    return {"message": result}
