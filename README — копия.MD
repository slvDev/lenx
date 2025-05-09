# Lens Profile X-Handle Onboarding & Smart Account Manager

## What is this project?

This project is a Next.js web application designed to provide a streamlined onboarding experience to the Lens Protocol. Users can optionally log in with their X (Twitter) account to fetch their X handle, which can then be used as a suggestion when minting a new Lens Profile. All blockchain interactions, including profile minting and managing the Lens Profile as a smart account, are performed by connecting the user's own crypto wallet (like MetaMask).

The application empowers users to manage their Lens Profile as a versatile smart account on the Lens Chain, enabling interactions with decentralized applications (dApps) via WalletConnect.

## How it Works

1.  **Login with X (Optional for Handle Suggestion):**
    - You can choose to log in with your X (Twitter) account.
    - If you do, we'll fetch your X handle. This handle will be suggested when you're ready to mint your Lens Profile, making it easy to use a familiar name. This step is optional.
2.  **Connect Your Wallet:**
    - Click "Connect Wallet" to link your existing cryptocurrency wallet (e.g., MetaMask, Coinbase Wallet, or any WalletConnect-compatible wallet).
    - This connected wallet will be your **Owner EOA**, used to authorize all your actions on the blockchain.
3.  **Get Your Lens Profile:**
    - We'll check if your connected wallet already owns a Lens Profile on the Polygon network.
    - **New Profile:** If not, you'll be guided to mint one. The handle input will be pre-filled with your X handle (if you logged in with X), but you can change it. Confirm, and sign the transaction with your connected wallet.
    - **Existing Profile:** If you already have one, we'll load it up!
4.  **Access Your Dashboard:**
    - Once your wallet is connected and your Lens Profile is set (either existing or newly minted), you'll land on your dashboard.
    - Here, you can see your Lens Profile address and your WGHO balance on the Lens Chain.
5.  **Connect to dApps via WalletConnect:**
    - Want to use your Lens Profile with other dApps on the Lens Chain?
    - Go to any dApp supporting WalletConnect. Copy their connection code (URI).
    - Paste it into our application. Your Lens Profile (acting as a smart wallet on Lens Chain) will connect to the dApp.
6.  **Sign Transactions Securely:**
    - When a connected dApp asks your Lens Profile to perform a transaction (e.g., interact with a protocol):
      - The request will appear in our application's dashboard for your review.
      - If you approve, your **connected Owner EOA wallet** will sign the instruction, telling your Lens Profile on Lens Chain to execute it.
      - You are always in control, using your own wallet to authorize actions for your Lens Profile.

## Key Features (MVP)

- **X (Twitter) Login for Handle Suggestion:** Optionally log in with X to pre-fill your Lens Profile handle.
- **Connect Your Own Wallet:** Full self-custody. Use ConnectKit to link your preferred EOA wallet.
- **Lens Profile Minting:** Guided flow to create your unique Lens Profile on Polygon, signed by your wallet.
- **Lens Profile Dashboard:** View your Lens Profile address and WGHO balance on Lens Chain.
- **WalletConnect v2 Integration:** Connect your Lens Profile (as a smart account on Lens Chain) to external dApps.
- **Secure Transaction Signing:** All on-chain actions are authorized and signed by your connected EOA wallet.

## For Whom?

- Individuals looking for an easy way to get a Lens Profile, potentially using their X handle as a starting point.
- Lens users who want an interface to manage their Lens Profile as a smart account for dApp interactions.
- Anyone wanting to interact with the Lens ecosystem using their self-custodial wallet.

## Technology Stack (High-Level)

- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Web3 & Wallet:**
  - Wagmi & Viem (for blockchain interactions)
  - ConnectKit (for wallet connection UI)
  - `@lens-protocol/client` (for Lens Protocol operations)
  - `@walletconnect/web3wallet` (for dApp connectivity)
  - X (Twitter) OAuth for handle fetching.
- **Package Manager:** PNPM
- **Blockchains:**
  - Polygon (for Lens Profile NFT minting & social graph)
  - Lens Chain (ID 232, for Lens Profile smart account operations & dApp interactions)

## Development & Future

This is an MVP. Future enhancements may include:

- More detailed Lens Profile management.
- Displaying Lens social activity.
- Support for more dApp interaction types.

_(More details on setup, running the project, and contribution will be added as development progresses.)_
