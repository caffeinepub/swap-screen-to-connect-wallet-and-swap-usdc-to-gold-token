# Specification

## Summary
**Goal:** Add a wallet provider selection UI on the Swap screen that keeps Internet Identity as the only working login method while clearly showing MetaMask as unavailable.

**Planned changes:**
- Update the Swap page wallet connection area to include a provider selection control with at least: Internet Identity and MetaMask.
- Keep the existing Internet Identity connect/disconnect and swap flow working end-to-end when Internet Identity is selected (without changing the existing Internet Identity hooks).
- For MetaMask selection, do not initiate any Web3/MetaMask connection; instead show a clear inline “not supported yet” message and/or disable the option with an explanation.
- Ensure the updated wallet connection UI remains responsive (mobile/desktop) and matches the current visual theme.

**User-visible outcome:** On the Swap page, users can choose a wallet provider; Internet Identity continues to work as before, and selecting MetaMask clearly indicates it is not supported yet without attempting to connect.
