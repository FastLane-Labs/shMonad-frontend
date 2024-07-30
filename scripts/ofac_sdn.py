import requests
import re
import json
import sys

SDN_PATH = (
    "https://sanctionslistservice.ofac.treas.gov/api/PublicationPreview/exports/SDN.XML"
)

eth_addr_regex = re.compile(r"0x[a-fA-F0-9]{40}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python ofac_sdn.py <output_file>")
        sys.exit(1)

    # Get the output file name
    outpute_file = sys.argv[1]

    # Download the file
    response = requests.get(SDN_PATH)

    # Parse the file and find all Ethereum addresses
    eth_addresses = eth_addr_regex.findall(response.text)

    # Save the addresses to a json file
    with open(outpute_file, "w") as f:
        f.write(json.dumps(eth_addresses, indent=2))


if __name__ == "__main__":
    main()
