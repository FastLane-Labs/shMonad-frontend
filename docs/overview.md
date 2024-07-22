# Atlas-RFQ Frontend Overview

Atlas-RFQ Frontend is an implementation of the first on-chain intent-based Request for Quote (RFQ) system. Built with React and the Atlas SDK, this frontend leverages the Atlas framework to provide a seamless and efficient token swapping experience on EVM-compatible blockchain networks.

## Atlas Framework

Atlas is a permissionless and modular smart contract framework for Execution Abstraction. It provides applications and frontends with an auction system in which Solvers compete to provide optimal solutions for user intents or MEV redistribution. A User Operation is collected by the app's frontend via the Atlas SDK and sent to an app-designated bundler, which combines it with Solver Operations into a single transaction.

## Key Features

1. **Intent-Based Swaps**: Utilizes Atlas's auction system to find optimal solutions for user swap intents.

2. **Solver Competition**: Leverages multiple Solvers to compete in providing the best execution for user operations.

3. **User-Friendly Interface**: Intuitive design allowing users to easily input swap intents and execute trades.

4. **Wallet Integration**: Seamless connection with popular Web3 wallets for secure transaction signing and balance management.

5. **Real-Time Quotes**: Fetches and displays up-to-date swap quotes from competing Solvers to offer users the best rates.

6. **Transaction Monitoring**: Provides real-time updates on the status of ongoing and past transactions.

7. **Responsive Design**: Optimized for both desktop and mobile devices, ensuring a consistent experience across platforms.

8. **Customizable Settings**: Allows users to adjust parameters for personalized trading preferences.

9. **Network Flexibility**: Supports multiple EVM-compatible networks, with clear network information and switching capabilities.

## Architecture Overview

- **Atlas SDK Integration**: Utilizes the Atlas SDK to interact with the Atlas framework for intent submission and Solver interaction.
- **Component-Based Structure**: Employs a modular React component architecture for maintainability and reusability.
- **Service Abstraction**: Implements service layers for handling User Operations, Solver interactions, and blockchain communications.
- **State Management**: Employs efficient state management techniques to handle complex application states and data flow.
- **Theming Support**: Includes light and dark mode themes for user comfort in various environments.

Atlas-RFQ Frontend aims to showcase the power of intent-based trading using the Atlas framework, providing a seamless, efficient, and secure token swapping experience that leverages competition among Solvers to achieve optimal execution for users.

## Component Overview

```mermaid
graph TD
    GP[GlobalProvider] --> A[App]
    A --> B[Header]
    A --> C[MainContent]
    A --> D[Footer]
    GP -.-> U[TransactionStatusService]
    GP -.-> DD[NetworkConfigService]

    B --> E[WalletConnector]
    B --> F[NotificationOverview]
    B --> H[NetworkInfo]
    B --> I[ThemeToggle]

    F --> T[NotificationEvent]

    C --> G[AtlasRFQCore]

    G --> J[SwapInterface]
    G -.-> V[SwapQuoteService]
    G -.-> W[TokenPriceService]
    G -.-> R[TokenProviderService]

    J --> L[TabNavigation]
    J --> M[SwapPanel]
    J --> N[SettingsButton]
    J --> O[Logo]

    N --> K[SettingsModal]
    M --> P[TokenInputPanel From]
    M --> Q[TokenInputPanel To]
    M --> S[SwapButton]

    P --> T1[TokenInput]
    P --> T2[TokenSelector]
    P --> T3[TokenBalance]
    P --> T4[MaxButton]

    Q --> U1[TokenInput]
    Q --> U2[TokenSelector]

    V --> X[ISwapQuoteProvider]
    X --> Y[UniswapProvider]
    X --> Z[AtlasProvider]

    R --> S1[ITokenProvider]
    S1 --> AA[ConfigFileTokenProvider]

    D --> BB[VersionField]
    D --> CC[Network Logo]

    style A fill:#f9f,stroke:#333,stroke-width:4px
    style GP fill:#ffcccc,stroke:#333,stroke-width:2px
    style G fill:#ccf,stroke:#333,stroke-width:2px
    style V fill:#e6e6fa,stroke:#333,stroke-width:2px
    style W fill:#e6e6fa,stroke:#333,stroke-width:2px
    style R fill:#e6e6fa,stroke:#333,stroke-width:2px
    style U fill:#e6e6fa,stroke:#333,stroke-width:2px
    style DD fill:#e6e6fa,stroke:#333,stroke-width:2px
    style X fill:#d8f0d8,stroke:#333,stroke-width:2px
    style S1 fill:#d8f0d8,stroke:#333,stroke-width:2px
    style Y fill:#fdd,stroke:#333,stroke-width:2px
    style Z fill:#fdd,stroke:#333,stroke-width:2px
    style AA fill:#fdd,stroke:#333,stroke-width:2px

    classDef swapInterfaceText fill:#0fff,color:#000000,font-weight:bold
    class J swapInterfaceText

    classDef atlasRFQCoreText fill:#0fff,color:#000000,font-weight:bold
    class G atlasRFQCoreText

    classDef interfacesText fill:#dadb95,color:#000000,font-weight:bold
    class X,S1 interfacesText

    classDef providerText fill:#c28894,color:#000000,font-weight:bold
    class Y,Z,AA providerText

    classDef serviceText fill:#eef075,color:#677387,font-weight:bold
    class V,W,R,U,DD serviceText

    classDef globalProviderText fill:#ffcccc,color:#000000,font-weight:bold
    class GP globalProviderText
```

