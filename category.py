import json

categories_map = {}

def gen_categories_map():
    with open("data/business.json", "r") as f:
        for line in f:
            data = json.loads(line)
            if data["state"] == "IL":
                b_id = data["business_id"]
                categories = data["categories"]
                if categories is not None:
                    categories = categories.split(", ")
                    for c in categories:
                        categories_map[c] = categories_map[c] + 1 if c in categories_map else 1
        
        print(sorted(categories_map.items(), key=lambda x: x[1]))
    with open("data/IL_categories_stat.json", "w") as out:
        json.dump(categories_map, out)

if __name__ == "__main__":
    gen_categories_map()