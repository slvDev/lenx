# Functional Specification: Lens Account Web Interface - MVP (Iteration 1)

## 1. Introduction

This document outlines the functional requirements for the Minimum Viable Product (MVP) of a web interface designed to interact with a custom EVM Smart Accoun - Lens Account. Users (Owners) will be able to identify their Lens Account, connect their controlling EOA wallet, view a basic balance, and use WalletConnect v2 to interact with external dApps _through_ the Lens Account.

## 2. Target Audience

This specification is intended for developers, QA testers, and product managers involved in building the MVP.

## 3. Key Concepts

- **Lens Account:** The EVM smart contract wallet being managed. It has a single `owner()` address.
- **Owner EOA:** The Externally Owned Account (e.g., MetaMask, hardware wallet address) designated as the `owner()` of the Lens Account. This wallet is used to authorize actions _for_ the Lens Account.
- **Lens Username:** A username potentially linked to a Lens Account address via the `LensGlobalNamespace` contract.
- **WalletConnect (WC):** A protocol allowing wallets (in this case, our interface acting _as_ a wallet for the Lens Account) to connect to dApps.
- **Lens Chain:** The specific blockchain (ID 232) where the Lens Account and related contracts reside.

## 4. Core Scenarios (MVP)

### Scenario 1: Account Discovery and Owner Login

**Goal:** The user identifies their target Lens Account using either a Lens username or the account address and connects their corresponding Owner EOA wallet, ensuring they are on the correct network.

**Steps:**

1.  **Initial View:** The user accesses the web application's main entry page (`/`).
2.  **Input Fields:** The user is presented with two input fields:
    - "Lens Username"
    - "Account Address"
3.  **Username Input (User Action):**
    - The user types a Lens username into the "Lens Username" field.
    - **(App Action):** As the user types (debounced), the application queries the `LensGlobalNamespace` contract on the Lens Chain using the `accountOf(string calldata name)` function.
    - **(Outcome):**
      - If an address is returned, the "Account Address" field is automatically populated with the resolved address.
      - If no address is found (or an error occurs), the "Account Address" field remains empty or clears, and subtle feedback may be shown (e.g., input border color change).
4.  **Address Input (User Action):**
    - The user types or pastes an address into the "Account Address" field.
    - **(App Action):** As the user types/pastes, the application checks until address length & format is correct (0x + 20 chars) and queries the `LensGlobalNamespace` contract on the Lens Chain using the `usernameOf(address user)` function.
    - **(Outcome):**
      - If a username is returned, the "Lens Username" field is populated.
      - If no username is found, the "Lens Username" field remains empty or clears.
5.  **Owner Verification (App Action):**
    - Once a valid address exists in the "Account Address" field, the application queries the Lens Account contract at that address using the `owner()` function.
    - The application stores the returned `owner` address internally as the _expected owner_.
6.  **Wallet Connection (User Action):**
    - A "Connect Wallet" button becomes enabled/visible once an Account Address is determined.
    - The expected owner is also displayed above the Connect Wallet button with some text (something like "To Login - connect with this Owner wallet:" but proper).
    - The user clicks "Connect Wallet".
    - **(App Action):** A standard wallet connection modal (e.g., RainbowKit) appears, prompting the user to choose and connect their Owner EOA wallet.
    - **(App Action):** The application checks if the connected Owner EOA wallet is currently on the **Lens Chain (ID: 232)**.
    - **(Outcome - Chain Mismatch):**
      - If the wallet is on a different chain, the application (via `wagmi`/`RainbowKit`) prompts the user to switch to the Lens Chain.
      - If the Lens Chain is not configured in the user's wallet, the application prompts the user to add it.
      - The connection process pauses until the wallet is successfully connected to the Lens Chain.
    - **(App Action):** Once the Owner EOA is connected and on the Lens Chain, the application compares the connected wallet's address with the _expected owner_ address stored in step 5.b.
    - **(Outcome - Owner Mismatch):**
      - If the addresses do _not_ match, an error message is displayed clearly indicating the mismatch (e.g., "Incorrect owner connected. Please connect with address: `0x...{expectedOwnerAddress}`").
      - The user remains on the login/discovery page and can attempt to connect a different wallet.
    - **(Outcome - Success):**
      - If the addresses _match_ and the wallet is on the Lens Chain, the user is authenticated for this session.
      - The application navigates the user to the main Dashboard page (e.g., `/dashboard`).

