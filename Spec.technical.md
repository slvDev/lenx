# Technical Specification: Lens Account Web Interface - MVP (Iteration 1)

**Version:** 1.0
**Date:** 2024-10-27

---

## 1. Introduction

### 1.1. Purpose

This document provides the technical details necessary for the development of the Minimum Viable Product (MVP) of the Lens Account Web Interface. It outlines the technology stack, architecture, key components, APIs, data structures, and implementation details derived from the Functional Specification (`Spec.functional.md`).

### 1.2. Scope

The scope of this MVP is limited to the core scenarios defined in the Functional Specification:

1.  **Account Discovery & Owner Login:** Identifying a Lens Account via username or address, connecting the Owner EOA wallet, and verifying ownership on the Lens Chain.
2.  **Dashboard & WalletConnect Pairing:** Displaying basic Lens Account info (address, balance) and initiating WalletConnect v2 pairings with external dApps.
3.  **WalletConnect Transaction Handling:** Receiving transaction requests from dApps via WalletConnect and facilitating their execution through the Lens Account via the Owner EOA.
4.  **Basic Error Handling:** Managing connection and transaction errors.

Features listed as "Out of Scope" in the Functional Specification are not included in this technical plan.

---

## 2. Technology Stack

- **Framework:** Next.js 15+ (App Router recommended)
- **Language:** TypeScript
- **Core Web3 Libraries:**
  - **Wagmi:** v2.x - For React hooks interacting with Ethereum (account state, contract interaction via Owner EOA, chain state, ENS lookups if adapted).
  - **Viem:** v2.x - Used internally by Wagmi for low-level Ethereum operations (encoding, decoding, RPC calls, utilities). May be used directly for specific utilities if needed.
  - **ConnectKit:** Latest compatible version - For the Owner EOA wallet connection UI and simplifying the `useConnect` flow from Wagmi.
  - **@walletconnect/web3wallet:** Latest v2 compatible version - **Crucially**, this SDK is required for the application to act _as a wallet_ on behalf of the Lens Account when interacting with external dApps via WalletConnect. ConnectKit/Wagmi handle connecting the _Owner EOA_ to _this_ app; `@walletconnect/web3wallet` handles connecting _this_ app (representing the Lens Account) to _other_ dApps.
- **UI/Styling:**
  - **Tailwind CSS:** Recommended for utility-first styling to maintain simplicity and avoid heavy UI library dependencies for the MVP. Basic HTML elements (`input`, `button`, `div`, `p`, etc.) styled with Tailwind will suffice. No complex UI component library is necessary initially.
- **State Management:** React Context API / `useState` / `useReducer` for managing application state (e.g., connected owner, target Lens Account, WC sessions/requests). Avoid Redux/Zustand for MVP complexity unless state becomes unmanageable.
- **Linting/Formatting:** ESLint, Prettier (Standard Next.js setup).

**Note on EthersJS:** While Wagmi v1 used EthersJS, Wagmi v2 (used by ConnectKit) uses **Viem**. EthersJS is **not** expected to be a required dependency for this project based on the chosen stack. We will proceed assuming Viem is the primary low-level library.

---

## 3. Architecture

### 3.1. Overview

The application will be a single-page application (SPA) built with Next.js. The core logic will reside within React components and custom hooks.

- **Client-Side Rendering:** Given the heavy reliance on wallet interactions and real-time state, the application will primarily be client-side rendered. Server components might be used for static layout elements if desired, but core functionality requires client components (`"use client"`).
- **Wallet Connection Management:**
  - **Owner EOA Connection:** Managed by ConnectKit, utilizing Wagmi hooks (`useAccount`, `useConnect`, `useDisconnect`, `useSwitchChain`). State will be accessible via Wagmi's context/hooks.
  - **Lens Account WC Connection (Acting as Wallet):** Managed by a dedicated service/context (`WalletConnectService`) wrapping the `@walletconnect/web3wallet` SDK. This service will handle pairing, session proposals/approvals, request handling, and responses.