## Atlas-RFQ Frontend Service Component Breakdown

### GlobalProvider

Functionality:
* Provides a global state management for the application
* Handles wallet connection and network configuration

Responsibilities:
* Provide a global state management for the application
* Handles wallet connection and network configuration

### TransactionStatusService

Functionality:
* Monitors the status of submitted transactions
* Provides access to past transaction statuses
* Registers monitor jobs for newly submitted transactions

Responsibilities:
* Keep track of all user transactions
* Update transaction statuses in real-time
* Persist transaction statuses for historical reference
* Notify other components (e.g., NotificationOverview) of status changes

### SwapQuoteService

Functionality:
* Interfaces with multiple swap providers (Uniswap, Atlas)
* Retrieves and compares quotes from different sources

Responsibilities:
* Implement the ISwapQuoteProvider interface
* Manage connections to different swap providers (UniswapProvider, AtlasProvider)
* Fetch real-time quotes based on user input
* Compare and select the best available quote
* Handle quote-related errors and edge cases

### TokenPriceService

Functionality:
* Fetches and manages token price data
* Provides up-to-date price information for supported tokens

Responsibilities:
* Regularly update token prices (e.g., every 2-3 minutes)
* Cache price data to reduce API calls
* Convert token amounts to their USD equivalent
* Handle network issues and API failures gracefully

### TokenProviderService

Functionality:
* Manages the list of supported tokens
* Provides token metadata and balance information

Responsibilities:
* Implement the ITokenProvider interface
* Load token list from a configuration file (ConfigFileTokenProvider)
* Fetch token balances for connected wallets
* Provide methods to search and filter tokens
* Keep token metadata (symbol, name, decimals, etc.) up to date

### Atlas SDK Integration

Functionality:
* Integrates the Atlas SDK capabilities into the frontend application
* Manages the core interactions between the frontend and the Atlas framework

Responsibilities:
1. User Operation Creation:
   * Generate user operations based on swap intents input by users
   * Handle necessary signing and validation of user operations

2. Solver Quote Management:
   * Submit user operations to receive quotes from solvers
   * Process and sort received solver operations to present the best available quotes

3. Transaction Handling:
   * Build and validate Atlas transactions combining user and solver operations
   * Manage the submission of these transactions to the Atlas framework

### useWalletConnection Hook

Functionality:
* Manages wallet connections and interactions using a wallet connection library (e.g., wagmi, Web3Modal, or RainbowKit)

Responsibilities:
* Provide a simple interface for connecting and disconnecting wallets
* Expose connected account information and network details
* Handle network switching requests
* Offer methods for transaction signing, including Atlas-specific operations
* Manage wallet connection state

### NetworkConfigService

Functionality:
* Stores and provides access to network-specific configurations for Atlas-RFQ Frontend

Responsibilities:
* Maintain a mapping of supported network configurations, including:
  - Multicall contract addresses
  - Atlas contract addresses
  - Chain IDs
* Provide methods to retrieve configuration details for the current or a specified network
* Update configuration details when necessary (e.g., contract address changes)

Implementation Notes:
* Implemented as a simple service or context provider
* Does not handle network switching or detection (managed by wallet connection library)
* Coordinates with the Atlas SDK to ensure consistent network configurations