# Project Architecture: Lens Profile X-Handle Onboarding & Smart Account Manager

**Version:** 1.1
**Date:** 2024-11-16

---

## 1. Introduction

### 1.1. Purpose

This document outlines the architecture for a Next.js web application that enables users to:

1.  Log in with X (Twitter) to fetch their X handle as a suggestion for a Lens Profile.
2.  Connect their own Externally Owned Account (EOA) wallet (e.g., MetaMask).
3.  Mint a new Lens Profile on Polygon using the suggested handle (or a custom one), signed by their connected EOA.
4.  Manage their Lens Profile as an EVM Smart Account on the Lens Chain (ID 232).
5.  Interact with external dApps through their Lens Profile using WalletConnect v2, with actions authorized by their connected EOA.

This architecture focuses on using X login for handle acquisition and relies on user-provided EOAs for all blockchain operations.

### 1.2. Scope

This architecture covers:

- X (Twitter) OAuth integration to fetch the user's X handle.
- User EOA wallet connection (e.g., via ConnectKit/Wagmi).
- Lens Profile minting on Polygon, using the fetched X handle as a suggestion.
- Using the minted/existing Lens Profile as a "Lens Account" on Lens Chain.
- Core functionalities: Dashboard, WalletConnect Pairing, and Transaction Handling via the Lens Account on Lens Chain, controlled by the user's connected EOA.

---

## 2. Overall System Flow

The user journey can be summarized as follows:

1.  **Landing Page:** User visits the application.
2.  **Login with X (Optional Handle Fetch):**
    - User clicks "Login with X".
    - Standard OAuth flow with X (Twitter) is initiated.
    - Upon successful authentication, the user's X handle is fetched. This handle is primarily for suggestion purposes.
3.  **Connect Wallet (Owner EOA):**
    - User is prompted to connect their EOA wallet (e.g., MetaMask, WalletConnect compatible) using a library like ConnectKit.
    - This connected wallet becomes the **Owner EOA** for all subsequent blockchain operations.
4.  **Lens Profile Check & Minting (on Polygon):**
    - The application checks if the connected Owner EOA already owns a Lens Profile on Polygon.
    - If no profile exists:
      - The user is prompted to choose a handle. The fetched X handle (if login with X was done) is pre-filled as a suggestion.
      - The user confirms the handle and initiates minting.
      - The Lens Profile minting transaction is signed by the connected **Owner EOA** on Polygon.
    - The newly minted (or existing) Lens Profile NFT address becomes the **Lens Account Address** for this application on Lens Chain.
5.  **Dashboard Access (on Lens Chain):**
    - The user is redirected to the dashboard.
    - The connected Owner EOA is confirmed as the owner of the Lens Account (Lens Profile acting as a smart account) on Lens Chain.
6.  **Lens Account Management (on Lens Chain):**
    - **View Info:** Display Lens Account address (Profile NFT address) and WGHO balance on Lens Chain.
    - **WalletConnect Pairing:** User pastes a WalletConnect URI from an external dApp. The application (acting as a wallet for the Lens Account) pairs with the dApp.
    - **Transaction Handling:**
      - The dApp sends transaction requests (e.g., `eth_sendTransaction`) to the Lens Account via WalletConnect.
      - The application displays the request to the user.
      - User approves. The application constructs an `executeTransaction` call for the Lens Account contract.
      - The connected **Owner EOA** signs and sends this `executeTransaction` on Lens Chain.
      - The result (transaction hash or error) is relayed back to the dApp.

---

## 3. Core Components & Responsibilities

### 3.1. Frontend (Next.js Application)

- **UI Components:**
  - `LoginPage.tsx`: Contains "Login with X" button and "Connect Wallet" button.
  - `MintProfilePage.tsx` / `MintProfileModal.tsx`: Form for handle input (pre-filled with X handle if available) and minting logic.
  - `DashboardPage.tsx`: Displays Lens Account info, WalletConnect UI, transaction request modals.
  - Shared UI elements (Buttons, Inputs, Modals) styled with Tailwind CSS, animated with Framer Motion.
- **Routing:** Next.js App Router.
  - `/`: Login page.
  - `/mint-profile`: Page/route for profile minting if necessary post-wallet connection.
  - `/dashboard`: Main application interface after login/wallet connection and profile setup.
