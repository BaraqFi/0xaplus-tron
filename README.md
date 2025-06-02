# SafePal Wallet Integration for Tron Blockchain

This project demonstrates how to connect SafePal wallet (both mobile app and desktop extension) to the Tron blockchain and execute transactions.

## What This Project Does

### Core Functionality
- **Connects to SafePal Wallet**: Works with both SafePal mobile app (DApp browser) and desktop browser extension
- **Tron Blockchain Integration**: Establishes connection to Tron network for transaction processing
- **Transaction Execution**: Sends transactions to the Tron blockchain with custom messages
- **USDT Token Support**: Handles USDT token approvals for smart contract interactions

### Key Features
- Wallet detection and connection
- Transaction signing through SafePal
- Message transactions (demonstrates sending "HI" to blockchain)
- USDT approval system for token interactions

## How It Works

### 1. Wallet Connection Process
- Detects if user is using SafePal (mobile or desktop)
- Waits for SafePal to inject TronWeb into the browser
- Retrieves user's wallet address
- Verifies connection to correct Tron network

### 2. Transaction Flow
- User connects SafePal wallet
- System requests USDT approval (if needed)
- User can send transactions with messages to blockchain
- All transactions are signed securely through SafePal

### 3. SafePal Integration Points
- **Mobile**: Works within SafePal app's built-in DApp browser
- **Desktop**: Compatible with SafePal browser extension
- **Security**: All private keys remain in SafePal - never exposed to the application

## Technical Components

### Core Files
- `SafePalConnector`: Main class handling wallet connection logic
- `TronWalletConnector`: User interface component for wallet interactions
- `tron-config`: Network settings and contract addresses
- `wallet-detection`: SafePal detection utilities

### Blockchain Interactions
- **Network Configuration**: Connects to Tron mainnet
- **Smart Contracts**: Interacts with USDT contract for token approvals
- **Transaction Types**: Supports both TRX transfers and contract interactions
- **Message Transactions**: Demonstrates sending data to blockchain via memo field

## Usage Requirements

### For Users
- SafePal wallet installed (mobile app or browser extension)
- Wallet must be unlocked and connected to Tron network
- Small amount of TRX for transaction fees

### For Developers
- Project works with SafePal's TronWeb injection
- No additional wallet libraries required
- Handles network switching automatically

## Transaction Examples

### Simple Message Transaction
- Sends minimal TRX amount (0.000001 TRX)
- Includes custom message in transaction memo
- Demonstrates basic blockchain interaction

### USDT Approval
- Approves smart contract to spend user's USDT - remember to change current dapp address and other addresses (except the usdt)
- Required for DeFi and token-based applications
- One-time approval per contract

## Security Features
- All transactions require user approval in SafePal
- Private keys never leave SafePal wallet
- Error handling for failed connections

## Compatibility
- **SafePal Mobile**: Works in DApp browser
- **SafePal Desktop**: Compatible with browser extension
- **Networks**: Supports Tron mainnet
- **Browsers**: Works in any browser with SafePal extension installed

This integration provides a foundation for Tron-based applications to work with SafePal wallet.