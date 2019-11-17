import json
from datetime import datetime, date

weekdays = ["Mon", "Tue", "Wedn", "Thur", "Fri", "Sat", "Sun"]
biz = {}
state = {}
def process_stat(d):
    # count fequency
    time_to_count = {}
    for inDate in d["date"]:
        parsed_d = datetime.strptime(inDate, "%Y-%m-%d %H:%M:%S")
        day = weekdays[parsed_d.weekday()]
        hour = str(parsed_d.hour)
        hash = (day, hour)
        if hash in time_to_count:
            time_to_count[hash] += 1
        else:
            time_to_count[hash] = 1
    d["stat"] = []
    for (key, value) in time_to_count.items():
        d["stat"].append({
            "day": key[0],
            "hour": key[1],
            "count": value
        })
        
def main():
    data = []
    data_map = {}
    with open("data/business.json", "r") as f:
        for line in f:
            d = json.loads(line)
            biz[d["business_id"]] = d

    with open("data/checkin.json", "r") as f:
        for line in f:
            d = json.loads(line)
            s = biz[d["business_id"]]["state"]
            # state[s] = state[s] + 1 if s in state else 1 
            if s == "IL":
                d["date"] = d["date"].split(", ")
                process_stat(d)
                data_map[d["business_id"]] = d


    with open("IL_checkin_stat_map.json", "w") as out:
        json.dump(data_map, out)
    
if __name__ == "__main__":
    main()