- **Contract Interaction:**
  - Reading Lens Account `owner()`: Uses Wagmi's `useReadContract`.
  - Reading `LensGlobalNamespace` (`accountOf`, `usernameOf`): Uses Wagmi's `useReadContract`.
  - Reading WGHO Balance: Uses Wagmi's `useReadContract` (ERC20 `balanceOf`).
  - Executing Lens Account Transactions (via Owner EOA): Uses Wagmi's `useWriteContract` targeting the Lens Account's `executeTransaction`.
- **State Management:** A combination of Wagmi's built-in state, local React component state (`useState`), and potentially 1-2 specific React Contexts (e.g., `WalletConnectContext` for managing WC sessions/requests, `LensAccountContext` for holding the target Lens Account address and owner).

### 3.2. Key Modules/Services

- **Wagmi Config (`lib/wagmi.ts`):** Central configuration for Wagmi/ConnectKit (chains, connectors, transports).
- **WalletConnect Service (`services/walletConnectService.ts`):** Singleton or context-provided class encapsulating `@walletconnect/web3wallet` logic (initialization, pairing, event listeners, session management, request/response handling).
- **Lens Contract Service (`services/lensService.ts`):** Optional utility functions abstracting the direct `useReadContract` calls for Lens Account `owner()`, `LensGlobalNamespace` lookups, and WGHO balance.

---

## 4. Project Structure (App Router Example)

