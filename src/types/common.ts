export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export type Nullable<T> = T | null

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}
