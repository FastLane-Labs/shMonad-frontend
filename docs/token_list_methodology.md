# Uniswap V3 Pools Data Fetching and Token List Creation

## Overview

This document outlines the process of fetching data for the top 100 Uniswap V3 pools on the Polygon network, extracting a unique list of traded tokens, and formatting the data into a JSON token list schema.

## Steps

### 1. Fetching Top 100 Uniswap V3 Pools on Polygon

- **URL**: `https://interface.gateway.uniswap.org/v1/graphql`
- **Query**:
  - Fetch the top 100 Uniswap V3 pools on the Polygon network.
  - Variables:
    - `first`: 100
    - `chain`: "POLYGON"

### 2. Retrieve Unique List of Tokens

- Extract a unique list of tokens traded in the fetched pools.
- Ensure each token includes the following details:
  - `chainId`: 137
  - `address`
  - `decimals`
  - `name`
  - `symbol`
  - `logoURI`

### 3. Adapting the List to JSON Token List Schema

- Format the extracted tokens into the JSON token list schema.
  - Example structure:
    ```json
    {
        "chainId": 137,
        "address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        "decimals": 6,
        "name": "USD Coin (PoS)",
        "symbol": "USDC",
        "logoURI": "https://example.com/logo.png"
    }
    ```

### 4. Verify with On-Chain Data

- Check the list using on-chain data pulled from the respective ERC20 smart contracts.

### Final Output

- The final JSON file will contain an array of token objects, each adhering to the specified schema.
- Save the list of unique tokens to a JSON file for further use.
