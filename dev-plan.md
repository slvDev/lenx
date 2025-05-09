# Detailed Development Plan: Lens Social Onboarding & Smart Account Manager

**Guiding Principles:**

- **Visual First:** Each UI component should be considered for animation and aesthetic appeal using Framer Motion and leveraging `react-bits` where appropriate for structure/style.
- **Atomic Commits:** Each checkmark ideally represents a distinct, understandable commit.
- **PNPM:** Use `pnpm` for all package management commands.

---

## Phase 0: Project Setup & Foundation (Est. 0.5 - 1 day)

- **Environment & Tooling:**
  - [x] Initialize Next.js project (App Router, TypeScript): `pnpm create next-app --typescript --tailwind` (then select App Router).
  - [x] Install core dependencies:
    - [ ] `pnpm add wagmi viem @tanstack/react-query`
    - [ ] `pnpm add framer-motion`
    - [ ] `pnpm add connectkit`
    - [ ] `pnpm add @lens-protocol/client` (or chosen Lens SDK)
    - [ ] `pnpm add @walletconnect/web3wallet`
    - [ ] `pnpm add <x-oauth-library-if-any>` (e.g., `next-auth` if used for X, or plan for custom OAuth flow)
  - [ ] Configure ESLint & Prettier for consistency.
  - [ ] Set up `.env.local` with placeholders: `NEXT_PUBLIC_ALCHEMY_ID` (or other RPC provider for Wagmi/ConnectKit), `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`, `NEXT_PUBLIC_X_CLIENT_ID`.
- **Basic Project Structure:**
  - [ ] Create initial folder structure (as per `architecture.md`: `app`, `components`, `contexts`, `hooks`, `services`, `lib`, `styles`).
- **Global Styles & Layout:**
  - [ ] Configure `tailwind.config.ts` (theme, plugins if any).
  - [ ] Set up `styles/globals.css` with Tailwind directives and base styles.
  - [ ] Create root `app/layout.tsx` with basic HTML structure.