### Scenario 2: Viewing Dashboard & Initiating WalletConnect Pairing

**Goal:** The user views basic account information and connects the Lens Account to an external dApp using a WalletConnect URI.

**Preconditions:**

- User has successfully completed Scenario 1.
- Owner EOA wallet is connected and verified.
- User is on the Dashboard page.

**Steps:**

1.  **Dashboard View:** The user sees the Dashboard.
2.  **Account Info Display (App Action):**
    - The Lens Account address is displayed.
    - The WGHO token balance for the Lens Account is fetched and displayed (formatted).
3.  **WalletConnect Input:** The user sees a dedicated section/component for WalletConnect containing:
    - An input field labeled "Paste WalletConnect Code".
    - A "Connect" button next to the input field.
4.  **Obtain WC URI (User Action):** The user navigates to an external dApp (e.g., Aave) and initiates a WalletConnect connection, copying the generated WC v2 URI (e.g., `wc:abc...`).
5.  **Paste & Connect (User Action):**
    - The user pastes the WC URI into the input field in _this_ web app.
    - The user clicks the "Connect" button.
6.  **Pairing & Session (App Action):**
    - The application uses the `@walletconnect/web3wallet` SDK to initiate pairing with the provided URI.
    - The SDK emits a `session_proposal` event.
    - The application automatically approves the session proposal using the Lens Account's address, enforcing Lens Chain (ID: 232) as the only supported chain regardless of dApp's requested chains.
    - The WalletConnect session is established between this interface (acting for the Lens Account) and the external dApp.
    - The input field clears and the WalletConnect section updates to show:
      - A prominent "Connected" status indicator in green
      - Connected dApp information from the session data:
        - dApp name and icon
        - Website URL
        - Connected chain (should always show Lens Chain)
        - Session ID (for debugging purposes)

### Scenario 3: Handling WalletConnect Transaction Requests

**Goal:** The user receives a transaction request from a connected external dApp and authorizes its execution via their Owner EOA.

**Preconditions:**

- User has successfully completed Scenario 1 & 2.
- An active WalletConnect session exists between the Lens Account interface and an external dApp.

**Steps:**

1.  **Request Initiation (External Action):** The user performs an action on the external dApp that requires a transaction (e.g., depositing collateral on Aave).
2.  **Request Reception (App Action):**
    a. The external dApp sends a request (typically `eth_sendTransaction` containing `to`, `value`, `data`) over the established WC session.
    b. The `@walletconnect/web3wallet` SDK listener in the application receives the `session_request` event.
3.  **Request Display:**
    - The application updates its state to indicate a pending request.
    - A dedicated component (`WcRequestDisplay`) appears on the Dashboard, showing:
      - The requesting dApp's name/icon (from session metadata).
      - The transaction details:
        - **Target Address (`to`):** The contract the Lens Account will call.
        - **Value (`value`):** Amount of native currency (GHO) to send (formatted).
        - **Data (`data`):** The raw calldata for the transaction. (MVP: Display raw hex data. Decoding can be added later).
      - A "Send Transaction" button.
      - A "Reject" button (optional for MVP, but good practice).
