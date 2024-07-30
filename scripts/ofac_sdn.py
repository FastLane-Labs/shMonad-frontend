import re
import json
import sys


def main():
    if len(sys.argv) < 3:
        print("Usage: python ofac_sdn.py <input_file> <output_file>")
        sys.exit(1)

    # Get the input file content
    input_file = sys.argv[1]
    with open(input_file) as f:
        content = f.read()

    # Get the output file name
    outpute_file = sys.argv[2]

    # Parse the file and find all Ethereum addresses
    eth_addresses = re.compile(r"0x[a-fA-F0-9]{40}").findall(content)

    # Save the addresses to a json file
    with open(outpute_file, "w") as f:
        f.write(json.dumps(eth_addresses, indent=2))


if __name__ == "__main__":
    main()