- **Wagmi & ConnectKit Configuration:**
  - [ ] Create `lib/constants.ts`:
    - [ ] Define Polygon chain object (Viem's `polygon`).
    - [ ] Define Lens Chain object (Viem's `defineChain` with ID 232, RPC, explorer, currency).
  - [ ] Create `lib/wagmi.ts`:
    - [ ] `createConfig` with Polygon and Lens Chain, default ConnectKit connectors, and chosen RPC provider (e.g., Alchemy via `NEXT_PUBLIC_ALCHEMY_ID`).
  - [ ] Create `components/providers.tsx` (or similar client component) to house client-side providers.
  - [ ] In `app/layout.tsx`, import and use `Providers` component from `components/providers.tsx` to wrap `children` with `WagmiProvider` and `ConnectKitProvider`.
  - [ ] Create basic `Header` component (`components/layout/Header.tsx`).
    - [ ] Add `ConnectKitButton` to the `Header` for initial wallet connection testing.
    - [ ] Implement initial Framer Motion animation for `Header` appearance (e.g., fade in).

---

## Phase 1: X (Twitter) OAuth & Wallet Connection (Est. 2-3 days)

- **X (Twitter) OAuth Integration:**
  - [ ] Register an X Developer App to get Client ID (and Client Secret if a backend-assisted flow is chosen).
  - [ ] Create `contexts/XAuthProvider.tsx`:
    - [ ] Define state for `isXAuthenticated`, `xHandle`, `isLoadingXAuth`.
    - [ ] Define functions `loginWithX`, `logoutFromX`, `handleXAuthCallback`.
  - [ ] Create `services/xAuthService.ts`:
    - [ ] Implement logic for constructing X authorization URL (PKCE).
    - [ ] Implement logic for exchanging authorization code for access token (if pure client-side is not feasible/secure for X API, consider a Next.js API route as a backend helper for this step, protecting `X_CLIENT_SECRET`).
    - [ ] Implement logic for fetching user's X handle using the access token.
  - [ ] Implement X OAuth 2.0 PKCE flow:
    - [ ] In `XAuthProvider.tsx` or a dedicated component, handle redirection to X authorization URL.
    - [ ] Create an API route (e.g., `app/api/auth/x/callback/route.ts`) or handle client-side callback logic to process the code from X.
    - [ ] Store X auth status and handle in `XAuthContext`.
  - [ ] Create `components/auth/XLoginButton.tsx`:
    - [ ] Renders a button to trigger `loginWithX` from `XAuthContext`.
    - [ ] Conditionally displays X handle or "Logged in with X" status based on `XAuthContext`.
    - [ ] Style with Tailwind, add hover/click animations with Framer Motion.
  - [ ] Add `XAuthProvider` to `components/providers.tsx` in `app/layout.tsx`.
- **Wallet Connection UI & Logic:**
  - [ ] Create `app/(auth)/login/page.tsx`.
  - [ ] Ensure `ConnectKitButton` from `connectkit` is prominently displayed on `app/(auth)/login/page.tsx` (potentially within a `ConnectWalletWrapper` component for styling).
  - [ ] Style the `ConnectKitButton` or its wrapper for seamless visual integration with the page design.
  - [ ] Test and confirm Wagmi hooks (`useAccount`, `useSigner`, `useSwitchChain`) are functioning correctly after successful wallet connection via ConnectKit.
- **Combined Login Page (`app/(auth)/login/page.tsx`):**
  - [ ] Design the page layout with clear sections/options: "Login with X (to suggest handle)" and "Connect Wallet".
  - [ ] Implement logic to guide user flow: wallet connection is primary; X login is an optional precursor.
  - [ ] Implement redirection or UI changes once the wallet is connected (e.g., proceed to profile check/minting phase).

---

## Phase 2: Lens Profile Check & Minting (Est. 2-3 days)

- **Lens SDK & Context:**
  - [ ] Create `services/lensProtocolService.ts`:
    - [ ] Initialize Lens SDK client (e.g., `@lens-protocol/client`).
  - [ ] Create `contexts/LensProfileProvider.tsx`:
    - [ ] Define state for `lensProfile`, `isLoadingProfile`, `profileError`.
    - [ ] Define functions to `fetchProfileByOwner`, `mintProfile`.
  - [ ] Add `LensProfileProvider` to `components/providers.tsx`.
- **Profile Checking Logic (using connected Owner EOA):**
  - [ ] In `LensProfileProvider.tsx` (e.g., within a `useEffect` hook):
    - [ ] Trigger profile check when `useAccount().isConnected` is true and `useAccount().address` is available.
    - [ ] Get `ownerAddress` from `useAccount().address`.
    - [ ] If `useAccount().chainId` is not Polygon, use `useSwitchChain().switchChain({ chainId: polygon.id })` to prompt user to switch.
    - [ ] Call `lensProtocolService.fetchDefaultProfile(ownerAddress)` (or similar Lens SDK function).
    - [ ] Update `LensProfileContext` with the fetched profile or null if none exists. Handle loading/error states.
- **Mint Profile UI & Logic (`app/(auth)/mint-profile/page.tsx` or Modal):**
  - [ ] Create the UI for minting a profile:
    - [ ] Input field for handle, pre-filled from `XAuthContext`'s `xHandle` (if available and user opted for X login). User can edit.
    - [ ] Submit button.
    - [ ] Style with Tailwind. Use `react-bits` components for structure if suitable. Apply Framer Motion for input focus, button interactions.
  - [ ] Implement handle availability check (debounced) in `lensProtocolService.ts` using Lens SDK. Show visual feedback.
  - [ ] Implement `mintLensProfile(handle, ownerSigner, ownerAddress)` in `lensProtocolService.ts`:
    - [ ] Prepare profile creation transaction data/request using Lens SDK.
  - [ ] In the UI component (e.g., `MintProfileForm.tsx`):
    - [ ] On submit, call the minting function from `LensProfileProvider` or directly `lensProtocolService.mintLensProfile`.
    - [ ] Use Wagmi's `useWriteContract` (or `useSendTransaction` if Lens SDK provides a fully prepared transaction request) to have the connected Owner EOA sign and send the minting transaction.
    - [ ] Ensure `chainId` for `useWriteContract` is explicitly set to Polygon's ID.
    - [ ] Handle `isLoading`, `isSuccess`, `isError` states from `useWriteContract` and `useWaitForTransactionReceipt`. Display animated loading indicators and success/error messages.
  - [ ] On successful mint, update `LensProfileContext` with the new profile and redirect to `/dashboard`.
- **Routing Logic:**
  - [ ] After wallet connection, if no profile is found in `LensProfileContext`, redirect to `/mint-profile`.
  - [ ] If profile exists or is successfully minted, redirect to `/dashboard`.

---

## Phase 3: Dashboard UI & Basic Information (Est. 1-2 days)

- **Dashboard Page Setup (`app/dashboard/page.tsx`):**
  - [ ] Implement protected route logic: redirect to `/login` if `useAccount().isConnected` is false or `LensProfileContext.lensProfile` is null after loading.
  - [ ] Design basic dashboard layout (e.g., main content area, potential sidebar for future navigation).
  - [ ] Use Framer Motion for page transition animation to the dashboard.
- **Account Display Component (`components/dashboard/AccountDisplay.tsx`):**
  - [ ] Fetch `lensProfile` from `LensProfileContext` to get the Lens Account Address (Profile NFT address).
  - [ ] Fetch Owner EOA address from `useAccount().address`.
  - [ ] Display Lens Account Address and Owner EOA. Style with Tailwind, consider `react-bits` for card-like display. Animate appearance.
  - [ ] Fetch WGHO balance for the Lens Account Address on Lens Chain:
    - [ ] Use Wagmi's `useReadContract` hook.
      - `address`: WGHO token address on Lens Chain.
      - `abi`: ERC20 ABI (specifically `balanceOf`).
      - `functionName`: `balanceOf`.
      - `args`: `[lensProfile.ownedBy.address]` (or the profile contract address itself, depending on what WGHO is tied to).
      - `chainId`: Lens Chain ID (232).
    - [ ] (Note: The `useAccount().address` does not need to be on Lens Chain for this read, as `useReadContract` specifies the target chain).
    - [ ] Format and display balance (e.g., using `viem/utils.formatUnits`). Show loading state.
- **Visual Polish:**
  - [ ] Ensure the dashboard has a clean, modern aesthetic using Tailwind.
  - [ ] Incorporate "awesome" animations for elements appearing on the dashboard using Framer Motion.

---

## Phase 4: WalletConnect v2 Integration (Acting as Wallet) (Est. 2-3 days)

- **WalletConnect Service & Context:**
  - [ ] Ensure `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is obtained and set in `.env.local`.
  - [ ] Create `services/walletConnectService.ts`.
    - [ ] Implement `initWeb3Wallet()` to initialize `Web3Wallet` from `@walletconnect/web3wallet` using the project ID.
    - [ ] Implement `pair(uri)` and listener setup functions.
  - [ ] Create `contexts/WalletConnectProvider.tsx`:
    - [ ] Manage `web3wallet` instance, active sessions, and pending requests.
    - [ ] Call `walletConnectService.initWeb3Wallet()` on mount.
  - [ ] Add `WalletConnectProvider` to `components/providers.tsx`.
- **WalletConnect UI (`components/dashboard/WcConnect.tsx`):**
  - [ ] Input field for WalletConnect URI.
  - [ ] "Connect" button.
  - [ ] Display area for active WC sessions (dApp name, icon, URL).
  - [ ] Style all elements with Tailwind; animate interactions and list appearances with Framer Motion.
- **Pairing Logic:**
  - [ ] In `WcConnect.tsx`, on "Connect" button click, call a function from `WalletConnectProvider` (or `walletConnectService`) to execute `web3wallet.core.pairing.pair({ uri })`.
  - [ ] Handle pairing errors.
- **Session Proposal Handling:**
  - [ ] In `WalletConnectProvider.tsx` (or `walletConnectService.ts`), set up `web3wallet.on('session_proposal', onSessionProposalHandler)`.
  - [ ] Implement `onSessionProposalHandler`:
    - [ ] Retrieve Lens Account Address from `LensProfileContext`.
    - [ ] Construct approved `namespaces` containing **only** the Lens Chain (`eip155:232`) and the Lens Account Address (`eip155:232:{LENS_ACCOUNT_ADDRESS}`). Include standard methods (`eth_sendTransaction`, `personal_sign`, etc.).
    - [ ] Call `web3wallet.approveSession({ id: proposal.id, namespaces })`.
    - [ ] Store the resulting session details in `WalletConnectContext`. Update UI.

---

## Phase 5: WalletConnect Transaction Handling (Est. 3-4 days)

- **Session Request Listener:**
  - [ ] In `WalletConnectProvider.tsx` (or `walletConnectService.ts`), set up `web3wallet.on('session_request', onSessionRequestHandler)`.
  - [ ] Implement `onSessionRequestHandler`:
    - [ ] Store the event payload (`topic`, `params`, `id`) in `WalletConnectContext` as `pendingRequest`.
- **Transaction Request Modal (`components/dashboard/WcRequestDisplay.tsx`):**
  - [ ] Component conditionally renders (e.g., as a modal) when `pendingRequest` is set in `WalletConnectContext`.
  - [ ] Use Framer Motion for modal entrance/exit animation.
  - [ ] Display transaction details from `pendingRequest`: dApp info, `To`, `Value`, `Data`.
  - [ ] "Send Transaction" and "Reject" buttons, styled and animated.
- **Transaction Execution Logic (`hooks/useWcRequestHandler.ts` or within `WcRequestDisplay.tsx`):**
  - [ ] On "Send Transaction" click:
    - [ ] Retrieve `pendingRequest`, Lens Account Address (from `LensProfileContext`), and Owner EOA address (from `useAccount().address`).
    - [ ] If `useAccount().chainId` is not Lens Chain, use `useSwitchChain().switchChain({ chainId: LENS_CHAIN_ID })` to prompt user.
    - [ ] Use Wagmi's `useWriteContract` to call `executeTransaction` on the Lens Account contract:
      - `address`: Lens Account Address.
      - `abi`: Lens Account ABI (including `executeTransaction`).
      - `functionName`: `'executeTransaction'`.
      - `args`: `[pendingRequest.params.request.params[0].to, pendingRequest.params.request.params[0].value, pendingRequest.params.request.params[0].data]` (adjust path based on actual WC payload structure).
      - `account`: Owner EOA address.
      - `chainId`: Lens Chain ID (232).
    - [ ] Handle `useWriteContract`'s `isPending`, `isSuccess`, `error` states. Show loading.
    - [ ] If `isSuccess`, wait for transaction receipt using `useWaitForTransactionReceipt`.
      - [ ] If receipt status is `'success'`, call `web3wallet.respondSessionRequest({ topic: pendingRequest.topic, response: { id: pendingRequest.id, result: receipt.transactionHash, jsonrpc: '2.0' } })`.
      - [ ] If receipt status is `'reverted'`, respond with an error.
    - [ ] If any error occurs, call `web3wallet.respondSessionRequest` with an appropriate error payload.
    - [ ] Clear `pendingRequest` from context and close modal.
  - [ ] On "Reject" button click:
    - [ ] Call `web3wallet.respondSessionRequest` with a user rejection error. Clear `pendingRequest` and close modal.
- **Error Handling for WC:** Display animated error messages within the modal or as toasts.

---

## Phase 6: Styling, Animation Polish & Component Refinement (Ongoing, Dedicated pass: 2-3 days)

- **Component Review (`react-bits` & Custom):**
  - [ ] Systematically review each component for visual appeal and animation opportunities.
  - [ ] Enhance custom components with Framer Motion for:
    - [ ] Page transitions (`AnimatePresence` in `layout.tsx` or page components).
    - [ ] List item animations (e.g., for WC sessions, future content).
    - [ ] Button hover, press, and loading state animations.
    - [ ] Input field focus and validation feedback animations.
    - [ ] Modal entrance/exit and content animations.
    - [ ] Data loading skeletons/shimmers with smooth animations.
- **Theme Consistency:**
  - [ ] Ensure consistent use of colors, typography, spacing from Tailwind config.
  - [ ] Verify visual harmony and responsiveness across all pages and states.
- **Micro-interactions:**
  - [ ] Add subtle animations to acknowledge user actions (e.g., click ripples, icon transformations, state change indicators).

---

## Phase 7: Testing & Refinement (Est. 2-3 days)

- **Functional Testing:**
  - [ ] Test entire user flow: X Login (optional) -> Wallet Connect -> Profile Mint (if new) -> Dashboard -> WC Pair -> WC Transaction (success & reject).
  - [ ] Test all edge cases: X auth failure, wallet connection cancelled, profile mint failure (handle taken, tx revert), WC pairing issues, WC transaction errors, chain switching prompts and failures.
- **UI & UX Testing:**
  - [ ] Verify visual consistency, check for animation glitches or performance issues.
  - [ ] Ensure error messages are clear, helpful, and well-presented.
  - [ ] Test on major browsers (Chrome, Firefox, Safari, Edge).
- **Code Review & Refactoring:**
  - [ ] Clean up code, remove unused imports/variables, ensure consistent coding style.
  - [ ] Optimize components/hooks for performance and readability.

---

## Phase 8: Deployment Preparation (Est. 0.5 day)

- **Build Optimization:**
  - [ ] Run `pnpm run build` and check for errors or large bundle warnings.
- **Environment Variables:**
  - [ ] Confirm all `NEXT_PUBLIC_` environment variables are correctly configured in the deployment environment (e.g., Vercel, Netlify).
  - [ ] If using a backend helper for X OAuth, ensure server-side secrets (like `X_CLIENT_SECRET`) are securely configured.
- **Deployment:**
  - [ ] Deploy to a staging/preview environment.
  - [ ] Conduct a final round of testing on the deployed version.
  - [ ] Deploy to production.
