import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Balance = Nat;

  public type Asset = { #usdc; #gold };
  public type UserProfile = { name : Text };

  type SwapQuote = {
    inputAmount : Balance;
    outputAmount : Balance;
    inputAsset : Asset;
    outputAsset : Asset;
    rate : Balance;
  };

  var goldRate : Balance = 10;

  let balances = Map.empty<Principal, { usdc : Balance; gold : Balance }>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Balance Management
  func getBalanceInternal(principal : Principal) : { usdc : Balance; gold : Balance } {
    switch (balances.get(principal)) {
      case (null) { Runtime.trap("No balance found for this principal") };
      case (?balance) { balance };
    };
  };

  public shared ({ caller }) func depositUsdc(amount : Balance) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can deposit");
    };
    let currentBalance = switch (balances.get(caller)) {
      case (null) { { usdc = 0; gold = 0 } };
      case (?balance) { balance };
    };
    balances.add(caller, { usdc = currentBalance.usdc + amount; gold = currentBalance.gold });
  };

  public query ({ caller }) func getBalance() : async { usdc : Balance; gold : Balance } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view balances");
    };
    getBalanceInternal(caller);
  };

  public query ({ caller }) func getAllBalances() : async [(Principal, { usdc : Balance; gold : Balance })] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all balances");
    };
    if (balances.isEmpty()) { Runtime.trap("Balances map is empty!") };
    balances.toArray();
  };

  // Swap Operations
  public query ({ caller }) func getQuote() : async SwapQuote {
    // Quote is public information, no auth required (guests can view)
    {
      inputAmount = 0;
      outputAmount = 0;
      inputAsset = #usdc;
      outputAsset = #gold;
      rate = goldRate;
    };
  };

  public shared ({ caller }) func updateRate(newRate : Balance) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update the rate");
    };
    if (newRate == 0) { Runtime.trap("Rate cannot be 0") };
    goldRate := newRate;
  };

  public shared ({ caller }) func swapUsdcForGold(amount : Balance) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can perform swaps");
    };
    if (amount <= 0) { Runtime.trap("Swap amount must be greater than zero") };

    let userBalances = getBalanceInternal(caller);

    if (userBalances.usdc < amount) {
      Runtime.trap("Insufficient USDC balance for this swap attempt");
    };

    let goldAmount = amount * goldRate;

    let updatedBalances = {
      usdc = userBalances.usdc - amount;
      gold = userBalances.gold + goldAmount;
    };
    balances.add(caller, updatedBalances);
  };
};
