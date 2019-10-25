#!/usr/bin/env python
# coding: utf-8

import json

def main():
    print("Please put business.json file in data/ of current directory")
    data = []
    with open("data/business.json", "r") as f:
        for line in f:
            data.append(json.loads(line[:-1]))
    
    for d in data:
        if d.get("categories") is not None:
            del d["hours"]
            d["categories"] = d["categories"].split(",")
            for i in range(len(d["categories"])):
                d["categories"][i] = d["categories"][i].strip()
    with open("data_simplified.json", "w") as out:
        json.dump(data, out)

if __name__ == "__main__":
    main()