4.  **User Review & Action:**
    - The user reviews the displayed transaction details.
    - **(Option A - Send):** The user clicks "Send Transaction".
    - **(App Action - Execute):**
      - The application prepares the call to the Lens Account's `executeTransaction(address target, uint256 value, bytes calldata data)` function, using the parameters from the WC request.
      - It triggers the transaction using `wagmi`.
      - The connected **Owner EOA wallet** (MetaMask, etc.) prompts the user to confirm _this_ transaction (the one calling `executeTransaction` on the Lens Account).
      - **(User Action):** The user confirms the transaction in their EOA wallet.
      - The transaction is sent to the Lens Chain network.
      - The application waits for the transaction hash.
      - Upon receiving the hash, the application sends a _success response_ containing the transaction hash back to the external dApp via the WalletConnect session (`web3wallet.respondSessionRequest`).
      - The `WcRequestDisplay` component is hidden or updated.
      - A success indicator (e.g., checkmark, brief message "Transaction Submitted") is displayed on the dashboard.
    - **(Option B - Reject):** The user clicks "Reject" (if implemented).
    - **(App Action - Reject):**
      - The application sends an _error response_ (e.g., user rejection error) back to the external dApp via the WalletConnect session.
      - The `WcRequestDisplay` component is hidden.

### Scenario 4: Handling Errors during WC Request Execution

**Goal:** Inform the user and the external dApp if an error occurs during the authorization or sending of a WC transaction request.

**Steps (Owner Rejection):**

1.  Follow Scenario 3 up to step 4.c.iii (Owner EOA wallet prompt).
2.  **User Action:** User explicitly rejects the transaction in their wallet.
3.  **(App Action):** The `wagmi` transaction hook/promise rejects with a user rejection error.
4.  The application sends an _error response_ (user rejection) back to the external dApp via WalletConnect.
5.  The `WcRequestDisplay` component is hidden.
6.  An error message is displayed on the dashboard (e.g., "Transaction rejected by user").

**Steps (Blockchain Error):**

1.  Follow Scenario 3 up to step 4.c.v (Transaction sent).
2.  **(Blockchain Action):** The transaction execution _fails_ on the Lens Chain (e.g., reverts).
3.  **(App Action):** The `wagmi` transaction hook/promise resolves with a failed status (or requires checking the receipt).
4.  The application sends an _error response_ (generic execution error) back to the external dApp via WalletConnect.
5.  The `WcRequestDisplay` component is hidden.
6.  An error message is displayed on the dashboard (e.g., "Transaction failed on-chain").

## 5. Non-Functional Requirements (MVP)

- **Target Network:** The application MUST operate exclusively on the Lens Chain Mainnet (ID: 232). Network configuration should reflect this.
- **Responsiveness:** The UI should be usable on standard desktop browsers. Mobile responsiveness is secondary for the MVP.
- **Error Handling:** Basic error messages should be displayed for contract call failures, lookup failures, WC connection issues, and incorrect owner connections.
- **Performance:** Interactions (lookups, balance fetches) should feel reasonably responsive. Debouncing should be used for inputs triggering lookups.

## 6. Out of Scope (MVP - Iteration 1)

- Displaying Transaction History or Queue (beyond the currently active WC request).
- Initiating _new_ transactions (e.g., Send ETH/Token) directly from the UI.
- Managing Lens Account settings (Owners, Threshold).
- Detailed decoding of transaction data within the WC request display.
- Address Book functionality.
- NFT display or management.
- Advanced WalletConnect session management (listing active sessions, manual disconnection).
- Gas controls or advanced transaction parameters.
- Support for multiple Lens Account types or versions beyond the specific one targeted.
- Account Manager roles.
- Push notifications or complex real-time updates beyond basic WC request handling.

## 7. Lens Chain Details

- **Chain Type:** ZkSync-based L2, EVM-compatible
- **Network Name:** Lens Chain Mainnet
- **New RPC URL:** https://rpc.lens.xyz
- **Chain ID:** 232
- **Currency Symbol:** GHO
- **Block Explorer URL:** https://explorer.lens.xyz