- **State Management:**
  - **XAuthContext:** Manages X OAuth state (is X authenticated, X handle).
  - **Wagmi's internal state & ConnectKit:** Manages Owner EOA connection (address, chain, signer), connection status.
  - **LensProfileContext:** Manages the active Lens Profile ID/handle, Lens Profile address (Lens Account address), and its ownership status relative to the connected Owner EOA.
  - **WalletConnectContext:** Manages `@walletconnect/web3wallet` instance, sessions, and requests.
  - Local component state (`useState`, `useReducer`).

### 3.2. Services

- **`XAuthService` (`services/xAuthService.ts`):**
  - Handles the X (Twitter) OAuth 2.0 PKCE flow (client-side or with a minimal backend helper for token exchange if X API requires it for security).
  - Fetches the user's X handle.
  - Provides functions like `loginWithX()`, `logoutFromX()`.
- **`LensProtocolService` (`services/lensProtocolService.ts`):**
  - Uses the Lens Protocol SDK (e.g., `@lens-protocol/client`).
  - Functions for:
    - Checking if an EOA has a Lens Profile.
    - Fetching existing profile details.
    - Minting a new Lens Profile (handle creation, preparing transaction for signing by Owner EOA on Polygon).
    - Fetching profile metadata.
- **`WalletConnectService` (`services/walletConnectService.ts`):**
  - Wraps `@walletconnect/web3wallet` logic.
  - Handles initialization, pairing, event listeners, session management, request/response handling for the Lens Account.
- **`WagmiConfig` (`lib/wagmi.ts`):**
  - Central configuration for Wagmi & ConnectKit.
  - Defines chains: Polygon (for profile minting) and Lens Chain (for smart account operations).
  - Configures ConnectKit with desired connectors (Injected, WalletConnect, etc.).

---

## 4. Technology Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Package Manager:** PNPM
- **X (Twitter) Login:** Standard OAuth 2.0 PKCE flow (libraries like `next-auth` could assist, or a custom implementation for a simple handle fetch).
- **Core Web3 Libraries:**
  - **Wagmi:** v2.x - For React hooks interacting with Ethereum (account state, contract interaction via Owner EOA, chain state).
  - **Viem:** v2.x - Used by Wagmi; can be used directly.
  - **ConnectKit:** Latest - For the Owner EOA wallet connection UI.
  - **`@lens-protocol/client` (or similar Lens SDK):** For Lens Profile creation and interaction on Polygon.
  - **`@walletconnect/web3wallet`:** Latest v2 - For the application to act _as a wallet_ for the Lens Account on Lens Chain.
- **UI/Styling:**
  - **Tailwind CSS:** For utility-first styling.
  - **Animation:**
    - **Framer Motion (Recommended):** For declarative UI animations.
    - User Mention: `react-bits` (evaluate specific components for UI structure/style).
- **State Management:** React Context API / `useState` / `useReducer`, Wagmi's state.
- **Linting/Formatting:** ESLint, Prettier.

---

## 5. Detailed Workflow Breakdown

### 5.1. User Onboarding & Lens Profile Creation

1.  **"Login with X" (Optional for handle) (`LoginPage.tsx`, `XAuthService`):**
    - User clicks "Login with X".
    - `XAuthService` initiates X OAuth flow.
    - On success, X handle is fetched and stored in `XAuthContext`.
2.  **"Connect Wallet" (`LoginPage.tsx`, ConnectKit, Wagmi):**
    - User clicks "Connect Wallet".
    - ConnectKit modal appears, user selects and connects their EOA wallet.
    - Connected Owner EOA details (address, chain, signer) are managed by Wagmi.
3.  **Lens Profile Check (`LensProtocolService`, Wagmi):**
    - Application ensures connected Owner EOA is on Polygon (ConnectKit/Wagmi prompts for switch if needed).
    - `LensProtocolService` queries Lens Protocol (on Polygon) to see if the Owner EOA has an existing default Lens Profile.
4.  **Lens Profile Minting (Conditional) (`MintProfilePage.tsx`, `LensProtocolService`, Wagmi):**
    - If no profile exists:
      - User is navigated to `/mint-profile` or a modal appears.
      - Handle input field is pre-filled with X handle (if fetched), user can edit.
      - `LensProtocolService` checks handle availability.
      - User confirms. `LensProtocolService` prepares the profile creation transaction data.
      - Wagmi's `useWriteContract` (or similar for Lens SDK integration) is used, prompting the user to sign the `createProfile` transaction with their **Owner EOA** on Polygon.
      - On success, the new Lens Profile NFT address and ID are stored.
    - If a profile exists:
      - Its address and ID are fetched and stored.
