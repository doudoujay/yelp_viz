import json
# use review.json and tip.json to build user and bus relationship

user_to_bus = {}  # string -> set


def gen_user_to_bus_map():
    with open("data/review.json", "r") as review:
        for line in review:
            data = json.loads(line)
            u_id = data["user_id"]
            b_id = data["business_id"]
            if u_id in user_to_bus and b_id not in user_to_bus[u_id]:
                user_to_bus[u_id].add(b_id)
            else:
                user_to_bus[u_id] = {b_id}

    with open("data/tip.json", "r") as tip:
        for line in tip:
            data = json.loads(line)
            u_id = data["user_id"]
            b_id = data["business_id"]
            if u_id in user_to_bus and b_id not in user_to_bus[u_id]:
                user_to_bus[u_id].add(b_id)
            else:
                user_to_bus[u_id] = {b_id}

    for key in user_to_bus:
        user_to_bus[key] = list(user_to_bus[key])

    with open("user_to_bus_map.json", "w") as out:
        json.dump(user_to_bus, out)

    
def gen_bus_edge():
    with open("user_to_bus_map.json", "r") as f:
        user_to_bus = json.load(f)
        for user_id in user_to_bus:
            business_ids = user_to_bus[user_id]

if __name__ == "__main__":
    gen_bus_edge()
