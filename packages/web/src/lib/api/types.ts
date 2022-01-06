export interface AppStateValue {
  bytes: string
  type: number
  uint: number
}

export interface AppStateEntry {
  key: string
  value: AppStateValue
}

export interface AppStateSchema {
  numByteSlice: number
  numUint: number
}

export interface AppState {
  id: number
  deleted?: boolean
  keyValue?: AppStateEntry
  optedInAtRound: number
  schema: AppStateSchema
}

export interface AccountAsset {
  amount: number
  assetId: number
  creator: string
  deleted?: boolean
  isFrozen?: boolean
  optedInAtRound: number
}

export enum AccountStatus {
  OFFLINE = "Offline",
  ONLINE = "Online",
}

export enum SignatureType {
  LOGIC = "lsig",
  MULTI = "msig",
  SIMPLE = "sig",
}

export interface AccountInfo {
  address: string
  amount: number
  amountWithoutPendingRewards: number
  appsLocalState?: AppState[]
  appsTotalSchema?: AppStateSchema
  assets?: AccountAsset[]
  createdAtRound: number
  deleted?: boolean
  pendingRewards: number
  rewardsBase: number
  rewards: number
  round: number
  sigType: SignatureType
  status: AccountStatus
}