```
src/
├── app/
│   ├── dashboard/             # Dashboard page (requires auth)
│   │   └── page.tsx
│   ├── layout.tsx             # Root layout (WagmiProvider, etc.)
│   └── page.tsx               # Root page (Login/Discovery View)
├── components/
│   ├── layout/                # Header, Footer, etc.
│   ├── ui/                    # Basic UI elements (Button, Input - if abstracting)
│   ├── AccountDisplay.tsx     # Shows Lens Account Address/Balance
│   ├── ConnectOwnerButton.tsx # Uses ConnectKit button/logic
│   ├── DiscoveryForm.tsx      # Username/Address input fields
│   ├── WcConnect.tsx          # WC URI input and connection status
│   └── WcRequestDisplay.tsx   # Displays incoming WC requests
├── contexts/
│   ├── WalletConnectProvider.tsx # Manages WC state/service
│   └── LensAccountProvider.tsx   # Manages target Lens Account state
├── hooks/
│   ├── useLensLookup.ts       # Custom hook for username/address lookups
│   └── useWcRequestHandler.ts # Custom hook for handling WC requests
├── services/
│   ├── walletConnectService.ts # Wrapper around @walletconnect/web3wallet
│   └── lensService.ts          # (Optional) Utilities for Lens contract reads
├── lib/
│   ├── wagmi.ts               # Wagmi/ConnectKit config
│   ├── constants.ts           # Chain info, contract addresses, ABIs
│   └── utils.ts               # Helper functions
├── public/
│   └── ...                    # Static assets
├── styles/
│   └── globals.css            # Tailwind directives
├── .env.local                 # Environment variables (WC Project ID)
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 5. Core Components & Logic Implementation

### 5.1. Scenario 1: Account Discovery and Owner Login (`/app/page.tsx`, `DiscoveryForm.tsx`, `ConnectOwnerButton.tsx`)

- **UI:** `DiscoveryForm.tsx` contains two `<input>` fields styled with Tailwind. `ConnectOwnerButton.tsx` wraps ConnectKit's logic.
- **State:** Local state (`useState`) in `DiscoveryForm.tsx` for input values. A shared state (Context or prop drilling from `page.tsx`) for the determined Lens Account address and expected owner address.
- **Logic (`useLensLookup.ts`, `DiscoveryForm.tsx`):**
  - Use `React.useEffect` with debouncing for input changes.
  - Inside `useEffect`, call `useReadContract` (Wagmi) targeting `LensGlobalNamespace` (`accountOf` or `usernameOf`). **Important:** Need to configure `useReadContract` specifically for Lens Chain (ID 232). Pass the `chainId` parameter.
  - Update the corresponding input field based on lookup results.
  - Once an address is confirmed, call `useReadContract` targeting the Lens Account address for the `owner()` function. Store the result as `expectedOwner`.
  - Display `expectedOwner` near the connect button.
- **Owner Connection (`ConnectOwnerButton.tsx`, `page.tsx`):**
  - Use `ConnectKitButton` component or `useConnect` (Wagmi) + `useAccount` (Wagmi). ConnectKit is simpler.
  - The `wagmi.ts` config must include the Lens Chain definition. ConnectKit/Wagmi will handle prompting the user to add/switch to the Lens Chain.
  - After connection, use `useAccount` hook (Wagmi) to get the `address` and `chainId`.
  - Compare `address` with `expectedOwner`.
  - If match and `chainId === 232`, navigate to `/dashboard` (e.g., using `next/navigation`'s `useRouter`). Store the Lens Account address and Owner EOA address in Context/State for the dashboard.
  - If mismatch, display an error message.

### 5.2. Scenario 2: Viewing Dashboard & Initiating WalletConnect Pairing (`/app/dashboard/page.tsx`, `AccountDisplay.tsx`, `WcConnect.tsx`, `WalletConnectProvider.tsx`, `services/walletConnectService.ts`)

- **UI:** `AccountDisplay.tsx` shows Lens address (from Context/State) and balance. `WcConnect.tsx` shows WC URI input/button initially, then connected dApp info.
- **State:** `WalletConnectContext` manages `Web3Wallet` instance, active sessions, and pairing state.
- **Logic:**
  - Fetch WGHO balance using `useReadContract` (Wagmi) targeting the ERC20 contract with the Lens Account address. Format using Viem's `formatUnits`.
  - In `WalletConnectProvider.tsx` (or on component mount):
    - Initialize `Web3Wallet` from `@walletconnect/web3wallet` using `projectId` from `.env.local`. Store the instance.
    - Set up listeners (`web3wallet.on('session_proposal', ...)` etc.) defined in `walletConnectService.ts`.
  - **Pairing (`WcConnect.tsx`, `walletConnectService.ts`):**
    - On "Connect" button click with URI: Call `web3wallet.core.pairing.pair({ uri })`.
  - **Session Approval (`walletConnectService.ts` listener):**
    - On `session_proposal` event:
      - Construct approved `namespaces` containing **only** the Lens Chain (`eip155:232`) and the Lens Account address (`eip155:232:0x...`). Include standard methods (`eth_sendTransaction`, `personal_sign`, etc.).
      - Call `web3wallet.approveSession({ id: proposal.id, namespaces })`.
      - Store the resulting session details in the `WalletConnectContext`.
      - Update UI state in `WcConnect.tsx` to show connected dApp info.

### 5.3. Scenario 3 & 4: Handling WalletConnect Transaction Requests (`/app/dashboard/page.tsx`, `WcRequestDisplay.tsx`, `useWcRequestHandler.ts`, `services/walletConnectService.ts`)

- **UI:** `WcRequestDisplay.tsx` conditionally renders when a request is pending in `WalletConnectContext`. Displays request details and Approve/Reject buttons.
- **State:** `WalletConnectContext` stores the current pending `session_request` event payload.
- **Logic:**
  - **Request Listener (`walletConnectService.ts`):**
    - On `session_request` event: Store the event payload (`topic`, `params`, `id`) in `WalletConnectContext` state.
  - **Transaction Execution (`WcRequestDisplay.tsx`, `useWcRequestHandler.ts`):**
    - On "Send Transaction" click:
      - Retrieve request details (`to`, `value`, `data`) from the context state.
      - Use Viem's `encodeFunctionData` to prepare the calldata for the Lens Account's `executeTransaction(address target, uint256 value, bytes calldata data)` function.
      - Call the `writeContract` mutation function returned by `useWriteContract` (Wagmi), providing:
        - `address`: The Lens Account address (from Context/State).
        - `abi`: The Lens Account ABI (including `executeTransaction`).
        - `functionName`: `'executeTransaction'`.
        - `args`: `[to, value, data]`.
        - `account`: The connected Owner EOA address (from `useAccount`).
        - `chainId`: Must be Lens Chain ID (232).
      - Handle `useWriteContract`'s `isPending`, `isSuccess`, `error` states.
      - If `isPending`, show loading state.
      - If `error`, call `web3wallet.respondSessionRequest` with an appropriate error payload (e.g., `{ code: 5000, message: 'User Rejected' }` or a generic error). Display error in UI. Clear the pending request state.
      - If `isSuccess` (meaning the _Owner EOA_ transaction was submitted), wait for the transaction receipt using `useWaitForTransactionReceipt` (Wagmi).
        - If the receipt status is `'success'`, call `web3wallet.respondSessionRequest({ topic, response: { id, result: receipt.transactionHash, jsonrpc: '2.0' } })`. Display success in UI. Clear the pending request state.
        - If the receipt status is `'reverted'`, call `web3wallet.respondSessionRequest` with a generic execution error payload. Display error in UI. Clear the pending request state.
    - On "Reject" button click:
      - Call `web3wallet.respondSessionRequest` with a user rejection error payload.
      - Clear the pending request state.

---

## 6. State Management

- **Wagmi:** Manages Owner EOA connection state (address, chainId, connector, connection status) and provides TanStack Query caching for reads.
- **LensAccountContext:** Stores the identified Lens Account address and the verified Owner EOA address upon successful login.
- **WalletConnectContext:** Stores the `@walletconnect/web3wallet` instance, active WC sessions (list/map), current pending WC request payload, and connection/pairing status flags.
- **Local Component State:** Used for form inputs, UI loading/error states within specific components.

---

## 7. Styling

- Utilize **Tailwind CSS** for styling all components.
- Keep styling minimal and functional for the MVP.
- Ensure basic layout structure (header, main content area).

---

## 8. Error Handling

- Implement `try...catch` blocks around critical operations (WC pairing, session approval, request responses).
- Utilize the `error` states returned by Wagmi hooks (`useReadContract`, `useWriteContract`, `useWaitForTransactionReceipt`).
- Display user-friendly error messages for common issues (network mismatch, incorrect owner, transaction rejection, WC errors, contract reverts). Log detailed errors to the console for debugging.
- Specifically handle WalletConnect SDK errors during pairing and session proposals.

---

## 9. Constants & Configuration

- **`lib/constants.ts`:**
  - `LENS_CHAIN_ID = 232`
  - `LENS_CHAIN_RPC_URL = 'https://rpc.lens.xyz'`
  - `LENS_CHAIN_EXPLORER_URL = 'https://explorer.lens.xyz'`
  - `LENS_CHAIN_CURRENCY = { name: 'GHO', symbol: 'GHO', decimals: 18 }`
  - `LENS_GLOBAL_NAMESPACE_ADDRESS = '0x1aA55B9042f08f45825dC4b651B64c9F98Af4615'`
  - `WGHO_TOKEN_ADDRESS = '0x6bDc36E20D267Ff0dd6097799f82e78907105e2F'` (Actual Address Needed)
  - `LENS_ACCOUNT_ABI = [...]` (Include `owner()`, `executeTransaction()`)
  - `LENS_GLOBAL_NAMESPACE_ABI = [...]` (Include `accountOf(string)`, `usernameOf(address)`)
  - `ERC20_ABI = [...]` (Include `balanceOf(address)`)
- **`lib/wagmi.ts`:**
  - Define the `lensChain` object using Viem's `defineChain`.
  - Configure `createConfig` (Wagmi) with `chains: [lensChain]`, necessary connectors (e.g., `injected`, `walletConnect`), and transports.
- **`.env.local`:**
  - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<Your_WC_Project_ID>` (Obtain from [cloud.walletconnect.com](https://cloud.walletconnect.com/))

---

## 10. Deployment

- Standard Next.js deployment process (e.g., Vercel, Netlify).
- Ensure environment variables (like `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`) are configured in the deployment environment.

---

## 11. Future Considerations (Post-MVP)

- Support for multiple Lens Account types/versions.
- Transaction history display.
- Direct sending of GHO/WGHO from the UI.
- More detailed transaction decoding for WC requests.
- Advanced error handling and user feedback.
- Mobile responsiveness improvements.
- Session management UI (disconnecting specific WC sessions).
- Support for additional WC methods (e.g., `personal_sign`).
- Potential integration of Safe SDKs if the Lens Account implements Safe compatibility layers.