5.  **Set Lens Account:** The Lens Profile NFT address is now the `LENS_ACCOUNT_ADDRESS`. The connected EOA is the `OWNER_EOA_ADDRESS`.
6.  **Navigation:** User is navigated to `/dashboard`.

### 5.2. Dashboard & WalletConnect Pairing (Lens Chain)

- (Largely as original spec, but Owner EOA is the externally connected one)
- Ensure Owner EOA is on Lens Chain (ConnectKit/Wagmi prompts for switch).
- Dashboard displays info. WGHO balance fetch uses `useReadContract` with `chainId: 232`.
- WC Pairing: `WalletConnectService` approves session with `eip155:232:{LENS_ACCOUNT_ADDRESS}`.

### 5.3. WalletConnect Transaction Handling (Lens Chain)

- (Largely as original spec, but Owner EOA is the externally connected one)
- Incoming WC requests are for the `LENS_ACCOUNT_ADDRESS`.
- `executeTransaction` call on Lens Account is prepared.
- Wagmi's `useWriteContract` is used, configured with `account: OWNER_EOA_ADDRESS` and `chainId: 232`. The **Owner EOA** signs.

---

## 6. Data Flow & State Management

- **`XAuthContext`:** Holds `isXAuthenticated`, `xHandle`, `loginWithX()`, `logoutFromX()`. Populated by `XAuthService`.
- **Wagmi/ConnectKit:** Manages `ownerEOAAddress`, `isConnected`, `chain`, `signer`, `connect()`, `disconnect()`, `switchChain()`.
- **`LensProfileContext`:** Holds `profileId`, `profileHandle`, `lensAccountAddress` (profile NFT address), `isLoadingProfile`.
- **`WalletConnectContext`:** Holds `web3WalletInstance`, `activeSessions`, `pendingRequest`.

---

## 7. Contract Interactions Summary

- **Lens Protocol Contracts (on Polygon, via Lens SDK & signed by Owner EOA):**
  - `LensHub.createProfile()`
  - Reads for existing profiles.
- **Lens Account Contract (on Lens Chain, via Wagmi & signed by Owner EOA):**
  - `owner()`: Read.
  - `executeTransaction()`: Write.
- **WGHO ERC20 Contract (on Lens Chain, via Wagmi):**
  - `balanceOf(address)`: Read.

---

## 8. Project Structure (App Router Example - Updated)

src/
├── app/
│ ├── (auth)/
│ │ ├── login/page.tsx
│ │ └── mint-profile/page.tsx
│ ├── dashboard/
│ │ └── page.tsx
│ ├── layout.tsx # Root layout (Providers: Wagmi/ConnectKit, XAuth, LensProfile, WC)
│ └── page.tsx # Entry point
├── components/
│ ├── auth/ # XLoginButton, MintProfileForm
│ ├── common/ # ConnectWalletButton (ConnectKit wrapper)
│ ├── dashboard/ # AccountDisplay, WcConnect, WcRequestDisplay
│ ├── layout/ # Header, Footer
│ └── ui/ # Generic Button, Input, Modal (styled with Tailwind, animated with Framer)
├── contexts/
│ ├── XAuthProvider.tsx
│ ├── LensProfileProvider.tsx
│ └── WalletConnectProvider.tsx
├── hooks/
│ └── useWcRequestHandler.ts
├── services/
│ ├── xAuthService.ts # X OAuth logic
│ ├── lensProtocolService.ts
│ └── walletConnectService.ts
├── lib/
│ ├── wagmi.ts # Wagmi/ConnectKit config (Polygon, Lens Chain)
│ ├── constants.ts
│ └── utils.ts
├── public/
├── styles/
├── .env.local # X_CLIENT_ID, X_CLIENT_SECRET (if backend helper), NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID, NEXT_PUBLIC_ALCHEMY_ID (or other RPC provider for Wagmi)
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json

_(Note: `X_CLIENT_SECRET` should ideally not be in `.env.local` if a backend helper is used; it would be on the server. If a pure client-side PKCE flow is possible and secure for handle fetching with X, then only `X_CLIENT_ID` might be public)._

---

## 9. Error Handling

- Extend to cover:
  - X OAuth failures.
  - Wallet connection errors (user rejects, provider errors).
  - Chain switching failures.
- Clear user feedback for each step.

---

## 10. Security Considerations

- **X OAuth:** Securely handle X OAuth flow. If using a backend for token exchange, protect the client secret. For client-side PKCE, ensure proper implementation.
- **Transaction Clarity:** Clearly display all transaction details before the user's Owner EOA signs them.
- **CSRF/XSS:** Standard web security practices.

---
