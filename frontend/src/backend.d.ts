import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SwapQuote {
    rate: Balance;
    outputAsset: Asset;
    inputAsset: Asset;
    inputAmount: Balance;
    outputAmount: Balance;
}
export interface UserProfile {
    name: string;
}
export type Balance = bigint;
export enum Asset {
    gold = "gold",
    usdc = "usdc"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    depositUsdc(amount: Balance): Promise<void>;
    getAllBalances(): Promise<Array<[Principal, {
            gold: Balance;
            usdc: Balance;
        }]>>;
    getBalance(): Promise<{
        gold: Balance;
        usdc: Balance;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getQuote(): Promise<SwapQuote>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    swapUsdcForGold(amount: Balance): Promise<void>;
    updateRate(newRate: Balance): Promise<void>;
}
