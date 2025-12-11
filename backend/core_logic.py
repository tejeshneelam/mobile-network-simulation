import math

class Stack:
    class Node:
        def __init__(self, data):
            self.data = data
            self.next = None

    def __init__(self):
        self.head = None

    def push(self, data):
        newnode = self.Node(data)
        newnode.next = self.head
        self.head = newnode

    def pop(self):
        if self.head is None:
            return None
        temp = self.head
        self.head = self.head.next
        return temp.data

    def top(self):
        return self.head.data if self.head else None

class Edge:
    def __init__(self, data, origin, destination):
        self.origin = origin
        self.destination = destination
        self.distance = data

class Vertex:
    def __init__(self, data, msc, x, y, ht):
        self.data = data
        self.position = (x, y)
        self.type = "tower"
        self.msc = msc
        self.radius = self.coverage_area(ht)

    def coverage_area(self, ht, hr=1.5):
        return math.sqrt(2 * ht) + math.sqrt(2 * hr)

class TelephoneHashMap:
    def __init__(self, capacity=100):
        self.capacity = capacity
        self.size = 0
        self.buckets = [[] for _ in range(capacity)]

    def telephone_hash(self, phone_number):
        part1 = phone_number // 100000
        part2 = phone_number % 100000
        combined = part1 ^ part2
        return combined % self.capacity

    def put(self, phone_number, value):
        index = self.telephone_hash(phone_number)
        bucket = self.buckets[index]
        for i, (pn, _) in enumerate(bucket):
            if pn == phone_number:
                bucket[i] = (phone_number, value)
                return
        bucket.append((phone_number, value))
        self.size += 1

    def get(self, phone_number):
        index = self.telephone_hash(phone_number)
        bucket = self.buckets[index]
        for pn, v in bucket:
            if pn == phone_number:
                return v
        return None

class MSCVertex:
    mainDirectory = TelephoneHashMap()

    def __init__(self, data, x, y):
        self.data = data
        self.position = (x, y)
        self.radius = 0
        self.type = "msc"
        self.directory = TelephoneHashMap()

class User:
    def __init__(self, data, number, x, y):
        self.data = data
        self.number = number
        self.position = (x, y)
        self.connectedTower = None

class Network:
    def __init__(self, name):
        self.msc = MSCVertex(name, 0, 0)
        self.outgoing = {self.msc: {}}

    def get_distance(self, x1, y1, x2, y2):
        return math.sqrt((x2 - x1)**2 + (y2 - y1)**2)

    def is_intersecting(self, x1, y1, r1, x2, y2, r2):
        return self.get_distance(x1, y1, x2, y2) <= (r1 + r2)

    def insert_vertex(self, name, x, y, ht):
        v = Vertex(name, self.msc, x, y, ht)
        min_dist = float('inf')
        nearest = None

        for node in self.outgoing:
            dist = self.get_distance(node.position[0], node.position[1], x, y)
            if dist < min_dist:
                min_dist = dist
                nearest = node

        if nearest != self.msc and self.is_intersecting(
            x, y, v.radius,
            nearest.position[0], nearest.position[1], nearest.radius
        ):
            return  # Overlapping coverage

        self.outgoing[v] = {}
        self.insert_edge(min_dist, nearest, v)
        self.insert_edge(min_dist, v, nearest)

    def insert_edge(self, data, u, v):
        self.outgoing[u][v] = Edge(data, u, v)

    def getPathToMSC(self, start):
        stack = Stack()
        stack.push((start, [start]))
        visited = set()

        while True:
            curr = stack.pop()
            if not curr:
                break
            node, path = curr
            if node.type == "msc":
                return path
            if node not in visited:
                visited.add(node)
                for neighbor in self.outgoing.get(node, {}):
                    if neighbor not in visited:
                        stack.push((neighbor, path + [neighbor]))
        return None

    def addUser(self, name, number, x, y):
        user = User(name, number, x, y)
        self.msc.mainDirectory.put(number, self.msc)

        for tower in self.outgoing:
            if tower.type == "tower":
                if self.get_distance(x, y, tower.position[0], tower.position[1]) <= tower.radius:
                    user.connectedTower = tower
                    self.connectToMSC(user)
                    return user
        return user

    def connectToMSC(self, user):
        path = self.getPathToMSC(user.connectedTower)
        if path:
            msc = path[-1]
            msc.directory.put(user.number, user)

    def makeCall(self, nl, number1, number2):
        msc1 = self.msc.mainDirectory.get(number1)
        user1 = msc1.directory.get(number1) if msc1 else None

        msc2 = self.msc.mainDirectory.get(number2)
        user2 = msc2.directory.get(number2) if msc2 else None

        if not user1 or not user2:
            return "Call failed: user not found"

        return f"Call from {user1.data} to {user2.data} established!"

class NetworkList:
    class Node:
        def __init__(self, network):
            self.network = network
            self.next = None

    def __init__(self):
        self.head = None

    def addNetwork(self, network):
        node = self.Node(network)
        if not self.head:
            self.head = node
        else:
            curr = self.head
            while curr.next:
                curr = curr.next
            curr.next = node

    def getNetwork(self, name):
        curr = self.head
        while curr:
            if curr.network.msc.data == name:
                return curr.network
            curr = curr.next
        return None
