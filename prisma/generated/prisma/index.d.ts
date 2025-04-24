
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Business
 * 
 */
export type Business = $Result.DefaultSelection<Prisma.$BusinessPayload>
/**
 * Model Inventory
 * 
 */
export type Inventory = $Result.DefaultSelection<Prisma.$InventoryPayload>
/**
 * Model Customer
 * 
 */
export type Customer = $Result.DefaultSelection<Prisma.$CustomerPayload>
/**
 * Model Booking
 * 
 */
export type Booking = $Result.DefaultSelection<Prisma.$BookingPayload>
/**
 * Model BookingItem
 * 
 */
export type BookingItem = $Result.DefaultSelection<Prisma.$BookingItemPayload>
/**
 * Model Payment
 * 
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>
/**
 * Model Coupon
 * 
 */
export type Coupon = $Result.DefaultSelection<Prisma.$CouponPayload>
/**
 * Model SalesFunnel
 * 
 */
export type SalesFunnel = $Result.DefaultSelection<Prisma.$SalesFunnelPayload>
/**
 * Model Waiver
 * 
 */
export type Waiver = $Result.DefaultSelection<Prisma.$WaiverPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const WaiverStatus: {
  PENDING: 'PENDING',
  SIGNED: 'SIGNED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
};

export type WaiverStatus = (typeof WaiverStatus)[keyof typeof WaiverStatus]


export const InventoryStatus: {
  AVAILABLE: 'AVAILABLE',
  BOOKED: 'BOOKED',
  MAINTENANCE: 'MAINTENANCE',
  RETIRED: 'RETIRED'
};

export type InventoryStatus = (typeof InventoryStatus)[keyof typeof InventoryStatus]


export const InventoryType: {
  BOUNCE_HOUSE: 'BOUNCE_HOUSE',
  INFLATABLE: 'INFLATABLE',
  GAME: 'GAME',
  OTHER: 'OTHER'
};

export type InventoryType = (typeof InventoryType)[keyof typeof InventoryType]


export const BookingStatus: {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  NO_SHOW: 'NO_SHOW',
  WEATHER_HOLD: 'WEATHER_HOLD'
};

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus]


export const PaymentType: {
  DEPOSIT: 'DEPOSIT',
  FULL_PAYMENT: 'FULL_PAYMENT',
  REFUND: 'REFUND'
};

export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType]


export const PaymentStatus: {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]


export const DiscountType: {
  PERCENTAGE: 'PERCENTAGE',
  FIXED: 'FIXED'
};

export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType]

}

export type WaiverStatus = $Enums.WaiverStatus

export const WaiverStatus: typeof $Enums.WaiverStatus

export type InventoryStatus = $Enums.InventoryStatus

export const InventoryStatus: typeof $Enums.InventoryStatus

export type InventoryType = $Enums.InventoryType

export const InventoryType: typeof $Enums.InventoryType

export type BookingStatus = $Enums.BookingStatus

export const BookingStatus: typeof $Enums.BookingStatus

export type PaymentType = $Enums.PaymentType

export const PaymentType: typeof $Enums.PaymentType

export type PaymentStatus = $Enums.PaymentStatus

export const PaymentStatus: typeof $Enums.PaymentStatus

export type DiscountType = $Enums.DiscountType

export const DiscountType: typeof $Enums.DiscountType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.business`: Exposes CRUD operations for the **Business** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Businesses
    * const businesses = await prisma.business.findMany()
    * ```
    */
  get business(): Prisma.BusinessDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inventory`: Exposes CRUD operations for the **Inventory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Inventories
    * const inventories = await prisma.inventory.findMany()
    * ```
    */
  get inventory(): Prisma.InventoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.customer`: Exposes CRUD operations for the **Customer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Customers
    * const customers = await prisma.customer.findMany()
    * ```
    */
  get customer(): Prisma.CustomerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.booking`: Exposes CRUD operations for the **Booking** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bookings
    * const bookings = await prisma.booking.findMany()
    * ```
    */
  get booking(): Prisma.BookingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bookingItem`: Exposes CRUD operations for the **BookingItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BookingItems
    * const bookingItems = await prisma.bookingItem.findMany()
    * ```
    */
  get bookingItem(): Prisma.BookingItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.coupon`: Exposes CRUD operations for the **Coupon** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Coupons
    * const coupons = await prisma.coupon.findMany()
    * ```
    */
  get coupon(): Prisma.CouponDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.salesFunnel`: Exposes CRUD operations for the **SalesFunnel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SalesFunnels
    * const salesFunnels = await prisma.salesFunnel.findMany()
    * ```
    */
  get salesFunnel(): Prisma.SalesFunnelDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.waiver`: Exposes CRUD operations for the **Waiver** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Waivers
    * const waivers = await prisma.waiver.findMany()
    * ```
    */
  get waiver(): Prisma.WaiverDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Business: 'Business',
    Inventory: 'Inventory',
    Customer: 'Customer',
    Booking: 'Booking',
    BookingItem: 'BookingItem',
    Payment: 'Payment',
    Coupon: 'Coupon',
    SalesFunnel: 'SalesFunnel',
    Waiver: 'Waiver'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "business" | "inventory" | "customer" | "booking" | "bookingItem" | "payment" | "coupon" | "salesFunnel" | "waiver"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Business: {
        payload: Prisma.$BusinessPayload<ExtArgs>
        fields: Prisma.BusinessFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BusinessFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BusinessFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          findFirst: {
            args: Prisma.BusinessFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BusinessFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          findMany: {
            args: Prisma.BusinessFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>[]
          }
          create: {
            args: Prisma.BusinessCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          createMany: {
            args: Prisma.BusinessCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BusinessCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>[]
          }
          delete: {
            args: Prisma.BusinessDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          update: {
            args: Prisma.BusinessUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          deleteMany: {
            args: Prisma.BusinessDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BusinessUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BusinessUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>[]
          }
          upsert: {
            args: Prisma.BusinessUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BusinessPayload>
          }
          aggregate: {
            args: Prisma.BusinessAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBusiness>
          }
          groupBy: {
            args: Prisma.BusinessGroupByArgs<ExtArgs>
            result: $Utils.Optional<BusinessGroupByOutputType>[]
          }
          count: {
            args: Prisma.BusinessCountArgs<ExtArgs>
            result: $Utils.Optional<BusinessCountAggregateOutputType> | number
          }
        }
      }
      Inventory: {
        payload: Prisma.$InventoryPayload<ExtArgs>
        fields: Prisma.InventoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          findFirst: {
            args: Prisma.InventoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          findMany: {
            args: Prisma.InventoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>[]
          }
          create: {
            args: Prisma.InventoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          createMany: {
            args: Prisma.InventoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InventoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>[]
          }
          delete: {
            args: Prisma.InventoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          update: {
            args: Prisma.InventoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          deleteMany: {
            args: Prisma.InventoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InventoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>[]
          }
          upsert: {
            args: Prisma.InventoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          aggregate: {
            args: Prisma.InventoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventory>
          }
          groupBy: {
            args: Prisma.InventoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryCountAggregateOutputType> | number
          }
        }
      }
      Customer: {
        payload: Prisma.$CustomerPayload<ExtArgs>
        fields: Prisma.CustomerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findFirst: {
            args: Prisma.CustomerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findMany: {
            args: Prisma.CustomerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          create: {
            args: Prisma.CustomerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          createMany: {
            args: Prisma.CustomerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          delete: {
            args: Prisma.CustomerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          update: {
            args: Prisma.CustomerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          deleteMany: {
            args: Prisma.CustomerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CustomerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          upsert: {
            args: Prisma.CustomerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          aggregate: {
            args: Prisma.CustomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomer>
          }
          groupBy: {
            args: Prisma.CustomerGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerCountAggregateOutputType> | number
          }
        }
      }
      Booking: {
        payload: Prisma.$BookingPayload<ExtArgs>
        fields: Prisma.BookingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          findFirst: {
            args: Prisma.BookingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          findMany: {
            args: Prisma.BookingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          create: {
            args: Prisma.BookingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          createMany: {
            args: Prisma.BookingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          delete: {
            args: Prisma.BookingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          update: {
            args: Prisma.BookingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          deleteMany: {
            args: Prisma.BookingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BookingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          upsert: {
            args: Prisma.BookingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          aggregate: {
            args: Prisma.BookingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBooking>
          }
          groupBy: {
            args: Prisma.BookingGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookingGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookingCountArgs<ExtArgs>
            result: $Utils.Optional<BookingCountAggregateOutputType> | number
          }
        }
      }
      BookingItem: {
        payload: Prisma.$BookingItemPayload<ExtArgs>
        fields: Prisma.BookingItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookingItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookingItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingItemPayload>
          }
          findFirst: {
            args: Prisma.BookingItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookingItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingItemPayload>
          }
          findMany: {
            args: Prisma.BookingItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingItemPayload>[]
          }
          create: {
            args: Prisma.BookingItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingItemPayload>
          }
          createMany: {
            args: Prisma.BookingItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookingItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingItemPayload>[]
          }
          delete: {
            args: Prisma.BookingItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingItemPayload>
          }
          update: {
            args: Prisma.BookingItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingItemPayload>
          }
          deleteMany: {
            args: Prisma.BookingItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookingItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BookingItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingItemPayload>[]
          }
          upsert: {
            args: Prisma.BookingItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingItemPayload>
          }
          aggregate: {
            args: Prisma.BookingItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBookingItem>
          }
          groupBy: {
            args: Prisma.BookingItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookingItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookingItemCountArgs<ExtArgs>
            result: $Utils.Optional<BookingItemCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaymentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
      Coupon: {
        payload: Prisma.$CouponPayload<ExtArgs>
        fields: Prisma.CouponFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CouponFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CouponFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>
          }
          findFirst: {
            args: Prisma.CouponFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CouponFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>
          }
          findMany: {
            args: Prisma.CouponFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>[]
          }
          create: {
            args: Prisma.CouponCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>
          }
          createMany: {
            args: Prisma.CouponCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CouponCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>[]
          }
          delete: {
            args: Prisma.CouponDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>
          }
          update: {
            args: Prisma.CouponUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>
          }
          deleteMany: {
            args: Prisma.CouponDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CouponUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CouponUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>[]
          }
          upsert: {
            args: Prisma.CouponUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CouponPayload>
          }
          aggregate: {
            args: Prisma.CouponAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCoupon>
          }
          groupBy: {
            args: Prisma.CouponGroupByArgs<ExtArgs>
            result: $Utils.Optional<CouponGroupByOutputType>[]
          }
          count: {
            args: Prisma.CouponCountArgs<ExtArgs>
            result: $Utils.Optional<CouponCountAggregateOutputType> | number
          }
        }
      }
      SalesFunnel: {
        payload: Prisma.$SalesFunnelPayload<ExtArgs>
        fields: Prisma.SalesFunnelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SalesFunnelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesFunnelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SalesFunnelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesFunnelPayload>
          }
          findFirst: {
            args: Prisma.SalesFunnelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesFunnelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SalesFunnelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesFunnelPayload>
          }
          findMany: {
            args: Prisma.SalesFunnelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesFunnelPayload>[]
          }
          create: {
            args: Prisma.SalesFunnelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesFunnelPayload>
          }
          createMany: {
            args: Prisma.SalesFunnelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SalesFunnelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesFunnelPayload>[]
          }
          delete: {
            args: Prisma.SalesFunnelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesFunnelPayload>
          }
          update: {
            args: Prisma.SalesFunnelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesFunnelPayload>
          }
          deleteMany: {
            args: Prisma.SalesFunnelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SalesFunnelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SalesFunnelUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesFunnelPayload>[]
          }
          upsert: {
            args: Prisma.SalesFunnelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesFunnelPayload>
          }
          aggregate: {
            args: Prisma.SalesFunnelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSalesFunnel>
          }
          groupBy: {
            args: Prisma.SalesFunnelGroupByArgs<ExtArgs>
            result: $Utils.Optional<SalesFunnelGroupByOutputType>[]
          }
          count: {
            args: Prisma.SalesFunnelCountArgs<ExtArgs>
            result: $Utils.Optional<SalesFunnelCountAggregateOutputType> | number
          }
        }
      }
      Waiver: {
        payload: Prisma.$WaiverPayload<ExtArgs>
        fields: Prisma.WaiverFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WaiverFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaiverPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WaiverFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaiverPayload>
          }
          findFirst: {
            args: Prisma.WaiverFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaiverPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WaiverFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaiverPayload>
          }
          findMany: {
            args: Prisma.WaiverFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaiverPayload>[]
          }
          create: {
            args: Prisma.WaiverCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaiverPayload>
          }
          createMany: {
            args: Prisma.WaiverCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WaiverCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaiverPayload>[]
          }
          delete: {
            args: Prisma.WaiverDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaiverPayload>
          }
          update: {
            args: Prisma.WaiverUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaiverPayload>
          }
          deleteMany: {
            args: Prisma.WaiverDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WaiverUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WaiverUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaiverPayload>[]
          }
          upsert: {
            args: Prisma.WaiverUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WaiverPayload>
          }
          aggregate: {
            args: Prisma.WaiverAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWaiver>
          }
          groupBy: {
            args: Prisma.WaiverGroupByArgs<ExtArgs>
            result: $Utils.Optional<WaiverGroupByOutputType>[]
          }
          count: {
            args: Prisma.WaiverCountArgs<ExtArgs>
            result: $Utils.Optional<WaiverCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    business?: BusinessOmit
    inventory?: InventoryOmit
    customer?: CustomerOmit
    booking?: BookingOmit
    bookingItem?: BookingItemOmit
    payment?: PaymentOmit
    coupon?: CouponOmit
    salesFunnel?: SalesFunnelOmit
    waiver?: WaiverOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    businesses: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    businesses?: boolean | UserCountOutputTypeCountBusinessesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBusinessesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BusinessWhereInput
  }


  /**
   * Count Type BusinessCountOutputType
   */

  export type BusinessCountOutputType = {
    bookings: number
    customers: number
    inventory: number
    payments: number
    coupons: number
    salesFunnels: number
    waivers: number
  }

  export type BusinessCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookings?: boolean | BusinessCountOutputTypeCountBookingsArgs
    customers?: boolean | BusinessCountOutputTypeCountCustomersArgs
    inventory?: boolean | BusinessCountOutputTypeCountInventoryArgs
    payments?: boolean | BusinessCountOutputTypeCountPaymentsArgs
    coupons?: boolean | BusinessCountOutputTypeCountCouponsArgs
    salesFunnels?: boolean | BusinessCountOutputTypeCountSalesFunnelsArgs
    waivers?: boolean | BusinessCountOutputTypeCountWaiversArgs
  }

  // Custom InputTypes
  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BusinessCountOutputType
     */
    select?: BusinessCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountBookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountCustomersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountInventoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountCouponsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CouponWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountSalesFunnelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalesFunnelWhereInput
  }

  /**
   * BusinessCountOutputType without action
   */
  export type BusinessCountOutputTypeCountWaiversArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WaiverWhereInput
  }


  /**
   * Count Type InventoryCountOutputType
   */

  export type InventoryCountOutputType = {
    bookingItems: number
  }

  export type InventoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookingItems?: boolean | InventoryCountOutputTypeCountBookingItemsArgs
  }

  // Custom InputTypes
  /**
   * InventoryCountOutputType without action
   */
  export type InventoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InventoryCountOutputType
     */
    select?: InventoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InventoryCountOutputType without action
   */
  export type InventoryCountOutputTypeCountBookingItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingItemWhereInput
  }


  /**
   * Count Type CustomerCountOutputType
   */

  export type CustomerCountOutputType = {
    bookings: number
    waivers: number
  }

  export type CustomerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookings?: boolean | CustomerCountOutputTypeCountBookingsArgs
    waivers?: boolean | CustomerCountOutputTypeCountWaiversArgs
  }

  // Custom InputTypes
  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerCountOutputType
     */
    select?: CustomerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountBookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountWaiversArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WaiverWhereInput
  }


  /**
   * Count Type BookingCountOutputType
   */

  export type BookingCountOutputType = {
    inventoryItems: number
    payments: number
    waivers: number
  }

  export type BookingCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventoryItems?: boolean | BookingCountOutputTypeCountInventoryItemsArgs
    payments?: boolean | BookingCountOutputTypeCountPaymentsArgs
    waivers?: boolean | BookingCountOutputTypeCountWaiversArgs
  }

  // Custom InputTypes
  /**
   * BookingCountOutputType without action
   */
  export type BookingCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingCountOutputType
     */
    select?: BookingCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BookingCountOutputType without action
   */
  export type BookingCountOutputTypeCountInventoryItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingItemWhereInput
  }

  /**
   * BookingCountOutputType without action
   */
  export type BookingCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }

  /**
   * BookingCountOutputType without action
   */
  export type BookingCountOutputTypeCountWaiversArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WaiverWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    createdAt: Date | null
    image: string | null
    updatedAt: Date | null
    onboarded: boolean | null
    clerkUserId: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    createdAt: Date | null
    image: string | null
    updatedAt: Date | null
    onboarded: boolean | null
    clerkUserId: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    createdAt: number
    image: number
    updatedAt: number
    onboarded: number
    clerkUserId: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    createdAt?: true
    image?: true
    updatedAt?: true
    onboarded?: true
    clerkUserId?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    createdAt?: true
    image?: true
    updatedAt?: true
    onboarded?: true
    clerkUserId?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    createdAt?: true
    image?: true
    updatedAt?: true
    onboarded?: true
    clerkUserId?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string | null
    name: string | null
    createdAt: Date
    image: string | null
    updatedAt: Date
    onboarded: boolean
    clerkUserId: string | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    createdAt?: boolean
    image?: boolean
    updatedAt?: boolean
    onboarded?: boolean
    clerkUserId?: boolean
    businesses?: boolean | User$businessesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    createdAt?: boolean
    image?: boolean
    updatedAt?: boolean
    onboarded?: boolean
    clerkUserId?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    createdAt?: boolean
    image?: boolean
    updatedAt?: boolean
    onboarded?: boolean
    clerkUserId?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    createdAt?: boolean
    image?: boolean
    updatedAt?: boolean
    onboarded?: boolean
    clerkUserId?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "createdAt" | "image" | "updatedAt" | "onboarded" | "clerkUserId", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    businesses?: boolean | User$businessesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      businesses: Prisma.$BusinessPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string | null
      name: string | null
      createdAt: Date
      image: string | null
      updatedAt: Date
      onboarded: boolean
      clerkUserId: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    businesses<T extends User$businessesArgs<ExtArgs> = {}>(args?: Subset<T, User$businessesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly image: FieldRef<"User", 'String'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly onboarded: FieldRef<"User", 'Boolean'>
    readonly clerkUserId: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.businesses
   */
  export type User$businessesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Business
     */
    omit?: BusinessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    where?: BusinessWhereInput
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    cursor?: BusinessWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Business
   */

  export type AggregateBusiness = {
    _count: BusinessCountAggregateOutputType | null
    _avg: BusinessAvgAggregateOutputType | null
    _sum: BusinessSumAggregateOutputType | null
    _min: BusinessMinAggregateOutputType | null
    _max: BusinessMaxAggregateOutputType | null
  }

  export type BusinessAvgAggregateOutputType = {
    minAdvanceBooking: number | null
    maxAdvanceBooking: number | null
    minimumPurchase: number | null
  }

  export type BusinessSumAggregateOutputType = {
    minAdvanceBooking: number | null
    maxAdvanceBooking: number | null
    minimumPurchase: number | null
  }

  export type BusinessMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    phone: string | null
    email: string | null
    logo: string | null
    createdAt: Date | null
    updatedAt: Date | null
    minAdvanceBooking: number | null
    maxAdvanceBooking: number | null
    minimumPurchase: number | null
    userId: string | null
    stripeAccountId: string | null
    customDomain: string | null
    subdomain: string | null
    onboardingError: string | null
  }

  export type BusinessMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    phone: string | null
    email: string | null
    logo: string | null
    createdAt: Date | null
    updatedAt: Date | null
    minAdvanceBooking: number | null
    maxAdvanceBooking: number | null
    minimumPurchase: number | null
    userId: string | null
    stripeAccountId: string | null
    customDomain: string | null
    subdomain: string | null
    onboardingError: string | null
  }

  export type BusinessCountAggregateOutputType = {
    id: number
    name: number
    description: number
    address: number
    city: number
    state: number
    zipCode: number
    phone: number
    email: number
    serviceArea: number
    logo: number
    createdAt: number
    updatedAt: number
    minAdvanceBooking: number
    maxAdvanceBooking: number
    minimumPurchase: number
    userId: number
    stripeAccountId: number
    socialMedia: number
    customDomain: number
    subdomain: number
    siteConfig: number
    onboardingError: number
    _all: number
  }


  export type BusinessAvgAggregateInputType = {
    minAdvanceBooking?: true
    maxAdvanceBooking?: true
    minimumPurchase?: true
  }

  export type BusinessSumAggregateInputType = {
    minAdvanceBooking?: true
    maxAdvanceBooking?: true
    minimumPurchase?: true
  }

  export type BusinessMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    address?: true
    city?: true
    state?: true
    zipCode?: true
    phone?: true
    email?: true
    logo?: true
    createdAt?: true
    updatedAt?: true
    minAdvanceBooking?: true
    maxAdvanceBooking?: true
    minimumPurchase?: true
    userId?: true
    stripeAccountId?: true
    customDomain?: true
    subdomain?: true
    onboardingError?: true
  }

  export type BusinessMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    address?: true
    city?: true
    state?: true
    zipCode?: true
    phone?: true
    email?: true
    logo?: true
    createdAt?: true
    updatedAt?: true
    minAdvanceBooking?: true
    maxAdvanceBooking?: true
    minimumPurchase?: true
    userId?: true
    stripeAccountId?: true
    customDomain?: true
    subdomain?: true
    onboardingError?: true
  }

  export type BusinessCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    address?: true
    city?: true
    state?: true
    zipCode?: true
    phone?: true
    email?: true
    serviceArea?: true
    logo?: true
    createdAt?: true
    updatedAt?: true
    minAdvanceBooking?: true
    maxAdvanceBooking?: true
    minimumPurchase?: true
    userId?: true
    stripeAccountId?: true
    socialMedia?: true
    customDomain?: true
    subdomain?: true
    siteConfig?: true
    onboardingError?: true
    _all?: true
  }

  export type BusinessAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Business to aggregate.
     */
    where?: BusinessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Businesses to fetch.
     */
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BusinessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Businesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Businesses
    **/
    _count?: true | BusinessCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BusinessAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BusinessSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BusinessMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BusinessMaxAggregateInputType
  }

  export type GetBusinessAggregateType<T extends BusinessAggregateArgs> = {
        [P in keyof T & keyof AggregateBusiness]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBusiness[P]>
      : GetScalarType<T[P], AggregateBusiness[P]>
  }




  export type BusinessGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BusinessWhereInput
    orderBy?: BusinessOrderByWithAggregationInput | BusinessOrderByWithAggregationInput[]
    by: BusinessScalarFieldEnum[] | BusinessScalarFieldEnum
    having?: BusinessScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BusinessCountAggregateInputType | true
    _avg?: BusinessAvgAggregateInputType
    _sum?: BusinessSumAggregateInputType
    _min?: BusinessMinAggregateInputType
    _max?: BusinessMaxAggregateInputType
  }

  export type BusinessGroupByOutputType = {
    id: string
    name: string
    description: string | null
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    phone: string | null
    email: string | null
    serviceArea: string[]
    logo: string | null
    createdAt: Date
    updatedAt: Date
    minAdvanceBooking: number
    maxAdvanceBooking: number
    minimumPurchase: number
    userId: string
    stripeAccountId: string | null
    socialMedia: JsonValue | null
    customDomain: string | null
    subdomain: string | null
    siteConfig: JsonValue | null
    onboardingError: string | null
    _count: BusinessCountAggregateOutputType | null
    _avg: BusinessAvgAggregateOutputType | null
    _sum: BusinessSumAggregateOutputType | null
    _min: BusinessMinAggregateOutputType | null
    _max: BusinessMaxAggregateOutputType | null
  }

  type GetBusinessGroupByPayload<T extends BusinessGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BusinessGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BusinessGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BusinessGroupByOutputType[P]>
            : GetScalarType<T[P], BusinessGroupByOutputType[P]>
        }
      >
    >


  export type BusinessSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    phone?: boolean
    email?: boolean
    serviceArea?: boolean
    logo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    minAdvanceBooking?: boolean
    maxAdvanceBooking?: boolean
    minimumPurchase?: boolean
    userId?: boolean
    stripeAccountId?: boolean
    socialMedia?: boolean
    customDomain?: boolean
    subdomain?: boolean
    siteConfig?: boolean
    onboardingError?: boolean
    bookings?: boolean | Business$bookingsArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    customers?: boolean | Business$customersArgs<ExtArgs>
    inventory?: boolean | Business$inventoryArgs<ExtArgs>
    payments?: boolean | Business$paymentsArgs<ExtArgs>
    coupons?: boolean | Business$couponsArgs<ExtArgs>
    salesFunnels?: boolean | Business$salesFunnelsArgs<ExtArgs>
    waivers?: boolean | Business$waiversArgs<ExtArgs>
    _count?: boolean | BusinessCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["business"]>

  export type BusinessSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    phone?: boolean
    email?: boolean
    serviceArea?: boolean
    logo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    minAdvanceBooking?: boolean
    maxAdvanceBooking?: boolean
    minimumPurchase?: boolean
    userId?: boolean
    stripeAccountId?: boolean
    socialMedia?: boolean
    customDomain?: boolean
    subdomain?: boolean
    siteConfig?: boolean
    onboardingError?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["business"]>

  export type BusinessSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    phone?: boolean
    email?: boolean
    serviceArea?: boolean
    logo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    minAdvanceBooking?: boolean
    maxAdvanceBooking?: boolean
    minimumPurchase?: boolean
    userId?: boolean
    stripeAccountId?: boolean
    socialMedia?: boolean
    customDomain?: boolean
    subdomain?: boolean
    siteConfig?: boolean
    onboardingError?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["business"]>

  export type BusinessSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    phone?: boolean
    email?: boolean
    serviceArea?: boolean
    logo?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    minAdvanceBooking?: boolean
    maxAdvanceBooking?: boolean
    minimumPurchase?: boolean
    userId?: boolean
    stripeAccountId?: boolean
    socialMedia?: boolean
    customDomain?: boolean
    subdomain?: boolean
    siteConfig?: boolean
    onboardingError?: boolean
  }

  export type BusinessOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "address" | "city" | "state" | "zipCode" | "phone" | "email" | "serviceArea" | "logo" | "createdAt" | "updatedAt" | "minAdvanceBooking" | "maxAdvanceBooking" | "minimumPurchase" | "userId" | "stripeAccountId" | "socialMedia" | "customDomain" | "subdomain" | "siteConfig" | "onboardingError", ExtArgs["result"]["business"]>
  export type BusinessInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookings?: boolean | Business$bookingsArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    customers?: boolean | Business$customersArgs<ExtArgs>
    inventory?: boolean | Business$inventoryArgs<ExtArgs>
    payments?: boolean | Business$paymentsArgs<ExtArgs>
    coupons?: boolean | Business$couponsArgs<ExtArgs>
    salesFunnels?: boolean | Business$salesFunnelsArgs<ExtArgs>
    waivers?: boolean | Business$waiversArgs<ExtArgs>
    _count?: boolean | BusinessCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BusinessIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type BusinessIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $BusinessPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Business"
    objects: {
      bookings: Prisma.$BookingPayload<ExtArgs>[]
      user: Prisma.$UserPayload<ExtArgs>
      customers: Prisma.$CustomerPayload<ExtArgs>[]
      inventory: Prisma.$InventoryPayload<ExtArgs>[]
      payments: Prisma.$PaymentPayload<ExtArgs>[]
      coupons: Prisma.$CouponPayload<ExtArgs>[]
      salesFunnels: Prisma.$SalesFunnelPayload<ExtArgs>[]
      waivers: Prisma.$WaiverPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      address: string | null
      city: string | null
      state: string | null
      zipCode: string | null
      phone: string | null
      email: string | null
      serviceArea: string[]
      logo: string | null
      createdAt: Date
      updatedAt: Date
      minAdvanceBooking: number
      maxAdvanceBooking: number
      minimumPurchase: number
      userId: string
      stripeAccountId: string | null
      socialMedia: Prisma.JsonValue | null
      customDomain: string | null
      subdomain: string | null
      siteConfig: Prisma.JsonValue | null
      onboardingError: string | null
    }, ExtArgs["result"]["business"]>
    composites: {}
  }

  type BusinessGetPayload<S extends boolean | null | undefined | BusinessDefaultArgs> = $Result.GetResult<Prisma.$BusinessPayload, S>

  type BusinessCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BusinessFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BusinessCountAggregateInputType | true
    }

  export interface BusinessDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Business'], meta: { name: 'Business' } }
    /**
     * Find zero or one Business that matches the filter.
     * @param {BusinessFindUniqueArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BusinessFindUniqueArgs>(args: SelectSubset<T, BusinessFindUniqueArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Business that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BusinessFindUniqueOrThrowArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BusinessFindUniqueOrThrowArgs>(args: SelectSubset<T, BusinessFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Business that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessFindFirstArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BusinessFindFirstArgs>(args?: SelectSubset<T, BusinessFindFirstArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Business that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessFindFirstOrThrowArgs} args - Arguments to find a Business
     * @example
     * // Get one Business
     * const business = await prisma.business.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BusinessFindFirstOrThrowArgs>(args?: SelectSubset<T, BusinessFindFirstOrThrowArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Businesses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Businesses
     * const businesses = await prisma.business.findMany()
     * 
     * // Get first 10 Businesses
     * const businesses = await prisma.business.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const businessWithIdOnly = await prisma.business.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BusinessFindManyArgs>(args?: SelectSubset<T, BusinessFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Business.
     * @param {BusinessCreateArgs} args - Arguments to create a Business.
     * @example
     * // Create one Business
     * const Business = await prisma.business.create({
     *   data: {
     *     // ... data to create a Business
     *   }
     * })
     * 
     */
    create<T extends BusinessCreateArgs>(args: SelectSubset<T, BusinessCreateArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Businesses.
     * @param {BusinessCreateManyArgs} args - Arguments to create many Businesses.
     * @example
     * // Create many Businesses
     * const business = await prisma.business.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BusinessCreateManyArgs>(args?: SelectSubset<T, BusinessCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Businesses and returns the data saved in the database.
     * @param {BusinessCreateManyAndReturnArgs} args - Arguments to create many Businesses.
     * @example
     * // Create many Businesses
     * const business = await prisma.business.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Businesses and only return the `id`
     * const businessWithIdOnly = await prisma.business.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BusinessCreateManyAndReturnArgs>(args?: SelectSubset<T, BusinessCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Business.
     * @param {BusinessDeleteArgs} args - Arguments to delete one Business.
     * @example
     * // Delete one Business
     * const Business = await prisma.business.delete({
     *   where: {
     *     // ... filter to delete one Business
     *   }
     * })
     * 
     */
    delete<T extends BusinessDeleteArgs>(args: SelectSubset<T, BusinessDeleteArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Business.
     * @param {BusinessUpdateArgs} args - Arguments to update one Business.
     * @example
     * // Update one Business
     * const business = await prisma.business.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BusinessUpdateArgs>(args: SelectSubset<T, BusinessUpdateArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Businesses.
     * @param {BusinessDeleteManyArgs} args - Arguments to filter Businesses to delete.
     * @example
     * // Delete a few Businesses
     * const { count } = await prisma.business.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BusinessDeleteManyArgs>(args?: SelectSubset<T, BusinessDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Businesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Businesses
     * const business = await prisma.business.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BusinessUpdateManyArgs>(args: SelectSubset<T, BusinessUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Businesses and returns the data updated in the database.
     * @param {BusinessUpdateManyAndReturnArgs} args - Arguments to update many Businesses.
     * @example
     * // Update many Businesses
     * const business = await prisma.business.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Businesses and only return the `id`
     * const businessWithIdOnly = await prisma.business.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BusinessUpdateManyAndReturnArgs>(args: SelectSubset<T, BusinessUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Business.
     * @param {BusinessUpsertArgs} args - Arguments to update or create a Business.
     * @example
     * // Update or create a Business
     * const business = await prisma.business.upsert({
     *   create: {
     *     // ... data to create a Business
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Business we want to update
     *   }
     * })
     */
    upsert<T extends BusinessUpsertArgs>(args: SelectSubset<T, BusinessUpsertArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Businesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessCountArgs} args - Arguments to filter Businesses to count.
     * @example
     * // Count the number of Businesses
     * const count = await prisma.business.count({
     *   where: {
     *     // ... the filter for the Businesses we want to count
     *   }
     * })
    **/
    count<T extends BusinessCountArgs>(
      args?: Subset<T, BusinessCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BusinessCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Business.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BusinessAggregateArgs>(args: Subset<T, BusinessAggregateArgs>): Prisma.PrismaPromise<GetBusinessAggregateType<T>>

    /**
     * Group by Business.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BusinessGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BusinessGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BusinessGroupByArgs['orderBy'] }
        : { orderBy?: BusinessGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BusinessGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBusinessGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Business model
   */
  readonly fields: BusinessFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Business.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BusinessClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bookings<T extends Business$bookingsArgs<ExtArgs> = {}>(args?: Subset<T, Business$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    customers<T extends Business$customersArgs<ExtArgs> = {}>(args?: Subset<T, Business$customersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    inventory<T extends Business$inventoryArgs<ExtArgs> = {}>(args?: Subset<T, Business$inventoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    payments<T extends Business$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, Business$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    coupons<T extends Business$couponsArgs<ExtArgs> = {}>(args?: Subset<T, Business$couponsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    salesFunnels<T extends Business$salesFunnelsArgs<ExtArgs> = {}>(args?: Subset<T, Business$salesFunnelsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesFunnelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    waivers<T extends Business$waiversArgs<ExtArgs> = {}>(args?: Subset<T, Business$waiversArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WaiverPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Business model
   */
  interface BusinessFieldRefs {
    readonly id: FieldRef<"Business", 'String'>
    readonly name: FieldRef<"Business", 'String'>
    readonly description: FieldRef<"Business", 'String'>
    readonly address: FieldRef<"Business", 'String'>
    readonly city: FieldRef<"Business", 'String'>
    readonly state: FieldRef<"Business", 'String'>
    readonly zipCode: FieldRef<"Business", 'String'>
    readonly phone: FieldRef<"Business", 'String'>
    readonly email: FieldRef<"Business", 'String'>
    readonly serviceArea: FieldRef<"Business", 'String[]'>
    readonly logo: FieldRef<"Business", 'String'>
    readonly createdAt: FieldRef<"Business", 'DateTime'>
    readonly updatedAt: FieldRef<"Business", 'DateTime'>
    readonly minAdvanceBooking: FieldRef<"Business", 'Int'>
    readonly maxAdvanceBooking: FieldRef<"Business", 'Int'>
    readonly minimumPurchase: FieldRef<"Business", 'Float'>
    readonly userId: FieldRef<"Business", 'String'>
    readonly stripeAccountId: FieldRef<"Business", 'String'>
    readonly socialMedia: FieldRef<"Business", 'Json'>
    readonly customDomain: FieldRef<"Business", 'String'>
    readonly subdomain: FieldRef<"Business", 'String'>
    readonly siteConfig: FieldRef<"Business", 'Json'>
    readonly onboardingError: FieldRef<"Business", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Business findUnique
   */
  export type BusinessFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Business
     */
    omit?: BusinessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Business to fetch.
     */
    where: BusinessWhereUniqueInput
  }

  /**
   * Business findUniqueOrThrow
   */
  export type BusinessFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Business
     */
    omit?: BusinessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Business to fetch.
     */
    where: BusinessWhereUniqueInput
  }

  /**
   * Business findFirst
   */
  export type BusinessFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Business
     */
    omit?: BusinessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Business to fetch.
     */
    where?: BusinessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Businesses to fetch.
     */
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Businesses.
     */
    cursor?: BusinessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Businesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Businesses.
     */
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
  }

  /**
   * Business findFirstOrThrow
   */
  export type BusinessFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Business
     */
    omit?: BusinessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Business to fetch.
     */
    where?: BusinessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Businesses to fetch.
     */
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Businesses.
     */
    cursor?: BusinessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Businesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Businesses.
     */
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
  }

  /**
   * Business findMany
   */
  export type BusinessFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Business
     */
    omit?: BusinessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter, which Businesses to fetch.
     */
    where?: BusinessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Businesses to fetch.
     */
    orderBy?: BusinessOrderByWithRelationInput | BusinessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Businesses.
     */
    cursor?: BusinessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Businesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Businesses.
     */
    skip?: number
    distinct?: BusinessScalarFieldEnum | BusinessScalarFieldEnum[]
  }

  /**
   * Business create
   */
  export type BusinessCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Business
     */
    omit?: BusinessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * The data needed to create a Business.
     */
    data: XOR<BusinessCreateInput, BusinessUncheckedCreateInput>
  }

  /**
   * Business createMany
   */
  export type BusinessCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Businesses.
     */
    data: BusinessCreateManyInput | BusinessCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Business createManyAndReturn
   */
  export type BusinessCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Business
     */
    omit?: BusinessOmit<ExtArgs> | null
    /**
     * The data used to create many Businesses.
     */
    data: BusinessCreateManyInput | BusinessCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Business update
   */
  export type BusinessUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Business
     */
    omit?: BusinessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * The data needed to update a Business.
     */
    data: XOR<BusinessUpdateInput, BusinessUncheckedUpdateInput>
    /**
     * Choose, which Business to update.
     */
    where: BusinessWhereUniqueInput
  }

  /**
   * Business updateMany
   */
  export type BusinessUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Businesses.
     */
    data: XOR<BusinessUpdateManyMutationInput, BusinessUncheckedUpdateManyInput>
    /**
     * Filter which Businesses to update
     */
    where?: BusinessWhereInput
    /**
     * Limit how many Businesses to update.
     */
    limit?: number
  }

  /**
   * Business updateManyAndReturn
   */
  export type BusinessUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Business
     */
    omit?: BusinessOmit<ExtArgs> | null
    /**
     * The data used to update Businesses.
     */
    data: XOR<BusinessUpdateManyMutationInput, BusinessUncheckedUpdateManyInput>
    /**
     * Filter which Businesses to update
     */
    where?: BusinessWhereInput
    /**
     * Limit how many Businesses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Business upsert
   */
  export type BusinessUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Business
     */
    omit?: BusinessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * The filter to search for the Business to update in case it exists.
     */
    where: BusinessWhereUniqueInput
    /**
     * In case the Business found by the `where` argument doesn't exist, create a new Business with this data.
     */
    create: XOR<BusinessCreateInput, BusinessUncheckedCreateInput>
    /**
     * In case the Business was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BusinessUpdateInput, BusinessUncheckedUpdateInput>
  }

  /**
   * Business delete
   */
  export type BusinessDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Business
     */
    omit?: BusinessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
    /**
     * Filter which Business to delete.
     */
    where: BusinessWhereUniqueInput
  }

  /**
   * Business deleteMany
   */
  export type BusinessDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Businesses to delete
     */
    where?: BusinessWhereInput
    /**
     * Limit how many Businesses to delete.
     */
    limit?: number
  }

  /**
   * Business.bookings
   */
  export type Business$bookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    cursor?: BookingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Business.customers
   */
  export type Business$customersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    cursor?: CustomerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Business.inventory
   */
  export type Business$inventoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    where?: InventoryWhereInput
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    cursor?: InventoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * Business.payments
   */
  export type Business$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Business.coupons
   */
  export type Business$couponsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    where?: CouponWhereInput
    orderBy?: CouponOrderByWithRelationInput | CouponOrderByWithRelationInput[]
    cursor?: CouponWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CouponScalarFieldEnum | CouponScalarFieldEnum[]
  }

  /**
   * Business.salesFunnels
   */
  export type Business$salesFunnelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesFunnel
     */
    select?: SalesFunnelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesFunnel
     */
    omit?: SalesFunnelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesFunnelInclude<ExtArgs> | null
    where?: SalesFunnelWhereInput
    orderBy?: SalesFunnelOrderByWithRelationInput | SalesFunnelOrderByWithRelationInput[]
    cursor?: SalesFunnelWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SalesFunnelScalarFieldEnum | SalesFunnelScalarFieldEnum[]
  }

  /**
   * Business.waivers
   */
  export type Business$waiversArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Waiver
     */
    select?: WaiverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Waiver
     */
    omit?: WaiverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaiverInclude<ExtArgs> | null
    where?: WaiverWhereInput
    orderBy?: WaiverOrderByWithRelationInput | WaiverOrderByWithRelationInput[]
    cursor?: WaiverWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WaiverScalarFieldEnum | WaiverScalarFieldEnum[]
  }

  /**
   * Business without action
   */
  export type BusinessDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Business
     */
    select?: BusinessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Business
     */
    omit?: BusinessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BusinessInclude<ExtArgs> | null
  }


  /**
   * Model Inventory
   */

  export type AggregateInventory = {
    _count: InventoryCountAggregateOutputType | null
    _avg: InventoryAvgAggregateOutputType | null
    _sum: InventorySumAggregateOutputType | null
    _min: InventoryMinAggregateOutputType | null
    _max: InventoryMaxAggregateOutputType | null
  }

  export type InventoryAvgAggregateOutputType = {
    capacity: number | null
    price: number | null
    setupTime: number | null
    teardownTime: number | null
    weightLimit: number | null
    quantity: number | null
  }

  export type InventorySumAggregateOutputType = {
    capacity: number | null
    price: number | null
    setupTime: number | null
    teardownTime: number | null
    weightLimit: number | null
    quantity: number | null
  }

  export type InventoryMinAggregateOutputType = {
    id: string | null
    type: $Enums.InventoryType | null
    name: string | null
    description: string | null
    dimensions: string | null
    capacity: number | null
    price: number | null
    setupTime: number | null
    teardownTime: number | null
    primaryImage: string | null
    status: $Enums.InventoryStatus | null
    minimumSpace: string | null
    weightLimit: number | null
    ageRange: string | null
    businessId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    quantity: number | null
  }

  export type InventoryMaxAggregateOutputType = {
    id: string | null
    type: $Enums.InventoryType | null
    name: string | null
    description: string | null
    dimensions: string | null
    capacity: number | null
    price: number | null
    setupTime: number | null
    teardownTime: number | null
    primaryImage: string | null
    status: $Enums.InventoryStatus | null
    minimumSpace: string | null
    weightLimit: number | null
    ageRange: string | null
    businessId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    quantity: number | null
  }

  export type InventoryCountAggregateOutputType = {
    id: number
    type: number
    name: number
    description: number
    dimensions: number
    capacity: number
    price: number
    setupTime: number
    teardownTime: number
    images: number
    primaryImage: number
    status: number
    minimumSpace: number
    weightLimit: number
    ageRange: number
    weatherRestrictions: number
    businessId: number
    createdAt: number
    updatedAt: number
    quantity: number
    _all: number
  }


  export type InventoryAvgAggregateInputType = {
    capacity?: true
    price?: true
    setupTime?: true
    teardownTime?: true
    weightLimit?: true
    quantity?: true
  }

  export type InventorySumAggregateInputType = {
    capacity?: true
    price?: true
    setupTime?: true
    teardownTime?: true
    weightLimit?: true
    quantity?: true
  }

  export type InventoryMinAggregateInputType = {
    id?: true
    type?: true
    name?: true
    description?: true
    dimensions?: true
    capacity?: true
    price?: true
    setupTime?: true
    teardownTime?: true
    primaryImage?: true
    status?: true
    minimumSpace?: true
    weightLimit?: true
    ageRange?: true
    businessId?: true
    createdAt?: true
    updatedAt?: true
    quantity?: true
  }

  export type InventoryMaxAggregateInputType = {
    id?: true
    type?: true
    name?: true
    description?: true
    dimensions?: true
    capacity?: true
    price?: true
    setupTime?: true
    teardownTime?: true
    primaryImage?: true
    status?: true
    minimumSpace?: true
    weightLimit?: true
    ageRange?: true
    businessId?: true
    createdAt?: true
    updatedAt?: true
    quantity?: true
  }

  export type InventoryCountAggregateInputType = {
    id?: true
    type?: true
    name?: true
    description?: true
    dimensions?: true
    capacity?: true
    price?: true
    setupTime?: true
    teardownTime?: true
    images?: true
    primaryImage?: true
    status?: true
    minimumSpace?: true
    weightLimit?: true
    ageRange?: true
    weatherRestrictions?: true
    businessId?: true
    createdAt?: true
    updatedAt?: true
    quantity?: true
    _all?: true
  }

  export type InventoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inventory to aggregate.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Inventories
    **/
    _count?: true | InventoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InventoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InventorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryMaxAggregateInputType
  }

  export type GetInventoryAggregateType<T extends InventoryAggregateArgs> = {
        [P in keyof T & keyof AggregateInventory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventory[P]>
      : GetScalarType<T[P], AggregateInventory[P]>
  }




  export type InventoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryWhereInput
    orderBy?: InventoryOrderByWithAggregationInput | InventoryOrderByWithAggregationInput[]
    by: InventoryScalarFieldEnum[] | InventoryScalarFieldEnum
    having?: InventoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryCountAggregateInputType | true
    _avg?: InventoryAvgAggregateInputType
    _sum?: InventorySumAggregateInputType
    _min?: InventoryMinAggregateInputType
    _max?: InventoryMaxAggregateInputType
  }

  export type InventoryGroupByOutputType = {
    id: string
    type: $Enums.InventoryType
    name: string
    description: string | null
    dimensions: string
    capacity: number
    price: number
    setupTime: number
    teardownTime: number
    images: string[]
    primaryImage: string | null
    status: $Enums.InventoryStatus
    minimumSpace: string
    weightLimit: number
    ageRange: string
    weatherRestrictions: string[]
    businessId: string
    createdAt: Date
    updatedAt: Date
    quantity: number
    _count: InventoryCountAggregateOutputType | null
    _avg: InventoryAvgAggregateOutputType | null
    _sum: InventorySumAggregateOutputType | null
    _min: InventoryMinAggregateOutputType | null
    _max: InventoryMaxAggregateOutputType | null
  }

  type GetInventoryGroupByPayload<T extends InventoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryGroupByOutputType[P]>
        }
      >
    >


  export type InventorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    name?: boolean
    description?: boolean
    dimensions?: boolean
    capacity?: boolean
    price?: boolean
    setupTime?: boolean
    teardownTime?: boolean
    images?: boolean
    primaryImage?: boolean
    status?: boolean
    minimumSpace?: boolean
    weightLimit?: boolean
    ageRange?: boolean
    weatherRestrictions?: boolean
    businessId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    quantity?: boolean
    bookingItems?: boolean | Inventory$bookingItemsArgs<ExtArgs>
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    _count?: boolean | InventoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventory"]>

  export type InventorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    name?: boolean
    description?: boolean
    dimensions?: boolean
    capacity?: boolean
    price?: boolean
    setupTime?: boolean
    teardownTime?: boolean
    images?: boolean
    primaryImage?: boolean
    status?: boolean
    minimumSpace?: boolean
    weightLimit?: boolean
    ageRange?: boolean
    weatherRestrictions?: boolean
    businessId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    quantity?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventory"]>

  export type InventorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    name?: boolean
    description?: boolean
    dimensions?: boolean
    capacity?: boolean
    price?: boolean
    setupTime?: boolean
    teardownTime?: boolean
    images?: boolean
    primaryImage?: boolean
    status?: boolean
    minimumSpace?: boolean
    weightLimit?: boolean
    ageRange?: boolean
    weatherRestrictions?: boolean
    businessId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    quantity?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventory"]>

  export type InventorySelectScalar = {
    id?: boolean
    type?: boolean
    name?: boolean
    description?: boolean
    dimensions?: boolean
    capacity?: boolean
    price?: boolean
    setupTime?: boolean
    teardownTime?: boolean
    images?: boolean
    primaryImage?: boolean
    status?: boolean
    minimumSpace?: boolean
    weightLimit?: boolean
    ageRange?: boolean
    weatherRestrictions?: boolean
    businessId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    quantity?: boolean
  }

  export type InventoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "name" | "description" | "dimensions" | "capacity" | "price" | "setupTime" | "teardownTime" | "images" | "primaryImage" | "status" | "minimumSpace" | "weightLimit" | "ageRange" | "weatherRestrictions" | "businessId" | "createdAt" | "updatedAt" | "quantity", ExtArgs["result"]["inventory"]>
  export type InventoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookingItems?: boolean | Inventory$bookingItemsArgs<ExtArgs>
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    _count?: boolean | InventoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InventoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }
  export type InventoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }

  export type $InventoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Inventory"
    objects: {
      bookingItems: Prisma.$BookingItemPayload<ExtArgs>[]
      business: Prisma.$BusinessPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: $Enums.InventoryType
      name: string
      description: string | null
      dimensions: string
      capacity: number
      price: number
      setupTime: number
      teardownTime: number
      images: string[]
      primaryImage: string | null
      status: $Enums.InventoryStatus
      minimumSpace: string
      weightLimit: number
      ageRange: string
      weatherRestrictions: string[]
      businessId: string
      createdAt: Date
      updatedAt: Date
      quantity: number
    }, ExtArgs["result"]["inventory"]>
    composites: {}
  }

  type InventoryGetPayload<S extends boolean | null | undefined | InventoryDefaultArgs> = $Result.GetResult<Prisma.$InventoryPayload, S>

  type InventoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InventoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InventoryCountAggregateInputType | true
    }

  export interface InventoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Inventory'], meta: { name: 'Inventory' } }
    /**
     * Find zero or one Inventory that matches the filter.
     * @param {InventoryFindUniqueArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryFindUniqueArgs>(args: SelectSubset<T, InventoryFindUniqueArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Inventory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InventoryFindUniqueOrThrowArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inventory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryFindFirstArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryFindFirstArgs>(args?: SelectSubset<T, InventoryFindFirstArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inventory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryFindFirstOrThrowArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Inventories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Inventories
     * const inventories = await prisma.inventory.findMany()
     * 
     * // Get first 10 Inventories
     * const inventories = await prisma.inventory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryWithIdOnly = await prisma.inventory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryFindManyArgs>(args?: SelectSubset<T, InventoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Inventory.
     * @param {InventoryCreateArgs} args - Arguments to create a Inventory.
     * @example
     * // Create one Inventory
     * const Inventory = await prisma.inventory.create({
     *   data: {
     *     // ... data to create a Inventory
     *   }
     * })
     * 
     */
    create<T extends InventoryCreateArgs>(args: SelectSubset<T, InventoryCreateArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Inventories.
     * @param {InventoryCreateManyArgs} args - Arguments to create many Inventories.
     * @example
     * // Create many Inventories
     * const inventory = await prisma.inventory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryCreateManyArgs>(args?: SelectSubset<T, InventoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Inventories and returns the data saved in the database.
     * @param {InventoryCreateManyAndReturnArgs} args - Arguments to create many Inventories.
     * @example
     * // Create many Inventories
     * const inventory = await prisma.inventory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Inventories and only return the `id`
     * const inventoryWithIdOnly = await prisma.inventory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InventoryCreateManyAndReturnArgs>(args?: SelectSubset<T, InventoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Inventory.
     * @param {InventoryDeleteArgs} args - Arguments to delete one Inventory.
     * @example
     * // Delete one Inventory
     * const Inventory = await prisma.inventory.delete({
     *   where: {
     *     // ... filter to delete one Inventory
     *   }
     * })
     * 
     */
    delete<T extends InventoryDeleteArgs>(args: SelectSubset<T, InventoryDeleteArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Inventory.
     * @param {InventoryUpdateArgs} args - Arguments to update one Inventory.
     * @example
     * // Update one Inventory
     * const inventory = await prisma.inventory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryUpdateArgs>(args: SelectSubset<T, InventoryUpdateArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Inventories.
     * @param {InventoryDeleteManyArgs} args - Arguments to filter Inventories to delete.
     * @example
     * // Delete a few Inventories
     * const { count } = await prisma.inventory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryDeleteManyArgs>(args?: SelectSubset<T, InventoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inventories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Inventories
     * const inventory = await prisma.inventory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryUpdateManyArgs>(args: SelectSubset<T, InventoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inventories and returns the data updated in the database.
     * @param {InventoryUpdateManyAndReturnArgs} args - Arguments to update many Inventories.
     * @example
     * // Update many Inventories
     * const inventory = await prisma.inventory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Inventories and only return the `id`
     * const inventoryWithIdOnly = await prisma.inventory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InventoryUpdateManyAndReturnArgs>(args: SelectSubset<T, InventoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Inventory.
     * @param {InventoryUpsertArgs} args - Arguments to update or create a Inventory.
     * @example
     * // Update or create a Inventory
     * const inventory = await prisma.inventory.upsert({
     *   create: {
     *     // ... data to create a Inventory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Inventory we want to update
     *   }
     * })
     */
    upsert<T extends InventoryUpsertArgs>(args: SelectSubset<T, InventoryUpsertArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Inventories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryCountArgs} args - Arguments to filter Inventories to count.
     * @example
     * // Count the number of Inventories
     * const count = await prisma.inventory.count({
     *   where: {
     *     // ... the filter for the Inventories we want to count
     *   }
     * })
    **/
    count<T extends InventoryCountArgs>(
      args?: Subset<T, InventoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Inventory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InventoryAggregateArgs>(args: Subset<T, InventoryAggregateArgs>): Prisma.PrismaPromise<GetInventoryAggregateType<T>>

    /**
     * Group by Inventory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InventoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryGroupByArgs['orderBy'] }
        : { orderBy?: InventoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InventoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Inventory model
   */
  readonly fields: InventoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Inventory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bookingItems<T extends Inventory$bookingItemsArgs<ExtArgs> = {}>(args?: Subset<T, Inventory$bookingItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Inventory model
   */
  interface InventoryFieldRefs {
    readonly id: FieldRef<"Inventory", 'String'>
    readonly type: FieldRef<"Inventory", 'InventoryType'>
    readonly name: FieldRef<"Inventory", 'String'>
    readonly description: FieldRef<"Inventory", 'String'>
    readonly dimensions: FieldRef<"Inventory", 'String'>
    readonly capacity: FieldRef<"Inventory", 'Int'>
    readonly price: FieldRef<"Inventory", 'Float'>
    readonly setupTime: FieldRef<"Inventory", 'Int'>
    readonly teardownTime: FieldRef<"Inventory", 'Int'>
    readonly images: FieldRef<"Inventory", 'String[]'>
    readonly primaryImage: FieldRef<"Inventory", 'String'>
    readonly status: FieldRef<"Inventory", 'InventoryStatus'>
    readonly minimumSpace: FieldRef<"Inventory", 'String'>
    readonly weightLimit: FieldRef<"Inventory", 'Int'>
    readonly ageRange: FieldRef<"Inventory", 'String'>
    readonly weatherRestrictions: FieldRef<"Inventory", 'String[]'>
    readonly businessId: FieldRef<"Inventory", 'String'>
    readonly createdAt: FieldRef<"Inventory", 'DateTime'>
    readonly updatedAt: FieldRef<"Inventory", 'DateTime'>
    readonly quantity: FieldRef<"Inventory", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Inventory findUnique
   */
  export type InventoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory findUniqueOrThrow
   */
  export type InventoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory findFirst
   */
  export type InventoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inventories.
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inventories.
     */
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * Inventory findFirstOrThrow
   */
  export type InventoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inventories.
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inventories.
     */
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * Inventory findMany
   */
  export type InventoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventories to fetch.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Inventories.
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * Inventory create
   */
  export type InventoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Inventory.
     */
    data: XOR<InventoryCreateInput, InventoryUncheckedCreateInput>
  }

  /**
   * Inventory createMany
   */
  export type InventoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Inventories.
     */
    data: InventoryCreateManyInput | InventoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Inventory createManyAndReturn
   */
  export type InventoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * The data used to create many Inventories.
     */
    data: InventoryCreateManyInput | InventoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Inventory update
   */
  export type InventoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Inventory.
     */
    data: XOR<InventoryUpdateInput, InventoryUncheckedUpdateInput>
    /**
     * Choose, which Inventory to update.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory updateMany
   */
  export type InventoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Inventories.
     */
    data: XOR<InventoryUpdateManyMutationInput, InventoryUncheckedUpdateManyInput>
    /**
     * Filter which Inventories to update
     */
    where?: InventoryWhereInput
    /**
     * Limit how many Inventories to update.
     */
    limit?: number
  }

  /**
   * Inventory updateManyAndReturn
   */
  export type InventoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * The data used to update Inventories.
     */
    data: XOR<InventoryUpdateManyMutationInput, InventoryUncheckedUpdateManyInput>
    /**
     * Filter which Inventories to update
     */
    where?: InventoryWhereInput
    /**
     * Limit how many Inventories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Inventory upsert
   */
  export type InventoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Inventory to update in case it exists.
     */
    where: InventoryWhereUniqueInput
    /**
     * In case the Inventory found by the `where` argument doesn't exist, create a new Inventory with this data.
     */
    create: XOR<InventoryCreateInput, InventoryUncheckedCreateInput>
    /**
     * In case the Inventory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryUpdateInput, InventoryUncheckedUpdateInput>
  }

  /**
   * Inventory delete
   */
  export type InventoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter which Inventory to delete.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory deleteMany
   */
  export type InventoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inventories to delete
     */
    where?: InventoryWhereInput
    /**
     * Limit how many Inventories to delete.
     */
    limit?: number
  }

  /**
   * Inventory.bookingItems
   */
  export type Inventory$bookingItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingItem
     */
    select?: BookingItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingItem
     */
    omit?: BookingItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingItemInclude<ExtArgs> | null
    where?: BookingItemWhereInput
    orderBy?: BookingItemOrderByWithRelationInput | BookingItemOrderByWithRelationInput[]
    cursor?: BookingItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingItemScalarFieldEnum | BookingItemScalarFieldEnum[]
  }

  /**
   * Inventory without action
   */
  export type InventoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
  }


  /**
   * Model Customer
   */

  export type AggregateCustomer = {
    _count: CustomerCountAggregateOutputType | null
    _avg: CustomerAvgAggregateOutputType | null
    _sum: CustomerSumAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  export type CustomerAvgAggregateOutputType = {
    bookingCount: number | null
    totalSpent: number | null
  }

  export type CustomerSumAggregateOutputType = {
    bookingCount: number | null
    totalSpent: number | null
  }

  export type CustomerMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    notes: string | null
    bookingCount: number | null
    totalSpent: number | null
    lastBooking: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    businessId: string | null
    isLead: boolean | null
    status: string | null
    type: string | null
  }

  export type CustomerMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    notes: string | null
    bookingCount: number | null
    totalSpent: number | null
    lastBooking: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    businessId: string | null
    isLead: boolean | null
    status: string | null
    type: string | null
  }

  export type CustomerCountAggregateOutputType = {
    id: number
    name: number
    email: number
    phone: number
    address: number
    city: number
    state: number
    zipCode: number
    notes: number
    bookingCount: number
    totalSpent: number
    lastBooking: number
    createdAt: number
    updatedAt: number
    businessId: number
    isLead: number
    status: number
    type: number
    _all: number
  }


  export type CustomerAvgAggregateInputType = {
    bookingCount?: true
    totalSpent?: true
  }

  export type CustomerSumAggregateInputType = {
    bookingCount?: true
    totalSpent?: true
  }

  export type CustomerMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    address?: true
    city?: true
    state?: true
    zipCode?: true
    notes?: true
    bookingCount?: true
    totalSpent?: true
    lastBooking?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
    isLead?: true
    status?: true
    type?: true
  }

  export type CustomerMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    address?: true
    city?: true
    state?: true
    zipCode?: true
    notes?: true
    bookingCount?: true
    totalSpent?: true
    lastBooking?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
    isLead?: true
    status?: true
    type?: true
  }

  export type CustomerCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    address?: true
    city?: true
    state?: true
    zipCode?: true
    notes?: true
    bookingCount?: true
    totalSpent?: true
    lastBooking?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
    isLead?: true
    status?: true
    type?: true
    _all?: true
  }

  export type CustomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customer to aggregate.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Customers
    **/
    _count?: true | CustomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerMaxAggregateInputType
  }

  export type GetCustomerAggregateType<T extends CustomerAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomer[P]>
      : GetScalarType<T[P], AggregateCustomer[P]>
  }




  export type CustomerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithAggregationInput | CustomerOrderByWithAggregationInput[]
    by: CustomerScalarFieldEnum[] | CustomerScalarFieldEnum
    having?: CustomerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerCountAggregateInputType | true
    _avg?: CustomerAvgAggregateInputType
    _sum?: CustomerSumAggregateInputType
    _min?: CustomerMinAggregateInputType
    _max?: CustomerMaxAggregateInputType
  }

  export type CustomerGroupByOutputType = {
    id: string
    name: string
    email: string
    phone: string
    address: string | null
    city: string | null
    state: string | null
    zipCode: string | null
    notes: string | null
    bookingCount: number
    totalSpent: number
    lastBooking: Date | null
    createdAt: Date
    updatedAt: Date
    businessId: string
    isLead: boolean
    status: string
    type: string
    _count: CustomerCountAggregateOutputType | null
    _avg: CustomerAvgAggregateOutputType | null
    _sum: CustomerSumAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  type GetCustomerGroupByPayload<T extends CustomerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerGroupByOutputType[P]>
        }
      >
    >


  export type CustomerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    notes?: boolean
    bookingCount?: boolean
    totalSpent?: boolean
    lastBooking?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    isLead?: boolean
    status?: boolean
    type?: boolean
    bookings?: boolean | Customer$bookingsArgs<ExtArgs>
    waivers?: boolean | Customer$waiversArgs<ExtArgs>
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    notes?: boolean
    bookingCount?: boolean
    totalSpent?: boolean
    lastBooking?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    isLead?: boolean
    status?: boolean
    type?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    notes?: boolean
    bookingCount?: boolean
    totalSpent?: boolean
    lastBooking?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    isLead?: boolean
    status?: boolean
    type?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zipCode?: boolean
    notes?: boolean
    bookingCount?: boolean
    totalSpent?: boolean
    lastBooking?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    isLead?: boolean
    status?: boolean
    type?: boolean
  }

  export type CustomerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "phone" | "address" | "city" | "state" | "zipCode" | "notes" | "bookingCount" | "totalSpent" | "lastBooking" | "createdAt" | "updatedAt" | "businessId" | "isLead" | "status" | "type", ExtArgs["result"]["customer"]>
  export type CustomerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookings?: boolean | Customer$bookingsArgs<ExtArgs>
    waivers?: boolean | Customer$waiversArgs<ExtArgs>
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CustomerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }
  export type CustomerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }

  export type $CustomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Customer"
    objects: {
      bookings: Prisma.$BookingPayload<ExtArgs>[]
      waivers: Prisma.$WaiverPayload<ExtArgs>[]
      business: Prisma.$BusinessPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      phone: string
      address: string | null
      city: string | null
      state: string | null
      zipCode: string | null
      notes: string | null
      bookingCount: number
      totalSpent: number
      lastBooking: Date | null
      createdAt: Date
      updatedAt: Date
      businessId: string
      isLead: boolean
      status: string
      type: string
    }, ExtArgs["result"]["customer"]>
    composites: {}
  }

  type CustomerGetPayload<S extends boolean | null | undefined | CustomerDefaultArgs> = $Result.GetResult<Prisma.$CustomerPayload, S>

  type CustomerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CustomerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomerCountAggregateInputType | true
    }

  export interface CustomerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Customer'], meta: { name: 'Customer' } }
    /**
     * Find zero or one Customer that matches the filter.
     * @param {CustomerFindUniqueArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerFindUniqueArgs>(args: SelectSubset<T, CustomerFindUniqueArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Customer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CustomerFindUniqueOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Customer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerFindFirstArgs>(args?: SelectSubset<T, CustomerFindFirstArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Customer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Customers
     * const customers = await prisma.customer.findMany()
     * 
     * // Get first 10 Customers
     * const customers = await prisma.customer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerWithIdOnly = await prisma.customer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerFindManyArgs>(args?: SelectSubset<T, CustomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Customer.
     * @param {CustomerCreateArgs} args - Arguments to create a Customer.
     * @example
     * // Create one Customer
     * const Customer = await prisma.customer.create({
     *   data: {
     *     // ... data to create a Customer
     *   }
     * })
     * 
     */
    create<T extends CustomerCreateArgs>(args: SelectSubset<T, CustomerCreateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Customers.
     * @param {CustomerCreateManyArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerCreateManyArgs>(args?: SelectSubset<T, CustomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Customers and returns the data saved in the database.
     * @param {CustomerCreateManyAndReturnArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Customers and only return the `id`
     * const customerWithIdOnly = await prisma.customer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomerCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Customer.
     * @param {CustomerDeleteArgs} args - Arguments to delete one Customer.
     * @example
     * // Delete one Customer
     * const Customer = await prisma.customer.delete({
     *   where: {
     *     // ... filter to delete one Customer
     *   }
     * })
     * 
     */
    delete<T extends CustomerDeleteArgs>(args: SelectSubset<T, CustomerDeleteArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Customer.
     * @param {CustomerUpdateArgs} args - Arguments to update one Customer.
     * @example
     * // Update one Customer
     * const customer = await prisma.customer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerUpdateArgs>(args: SelectSubset<T, CustomerUpdateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Customers.
     * @param {CustomerDeleteManyArgs} args - Arguments to filter Customers to delete.
     * @example
     * // Delete a few Customers
     * const { count } = await prisma.customer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerDeleteManyArgs>(args?: SelectSubset<T, CustomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerUpdateManyArgs>(args: SelectSubset<T, CustomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers and returns the data updated in the database.
     * @param {CustomerUpdateManyAndReturnArgs} args - Arguments to update many Customers.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Customers and only return the `id`
     * const customerWithIdOnly = await prisma.customer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CustomerUpdateManyAndReturnArgs>(args: SelectSubset<T, CustomerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Customer.
     * @param {CustomerUpsertArgs} args - Arguments to update or create a Customer.
     * @example
     * // Update or create a Customer
     * const customer = await prisma.customer.upsert({
     *   create: {
     *     // ... data to create a Customer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Customer we want to update
     *   }
     * })
     */
    upsert<T extends CustomerUpsertArgs>(args: SelectSubset<T, CustomerUpsertArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerCountArgs} args - Arguments to filter Customers to count.
     * @example
     * // Count the number of Customers
     * const count = await prisma.customer.count({
     *   where: {
     *     // ... the filter for the Customers we want to count
     *   }
     * })
    **/
    count<T extends CustomerCountArgs>(
      args?: Subset<T, CustomerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomerAggregateArgs>(args: Subset<T, CustomerAggregateArgs>): Prisma.PrismaPromise<GetCustomerAggregateType<T>>

    /**
     * Group by Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerGroupByArgs['orderBy'] }
        : { orderBy?: CustomerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Customer model
   */
  readonly fields: CustomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Customer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bookings<T extends Customer$bookingsArgs<ExtArgs> = {}>(args?: Subset<T, Customer$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    waivers<T extends Customer$waiversArgs<ExtArgs> = {}>(args?: Subset<T, Customer$waiversArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WaiverPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Customer model
   */
  interface CustomerFieldRefs {
    readonly id: FieldRef<"Customer", 'String'>
    readonly name: FieldRef<"Customer", 'String'>
    readonly email: FieldRef<"Customer", 'String'>
    readonly phone: FieldRef<"Customer", 'String'>
    readonly address: FieldRef<"Customer", 'String'>
    readonly city: FieldRef<"Customer", 'String'>
    readonly state: FieldRef<"Customer", 'String'>
    readonly zipCode: FieldRef<"Customer", 'String'>
    readonly notes: FieldRef<"Customer", 'String'>
    readonly bookingCount: FieldRef<"Customer", 'Int'>
    readonly totalSpent: FieldRef<"Customer", 'Float'>
    readonly lastBooking: FieldRef<"Customer", 'DateTime'>
    readonly createdAt: FieldRef<"Customer", 'DateTime'>
    readonly updatedAt: FieldRef<"Customer", 'DateTime'>
    readonly businessId: FieldRef<"Customer", 'String'>
    readonly isLead: FieldRef<"Customer", 'Boolean'>
    readonly status: FieldRef<"Customer", 'String'>
    readonly type: FieldRef<"Customer", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Customer findUnique
   */
  export type CustomerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findUniqueOrThrow
   */
  export type CustomerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findFirst
   */
  export type CustomerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findFirstOrThrow
   */
  export type CustomerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findMany
   */
  export type CustomerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customers to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer create
   */
  export type CustomerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to create a Customer.
     */
    data: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
  }

  /**
   * Customer createMany
   */
  export type CustomerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Customer createManyAndReturn
   */
  export type CustomerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Customer update
   */
  export type CustomerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to update a Customer.
     */
    data: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
    /**
     * Choose, which Customer to update.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer updateMany
   */
  export type CustomerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Customers.
     */
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyInput>
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput
    /**
     * Limit how many Customers to update.
     */
    limit?: number
  }

  /**
   * Customer updateManyAndReturn
   */
  export type CustomerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * The data used to update Customers.
     */
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyInput>
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput
    /**
     * Limit how many Customers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Customer upsert
   */
  export type CustomerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The filter to search for the Customer to update in case it exists.
     */
    where: CustomerWhereUniqueInput
    /**
     * In case the Customer found by the `where` argument doesn't exist, create a new Customer with this data.
     */
    create: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
    /**
     * In case the Customer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
  }

  /**
   * Customer delete
   */
  export type CustomerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter which Customer to delete.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer deleteMany
   */
  export type CustomerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customers to delete
     */
    where?: CustomerWhereInput
    /**
     * Limit how many Customers to delete.
     */
    limit?: number
  }

  /**
   * Customer.bookings
   */
  export type Customer$bookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    cursor?: BookingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Customer.waivers
   */
  export type Customer$waiversArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Waiver
     */
    select?: WaiverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Waiver
     */
    omit?: WaiverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaiverInclude<ExtArgs> | null
    where?: WaiverWhereInput
    orderBy?: WaiverOrderByWithRelationInput | WaiverOrderByWithRelationInput[]
    cursor?: WaiverWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WaiverScalarFieldEnum | WaiverScalarFieldEnum[]
  }

  /**
   * Customer without action
   */
  export type CustomerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
  }


  /**
   * Model Booking
   */

  export type AggregateBooking = {
    _count: BookingCountAggregateOutputType | null
    _avg: BookingAvgAggregateOutputType | null
    _sum: BookingSumAggregateOutputType | null
    _min: BookingMinAggregateOutputType | null
    _max: BookingMaxAggregateOutputType | null
  }

  export type BookingAvgAggregateOutputType = {
    totalAmount: number | null
    depositAmount: number | null
    participantAge: number | null
    participantCount: number | null
    subtotalAmount: number | null
    taxAmount: number | null
    taxRate: number | null
  }

  export type BookingSumAggregateOutputType = {
    totalAmount: number | null
    depositAmount: number | null
    participantAge: number | null
    participantCount: number | null
    subtotalAmount: number | null
    taxAmount: number | null
    taxRate: number | null
  }

  export type BookingMinAggregateOutputType = {
    id: string | null
    eventDate: Date | null
    startTime: Date | null
    endTime: Date | null
    status: $Enums.BookingStatus | null
    totalAmount: number | null
    depositAmount: number | null
    depositPaid: boolean | null
    eventType: string | null
    eventAddress: string | null
    eventCity: string | null
    eventState: string | null
    eventZipCode: string | null
    participantAge: number | null
    participantCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
    businessId: string | null
    customerId: string | null
    isCompleted: boolean | null
    isCancelled: boolean | null
    specialInstructions: string | null
    subtotalAmount: number | null
    taxAmount: number | null
    taxRate: number | null
  }

  export type BookingMaxAggregateOutputType = {
    id: string | null
    eventDate: Date | null
    startTime: Date | null
    endTime: Date | null
    status: $Enums.BookingStatus | null
    totalAmount: number | null
    depositAmount: number | null
    depositPaid: boolean | null
    eventType: string | null
    eventAddress: string | null
    eventCity: string | null
    eventState: string | null
    eventZipCode: string | null
    participantAge: number | null
    participantCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
    businessId: string | null
    customerId: string | null
    isCompleted: boolean | null
    isCancelled: boolean | null
    specialInstructions: string | null
    subtotalAmount: number | null
    taxAmount: number | null
    taxRate: number | null
  }

  export type BookingCountAggregateOutputType = {
    id: number
    eventDate: number
    startTime: number
    endTime: number
    status: number
    totalAmount: number
    depositAmount: number
    depositPaid: number
    eventType: number
    eventAddress: number
    eventCity: number
    eventState: number
    eventZipCode: number
    participantAge: number
    participantCount: number
    createdAt: number
    updatedAt: number
    businessId: number
    customerId: number
    isCompleted: number
    isCancelled: number
    specialInstructions: number
    subtotalAmount: number
    taxAmount: number
    taxRate: number
    _all: number
  }


  export type BookingAvgAggregateInputType = {
    totalAmount?: true
    depositAmount?: true
    participantAge?: true
    participantCount?: true
    subtotalAmount?: true
    taxAmount?: true
    taxRate?: true
  }

  export type BookingSumAggregateInputType = {
    totalAmount?: true
    depositAmount?: true
    participantAge?: true
    participantCount?: true
    subtotalAmount?: true
    taxAmount?: true
    taxRate?: true
  }

  export type BookingMinAggregateInputType = {
    id?: true
    eventDate?: true
    startTime?: true
    endTime?: true
    status?: true
    totalAmount?: true
    depositAmount?: true
    depositPaid?: true
    eventType?: true
    eventAddress?: true
    eventCity?: true
    eventState?: true
    eventZipCode?: true
    participantAge?: true
    participantCount?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
    customerId?: true
    isCompleted?: true
    isCancelled?: true
    specialInstructions?: true
    subtotalAmount?: true
    taxAmount?: true
    taxRate?: true
  }

  export type BookingMaxAggregateInputType = {
    id?: true
    eventDate?: true
    startTime?: true
    endTime?: true
    status?: true
    totalAmount?: true
    depositAmount?: true
    depositPaid?: true
    eventType?: true
    eventAddress?: true
    eventCity?: true
    eventState?: true
    eventZipCode?: true
    participantAge?: true
    participantCount?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
    customerId?: true
    isCompleted?: true
    isCancelled?: true
    specialInstructions?: true
    subtotalAmount?: true
    taxAmount?: true
    taxRate?: true
  }

  export type BookingCountAggregateInputType = {
    id?: true
    eventDate?: true
    startTime?: true
    endTime?: true
    status?: true
    totalAmount?: true
    depositAmount?: true
    depositPaid?: true
    eventType?: true
    eventAddress?: true
    eventCity?: true
    eventState?: true
    eventZipCode?: true
    participantAge?: true
    participantCount?: true
    createdAt?: true
    updatedAt?: true
    businessId?: true
    customerId?: true
    isCompleted?: true
    isCancelled?: true
    specialInstructions?: true
    subtotalAmount?: true
    taxAmount?: true
    taxRate?: true
    _all?: true
  }

  export type BookingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Booking to aggregate.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bookings
    **/
    _count?: true | BookingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookingMaxAggregateInputType
  }

  export type GetBookingAggregateType<T extends BookingAggregateArgs> = {
        [P in keyof T & keyof AggregateBooking]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBooking[P]>
      : GetScalarType<T[P], AggregateBooking[P]>
  }




  export type BookingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithAggregationInput | BookingOrderByWithAggregationInput[]
    by: BookingScalarFieldEnum[] | BookingScalarFieldEnum
    having?: BookingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookingCountAggregateInputType | true
    _avg?: BookingAvgAggregateInputType
    _sum?: BookingSumAggregateInputType
    _min?: BookingMinAggregateInputType
    _max?: BookingMaxAggregateInputType
  }

  export type BookingGroupByOutputType = {
    id: string
    eventDate: Date
    startTime: Date
    endTime: Date
    status: $Enums.BookingStatus
    totalAmount: number
    depositAmount: number | null
    depositPaid: boolean
    eventType: string | null
    eventAddress: string
    eventCity: string
    eventState: string
    eventZipCode: string
    participantAge: number | null
    participantCount: number
    createdAt: Date
    updatedAt: Date
    businessId: string
    customerId: string
    isCompleted: boolean
    isCancelled: boolean
    specialInstructions: string | null
    subtotalAmount: number
    taxAmount: number
    taxRate: number
    _count: BookingCountAggregateOutputType | null
    _avg: BookingAvgAggregateOutputType | null
    _sum: BookingSumAggregateOutputType | null
    _min: BookingMinAggregateOutputType | null
    _max: BookingMaxAggregateOutputType | null
  }

  type GetBookingGroupByPayload<T extends BookingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookingGroupByOutputType[P]>
            : GetScalarType<T[P], BookingGroupByOutputType[P]>
        }
      >
    >


  export type BookingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventDate?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    totalAmount?: boolean
    depositAmount?: boolean
    depositPaid?: boolean
    eventType?: boolean
    eventAddress?: boolean
    eventCity?: boolean
    eventState?: boolean
    eventZipCode?: boolean
    participantAge?: boolean
    participantCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    customerId?: boolean
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: boolean
    subtotalAmount?: boolean
    taxAmount?: boolean
    taxRate?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    inventoryItems?: boolean | Booking$inventoryItemsArgs<ExtArgs>
    payments?: boolean | Booking$paymentsArgs<ExtArgs>
    waivers?: boolean | Booking$waiversArgs<ExtArgs>
    _count?: boolean | BookingCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventDate?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    totalAmount?: boolean
    depositAmount?: boolean
    depositPaid?: boolean
    eventType?: boolean
    eventAddress?: boolean
    eventCity?: boolean
    eventState?: boolean
    eventZipCode?: boolean
    participantAge?: boolean
    participantCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    customerId?: boolean
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: boolean
    subtotalAmount?: boolean
    taxAmount?: boolean
    taxRate?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eventDate?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    totalAmount?: boolean
    depositAmount?: boolean
    depositPaid?: boolean
    eventType?: boolean
    eventAddress?: boolean
    eventCity?: boolean
    eventState?: boolean
    eventZipCode?: boolean
    participantAge?: boolean
    participantCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    customerId?: boolean
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: boolean
    subtotalAmount?: boolean
    taxAmount?: boolean
    taxRate?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectScalar = {
    id?: boolean
    eventDate?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    totalAmount?: boolean
    depositAmount?: boolean
    depositPaid?: boolean
    eventType?: boolean
    eventAddress?: boolean
    eventCity?: boolean
    eventState?: boolean
    eventZipCode?: boolean
    participantAge?: boolean
    participantCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    businessId?: boolean
    customerId?: boolean
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: boolean
    subtotalAmount?: boolean
    taxAmount?: boolean
    taxRate?: boolean
  }

  export type BookingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "eventDate" | "startTime" | "endTime" | "status" | "totalAmount" | "depositAmount" | "depositPaid" | "eventType" | "eventAddress" | "eventCity" | "eventState" | "eventZipCode" | "participantAge" | "participantCount" | "createdAt" | "updatedAt" | "businessId" | "customerId" | "isCompleted" | "isCancelled" | "specialInstructions" | "subtotalAmount" | "taxAmount" | "taxRate", ExtArgs["result"]["booking"]>
  export type BookingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    inventoryItems?: boolean | Booking$inventoryItemsArgs<ExtArgs>
    payments?: boolean | Booking$paymentsArgs<ExtArgs>
    waivers?: boolean | Booking$waiversArgs<ExtArgs>
    _count?: boolean | BookingCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BookingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
  }
  export type BookingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
  }

  export type $BookingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Booking"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
      customer: Prisma.$CustomerPayload<ExtArgs>
      inventoryItems: Prisma.$BookingItemPayload<ExtArgs>[]
      payments: Prisma.$PaymentPayload<ExtArgs>[]
      waivers: Prisma.$WaiverPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      eventDate: Date
      startTime: Date
      endTime: Date
      status: $Enums.BookingStatus
      totalAmount: number
      depositAmount: number | null
      depositPaid: boolean
      eventType: string | null
      eventAddress: string
      eventCity: string
      eventState: string
      eventZipCode: string
      participantAge: number | null
      participantCount: number
      createdAt: Date
      updatedAt: Date
      businessId: string
      customerId: string
      isCompleted: boolean
      isCancelled: boolean
      specialInstructions: string | null
      subtotalAmount: number
      taxAmount: number
      taxRate: number
    }, ExtArgs["result"]["booking"]>
    composites: {}
  }

  type BookingGetPayload<S extends boolean | null | undefined | BookingDefaultArgs> = $Result.GetResult<Prisma.$BookingPayload, S>

  type BookingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BookingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookingCountAggregateInputType | true
    }

  export interface BookingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Booking'], meta: { name: 'Booking' } }
    /**
     * Find zero or one Booking that matches the filter.
     * @param {BookingFindUniqueArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookingFindUniqueArgs>(args: SelectSubset<T, BookingFindUniqueArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Booking that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookingFindUniqueOrThrowArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookingFindUniqueOrThrowArgs>(args: SelectSubset<T, BookingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Booking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindFirstArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookingFindFirstArgs>(args?: SelectSubset<T, BookingFindFirstArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Booking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindFirstOrThrowArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookingFindFirstOrThrowArgs>(args?: SelectSubset<T, BookingFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bookings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bookings
     * const bookings = await prisma.booking.findMany()
     * 
     * // Get first 10 Bookings
     * const bookings = await prisma.booking.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookingWithIdOnly = await prisma.booking.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookingFindManyArgs>(args?: SelectSubset<T, BookingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Booking.
     * @param {BookingCreateArgs} args - Arguments to create a Booking.
     * @example
     * // Create one Booking
     * const Booking = await prisma.booking.create({
     *   data: {
     *     // ... data to create a Booking
     *   }
     * })
     * 
     */
    create<T extends BookingCreateArgs>(args: SelectSubset<T, BookingCreateArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bookings.
     * @param {BookingCreateManyArgs} args - Arguments to create many Bookings.
     * @example
     * // Create many Bookings
     * const booking = await prisma.booking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookingCreateManyArgs>(args?: SelectSubset<T, BookingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bookings and returns the data saved in the database.
     * @param {BookingCreateManyAndReturnArgs} args - Arguments to create many Bookings.
     * @example
     * // Create many Bookings
     * const booking = await prisma.booking.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bookings and only return the `id`
     * const bookingWithIdOnly = await prisma.booking.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookingCreateManyAndReturnArgs>(args?: SelectSubset<T, BookingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Booking.
     * @param {BookingDeleteArgs} args - Arguments to delete one Booking.
     * @example
     * // Delete one Booking
     * const Booking = await prisma.booking.delete({
     *   where: {
     *     // ... filter to delete one Booking
     *   }
     * })
     * 
     */
    delete<T extends BookingDeleteArgs>(args: SelectSubset<T, BookingDeleteArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Booking.
     * @param {BookingUpdateArgs} args - Arguments to update one Booking.
     * @example
     * // Update one Booking
     * const booking = await prisma.booking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookingUpdateArgs>(args: SelectSubset<T, BookingUpdateArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bookings.
     * @param {BookingDeleteManyArgs} args - Arguments to filter Bookings to delete.
     * @example
     * // Delete a few Bookings
     * const { count } = await prisma.booking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookingDeleteManyArgs>(args?: SelectSubset<T, BookingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bookings
     * const booking = await prisma.booking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookingUpdateManyArgs>(args: SelectSubset<T, BookingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookings and returns the data updated in the database.
     * @param {BookingUpdateManyAndReturnArgs} args - Arguments to update many Bookings.
     * @example
     * // Update many Bookings
     * const booking = await prisma.booking.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Bookings and only return the `id`
     * const bookingWithIdOnly = await prisma.booking.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BookingUpdateManyAndReturnArgs>(args: SelectSubset<T, BookingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Booking.
     * @param {BookingUpsertArgs} args - Arguments to update or create a Booking.
     * @example
     * // Update or create a Booking
     * const booking = await prisma.booking.upsert({
     *   create: {
     *     // ... data to create a Booking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Booking we want to update
     *   }
     * })
     */
    upsert<T extends BookingUpsertArgs>(args: SelectSubset<T, BookingUpsertArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingCountArgs} args - Arguments to filter Bookings to count.
     * @example
     * // Count the number of Bookings
     * const count = await prisma.booking.count({
     *   where: {
     *     // ... the filter for the Bookings we want to count
     *   }
     * })
    **/
    count<T extends BookingCountArgs>(
      args?: Subset<T, BookingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Booking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookingAggregateArgs>(args: Subset<T, BookingAggregateArgs>): Prisma.PrismaPromise<GetBookingAggregateType<T>>

    /**
     * Group by Booking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookingGroupByArgs['orderBy'] }
        : { orderBy?: BookingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Booking model
   */
  readonly fields: BookingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Booking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    customer<T extends CustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerDefaultArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    inventoryItems<T extends Booking$inventoryItemsArgs<ExtArgs> = {}>(args?: Subset<T, Booking$inventoryItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    payments<T extends Booking$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, Booking$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    waivers<T extends Booking$waiversArgs<ExtArgs> = {}>(args?: Subset<T, Booking$waiversArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WaiverPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Booking model
   */
  interface BookingFieldRefs {
    readonly id: FieldRef<"Booking", 'String'>
    readonly eventDate: FieldRef<"Booking", 'DateTime'>
    readonly startTime: FieldRef<"Booking", 'DateTime'>
    readonly endTime: FieldRef<"Booking", 'DateTime'>
    readonly status: FieldRef<"Booking", 'BookingStatus'>
    readonly totalAmount: FieldRef<"Booking", 'Float'>
    readonly depositAmount: FieldRef<"Booking", 'Float'>
    readonly depositPaid: FieldRef<"Booking", 'Boolean'>
    readonly eventType: FieldRef<"Booking", 'String'>
    readonly eventAddress: FieldRef<"Booking", 'String'>
    readonly eventCity: FieldRef<"Booking", 'String'>
    readonly eventState: FieldRef<"Booking", 'String'>
    readonly eventZipCode: FieldRef<"Booking", 'String'>
    readonly participantAge: FieldRef<"Booking", 'Int'>
    readonly participantCount: FieldRef<"Booking", 'Int'>
    readonly createdAt: FieldRef<"Booking", 'DateTime'>
    readonly updatedAt: FieldRef<"Booking", 'DateTime'>
    readonly businessId: FieldRef<"Booking", 'String'>
    readonly customerId: FieldRef<"Booking", 'String'>
    readonly isCompleted: FieldRef<"Booking", 'Boolean'>
    readonly isCancelled: FieldRef<"Booking", 'Boolean'>
    readonly specialInstructions: FieldRef<"Booking", 'String'>
    readonly subtotalAmount: FieldRef<"Booking", 'Float'>
    readonly taxAmount: FieldRef<"Booking", 'Float'>
    readonly taxRate: FieldRef<"Booking", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * Booking findUnique
   */
  export type BookingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking findUniqueOrThrow
   */
  export type BookingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking findFirst
   */
  export type BookingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking findFirstOrThrow
   */
  export type BookingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking findMany
   */
  export type BookingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Bookings to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking create
   */
  export type BookingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The data needed to create a Booking.
     */
    data: XOR<BookingCreateInput, BookingUncheckedCreateInput>
  }

  /**
   * Booking createMany
   */
  export type BookingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bookings.
     */
    data: BookingCreateManyInput | BookingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Booking createManyAndReturn
   */
  export type BookingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * The data used to create many Bookings.
     */
    data: BookingCreateManyInput | BookingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Booking update
   */
  export type BookingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The data needed to update a Booking.
     */
    data: XOR<BookingUpdateInput, BookingUncheckedUpdateInput>
    /**
     * Choose, which Booking to update.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking updateMany
   */
  export type BookingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bookings.
     */
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyInput>
    /**
     * Filter which Bookings to update
     */
    where?: BookingWhereInput
    /**
     * Limit how many Bookings to update.
     */
    limit?: number
  }

  /**
   * Booking updateManyAndReturn
   */
  export type BookingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * The data used to update Bookings.
     */
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyInput>
    /**
     * Filter which Bookings to update
     */
    where?: BookingWhereInput
    /**
     * Limit how many Bookings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Booking upsert
   */
  export type BookingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The filter to search for the Booking to update in case it exists.
     */
    where: BookingWhereUniqueInput
    /**
     * In case the Booking found by the `where` argument doesn't exist, create a new Booking with this data.
     */
    create: XOR<BookingCreateInput, BookingUncheckedCreateInput>
    /**
     * In case the Booking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookingUpdateInput, BookingUncheckedUpdateInput>
  }

  /**
   * Booking delete
   */
  export type BookingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter which Booking to delete.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking deleteMany
   */
  export type BookingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bookings to delete
     */
    where?: BookingWhereInput
    /**
     * Limit how many Bookings to delete.
     */
    limit?: number
  }

  /**
   * Booking.inventoryItems
   */
  export type Booking$inventoryItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingItem
     */
    select?: BookingItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingItem
     */
    omit?: BookingItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingItemInclude<ExtArgs> | null
    where?: BookingItemWhereInput
    orderBy?: BookingItemOrderByWithRelationInput | BookingItemOrderByWithRelationInput[]
    cursor?: BookingItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingItemScalarFieldEnum | BookingItemScalarFieldEnum[]
  }

  /**
   * Booking.payments
   */
  export type Booking$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Booking.waivers
   */
  export type Booking$waiversArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Waiver
     */
    select?: WaiverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Waiver
     */
    omit?: WaiverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaiverInclude<ExtArgs> | null
    where?: WaiverWhereInput
    orderBy?: WaiverOrderByWithRelationInput | WaiverOrderByWithRelationInput[]
    cursor?: WaiverWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WaiverScalarFieldEnum | WaiverScalarFieldEnum[]
  }

  /**
   * Booking without action
   */
  export type BookingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
  }


  /**
   * Model BookingItem
   */

  export type AggregateBookingItem = {
    _count: BookingItemCountAggregateOutputType | null
    _avg: BookingItemAvgAggregateOutputType | null
    _sum: BookingItemSumAggregateOutputType | null
    _min: BookingItemMinAggregateOutputType | null
    _max: BookingItemMaxAggregateOutputType | null
  }

  export type BookingItemAvgAggregateOutputType = {
    quantity: number | null
    price: number | null
  }

  export type BookingItemSumAggregateOutputType = {
    quantity: number | null
    price: number | null
  }

  export type BookingItemMinAggregateOutputType = {
    id: string | null
    bookingId: string | null
    inventoryId: string | null
    quantity: number | null
    price: number | null
  }

  export type BookingItemMaxAggregateOutputType = {
    id: string | null
    bookingId: string | null
    inventoryId: string | null
    quantity: number | null
    price: number | null
  }

  export type BookingItemCountAggregateOutputType = {
    id: number
    bookingId: number
    inventoryId: number
    quantity: number
    price: number
    _all: number
  }


  export type BookingItemAvgAggregateInputType = {
    quantity?: true
    price?: true
  }

  export type BookingItemSumAggregateInputType = {
    quantity?: true
    price?: true
  }

  export type BookingItemMinAggregateInputType = {
    id?: true
    bookingId?: true
    inventoryId?: true
    quantity?: true
    price?: true
  }

  export type BookingItemMaxAggregateInputType = {
    id?: true
    bookingId?: true
    inventoryId?: true
    quantity?: true
    price?: true
  }

  export type BookingItemCountAggregateInputType = {
    id?: true
    bookingId?: true
    inventoryId?: true
    quantity?: true
    price?: true
    _all?: true
  }

  export type BookingItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookingItem to aggregate.
     */
    where?: BookingItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingItems to fetch.
     */
    orderBy?: BookingItemOrderByWithRelationInput | BookingItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookingItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BookingItems
    **/
    _count?: true | BookingItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BookingItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BookingItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookingItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookingItemMaxAggregateInputType
  }

  export type GetBookingItemAggregateType<T extends BookingItemAggregateArgs> = {
        [P in keyof T & keyof AggregateBookingItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBookingItem[P]>
      : GetScalarType<T[P], AggregateBookingItem[P]>
  }




  export type BookingItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingItemWhereInput
    orderBy?: BookingItemOrderByWithAggregationInput | BookingItemOrderByWithAggregationInput[]
    by: BookingItemScalarFieldEnum[] | BookingItemScalarFieldEnum
    having?: BookingItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookingItemCountAggregateInputType | true
    _avg?: BookingItemAvgAggregateInputType
    _sum?: BookingItemSumAggregateInputType
    _min?: BookingItemMinAggregateInputType
    _max?: BookingItemMaxAggregateInputType
  }

  export type BookingItemGroupByOutputType = {
    id: string
    bookingId: string
    inventoryId: string
    quantity: number
    price: number
    _count: BookingItemCountAggregateOutputType | null
    _avg: BookingItemAvgAggregateOutputType | null
    _sum: BookingItemSumAggregateOutputType | null
    _min: BookingItemMinAggregateOutputType | null
    _max: BookingItemMaxAggregateOutputType | null
  }

  type GetBookingItemGroupByPayload<T extends BookingItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookingItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookingItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookingItemGroupByOutputType[P]>
            : GetScalarType<T[P], BookingItemGroupByOutputType[P]>
        }
      >
    >


  export type BookingItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookingId?: boolean
    inventoryId?: boolean
    quantity?: boolean
    price?: boolean
    booking?: boolean | BookingDefaultArgs<ExtArgs>
    inventory?: boolean | InventoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookingItem"]>

  export type BookingItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookingId?: boolean
    inventoryId?: boolean
    quantity?: boolean
    price?: boolean
    booking?: boolean | BookingDefaultArgs<ExtArgs>
    inventory?: boolean | InventoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookingItem"]>

  export type BookingItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bookingId?: boolean
    inventoryId?: boolean
    quantity?: boolean
    price?: boolean
    booking?: boolean | BookingDefaultArgs<ExtArgs>
    inventory?: boolean | InventoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bookingItem"]>

  export type BookingItemSelectScalar = {
    id?: boolean
    bookingId?: boolean
    inventoryId?: boolean
    quantity?: boolean
    price?: boolean
  }

  export type BookingItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "bookingId" | "inventoryId" | "quantity" | "price", ExtArgs["result"]["bookingItem"]>
  export type BookingItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | BookingDefaultArgs<ExtArgs>
    inventory?: boolean | InventoryDefaultArgs<ExtArgs>
  }
  export type BookingItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | BookingDefaultArgs<ExtArgs>
    inventory?: boolean | InventoryDefaultArgs<ExtArgs>
  }
  export type BookingItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | BookingDefaultArgs<ExtArgs>
    inventory?: boolean | InventoryDefaultArgs<ExtArgs>
  }

  export type $BookingItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BookingItem"
    objects: {
      booking: Prisma.$BookingPayload<ExtArgs>
      inventory: Prisma.$InventoryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bookingId: string
      inventoryId: string
      quantity: number
      price: number
    }, ExtArgs["result"]["bookingItem"]>
    composites: {}
  }

  type BookingItemGetPayload<S extends boolean | null | undefined | BookingItemDefaultArgs> = $Result.GetResult<Prisma.$BookingItemPayload, S>

  type BookingItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BookingItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookingItemCountAggregateInputType | true
    }

  export interface BookingItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BookingItem'], meta: { name: 'BookingItem' } }
    /**
     * Find zero or one BookingItem that matches the filter.
     * @param {BookingItemFindUniqueArgs} args - Arguments to find a BookingItem
     * @example
     * // Get one BookingItem
     * const bookingItem = await prisma.bookingItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookingItemFindUniqueArgs>(args: SelectSubset<T, BookingItemFindUniqueArgs<ExtArgs>>): Prisma__BookingItemClient<$Result.GetResult<Prisma.$BookingItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BookingItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookingItemFindUniqueOrThrowArgs} args - Arguments to find a BookingItem
     * @example
     * // Get one BookingItem
     * const bookingItem = await prisma.bookingItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookingItemFindUniqueOrThrowArgs>(args: SelectSubset<T, BookingItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookingItemClient<$Result.GetResult<Prisma.$BookingItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BookingItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingItemFindFirstArgs} args - Arguments to find a BookingItem
     * @example
     * // Get one BookingItem
     * const bookingItem = await prisma.bookingItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookingItemFindFirstArgs>(args?: SelectSubset<T, BookingItemFindFirstArgs<ExtArgs>>): Prisma__BookingItemClient<$Result.GetResult<Prisma.$BookingItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BookingItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingItemFindFirstOrThrowArgs} args - Arguments to find a BookingItem
     * @example
     * // Get one BookingItem
     * const bookingItem = await prisma.bookingItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookingItemFindFirstOrThrowArgs>(args?: SelectSubset<T, BookingItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookingItemClient<$Result.GetResult<Prisma.$BookingItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BookingItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BookingItems
     * const bookingItems = await prisma.bookingItem.findMany()
     * 
     * // Get first 10 BookingItems
     * const bookingItems = await prisma.bookingItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookingItemWithIdOnly = await prisma.bookingItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookingItemFindManyArgs>(args?: SelectSubset<T, BookingItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BookingItem.
     * @param {BookingItemCreateArgs} args - Arguments to create a BookingItem.
     * @example
     * // Create one BookingItem
     * const BookingItem = await prisma.bookingItem.create({
     *   data: {
     *     // ... data to create a BookingItem
     *   }
     * })
     * 
     */
    create<T extends BookingItemCreateArgs>(args: SelectSubset<T, BookingItemCreateArgs<ExtArgs>>): Prisma__BookingItemClient<$Result.GetResult<Prisma.$BookingItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BookingItems.
     * @param {BookingItemCreateManyArgs} args - Arguments to create many BookingItems.
     * @example
     * // Create many BookingItems
     * const bookingItem = await prisma.bookingItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookingItemCreateManyArgs>(args?: SelectSubset<T, BookingItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BookingItems and returns the data saved in the database.
     * @param {BookingItemCreateManyAndReturnArgs} args - Arguments to create many BookingItems.
     * @example
     * // Create many BookingItems
     * const bookingItem = await prisma.bookingItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BookingItems and only return the `id`
     * const bookingItemWithIdOnly = await prisma.bookingItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookingItemCreateManyAndReturnArgs>(args?: SelectSubset<T, BookingItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BookingItem.
     * @param {BookingItemDeleteArgs} args - Arguments to delete one BookingItem.
     * @example
     * // Delete one BookingItem
     * const BookingItem = await prisma.bookingItem.delete({
     *   where: {
     *     // ... filter to delete one BookingItem
     *   }
     * })
     * 
     */
    delete<T extends BookingItemDeleteArgs>(args: SelectSubset<T, BookingItemDeleteArgs<ExtArgs>>): Prisma__BookingItemClient<$Result.GetResult<Prisma.$BookingItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BookingItem.
     * @param {BookingItemUpdateArgs} args - Arguments to update one BookingItem.
     * @example
     * // Update one BookingItem
     * const bookingItem = await prisma.bookingItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookingItemUpdateArgs>(args: SelectSubset<T, BookingItemUpdateArgs<ExtArgs>>): Prisma__BookingItemClient<$Result.GetResult<Prisma.$BookingItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BookingItems.
     * @param {BookingItemDeleteManyArgs} args - Arguments to filter BookingItems to delete.
     * @example
     * // Delete a few BookingItems
     * const { count } = await prisma.bookingItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookingItemDeleteManyArgs>(args?: SelectSubset<T, BookingItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookingItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BookingItems
     * const bookingItem = await prisma.bookingItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookingItemUpdateManyArgs>(args: SelectSubset<T, BookingItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BookingItems and returns the data updated in the database.
     * @param {BookingItemUpdateManyAndReturnArgs} args - Arguments to update many BookingItems.
     * @example
     * // Update many BookingItems
     * const bookingItem = await prisma.bookingItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BookingItems and only return the `id`
     * const bookingItemWithIdOnly = await prisma.bookingItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BookingItemUpdateManyAndReturnArgs>(args: SelectSubset<T, BookingItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BookingItem.
     * @param {BookingItemUpsertArgs} args - Arguments to update or create a BookingItem.
     * @example
     * // Update or create a BookingItem
     * const bookingItem = await prisma.bookingItem.upsert({
     *   create: {
     *     // ... data to create a BookingItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BookingItem we want to update
     *   }
     * })
     */
    upsert<T extends BookingItemUpsertArgs>(args: SelectSubset<T, BookingItemUpsertArgs<ExtArgs>>): Prisma__BookingItemClient<$Result.GetResult<Prisma.$BookingItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BookingItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingItemCountArgs} args - Arguments to filter BookingItems to count.
     * @example
     * // Count the number of BookingItems
     * const count = await prisma.bookingItem.count({
     *   where: {
     *     // ... the filter for the BookingItems we want to count
     *   }
     * })
    **/
    count<T extends BookingItemCountArgs>(
      args?: Subset<T, BookingItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookingItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BookingItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookingItemAggregateArgs>(args: Subset<T, BookingItemAggregateArgs>): Prisma.PrismaPromise<GetBookingItemAggregateType<T>>

    /**
     * Group by BookingItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookingItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookingItemGroupByArgs['orderBy'] }
        : { orderBy?: BookingItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookingItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookingItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BookingItem model
   */
  readonly fields: BookingItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BookingItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookingItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    booking<T extends BookingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BookingDefaultArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    inventory<T extends InventoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InventoryDefaultArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BookingItem model
   */
  interface BookingItemFieldRefs {
    readonly id: FieldRef<"BookingItem", 'String'>
    readonly bookingId: FieldRef<"BookingItem", 'String'>
    readonly inventoryId: FieldRef<"BookingItem", 'String'>
    readonly quantity: FieldRef<"BookingItem", 'Int'>
    readonly price: FieldRef<"BookingItem", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * BookingItem findUnique
   */
  export type BookingItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingItem
     */
    select?: BookingItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingItem
     */
    omit?: BookingItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingItemInclude<ExtArgs> | null
    /**
     * Filter, which BookingItem to fetch.
     */
    where: BookingItemWhereUniqueInput
  }

  /**
   * BookingItem findUniqueOrThrow
   */
  export type BookingItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingItem
     */
    select?: BookingItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingItem
     */
    omit?: BookingItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingItemInclude<ExtArgs> | null
    /**
     * Filter, which BookingItem to fetch.
     */
    where: BookingItemWhereUniqueInput
  }

  /**
   * BookingItem findFirst
   */
  export type BookingItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingItem
     */
    select?: BookingItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingItem
     */
    omit?: BookingItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingItemInclude<ExtArgs> | null
    /**
     * Filter, which BookingItem to fetch.
     */
    where?: BookingItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingItems to fetch.
     */
    orderBy?: BookingItemOrderByWithRelationInput | BookingItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookingItems.
     */
    cursor?: BookingItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookingItems.
     */
    distinct?: BookingItemScalarFieldEnum | BookingItemScalarFieldEnum[]
  }

  /**
   * BookingItem findFirstOrThrow
   */
  export type BookingItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingItem
     */
    select?: BookingItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingItem
     */
    omit?: BookingItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingItemInclude<ExtArgs> | null
    /**
     * Filter, which BookingItem to fetch.
     */
    where?: BookingItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingItems to fetch.
     */
    orderBy?: BookingItemOrderByWithRelationInput | BookingItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BookingItems.
     */
    cursor?: BookingItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BookingItems.
     */
    distinct?: BookingItemScalarFieldEnum | BookingItemScalarFieldEnum[]
  }

  /**
   * BookingItem findMany
   */
  export type BookingItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingItem
     */
    select?: BookingItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingItem
     */
    omit?: BookingItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingItemInclude<ExtArgs> | null
    /**
     * Filter, which BookingItems to fetch.
     */
    where?: BookingItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BookingItems to fetch.
     */
    orderBy?: BookingItemOrderByWithRelationInput | BookingItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BookingItems.
     */
    cursor?: BookingItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BookingItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BookingItems.
     */
    skip?: number
    distinct?: BookingItemScalarFieldEnum | BookingItemScalarFieldEnum[]
  }

  /**
   * BookingItem create
   */
  export type BookingItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingItem
     */
    select?: BookingItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingItem
     */
    omit?: BookingItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingItemInclude<ExtArgs> | null
    /**
     * The data needed to create a BookingItem.
     */
    data: XOR<BookingItemCreateInput, BookingItemUncheckedCreateInput>
  }

  /**
   * BookingItem createMany
   */
  export type BookingItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BookingItems.
     */
    data: BookingItemCreateManyInput | BookingItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BookingItem createManyAndReturn
   */
  export type BookingItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingItem
     */
    select?: BookingItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BookingItem
     */
    omit?: BookingItemOmit<ExtArgs> | null
    /**
     * The data used to create many BookingItems.
     */
    data: BookingItemCreateManyInput | BookingItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BookingItem update
   */
  export type BookingItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingItem
     */
    select?: BookingItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingItem
     */
    omit?: BookingItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingItemInclude<ExtArgs> | null
    /**
     * The data needed to update a BookingItem.
     */
    data: XOR<BookingItemUpdateInput, BookingItemUncheckedUpdateInput>
    /**
     * Choose, which BookingItem to update.
     */
    where: BookingItemWhereUniqueInput
  }

  /**
   * BookingItem updateMany
   */
  export type BookingItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BookingItems.
     */
    data: XOR<BookingItemUpdateManyMutationInput, BookingItemUncheckedUpdateManyInput>
    /**
     * Filter which BookingItems to update
     */
    where?: BookingItemWhereInput
    /**
     * Limit how many BookingItems to update.
     */
    limit?: number
  }

  /**
   * BookingItem updateManyAndReturn
   */
  export type BookingItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingItem
     */
    select?: BookingItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BookingItem
     */
    omit?: BookingItemOmit<ExtArgs> | null
    /**
     * The data used to update BookingItems.
     */
    data: XOR<BookingItemUpdateManyMutationInput, BookingItemUncheckedUpdateManyInput>
    /**
     * Filter which BookingItems to update
     */
    where?: BookingItemWhereInput
    /**
     * Limit how many BookingItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BookingItem upsert
   */
  export type BookingItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingItem
     */
    select?: BookingItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingItem
     */
    omit?: BookingItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingItemInclude<ExtArgs> | null
    /**
     * The filter to search for the BookingItem to update in case it exists.
     */
    where: BookingItemWhereUniqueInput
    /**
     * In case the BookingItem found by the `where` argument doesn't exist, create a new BookingItem with this data.
     */
    create: XOR<BookingItemCreateInput, BookingItemUncheckedCreateInput>
    /**
     * In case the BookingItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookingItemUpdateInput, BookingItemUncheckedUpdateInput>
  }

  /**
   * BookingItem delete
   */
  export type BookingItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingItem
     */
    select?: BookingItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingItem
     */
    omit?: BookingItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingItemInclude<ExtArgs> | null
    /**
     * Filter which BookingItem to delete.
     */
    where: BookingItemWhereUniqueInput
  }

  /**
   * BookingItem deleteMany
   */
  export type BookingItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BookingItems to delete
     */
    where?: BookingItemWhereInput
    /**
     * Limit how many BookingItems to delete.
     */
    limit?: number
  }

  /**
   * BookingItem without action
   */
  export type BookingItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BookingItem
     */
    select?: BookingItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BookingItem
     */
    omit?: BookingItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingItemInclude<ExtArgs> | null
  }


  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    amount: Decimal | null
    refundAmount: Decimal | null
  }

  export type PaymentSumAggregateOutputType = {
    amount: Decimal | null
    refundAmount: Decimal | null
  }

  export type PaymentMinAggregateOutputType = {
    id: string | null
    amount: Decimal | null
    type: $Enums.PaymentType | null
    status: $Enums.PaymentStatus | null
    createdAt: Date | null
    bookingId: string | null
    businessId: string | null
    currency: string | null
    paidAt: Date | null
    refundAmount: Decimal | null
    refundReason: string | null
    stripeClientSecret: string | null
    stripePaymentId: string | null
    updatedAt: Date | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: string | null
    amount: Decimal | null
    type: $Enums.PaymentType | null
    status: $Enums.PaymentStatus | null
    createdAt: Date | null
    bookingId: string | null
    businessId: string | null
    currency: string | null
    paidAt: Date | null
    refundAmount: Decimal | null
    refundReason: string | null
    stripeClientSecret: string | null
    stripePaymentId: string | null
    updatedAt: Date | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    amount: number
    type: number
    status: number
    createdAt: number
    bookingId: number
    businessId: number
    currency: number
    metadata: number
    paidAt: number
    refundAmount: number
    refundReason: number
    stripeClientSecret: number
    stripePaymentId: number
    updatedAt: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    amount?: true
    refundAmount?: true
  }

  export type PaymentSumAggregateInputType = {
    amount?: true
    refundAmount?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    amount?: true
    type?: true
    status?: true
    createdAt?: true
    bookingId?: true
    businessId?: true
    currency?: true
    paidAt?: true
    refundAmount?: true
    refundReason?: true
    stripeClientSecret?: true
    stripePaymentId?: true
    updatedAt?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    amount?: true
    type?: true
    status?: true
    createdAt?: true
    bookingId?: true
    businessId?: true
    currency?: true
    paidAt?: true
    refundAmount?: true
    refundReason?: true
    stripeClientSecret?: true
    stripePaymentId?: true
    updatedAt?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    amount?: true
    type?: true
    status?: true
    createdAt?: true
    bookingId?: true
    businessId?: true
    currency?: true
    metadata?: true
    paidAt?: true
    refundAmount?: true
    refundReason?: true
    stripeClientSecret?: true
    stripePaymentId?: true
    updatedAt?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: string
    amount: Decimal
    type: $Enums.PaymentType
    status: $Enums.PaymentStatus
    createdAt: Date
    bookingId: string
    businessId: string
    currency: string
    metadata: JsonValue | null
    paidAt: Date | null
    refundAmount: Decimal | null
    refundReason: string | null
    stripeClientSecret: string | null
    stripePaymentId: string | null
    updatedAt: Date
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    amount?: boolean
    type?: boolean
    status?: boolean
    createdAt?: boolean
    bookingId?: boolean
    businessId?: boolean
    currency?: boolean
    metadata?: boolean
    paidAt?: boolean
    refundAmount?: boolean
    refundReason?: boolean
    stripeClientSecret?: boolean
    stripePaymentId?: boolean
    updatedAt?: boolean
    booking?: boolean | BookingDefaultArgs<ExtArgs>
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    amount?: boolean
    type?: boolean
    status?: boolean
    createdAt?: boolean
    bookingId?: boolean
    businessId?: boolean
    currency?: boolean
    metadata?: boolean
    paidAt?: boolean
    refundAmount?: boolean
    refundReason?: boolean
    stripeClientSecret?: boolean
    stripePaymentId?: boolean
    updatedAt?: boolean
    booking?: boolean | BookingDefaultArgs<ExtArgs>
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    amount?: boolean
    type?: boolean
    status?: boolean
    createdAt?: boolean
    bookingId?: boolean
    businessId?: boolean
    currency?: boolean
    metadata?: boolean
    paidAt?: boolean
    refundAmount?: boolean
    refundReason?: boolean
    stripeClientSecret?: boolean
    stripePaymentId?: boolean
    updatedAt?: boolean
    booking?: boolean | BookingDefaultArgs<ExtArgs>
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectScalar = {
    id?: boolean
    amount?: boolean
    type?: boolean
    status?: boolean
    createdAt?: boolean
    bookingId?: boolean
    businessId?: boolean
    currency?: boolean
    metadata?: boolean
    paidAt?: boolean
    refundAmount?: boolean
    refundReason?: boolean
    stripeClientSecret?: boolean
    stripePaymentId?: boolean
    updatedAt?: boolean
  }

  export type PaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "amount" | "type" | "status" | "createdAt" | "bookingId" | "businessId" | "currency" | "metadata" | "paidAt" | "refundAmount" | "refundReason" | "stripeClientSecret" | "stripePaymentId" | "updatedAt", ExtArgs["result"]["payment"]>
  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | BookingDefaultArgs<ExtArgs>
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | BookingDefaultArgs<ExtArgs>
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    booking?: boolean | BookingDefaultArgs<ExtArgs>
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      booking: Prisma.$BookingPayload<ExtArgs>
      business: Prisma.$BusinessPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      amount: Prisma.Decimal
      type: $Enums.PaymentType
      status: $Enums.PaymentStatus
      createdAt: Date
      bookingId: string
      businessId: string
      currency: string
      metadata: Prisma.JsonValue | null
      paidAt: Date | null
      refundAmount: Prisma.Decimal | null
      refundReason: string | null
      stripeClientSecret: string | null
      stripePaymentId: string | null
      updatedAt: Date
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payments and returns the data saved in the database.
     * @param {PaymentCreateManyAndReturnArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments and returns the data updated in the database.
     * @param {PaymentUpdateManyAndReturnArgs} args - Arguments to update many Payments.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PaymentUpdateManyAndReturnArgs>(args: SelectSubset<T, PaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    booking<T extends BookingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BookingDefaultArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Payment model
   */
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'String'>
    readonly amount: FieldRef<"Payment", 'Decimal'>
    readonly type: FieldRef<"Payment", 'PaymentType'>
    readonly status: FieldRef<"Payment", 'PaymentStatus'>
    readonly createdAt: FieldRef<"Payment", 'DateTime'>
    readonly bookingId: FieldRef<"Payment", 'String'>
    readonly businessId: FieldRef<"Payment", 'String'>
    readonly currency: FieldRef<"Payment", 'String'>
    readonly metadata: FieldRef<"Payment", 'Json'>
    readonly paidAt: FieldRef<"Payment", 'DateTime'>
    readonly refundAmount: FieldRef<"Payment", 'Decimal'>
    readonly refundReason: FieldRef<"Payment", 'String'>
    readonly stripeClientSecret: FieldRef<"Payment", 'String'>
    readonly stripePaymentId: FieldRef<"Payment", 'String'>
    readonly updatedAt: FieldRef<"Payment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment createManyAndReturn
   */
  export type PaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
  }

  /**
   * Payment updateManyAndReturn
   */
  export type PaymentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to delete.
     */
    limit?: number
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Model Coupon
   */

  export type AggregateCoupon = {
    _count: CouponCountAggregateOutputType | null
    _avg: CouponAvgAggregateOutputType | null
    _sum: CouponSumAggregateOutputType | null
    _min: CouponMinAggregateOutputType | null
    _max: CouponMaxAggregateOutputType | null
  }

  export type CouponAvgAggregateOutputType = {
    discountAmount: number | null
    maxUses: number | null
    usedCount: number | null
    minimumAmount: number | null
  }

  export type CouponSumAggregateOutputType = {
    discountAmount: number | null
    maxUses: number | null
    usedCount: number | null
    minimumAmount: number | null
  }

  export type CouponMinAggregateOutputType = {
    id: string | null
    code: string | null
    description: string | null
    discountType: $Enums.DiscountType | null
    discountAmount: number | null
    maxUses: number | null
    usedCount: number | null
    startDate: Date | null
    endDate: Date | null
    isActive: boolean | null
    minimumAmount: number | null
    businessId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CouponMaxAggregateOutputType = {
    id: string | null
    code: string | null
    description: string | null
    discountType: $Enums.DiscountType | null
    discountAmount: number | null
    maxUses: number | null
    usedCount: number | null
    startDate: Date | null
    endDate: Date | null
    isActive: boolean | null
    minimumAmount: number | null
    businessId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CouponCountAggregateOutputType = {
    id: number
    code: number
    description: number
    discountType: number
    discountAmount: number
    maxUses: number
    usedCount: number
    startDate: number
    endDate: number
    isActive: number
    minimumAmount: number
    businessId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CouponAvgAggregateInputType = {
    discountAmount?: true
    maxUses?: true
    usedCount?: true
    minimumAmount?: true
  }

  export type CouponSumAggregateInputType = {
    discountAmount?: true
    maxUses?: true
    usedCount?: true
    minimumAmount?: true
  }

  export type CouponMinAggregateInputType = {
    id?: true
    code?: true
    description?: true
    discountType?: true
    discountAmount?: true
    maxUses?: true
    usedCount?: true
    startDate?: true
    endDate?: true
    isActive?: true
    minimumAmount?: true
    businessId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CouponMaxAggregateInputType = {
    id?: true
    code?: true
    description?: true
    discountType?: true
    discountAmount?: true
    maxUses?: true
    usedCount?: true
    startDate?: true
    endDate?: true
    isActive?: true
    minimumAmount?: true
    businessId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CouponCountAggregateInputType = {
    id?: true
    code?: true
    description?: true
    discountType?: true
    discountAmount?: true
    maxUses?: true
    usedCount?: true
    startDate?: true
    endDate?: true
    isActive?: true
    minimumAmount?: true
    businessId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CouponAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Coupon to aggregate.
     */
    where?: CouponWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Coupons to fetch.
     */
    orderBy?: CouponOrderByWithRelationInput | CouponOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CouponWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Coupons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Coupons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Coupons
    **/
    _count?: true | CouponCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CouponAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CouponSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CouponMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CouponMaxAggregateInputType
  }

  export type GetCouponAggregateType<T extends CouponAggregateArgs> = {
        [P in keyof T & keyof AggregateCoupon]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCoupon[P]>
      : GetScalarType<T[P], AggregateCoupon[P]>
  }




  export type CouponGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CouponWhereInput
    orderBy?: CouponOrderByWithAggregationInput | CouponOrderByWithAggregationInput[]
    by: CouponScalarFieldEnum[] | CouponScalarFieldEnum
    having?: CouponScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CouponCountAggregateInputType | true
    _avg?: CouponAvgAggregateInputType
    _sum?: CouponSumAggregateInputType
    _min?: CouponMinAggregateInputType
    _max?: CouponMaxAggregateInputType
  }

  export type CouponGroupByOutputType = {
    id: string
    code: string
    description: string | null
    discountType: $Enums.DiscountType
    discountAmount: number
    maxUses: number | null
    usedCount: number
    startDate: Date | null
    endDate: Date | null
    isActive: boolean
    minimumAmount: number | null
    businessId: string
    createdAt: Date
    updatedAt: Date
    _count: CouponCountAggregateOutputType | null
    _avg: CouponAvgAggregateOutputType | null
    _sum: CouponSumAggregateOutputType | null
    _min: CouponMinAggregateOutputType | null
    _max: CouponMaxAggregateOutputType | null
  }

  type GetCouponGroupByPayload<T extends CouponGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CouponGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CouponGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CouponGroupByOutputType[P]>
            : GetScalarType<T[P], CouponGroupByOutputType[P]>
        }
      >
    >


  export type CouponSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    description?: boolean
    discountType?: boolean
    discountAmount?: boolean
    maxUses?: boolean
    usedCount?: boolean
    startDate?: boolean
    endDate?: boolean
    isActive?: boolean
    minimumAmount?: boolean
    businessId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["coupon"]>

  export type CouponSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    description?: boolean
    discountType?: boolean
    discountAmount?: boolean
    maxUses?: boolean
    usedCount?: boolean
    startDate?: boolean
    endDate?: boolean
    isActive?: boolean
    minimumAmount?: boolean
    businessId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["coupon"]>

  export type CouponSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    description?: boolean
    discountType?: boolean
    discountAmount?: boolean
    maxUses?: boolean
    usedCount?: boolean
    startDate?: boolean
    endDate?: boolean
    isActive?: boolean
    minimumAmount?: boolean
    businessId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["coupon"]>

  export type CouponSelectScalar = {
    id?: boolean
    code?: boolean
    description?: boolean
    discountType?: boolean
    discountAmount?: boolean
    maxUses?: boolean
    usedCount?: boolean
    startDate?: boolean
    endDate?: boolean
    isActive?: boolean
    minimumAmount?: boolean
    businessId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CouponOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "description" | "discountType" | "discountAmount" | "maxUses" | "usedCount" | "startDate" | "endDate" | "isActive" | "minimumAmount" | "businessId" | "createdAt" | "updatedAt", ExtArgs["result"]["coupon"]>
  export type CouponInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }
  export type CouponIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }
  export type CouponIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }

  export type $CouponPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Coupon"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      description: string | null
      discountType: $Enums.DiscountType
      discountAmount: number
      maxUses: number | null
      usedCount: number
      startDate: Date | null
      endDate: Date | null
      isActive: boolean
      minimumAmount: number | null
      businessId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["coupon"]>
    composites: {}
  }

  type CouponGetPayload<S extends boolean | null | undefined | CouponDefaultArgs> = $Result.GetResult<Prisma.$CouponPayload, S>

  type CouponCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CouponFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CouponCountAggregateInputType | true
    }

  export interface CouponDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Coupon'], meta: { name: 'Coupon' } }
    /**
     * Find zero or one Coupon that matches the filter.
     * @param {CouponFindUniqueArgs} args - Arguments to find a Coupon
     * @example
     * // Get one Coupon
     * const coupon = await prisma.coupon.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CouponFindUniqueArgs>(args: SelectSubset<T, CouponFindUniqueArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Coupon that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CouponFindUniqueOrThrowArgs} args - Arguments to find a Coupon
     * @example
     * // Get one Coupon
     * const coupon = await prisma.coupon.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CouponFindUniqueOrThrowArgs>(args: SelectSubset<T, CouponFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Coupon that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponFindFirstArgs} args - Arguments to find a Coupon
     * @example
     * // Get one Coupon
     * const coupon = await prisma.coupon.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CouponFindFirstArgs>(args?: SelectSubset<T, CouponFindFirstArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Coupon that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponFindFirstOrThrowArgs} args - Arguments to find a Coupon
     * @example
     * // Get one Coupon
     * const coupon = await prisma.coupon.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CouponFindFirstOrThrowArgs>(args?: SelectSubset<T, CouponFindFirstOrThrowArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Coupons that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Coupons
     * const coupons = await prisma.coupon.findMany()
     * 
     * // Get first 10 Coupons
     * const coupons = await prisma.coupon.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const couponWithIdOnly = await prisma.coupon.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CouponFindManyArgs>(args?: SelectSubset<T, CouponFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Coupon.
     * @param {CouponCreateArgs} args - Arguments to create a Coupon.
     * @example
     * // Create one Coupon
     * const Coupon = await prisma.coupon.create({
     *   data: {
     *     // ... data to create a Coupon
     *   }
     * })
     * 
     */
    create<T extends CouponCreateArgs>(args: SelectSubset<T, CouponCreateArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Coupons.
     * @param {CouponCreateManyArgs} args - Arguments to create many Coupons.
     * @example
     * // Create many Coupons
     * const coupon = await prisma.coupon.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CouponCreateManyArgs>(args?: SelectSubset<T, CouponCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Coupons and returns the data saved in the database.
     * @param {CouponCreateManyAndReturnArgs} args - Arguments to create many Coupons.
     * @example
     * // Create many Coupons
     * const coupon = await prisma.coupon.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Coupons and only return the `id`
     * const couponWithIdOnly = await prisma.coupon.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CouponCreateManyAndReturnArgs>(args?: SelectSubset<T, CouponCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Coupon.
     * @param {CouponDeleteArgs} args - Arguments to delete one Coupon.
     * @example
     * // Delete one Coupon
     * const Coupon = await prisma.coupon.delete({
     *   where: {
     *     // ... filter to delete one Coupon
     *   }
     * })
     * 
     */
    delete<T extends CouponDeleteArgs>(args: SelectSubset<T, CouponDeleteArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Coupon.
     * @param {CouponUpdateArgs} args - Arguments to update one Coupon.
     * @example
     * // Update one Coupon
     * const coupon = await prisma.coupon.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CouponUpdateArgs>(args: SelectSubset<T, CouponUpdateArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Coupons.
     * @param {CouponDeleteManyArgs} args - Arguments to filter Coupons to delete.
     * @example
     * // Delete a few Coupons
     * const { count } = await prisma.coupon.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CouponDeleteManyArgs>(args?: SelectSubset<T, CouponDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Coupons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Coupons
     * const coupon = await prisma.coupon.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CouponUpdateManyArgs>(args: SelectSubset<T, CouponUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Coupons and returns the data updated in the database.
     * @param {CouponUpdateManyAndReturnArgs} args - Arguments to update many Coupons.
     * @example
     * // Update many Coupons
     * const coupon = await prisma.coupon.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Coupons and only return the `id`
     * const couponWithIdOnly = await prisma.coupon.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CouponUpdateManyAndReturnArgs>(args: SelectSubset<T, CouponUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Coupon.
     * @param {CouponUpsertArgs} args - Arguments to update or create a Coupon.
     * @example
     * // Update or create a Coupon
     * const coupon = await prisma.coupon.upsert({
     *   create: {
     *     // ... data to create a Coupon
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Coupon we want to update
     *   }
     * })
     */
    upsert<T extends CouponUpsertArgs>(args: SelectSubset<T, CouponUpsertArgs<ExtArgs>>): Prisma__CouponClient<$Result.GetResult<Prisma.$CouponPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Coupons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponCountArgs} args - Arguments to filter Coupons to count.
     * @example
     * // Count the number of Coupons
     * const count = await prisma.coupon.count({
     *   where: {
     *     // ... the filter for the Coupons we want to count
     *   }
     * })
    **/
    count<T extends CouponCountArgs>(
      args?: Subset<T, CouponCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CouponCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Coupon.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CouponAggregateArgs>(args: Subset<T, CouponAggregateArgs>): Prisma.PrismaPromise<GetCouponAggregateType<T>>

    /**
     * Group by Coupon.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CouponGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CouponGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CouponGroupByArgs['orderBy'] }
        : { orderBy?: CouponGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CouponGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCouponGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Coupon model
   */
  readonly fields: CouponFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Coupon.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CouponClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Coupon model
   */
  interface CouponFieldRefs {
    readonly id: FieldRef<"Coupon", 'String'>
    readonly code: FieldRef<"Coupon", 'String'>
    readonly description: FieldRef<"Coupon", 'String'>
    readonly discountType: FieldRef<"Coupon", 'DiscountType'>
    readonly discountAmount: FieldRef<"Coupon", 'Float'>
    readonly maxUses: FieldRef<"Coupon", 'Int'>
    readonly usedCount: FieldRef<"Coupon", 'Int'>
    readonly startDate: FieldRef<"Coupon", 'DateTime'>
    readonly endDate: FieldRef<"Coupon", 'DateTime'>
    readonly isActive: FieldRef<"Coupon", 'Boolean'>
    readonly minimumAmount: FieldRef<"Coupon", 'Float'>
    readonly businessId: FieldRef<"Coupon", 'String'>
    readonly createdAt: FieldRef<"Coupon", 'DateTime'>
    readonly updatedAt: FieldRef<"Coupon", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Coupon findUnique
   */
  export type CouponFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * Filter, which Coupon to fetch.
     */
    where: CouponWhereUniqueInput
  }

  /**
   * Coupon findUniqueOrThrow
   */
  export type CouponFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * Filter, which Coupon to fetch.
     */
    where: CouponWhereUniqueInput
  }

  /**
   * Coupon findFirst
   */
  export type CouponFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * Filter, which Coupon to fetch.
     */
    where?: CouponWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Coupons to fetch.
     */
    orderBy?: CouponOrderByWithRelationInput | CouponOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Coupons.
     */
    cursor?: CouponWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Coupons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Coupons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Coupons.
     */
    distinct?: CouponScalarFieldEnum | CouponScalarFieldEnum[]
  }

  /**
   * Coupon findFirstOrThrow
   */
  export type CouponFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * Filter, which Coupon to fetch.
     */
    where?: CouponWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Coupons to fetch.
     */
    orderBy?: CouponOrderByWithRelationInput | CouponOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Coupons.
     */
    cursor?: CouponWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Coupons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Coupons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Coupons.
     */
    distinct?: CouponScalarFieldEnum | CouponScalarFieldEnum[]
  }

  /**
   * Coupon findMany
   */
  export type CouponFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * Filter, which Coupons to fetch.
     */
    where?: CouponWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Coupons to fetch.
     */
    orderBy?: CouponOrderByWithRelationInput | CouponOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Coupons.
     */
    cursor?: CouponWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Coupons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Coupons.
     */
    skip?: number
    distinct?: CouponScalarFieldEnum | CouponScalarFieldEnum[]
  }

  /**
   * Coupon create
   */
  export type CouponCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * The data needed to create a Coupon.
     */
    data: XOR<CouponCreateInput, CouponUncheckedCreateInput>
  }

  /**
   * Coupon createMany
   */
  export type CouponCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Coupons.
     */
    data: CouponCreateManyInput | CouponCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Coupon createManyAndReturn
   */
  export type CouponCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * The data used to create many Coupons.
     */
    data: CouponCreateManyInput | CouponCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Coupon update
   */
  export type CouponUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * The data needed to update a Coupon.
     */
    data: XOR<CouponUpdateInput, CouponUncheckedUpdateInput>
    /**
     * Choose, which Coupon to update.
     */
    where: CouponWhereUniqueInput
  }

  /**
   * Coupon updateMany
   */
  export type CouponUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Coupons.
     */
    data: XOR<CouponUpdateManyMutationInput, CouponUncheckedUpdateManyInput>
    /**
     * Filter which Coupons to update
     */
    where?: CouponWhereInput
    /**
     * Limit how many Coupons to update.
     */
    limit?: number
  }

  /**
   * Coupon updateManyAndReturn
   */
  export type CouponUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * The data used to update Coupons.
     */
    data: XOR<CouponUpdateManyMutationInput, CouponUncheckedUpdateManyInput>
    /**
     * Filter which Coupons to update
     */
    where?: CouponWhereInput
    /**
     * Limit how many Coupons to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Coupon upsert
   */
  export type CouponUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * The filter to search for the Coupon to update in case it exists.
     */
    where: CouponWhereUniqueInput
    /**
     * In case the Coupon found by the `where` argument doesn't exist, create a new Coupon with this data.
     */
    create: XOR<CouponCreateInput, CouponUncheckedCreateInput>
    /**
     * In case the Coupon was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CouponUpdateInput, CouponUncheckedUpdateInput>
  }

  /**
   * Coupon delete
   */
  export type CouponDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
    /**
     * Filter which Coupon to delete.
     */
    where: CouponWhereUniqueInput
  }

  /**
   * Coupon deleteMany
   */
  export type CouponDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Coupons to delete
     */
    where?: CouponWhereInput
    /**
     * Limit how many Coupons to delete.
     */
    limit?: number
  }

  /**
   * Coupon without action
   */
  export type CouponDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Coupon
     */
    select?: CouponSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Coupon
     */
    omit?: CouponOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CouponInclude<ExtArgs> | null
  }


  /**
   * Model SalesFunnel
   */

  export type AggregateSalesFunnel = {
    _count: SalesFunnelCountAggregateOutputType | null
    _min: SalesFunnelMinAggregateOutputType | null
    _max: SalesFunnelMaxAggregateOutputType | null
  }

  export type SalesFunnelMinAggregateOutputType = {
    id: string | null
    name: string | null
    isActive: boolean | null
    popupTitle: string | null
    popupText: string | null
    popupImage: string | null
    formTitle: string | null
    thankYouMessage: string | null
    couponId: string | null
    businessId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SalesFunnelMaxAggregateOutputType = {
    id: string | null
    name: string | null
    isActive: boolean | null
    popupTitle: string | null
    popupText: string | null
    popupImage: string | null
    formTitle: string | null
    thankYouMessage: string | null
    couponId: string | null
    businessId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SalesFunnelCountAggregateOutputType = {
    id: number
    name: number
    isActive: number
    popupTitle: number
    popupText: number
    popupImage: number
    formTitle: number
    thankYouMessage: number
    couponId: number
    businessId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SalesFunnelMinAggregateInputType = {
    id?: true
    name?: true
    isActive?: true
    popupTitle?: true
    popupText?: true
    popupImage?: true
    formTitle?: true
    thankYouMessage?: true
    couponId?: true
    businessId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SalesFunnelMaxAggregateInputType = {
    id?: true
    name?: true
    isActive?: true
    popupTitle?: true
    popupText?: true
    popupImage?: true
    formTitle?: true
    thankYouMessage?: true
    couponId?: true
    businessId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SalesFunnelCountAggregateInputType = {
    id?: true
    name?: true
    isActive?: true
    popupTitle?: true
    popupText?: true
    popupImage?: true
    formTitle?: true
    thankYouMessage?: true
    couponId?: true
    businessId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SalesFunnelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SalesFunnel to aggregate.
     */
    where?: SalesFunnelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesFunnels to fetch.
     */
    orderBy?: SalesFunnelOrderByWithRelationInput | SalesFunnelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SalesFunnelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesFunnels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesFunnels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SalesFunnels
    **/
    _count?: true | SalesFunnelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SalesFunnelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SalesFunnelMaxAggregateInputType
  }

  export type GetSalesFunnelAggregateType<T extends SalesFunnelAggregateArgs> = {
        [P in keyof T & keyof AggregateSalesFunnel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSalesFunnel[P]>
      : GetScalarType<T[P], AggregateSalesFunnel[P]>
  }




  export type SalesFunnelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalesFunnelWhereInput
    orderBy?: SalesFunnelOrderByWithAggregationInput | SalesFunnelOrderByWithAggregationInput[]
    by: SalesFunnelScalarFieldEnum[] | SalesFunnelScalarFieldEnum
    having?: SalesFunnelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SalesFunnelCountAggregateInputType | true
    _min?: SalesFunnelMinAggregateInputType
    _max?: SalesFunnelMaxAggregateInputType
  }

  export type SalesFunnelGroupByOutputType = {
    id: string
    name: string
    isActive: boolean
    popupTitle: string
    popupText: string
    popupImage: string | null
    formTitle: string
    thankYouMessage: string
    couponId: string | null
    businessId: string
    createdAt: Date
    updatedAt: Date
    _count: SalesFunnelCountAggregateOutputType | null
    _min: SalesFunnelMinAggregateOutputType | null
    _max: SalesFunnelMaxAggregateOutputType | null
  }

  type GetSalesFunnelGroupByPayload<T extends SalesFunnelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SalesFunnelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SalesFunnelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SalesFunnelGroupByOutputType[P]>
            : GetScalarType<T[P], SalesFunnelGroupByOutputType[P]>
        }
      >
    >


  export type SalesFunnelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isActive?: boolean
    popupTitle?: boolean
    popupText?: boolean
    popupImage?: boolean
    formTitle?: boolean
    thankYouMessage?: boolean
    couponId?: boolean
    businessId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["salesFunnel"]>

  export type SalesFunnelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isActive?: boolean
    popupTitle?: boolean
    popupText?: boolean
    popupImage?: boolean
    formTitle?: boolean
    thankYouMessage?: boolean
    couponId?: boolean
    businessId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["salesFunnel"]>

  export type SalesFunnelSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isActive?: boolean
    popupTitle?: boolean
    popupText?: boolean
    popupImage?: boolean
    formTitle?: boolean
    thankYouMessage?: boolean
    couponId?: boolean
    businessId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["salesFunnel"]>

  export type SalesFunnelSelectScalar = {
    id?: boolean
    name?: boolean
    isActive?: boolean
    popupTitle?: boolean
    popupText?: boolean
    popupImage?: boolean
    formTitle?: boolean
    thankYouMessage?: boolean
    couponId?: boolean
    businessId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SalesFunnelOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "isActive" | "popupTitle" | "popupText" | "popupImage" | "formTitle" | "thankYouMessage" | "couponId" | "businessId" | "createdAt" | "updatedAt", ExtArgs["result"]["salesFunnel"]>
  export type SalesFunnelInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }
  export type SalesFunnelIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }
  export type SalesFunnelIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
  }

  export type $SalesFunnelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SalesFunnel"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      isActive: boolean
      popupTitle: string
      popupText: string
      popupImage: string | null
      formTitle: string
      thankYouMessage: string
      couponId: string | null
      businessId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["salesFunnel"]>
    composites: {}
  }

  type SalesFunnelGetPayload<S extends boolean | null | undefined | SalesFunnelDefaultArgs> = $Result.GetResult<Prisma.$SalesFunnelPayload, S>

  type SalesFunnelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SalesFunnelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SalesFunnelCountAggregateInputType | true
    }

  export interface SalesFunnelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SalesFunnel'], meta: { name: 'SalesFunnel' } }
    /**
     * Find zero or one SalesFunnel that matches the filter.
     * @param {SalesFunnelFindUniqueArgs} args - Arguments to find a SalesFunnel
     * @example
     * // Get one SalesFunnel
     * const salesFunnel = await prisma.salesFunnel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SalesFunnelFindUniqueArgs>(args: SelectSubset<T, SalesFunnelFindUniqueArgs<ExtArgs>>): Prisma__SalesFunnelClient<$Result.GetResult<Prisma.$SalesFunnelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SalesFunnel that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SalesFunnelFindUniqueOrThrowArgs} args - Arguments to find a SalesFunnel
     * @example
     * // Get one SalesFunnel
     * const salesFunnel = await prisma.salesFunnel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SalesFunnelFindUniqueOrThrowArgs>(args: SelectSubset<T, SalesFunnelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SalesFunnelClient<$Result.GetResult<Prisma.$SalesFunnelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SalesFunnel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesFunnelFindFirstArgs} args - Arguments to find a SalesFunnel
     * @example
     * // Get one SalesFunnel
     * const salesFunnel = await prisma.salesFunnel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SalesFunnelFindFirstArgs>(args?: SelectSubset<T, SalesFunnelFindFirstArgs<ExtArgs>>): Prisma__SalesFunnelClient<$Result.GetResult<Prisma.$SalesFunnelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SalesFunnel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesFunnelFindFirstOrThrowArgs} args - Arguments to find a SalesFunnel
     * @example
     * // Get one SalesFunnel
     * const salesFunnel = await prisma.salesFunnel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SalesFunnelFindFirstOrThrowArgs>(args?: SelectSubset<T, SalesFunnelFindFirstOrThrowArgs<ExtArgs>>): Prisma__SalesFunnelClient<$Result.GetResult<Prisma.$SalesFunnelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SalesFunnels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesFunnelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SalesFunnels
     * const salesFunnels = await prisma.salesFunnel.findMany()
     * 
     * // Get first 10 SalesFunnels
     * const salesFunnels = await prisma.salesFunnel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const salesFunnelWithIdOnly = await prisma.salesFunnel.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SalesFunnelFindManyArgs>(args?: SelectSubset<T, SalesFunnelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesFunnelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SalesFunnel.
     * @param {SalesFunnelCreateArgs} args - Arguments to create a SalesFunnel.
     * @example
     * // Create one SalesFunnel
     * const SalesFunnel = await prisma.salesFunnel.create({
     *   data: {
     *     // ... data to create a SalesFunnel
     *   }
     * })
     * 
     */
    create<T extends SalesFunnelCreateArgs>(args: SelectSubset<T, SalesFunnelCreateArgs<ExtArgs>>): Prisma__SalesFunnelClient<$Result.GetResult<Prisma.$SalesFunnelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SalesFunnels.
     * @param {SalesFunnelCreateManyArgs} args - Arguments to create many SalesFunnels.
     * @example
     * // Create many SalesFunnels
     * const salesFunnel = await prisma.salesFunnel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SalesFunnelCreateManyArgs>(args?: SelectSubset<T, SalesFunnelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SalesFunnels and returns the data saved in the database.
     * @param {SalesFunnelCreateManyAndReturnArgs} args - Arguments to create many SalesFunnels.
     * @example
     * // Create many SalesFunnels
     * const salesFunnel = await prisma.salesFunnel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SalesFunnels and only return the `id`
     * const salesFunnelWithIdOnly = await prisma.salesFunnel.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SalesFunnelCreateManyAndReturnArgs>(args?: SelectSubset<T, SalesFunnelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesFunnelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SalesFunnel.
     * @param {SalesFunnelDeleteArgs} args - Arguments to delete one SalesFunnel.
     * @example
     * // Delete one SalesFunnel
     * const SalesFunnel = await prisma.salesFunnel.delete({
     *   where: {
     *     // ... filter to delete one SalesFunnel
     *   }
     * })
     * 
     */
    delete<T extends SalesFunnelDeleteArgs>(args: SelectSubset<T, SalesFunnelDeleteArgs<ExtArgs>>): Prisma__SalesFunnelClient<$Result.GetResult<Prisma.$SalesFunnelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SalesFunnel.
     * @param {SalesFunnelUpdateArgs} args - Arguments to update one SalesFunnel.
     * @example
     * // Update one SalesFunnel
     * const salesFunnel = await prisma.salesFunnel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SalesFunnelUpdateArgs>(args: SelectSubset<T, SalesFunnelUpdateArgs<ExtArgs>>): Prisma__SalesFunnelClient<$Result.GetResult<Prisma.$SalesFunnelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SalesFunnels.
     * @param {SalesFunnelDeleteManyArgs} args - Arguments to filter SalesFunnels to delete.
     * @example
     * // Delete a few SalesFunnels
     * const { count } = await prisma.salesFunnel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SalesFunnelDeleteManyArgs>(args?: SelectSubset<T, SalesFunnelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SalesFunnels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesFunnelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SalesFunnels
     * const salesFunnel = await prisma.salesFunnel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SalesFunnelUpdateManyArgs>(args: SelectSubset<T, SalesFunnelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SalesFunnels and returns the data updated in the database.
     * @param {SalesFunnelUpdateManyAndReturnArgs} args - Arguments to update many SalesFunnels.
     * @example
     * // Update many SalesFunnels
     * const salesFunnel = await prisma.salesFunnel.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SalesFunnels and only return the `id`
     * const salesFunnelWithIdOnly = await prisma.salesFunnel.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SalesFunnelUpdateManyAndReturnArgs>(args: SelectSubset<T, SalesFunnelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesFunnelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SalesFunnel.
     * @param {SalesFunnelUpsertArgs} args - Arguments to update or create a SalesFunnel.
     * @example
     * // Update or create a SalesFunnel
     * const salesFunnel = await prisma.salesFunnel.upsert({
     *   create: {
     *     // ... data to create a SalesFunnel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SalesFunnel we want to update
     *   }
     * })
     */
    upsert<T extends SalesFunnelUpsertArgs>(args: SelectSubset<T, SalesFunnelUpsertArgs<ExtArgs>>): Prisma__SalesFunnelClient<$Result.GetResult<Prisma.$SalesFunnelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SalesFunnels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesFunnelCountArgs} args - Arguments to filter SalesFunnels to count.
     * @example
     * // Count the number of SalesFunnels
     * const count = await prisma.salesFunnel.count({
     *   where: {
     *     // ... the filter for the SalesFunnels we want to count
     *   }
     * })
    **/
    count<T extends SalesFunnelCountArgs>(
      args?: Subset<T, SalesFunnelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SalesFunnelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SalesFunnel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesFunnelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SalesFunnelAggregateArgs>(args: Subset<T, SalesFunnelAggregateArgs>): Prisma.PrismaPromise<GetSalesFunnelAggregateType<T>>

    /**
     * Group by SalesFunnel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesFunnelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SalesFunnelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SalesFunnelGroupByArgs['orderBy'] }
        : { orderBy?: SalesFunnelGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SalesFunnelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSalesFunnelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SalesFunnel model
   */
  readonly fields: SalesFunnelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SalesFunnel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SalesFunnelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SalesFunnel model
   */
  interface SalesFunnelFieldRefs {
    readonly id: FieldRef<"SalesFunnel", 'String'>
    readonly name: FieldRef<"SalesFunnel", 'String'>
    readonly isActive: FieldRef<"SalesFunnel", 'Boolean'>
    readonly popupTitle: FieldRef<"SalesFunnel", 'String'>
    readonly popupText: FieldRef<"SalesFunnel", 'String'>
    readonly popupImage: FieldRef<"SalesFunnel", 'String'>
    readonly formTitle: FieldRef<"SalesFunnel", 'String'>
    readonly thankYouMessage: FieldRef<"SalesFunnel", 'String'>
    readonly couponId: FieldRef<"SalesFunnel", 'String'>
    readonly businessId: FieldRef<"SalesFunnel", 'String'>
    readonly createdAt: FieldRef<"SalesFunnel", 'DateTime'>
    readonly updatedAt: FieldRef<"SalesFunnel", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SalesFunnel findUnique
   */
  export type SalesFunnelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesFunnel
     */
    select?: SalesFunnelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesFunnel
     */
    omit?: SalesFunnelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesFunnelInclude<ExtArgs> | null
    /**
     * Filter, which SalesFunnel to fetch.
     */
    where: SalesFunnelWhereUniqueInput
  }

  /**
   * SalesFunnel findUniqueOrThrow
   */
  export type SalesFunnelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesFunnel
     */
    select?: SalesFunnelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesFunnel
     */
    omit?: SalesFunnelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesFunnelInclude<ExtArgs> | null
    /**
     * Filter, which SalesFunnel to fetch.
     */
    where: SalesFunnelWhereUniqueInput
  }

  /**
   * SalesFunnel findFirst
   */
  export type SalesFunnelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesFunnel
     */
    select?: SalesFunnelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesFunnel
     */
    omit?: SalesFunnelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesFunnelInclude<ExtArgs> | null
    /**
     * Filter, which SalesFunnel to fetch.
     */
    where?: SalesFunnelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesFunnels to fetch.
     */
    orderBy?: SalesFunnelOrderByWithRelationInput | SalesFunnelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SalesFunnels.
     */
    cursor?: SalesFunnelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesFunnels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesFunnels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SalesFunnels.
     */
    distinct?: SalesFunnelScalarFieldEnum | SalesFunnelScalarFieldEnum[]
  }

  /**
   * SalesFunnel findFirstOrThrow
   */
  export type SalesFunnelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesFunnel
     */
    select?: SalesFunnelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesFunnel
     */
    omit?: SalesFunnelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesFunnelInclude<ExtArgs> | null
    /**
     * Filter, which SalesFunnel to fetch.
     */
    where?: SalesFunnelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesFunnels to fetch.
     */
    orderBy?: SalesFunnelOrderByWithRelationInput | SalesFunnelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SalesFunnels.
     */
    cursor?: SalesFunnelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesFunnels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesFunnels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SalesFunnels.
     */
    distinct?: SalesFunnelScalarFieldEnum | SalesFunnelScalarFieldEnum[]
  }

  /**
   * SalesFunnel findMany
   */
  export type SalesFunnelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesFunnel
     */
    select?: SalesFunnelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesFunnel
     */
    omit?: SalesFunnelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesFunnelInclude<ExtArgs> | null
    /**
     * Filter, which SalesFunnels to fetch.
     */
    where?: SalesFunnelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesFunnels to fetch.
     */
    orderBy?: SalesFunnelOrderByWithRelationInput | SalesFunnelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SalesFunnels.
     */
    cursor?: SalesFunnelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesFunnels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesFunnels.
     */
    skip?: number
    distinct?: SalesFunnelScalarFieldEnum | SalesFunnelScalarFieldEnum[]
  }

  /**
   * SalesFunnel create
   */
  export type SalesFunnelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesFunnel
     */
    select?: SalesFunnelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesFunnel
     */
    omit?: SalesFunnelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesFunnelInclude<ExtArgs> | null
    /**
     * The data needed to create a SalesFunnel.
     */
    data: XOR<SalesFunnelCreateInput, SalesFunnelUncheckedCreateInput>
  }

  /**
   * SalesFunnel createMany
   */
  export type SalesFunnelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SalesFunnels.
     */
    data: SalesFunnelCreateManyInput | SalesFunnelCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SalesFunnel createManyAndReturn
   */
  export type SalesFunnelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesFunnel
     */
    select?: SalesFunnelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SalesFunnel
     */
    omit?: SalesFunnelOmit<ExtArgs> | null
    /**
     * The data used to create many SalesFunnels.
     */
    data: SalesFunnelCreateManyInput | SalesFunnelCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesFunnelIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SalesFunnel update
   */
  export type SalesFunnelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesFunnel
     */
    select?: SalesFunnelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesFunnel
     */
    omit?: SalesFunnelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesFunnelInclude<ExtArgs> | null
    /**
     * The data needed to update a SalesFunnel.
     */
    data: XOR<SalesFunnelUpdateInput, SalesFunnelUncheckedUpdateInput>
    /**
     * Choose, which SalesFunnel to update.
     */
    where: SalesFunnelWhereUniqueInput
  }

  /**
   * SalesFunnel updateMany
   */
  export type SalesFunnelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SalesFunnels.
     */
    data: XOR<SalesFunnelUpdateManyMutationInput, SalesFunnelUncheckedUpdateManyInput>
    /**
     * Filter which SalesFunnels to update
     */
    where?: SalesFunnelWhereInput
    /**
     * Limit how many SalesFunnels to update.
     */
    limit?: number
  }

  /**
   * SalesFunnel updateManyAndReturn
   */
  export type SalesFunnelUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesFunnel
     */
    select?: SalesFunnelSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SalesFunnel
     */
    omit?: SalesFunnelOmit<ExtArgs> | null
    /**
     * The data used to update SalesFunnels.
     */
    data: XOR<SalesFunnelUpdateManyMutationInput, SalesFunnelUncheckedUpdateManyInput>
    /**
     * Filter which SalesFunnels to update
     */
    where?: SalesFunnelWhereInput
    /**
     * Limit how many SalesFunnels to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesFunnelIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SalesFunnel upsert
   */
  export type SalesFunnelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesFunnel
     */
    select?: SalesFunnelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesFunnel
     */
    omit?: SalesFunnelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesFunnelInclude<ExtArgs> | null
    /**
     * The filter to search for the SalesFunnel to update in case it exists.
     */
    where: SalesFunnelWhereUniqueInput
    /**
     * In case the SalesFunnel found by the `where` argument doesn't exist, create a new SalesFunnel with this data.
     */
    create: XOR<SalesFunnelCreateInput, SalesFunnelUncheckedCreateInput>
    /**
     * In case the SalesFunnel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SalesFunnelUpdateInput, SalesFunnelUncheckedUpdateInput>
  }

  /**
   * SalesFunnel delete
   */
  export type SalesFunnelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesFunnel
     */
    select?: SalesFunnelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesFunnel
     */
    omit?: SalesFunnelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesFunnelInclude<ExtArgs> | null
    /**
     * Filter which SalesFunnel to delete.
     */
    where: SalesFunnelWhereUniqueInput
  }

  /**
   * SalesFunnel deleteMany
   */
  export type SalesFunnelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SalesFunnels to delete
     */
    where?: SalesFunnelWhereInput
    /**
     * Limit how many SalesFunnels to delete.
     */
    limit?: number
  }

  /**
   * SalesFunnel without action
   */
  export type SalesFunnelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesFunnel
     */
    select?: SalesFunnelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesFunnel
     */
    omit?: SalesFunnelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesFunnelInclude<ExtArgs> | null
  }


  /**
   * Model Waiver
   */

  export type AggregateWaiver = {
    _count: WaiverCountAggregateOutputType | null
    _min: WaiverMinAggregateOutputType | null
    _max: WaiverMaxAggregateOutputType | null
  }

  export type WaiverMinAggregateOutputType = {
    id: string | null
    businessId: string | null
    customerId: string | null
    bookingId: string | null
    status: $Enums.WaiverStatus | null
    templateVersion: string | null
    documentUrl: string | null
    openSignDocumentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WaiverMaxAggregateOutputType = {
    id: string | null
    businessId: string | null
    customerId: string | null
    bookingId: string | null
    status: $Enums.WaiverStatus | null
    templateVersion: string | null
    documentUrl: string | null
    openSignDocumentId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WaiverCountAggregateOutputType = {
    id: number
    businessId: number
    customerId: number
    bookingId: number
    status: number
    templateVersion: number
    documentUrl: number
    openSignDocumentId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WaiverMinAggregateInputType = {
    id?: true
    businessId?: true
    customerId?: true
    bookingId?: true
    status?: true
    templateVersion?: true
    documentUrl?: true
    openSignDocumentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WaiverMaxAggregateInputType = {
    id?: true
    businessId?: true
    customerId?: true
    bookingId?: true
    status?: true
    templateVersion?: true
    documentUrl?: true
    openSignDocumentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WaiverCountAggregateInputType = {
    id?: true
    businessId?: true
    customerId?: true
    bookingId?: true
    status?: true
    templateVersion?: true
    documentUrl?: true
    openSignDocumentId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WaiverAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Waiver to aggregate.
     */
    where?: WaiverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Waivers to fetch.
     */
    orderBy?: WaiverOrderByWithRelationInput | WaiverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WaiverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Waivers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Waivers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Waivers
    **/
    _count?: true | WaiverCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WaiverMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WaiverMaxAggregateInputType
  }

  export type GetWaiverAggregateType<T extends WaiverAggregateArgs> = {
        [P in keyof T & keyof AggregateWaiver]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWaiver[P]>
      : GetScalarType<T[P], AggregateWaiver[P]>
  }




  export type WaiverGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WaiverWhereInput
    orderBy?: WaiverOrderByWithAggregationInput | WaiverOrderByWithAggregationInput[]
    by: WaiverScalarFieldEnum[] | WaiverScalarFieldEnum
    having?: WaiverScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WaiverCountAggregateInputType | true
    _min?: WaiverMinAggregateInputType
    _max?: WaiverMaxAggregateInputType
  }

  export type WaiverGroupByOutputType = {
    id: string
    businessId: string
    customerId: string
    bookingId: string
    status: $Enums.WaiverStatus
    templateVersion: string
    documentUrl: string
    openSignDocumentId: string
    createdAt: Date
    updatedAt: Date
    _count: WaiverCountAggregateOutputType | null
    _min: WaiverMinAggregateOutputType | null
    _max: WaiverMaxAggregateOutputType | null
  }

  type GetWaiverGroupByPayload<T extends WaiverGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WaiverGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WaiverGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WaiverGroupByOutputType[P]>
            : GetScalarType<T[P], WaiverGroupByOutputType[P]>
        }
      >
    >


  export type WaiverSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    customerId?: boolean
    bookingId?: boolean
    status?: boolean
    templateVersion?: boolean
    documentUrl?: boolean
    openSignDocumentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["waiver"]>

  export type WaiverSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    customerId?: boolean
    bookingId?: boolean
    status?: boolean
    templateVersion?: boolean
    documentUrl?: boolean
    openSignDocumentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["waiver"]>

  export type WaiverSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    businessId?: boolean
    customerId?: boolean
    bookingId?: boolean
    status?: boolean
    templateVersion?: boolean
    documentUrl?: boolean
    openSignDocumentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["waiver"]>

  export type WaiverSelectScalar = {
    id?: boolean
    businessId?: boolean
    customerId?: boolean
    bookingId?: boolean
    status?: boolean
    templateVersion?: boolean
    documentUrl?: boolean
    openSignDocumentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WaiverOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "businessId" | "customerId" | "bookingId" | "status" | "templateVersion" | "documentUrl" | "openSignDocumentId" | "createdAt" | "updatedAt", ExtArgs["result"]["waiver"]>
  export type WaiverInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }
  export type WaiverIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }
  export type WaiverIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    business?: boolean | BusinessDefaultArgs<ExtArgs>
    customer?: boolean | CustomerDefaultArgs<ExtArgs>
    booking?: boolean | BookingDefaultArgs<ExtArgs>
  }

  export type $WaiverPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Waiver"
    objects: {
      business: Prisma.$BusinessPayload<ExtArgs>
      customer: Prisma.$CustomerPayload<ExtArgs>
      booking: Prisma.$BookingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      businessId: string
      customerId: string
      bookingId: string
      status: $Enums.WaiverStatus
      templateVersion: string
      documentUrl: string
      openSignDocumentId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["waiver"]>
    composites: {}
  }

  type WaiverGetPayload<S extends boolean | null | undefined | WaiverDefaultArgs> = $Result.GetResult<Prisma.$WaiverPayload, S>

  type WaiverCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WaiverFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WaiverCountAggregateInputType | true
    }

  export interface WaiverDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Waiver'], meta: { name: 'Waiver' } }
    /**
     * Find zero or one Waiver that matches the filter.
     * @param {WaiverFindUniqueArgs} args - Arguments to find a Waiver
     * @example
     * // Get one Waiver
     * const waiver = await prisma.waiver.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WaiverFindUniqueArgs>(args: SelectSubset<T, WaiverFindUniqueArgs<ExtArgs>>): Prisma__WaiverClient<$Result.GetResult<Prisma.$WaiverPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Waiver that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WaiverFindUniqueOrThrowArgs} args - Arguments to find a Waiver
     * @example
     * // Get one Waiver
     * const waiver = await prisma.waiver.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WaiverFindUniqueOrThrowArgs>(args: SelectSubset<T, WaiverFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WaiverClient<$Result.GetResult<Prisma.$WaiverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Waiver that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaiverFindFirstArgs} args - Arguments to find a Waiver
     * @example
     * // Get one Waiver
     * const waiver = await prisma.waiver.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WaiverFindFirstArgs>(args?: SelectSubset<T, WaiverFindFirstArgs<ExtArgs>>): Prisma__WaiverClient<$Result.GetResult<Prisma.$WaiverPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Waiver that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaiverFindFirstOrThrowArgs} args - Arguments to find a Waiver
     * @example
     * // Get one Waiver
     * const waiver = await prisma.waiver.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WaiverFindFirstOrThrowArgs>(args?: SelectSubset<T, WaiverFindFirstOrThrowArgs<ExtArgs>>): Prisma__WaiverClient<$Result.GetResult<Prisma.$WaiverPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Waivers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaiverFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Waivers
     * const waivers = await prisma.waiver.findMany()
     * 
     * // Get first 10 Waivers
     * const waivers = await prisma.waiver.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const waiverWithIdOnly = await prisma.waiver.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WaiverFindManyArgs>(args?: SelectSubset<T, WaiverFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WaiverPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Waiver.
     * @param {WaiverCreateArgs} args - Arguments to create a Waiver.
     * @example
     * // Create one Waiver
     * const Waiver = await prisma.waiver.create({
     *   data: {
     *     // ... data to create a Waiver
     *   }
     * })
     * 
     */
    create<T extends WaiverCreateArgs>(args: SelectSubset<T, WaiverCreateArgs<ExtArgs>>): Prisma__WaiverClient<$Result.GetResult<Prisma.$WaiverPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Waivers.
     * @param {WaiverCreateManyArgs} args - Arguments to create many Waivers.
     * @example
     * // Create many Waivers
     * const waiver = await prisma.waiver.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WaiverCreateManyArgs>(args?: SelectSubset<T, WaiverCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Waivers and returns the data saved in the database.
     * @param {WaiverCreateManyAndReturnArgs} args - Arguments to create many Waivers.
     * @example
     * // Create many Waivers
     * const waiver = await prisma.waiver.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Waivers and only return the `id`
     * const waiverWithIdOnly = await prisma.waiver.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WaiverCreateManyAndReturnArgs>(args?: SelectSubset<T, WaiverCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WaiverPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Waiver.
     * @param {WaiverDeleteArgs} args - Arguments to delete one Waiver.
     * @example
     * // Delete one Waiver
     * const Waiver = await prisma.waiver.delete({
     *   where: {
     *     // ... filter to delete one Waiver
     *   }
     * })
     * 
     */
    delete<T extends WaiverDeleteArgs>(args: SelectSubset<T, WaiverDeleteArgs<ExtArgs>>): Prisma__WaiverClient<$Result.GetResult<Prisma.$WaiverPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Waiver.
     * @param {WaiverUpdateArgs} args - Arguments to update one Waiver.
     * @example
     * // Update one Waiver
     * const waiver = await prisma.waiver.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WaiverUpdateArgs>(args: SelectSubset<T, WaiverUpdateArgs<ExtArgs>>): Prisma__WaiverClient<$Result.GetResult<Prisma.$WaiverPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Waivers.
     * @param {WaiverDeleteManyArgs} args - Arguments to filter Waivers to delete.
     * @example
     * // Delete a few Waivers
     * const { count } = await prisma.waiver.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WaiverDeleteManyArgs>(args?: SelectSubset<T, WaiverDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Waivers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaiverUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Waivers
     * const waiver = await prisma.waiver.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WaiverUpdateManyArgs>(args: SelectSubset<T, WaiverUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Waivers and returns the data updated in the database.
     * @param {WaiverUpdateManyAndReturnArgs} args - Arguments to update many Waivers.
     * @example
     * // Update many Waivers
     * const waiver = await prisma.waiver.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Waivers and only return the `id`
     * const waiverWithIdOnly = await prisma.waiver.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WaiverUpdateManyAndReturnArgs>(args: SelectSubset<T, WaiverUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WaiverPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Waiver.
     * @param {WaiverUpsertArgs} args - Arguments to update or create a Waiver.
     * @example
     * // Update or create a Waiver
     * const waiver = await prisma.waiver.upsert({
     *   create: {
     *     // ... data to create a Waiver
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Waiver we want to update
     *   }
     * })
     */
    upsert<T extends WaiverUpsertArgs>(args: SelectSubset<T, WaiverUpsertArgs<ExtArgs>>): Prisma__WaiverClient<$Result.GetResult<Prisma.$WaiverPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Waivers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaiverCountArgs} args - Arguments to filter Waivers to count.
     * @example
     * // Count the number of Waivers
     * const count = await prisma.waiver.count({
     *   where: {
     *     // ... the filter for the Waivers we want to count
     *   }
     * })
    **/
    count<T extends WaiverCountArgs>(
      args?: Subset<T, WaiverCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WaiverCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Waiver.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaiverAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WaiverAggregateArgs>(args: Subset<T, WaiverAggregateArgs>): Prisma.PrismaPromise<GetWaiverAggregateType<T>>

    /**
     * Group by Waiver.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WaiverGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WaiverGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WaiverGroupByArgs['orderBy'] }
        : { orderBy?: WaiverGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WaiverGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWaiverGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Waiver model
   */
  readonly fields: WaiverFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Waiver.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WaiverClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    business<T extends BusinessDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BusinessDefaultArgs<ExtArgs>>): Prisma__BusinessClient<$Result.GetResult<Prisma.$BusinessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    customer<T extends CustomerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CustomerDefaultArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    booking<T extends BookingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BookingDefaultArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Waiver model
   */
  interface WaiverFieldRefs {
    readonly id: FieldRef<"Waiver", 'String'>
    readonly businessId: FieldRef<"Waiver", 'String'>
    readonly customerId: FieldRef<"Waiver", 'String'>
    readonly bookingId: FieldRef<"Waiver", 'String'>
    readonly status: FieldRef<"Waiver", 'WaiverStatus'>
    readonly templateVersion: FieldRef<"Waiver", 'String'>
    readonly documentUrl: FieldRef<"Waiver", 'String'>
    readonly openSignDocumentId: FieldRef<"Waiver", 'String'>
    readonly createdAt: FieldRef<"Waiver", 'DateTime'>
    readonly updatedAt: FieldRef<"Waiver", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Waiver findUnique
   */
  export type WaiverFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Waiver
     */
    select?: WaiverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Waiver
     */
    omit?: WaiverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaiverInclude<ExtArgs> | null
    /**
     * Filter, which Waiver to fetch.
     */
    where: WaiverWhereUniqueInput
  }

  /**
   * Waiver findUniqueOrThrow
   */
  export type WaiverFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Waiver
     */
    select?: WaiverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Waiver
     */
    omit?: WaiverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaiverInclude<ExtArgs> | null
    /**
     * Filter, which Waiver to fetch.
     */
    where: WaiverWhereUniqueInput
  }

  /**
   * Waiver findFirst
   */
  export type WaiverFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Waiver
     */
    select?: WaiverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Waiver
     */
    omit?: WaiverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaiverInclude<ExtArgs> | null
    /**
     * Filter, which Waiver to fetch.
     */
    where?: WaiverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Waivers to fetch.
     */
    orderBy?: WaiverOrderByWithRelationInput | WaiverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Waivers.
     */
    cursor?: WaiverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Waivers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Waivers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Waivers.
     */
    distinct?: WaiverScalarFieldEnum | WaiverScalarFieldEnum[]
  }

  /**
   * Waiver findFirstOrThrow
   */
  export type WaiverFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Waiver
     */
    select?: WaiverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Waiver
     */
    omit?: WaiverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaiverInclude<ExtArgs> | null
    /**
     * Filter, which Waiver to fetch.
     */
    where?: WaiverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Waivers to fetch.
     */
    orderBy?: WaiverOrderByWithRelationInput | WaiverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Waivers.
     */
    cursor?: WaiverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Waivers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Waivers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Waivers.
     */
    distinct?: WaiverScalarFieldEnum | WaiverScalarFieldEnum[]
  }

  /**
   * Waiver findMany
   */
  export type WaiverFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Waiver
     */
    select?: WaiverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Waiver
     */
    omit?: WaiverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaiverInclude<ExtArgs> | null
    /**
     * Filter, which Waivers to fetch.
     */
    where?: WaiverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Waivers to fetch.
     */
    orderBy?: WaiverOrderByWithRelationInput | WaiverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Waivers.
     */
    cursor?: WaiverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Waivers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Waivers.
     */
    skip?: number
    distinct?: WaiverScalarFieldEnum | WaiverScalarFieldEnum[]
  }

  /**
   * Waiver create
   */
  export type WaiverCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Waiver
     */
    select?: WaiverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Waiver
     */
    omit?: WaiverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaiverInclude<ExtArgs> | null
    /**
     * The data needed to create a Waiver.
     */
    data: XOR<WaiverCreateInput, WaiverUncheckedCreateInput>
  }

  /**
   * Waiver createMany
   */
  export type WaiverCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Waivers.
     */
    data: WaiverCreateManyInput | WaiverCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Waiver createManyAndReturn
   */
  export type WaiverCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Waiver
     */
    select?: WaiverSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Waiver
     */
    omit?: WaiverOmit<ExtArgs> | null
    /**
     * The data used to create many Waivers.
     */
    data: WaiverCreateManyInput | WaiverCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaiverIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Waiver update
   */
  export type WaiverUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Waiver
     */
    select?: WaiverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Waiver
     */
    omit?: WaiverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaiverInclude<ExtArgs> | null
    /**
     * The data needed to update a Waiver.
     */
    data: XOR<WaiverUpdateInput, WaiverUncheckedUpdateInput>
    /**
     * Choose, which Waiver to update.
     */
    where: WaiverWhereUniqueInput
  }

  /**
   * Waiver updateMany
   */
  export type WaiverUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Waivers.
     */
    data: XOR<WaiverUpdateManyMutationInput, WaiverUncheckedUpdateManyInput>
    /**
     * Filter which Waivers to update
     */
    where?: WaiverWhereInput
    /**
     * Limit how many Waivers to update.
     */
    limit?: number
  }

  /**
   * Waiver updateManyAndReturn
   */
  export type WaiverUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Waiver
     */
    select?: WaiverSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Waiver
     */
    omit?: WaiverOmit<ExtArgs> | null
    /**
     * The data used to update Waivers.
     */
    data: XOR<WaiverUpdateManyMutationInput, WaiverUncheckedUpdateManyInput>
    /**
     * Filter which Waivers to update
     */
    where?: WaiverWhereInput
    /**
     * Limit how many Waivers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaiverIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Waiver upsert
   */
  export type WaiverUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Waiver
     */
    select?: WaiverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Waiver
     */
    omit?: WaiverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaiverInclude<ExtArgs> | null
    /**
     * The filter to search for the Waiver to update in case it exists.
     */
    where: WaiverWhereUniqueInput
    /**
     * In case the Waiver found by the `where` argument doesn't exist, create a new Waiver with this data.
     */
    create: XOR<WaiverCreateInput, WaiverUncheckedCreateInput>
    /**
     * In case the Waiver was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WaiverUpdateInput, WaiverUncheckedUpdateInput>
  }

  /**
   * Waiver delete
   */
  export type WaiverDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Waiver
     */
    select?: WaiverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Waiver
     */
    omit?: WaiverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaiverInclude<ExtArgs> | null
    /**
     * Filter which Waiver to delete.
     */
    where: WaiverWhereUniqueInput
  }

  /**
   * Waiver deleteMany
   */
  export type WaiverDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Waivers to delete
     */
    where?: WaiverWhereInput
    /**
     * Limit how many Waivers to delete.
     */
    limit?: number
  }

  /**
   * Waiver without action
   */
  export type WaiverDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Waiver
     */
    select?: WaiverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Waiver
     */
    omit?: WaiverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WaiverInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    createdAt: 'createdAt',
    image: 'image',
    updatedAt: 'updatedAt',
    onboarded: 'onboarded',
    clerkUserId: 'clerkUserId'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const BusinessScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    address: 'address',
    city: 'city',
    state: 'state',
    zipCode: 'zipCode',
    phone: 'phone',
    email: 'email',
    serviceArea: 'serviceArea',
    logo: 'logo',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    minAdvanceBooking: 'minAdvanceBooking',
    maxAdvanceBooking: 'maxAdvanceBooking',
    minimumPurchase: 'minimumPurchase',
    userId: 'userId',
    stripeAccountId: 'stripeAccountId',
    socialMedia: 'socialMedia',
    customDomain: 'customDomain',
    subdomain: 'subdomain',
    siteConfig: 'siteConfig',
    onboardingError: 'onboardingError'
  };

  export type BusinessScalarFieldEnum = (typeof BusinessScalarFieldEnum)[keyof typeof BusinessScalarFieldEnum]


  export const InventoryScalarFieldEnum: {
    id: 'id',
    type: 'type',
    name: 'name',
    description: 'description',
    dimensions: 'dimensions',
    capacity: 'capacity',
    price: 'price',
    setupTime: 'setupTime',
    teardownTime: 'teardownTime',
    images: 'images',
    primaryImage: 'primaryImage',
    status: 'status',
    minimumSpace: 'minimumSpace',
    weightLimit: 'weightLimit',
    ageRange: 'ageRange',
    weatherRestrictions: 'weatherRestrictions',
    businessId: 'businessId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    quantity: 'quantity'
  };

  export type InventoryScalarFieldEnum = (typeof InventoryScalarFieldEnum)[keyof typeof InventoryScalarFieldEnum]


  export const CustomerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    phone: 'phone',
    address: 'address',
    city: 'city',
    state: 'state',
    zipCode: 'zipCode',
    notes: 'notes',
    bookingCount: 'bookingCount',
    totalSpent: 'totalSpent',
    lastBooking: 'lastBooking',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    businessId: 'businessId',
    isLead: 'isLead',
    status: 'status',
    type: 'type'
  };

  export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum]


  export const BookingScalarFieldEnum: {
    id: 'id',
    eventDate: 'eventDate',
    startTime: 'startTime',
    endTime: 'endTime',
    status: 'status',
    totalAmount: 'totalAmount',
    depositAmount: 'depositAmount',
    depositPaid: 'depositPaid',
    eventType: 'eventType',
    eventAddress: 'eventAddress',
    eventCity: 'eventCity',
    eventState: 'eventState',
    eventZipCode: 'eventZipCode',
    participantAge: 'participantAge',
    participantCount: 'participantCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    businessId: 'businessId',
    customerId: 'customerId',
    isCompleted: 'isCompleted',
    isCancelled: 'isCancelled',
    specialInstructions: 'specialInstructions',
    subtotalAmount: 'subtotalAmount',
    taxAmount: 'taxAmount',
    taxRate: 'taxRate'
  };

  export type BookingScalarFieldEnum = (typeof BookingScalarFieldEnum)[keyof typeof BookingScalarFieldEnum]


  export const BookingItemScalarFieldEnum: {
    id: 'id',
    bookingId: 'bookingId',
    inventoryId: 'inventoryId',
    quantity: 'quantity',
    price: 'price'
  };

  export type BookingItemScalarFieldEnum = (typeof BookingItemScalarFieldEnum)[keyof typeof BookingItemScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
    id: 'id',
    amount: 'amount',
    type: 'type',
    status: 'status',
    createdAt: 'createdAt',
    bookingId: 'bookingId',
    businessId: 'businessId',
    currency: 'currency',
    metadata: 'metadata',
    paidAt: 'paidAt',
    refundAmount: 'refundAmount',
    refundReason: 'refundReason',
    stripeClientSecret: 'stripeClientSecret',
    stripePaymentId: 'stripePaymentId',
    updatedAt: 'updatedAt'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const CouponScalarFieldEnum: {
    id: 'id',
    code: 'code',
    description: 'description',
    discountType: 'discountType',
    discountAmount: 'discountAmount',
    maxUses: 'maxUses',
    usedCount: 'usedCount',
    startDate: 'startDate',
    endDate: 'endDate',
    isActive: 'isActive',
    minimumAmount: 'minimumAmount',
    businessId: 'businessId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CouponScalarFieldEnum = (typeof CouponScalarFieldEnum)[keyof typeof CouponScalarFieldEnum]


  export const SalesFunnelScalarFieldEnum: {
    id: 'id',
    name: 'name',
    isActive: 'isActive',
    popupTitle: 'popupTitle',
    popupText: 'popupText',
    popupImage: 'popupImage',
    formTitle: 'formTitle',
    thankYouMessage: 'thankYouMessage',
    couponId: 'couponId',
    businessId: 'businessId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SalesFunnelScalarFieldEnum = (typeof SalesFunnelScalarFieldEnum)[keyof typeof SalesFunnelScalarFieldEnum]


  export const WaiverScalarFieldEnum: {
    id: 'id',
    businessId: 'businessId',
    customerId: 'customerId',
    bookingId: 'bookingId',
    status: 'status',
    templateVersion: 'templateVersion',
    documentUrl: 'documentUrl',
    openSignDocumentId: 'openSignDocumentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WaiverScalarFieldEnum = (typeof WaiverScalarFieldEnum)[keyof typeof WaiverScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'InventoryType'
   */
  export type EnumInventoryTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InventoryType'>
    


  /**
   * Reference to a field of type 'InventoryType[]'
   */
  export type ListEnumInventoryTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InventoryType[]'>
    


  /**
   * Reference to a field of type 'InventoryStatus'
   */
  export type EnumInventoryStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InventoryStatus'>
    


  /**
   * Reference to a field of type 'InventoryStatus[]'
   */
  export type ListEnumInventoryStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InventoryStatus[]'>
    


  /**
   * Reference to a field of type 'BookingStatus'
   */
  export type EnumBookingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingStatus'>
    


  /**
   * Reference to a field of type 'BookingStatus[]'
   */
  export type ListEnumBookingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingStatus[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'PaymentType'
   */
  export type EnumPaymentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentType'>
    


  /**
   * Reference to a field of type 'PaymentType[]'
   */
  export type ListEnumPaymentTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentType[]'>
    


  /**
   * Reference to a field of type 'PaymentStatus'
   */
  export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus'>
    


  /**
   * Reference to a field of type 'PaymentStatus[]'
   */
  export type ListEnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentStatus[]'>
    


  /**
   * Reference to a field of type 'DiscountType'
   */
  export type EnumDiscountTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DiscountType'>
    


  /**
   * Reference to a field of type 'DiscountType[]'
   */
  export type ListEnumDiscountTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DiscountType[]'>
    


  /**
   * Reference to a field of type 'WaiverStatus'
   */
  export type EnumWaiverStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WaiverStatus'>
    


  /**
   * Reference to a field of type 'WaiverStatus[]'
   */
  export type ListEnumWaiverStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WaiverStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    name?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    image?: StringNullableFilter<"User"> | string | null
    updatedAt?: DateTimeFilter<"User"> | Date | string
    onboarded?: BoolFilter<"User"> | boolean
    clerkUserId?: StringNullableFilter<"User"> | string | null
    businesses?: BusinessListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    image?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    onboarded?: SortOrder
    clerkUserId?: SortOrderInput | SortOrder
    businesses?: BusinessOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    clerkUserId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    image?: StringNullableFilter<"User"> | string | null
    updatedAt?: DateTimeFilter<"User"> | Date | string
    onboarded?: BoolFilter<"User"> | boolean
    businesses?: BusinessListRelationFilter
  }, "id" | "email" | "clerkUserId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    image?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    onboarded?: SortOrder
    clerkUserId?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    onboarded?: BoolWithAggregatesFilter<"User"> | boolean
    clerkUserId?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type BusinessWhereInput = {
    AND?: BusinessWhereInput | BusinessWhereInput[]
    OR?: BusinessWhereInput[]
    NOT?: BusinessWhereInput | BusinessWhereInput[]
    id?: StringFilter<"Business"> | string
    name?: StringFilter<"Business"> | string
    description?: StringNullableFilter<"Business"> | string | null
    address?: StringNullableFilter<"Business"> | string | null
    city?: StringNullableFilter<"Business"> | string | null
    state?: StringNullableFilter<"Business"> | string | null
    zipCode?: StringNullableFilter<"Business"> | string | null
    phone?: StringNullableFilter<"Business"> | string | null
    email?: StringNullableFilter<"Business"> | string | null
    serviceArea?: StringNullableListFilter<"Business">
    logo?: StringNullableFilter<"Business"> | string | null
    createdAt?: DateTimeFilter<"Business"> | Date | string
    updatedAt?: DateTimeFilter<"Business"> | Date | string
    minAdvanceBooking?: IntFilter<"Business"> | number
    maxAdvanceBooking?: IntFilter<"Business"> | number
    minimumPurchase?: FloatFilter<"Business"> | number
    userId?: StringFilter<"Business"> | string
    stripeAccountId?: StringNullableFilter<"Business"> | string | null
    socialMedia?: JsonNullableFilter<"Business">
    customDomain?: StringNullableFilter<"Business"> | string | null
    subdomain?: StringNullableFilter<"Business"> | string | null
    siteConfig?: JsonNullableFilter<"Business">
    onboardingError?: StringNullableFilter<"Business"> | string | null
    bookings?: BookingListRelationFilter
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    customers?: CustomerListRelationFilter
    inventory?: InventoryListRelationFilter
    payments?: PaymentListRelationFilter
    coupons?: CouponListRelationFilter
    salesFunnels?: SalesFunnelListRelationFilter
    waivers?: WaiverListRelationFilter
  }

  export type BusinessOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    zipCode?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    serviceArea?: SortOrder
    logo?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    minAdvanceBooking?: SortOrder
    maxAdvanceBooking?: SortOrder
    minimumPurchase?: SortOrder
    userId?: SortOrder
    stripeAccountId?: SortOrderInput | SortOrder
    socialMedia?: SortOrderInput | SortOrder
    customDomain?: SortOrderInput | SortOrder
    subdomain?: SortOrderInput | SortOrder
    siteConfig?: SortOrderInput | SortOrder
    onboardingError?: SortOrderInput | SortOrder
    bookings?: BookingOrderByRelationAggregateInput
    user?: UserOrderByWithRelationInput
    customers?: CustomerOrderByRelationAggregateInput
    inventory?: InventoryOrderByRelationAggregateInput
    payments?: PaymentOrderByRelationAggregateInput
    coupons?: CouponOrderByRelationAggregateInput
    salesFunnels?: SalesFunnelOrderByRelationAggregateInput
    waivers?: WaiverOrderByRelationAggregateInput
  }

  export type BusinessWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    subdomain?: string
    AND?: BusinessWhereInput | BusinessWhereInput[]
    OR?: BusinessWhereInput[]
    NOT?: BusinessWhereInput | BusinessWhereInput[]
    name?: StringFilter<"Business"> | string
    description?: StringNullableFilter<"Business"> | string | null
    address?: StringNullableFilter<"Business"> | string | null
    city?: StringNullableFilter<"Business"> | string | null
    state?: StringNullableFilter<"Business"> | string | null
    zipCode?: StringNullableFilter<"Business"> | string | null
    phone?: StringNullableFilter<"Business"> | string | null
    email?: StringNullableFilter<"Business"> | string | null
    serviceArea?: StringNullableListFilter<"Business">
    logo?: StringNullableFilter<"Business"> | string | null
    createdAt?: DateTimeFilter<"Business"> | Date | string
    updatedAt?: DateTimeFilter<"Business"> | Date | string
    minAdvanceBooking?: IntFilter<"Business"> | number
    maxAdvanceBooking?: IntFilter<"Business"> | number
    minimumPurchase?: FloatFilter<"Business"> | number
    userId?: StringFilter<"Business"> | string
    stripeAccountId?: StringNullableFilter<"Business"> | string | null
    socialMedia?: JsonNullableFilter<"Business">
    customDomain?: StringNullableFilter<"Business"> | string | null
    siteConfig?: JsonNullableFilter<"Business">
    onboardingError?: StringNullableFilter<"Business"> | string | null
    bookings?: BookingListRelationFilter
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    customers?: CustomerListRelationFilter
    inventory?: InventoryListRelationFilter
    payments?: PaymentListRelationFilter
    coupons?: CouponListRelationFilter
    salesFunnels?: SalesFunnelListRelationFilter
    waivers?: WaiverListRelationFilter
  }, "id" | "subdomain">

  export type BusinessOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    zipCode?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    serviceArea?: SortOrder
    logo?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    minAdvanceBooking?: SortOrder
    maxAdvanceBooking?: SortOrder
    minimumPurchase?: SortOrder
    userId?: SortOrder
    stripeAccountId?: SortOrderInput | SortOrder
    socialMedia?: SortOrderInput | SortOrder
    customDomain?: SortOrderInput | SortOrder
    subdomain?: SortOrderInput | SortOrder
    siteConfig?: SortOrderInput | SortOrder
    onboardingError?: SortOrderInput | SortOrder
    _count?: BusinessCountOrderByAggregateInput
    _avg?: BusinessAvgOrderByAggregateInput
    _max?: BusinessMaxOrderByAggregateInput
    _min?: BusinessMinOrderByAggregateInput
    _sum?: BusinessSumOrderByAggregateInput
  }

  export type BusinessScalarWhereWithAggregatesInput = {
    AND?: BusinessScalarWhereWithAggregatesInput | BusinessScalarWhereWithAggregatesInput[]
    OR?: BusinessScalarWhereWithAggregatesInput[]
    NOT?: BusinessScalarWhereWithAggregatesInput | BusinessScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Business"> | string
    name?: StringWithAggregatesFilter<"Business"> | string
    description?: StringNullableWithAggregatesFilter<"Business"> | string | null
    address?: StringNullableWithAggregatesFilter<"Business"> | string | null
    city?: StringNullableWithAggregatesFilter<"Business"> | string | null
    state?: StringNullableWithAggregatesFilter<"Business"> | string | null
    zipCode?: StringNullableWithAggregatesFilter<"Business"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Business"> | string | null
    email?: StringNullableWithAggregatesFilter<"Business"> | string | null
    serviceArea?: StringNullableListFilter<"Business">
    logo?: StringNullableWithAggregatesFilter<"Business"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Business"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Business"> | Date | string
    minAdvanceBooking?: IntWithAggregatesFilter<"Business"> | number
    maxAdvanceBooking?: IntWithAggregatesFilter<"Business"> | number
    minimumPurchase?: FloatWithAggregatesFilter<"Business"> | number
    userId?: StringWithAggregatesFilter<"Business"> | string
    stripeAccountId?: StringNullableWithAggregatesFilter<"Business"> | string | null
    socialMedia?: JsonNullableWithAggregatesFilter<"Business">
    customDomain?: StringNullableWithAggregatesFilter<"Business"> | string | null
    subdomain?: StringNullableWithAggregatesFilter<"Business"> | string | null
    siteConfig?: JsonNullableWithAggregatesFilter<"Business">
    onboardingError?: StringNullableWithAggregatesFilter<"Business"> | string | null
  }

  export type InventoryWhereInput = {
    AND?: InventoryWhereInput | InventoryWhereInput[]
    OR?: InventoryWhereInput[]
    NOT?: InventoryWhereInput | InventoryWhereInput[]
    id?: StringFilter<"Inventory"> | string
    type?: EnumInventoryTypeFilter<"Inventory"> | $Enums.InventoryType
    name?: StringFilter<"Inventory"> | string
    description?: StringNullableFilter<"Inventory"> | string | null
    dimensions?: StringFilter<"Inventory"> | string
    capacity?: IntFilter<"Inventory"> | number
    price?: FloatFilter<"Inventory"> | number
    setupTime?: IntFilter<"Inventory"> | number
    teardownTime?: IntFilter<"Inventory"> | number
    images?: StringNullableListFilter<"Inventory">
    primaryImage?: StringNullableFilter<"Inventory"> | string | null
    status?: EnumInventoryStatusFilter<"Inventory"> | $Enums.InventoryStatus
    minimumSpace?: StringFilter<"Inventory"> | string
    weightLimit?: IntFilter<"Inventory"> | number
    ageRange?: StringFilter<"Inventory"> | string
    weatherRestrictions?: StringNullableListFilter<"Inventory">
    businessId?: StringFilter<"Inventory"> | string
    createdAt?: DateTimeFilter<"Inventory"> | Date | string
    updatedAt?: DateTimeFilter<"Inventory"> | Date | string
    quantity?: IntFilter<"Inventory"> | number
    bookingItems?: BookingItemListRelationFilter
    business?: XOR<BusinessScalarRelationFilter, BusinessWhereInput>
  }

  export type InventoryOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    dimensions?: SortOrder
    capacity?: SortOrder
    price?: SortOrder
    setupTime?: SortOrder
    teardownTime?: SortOrder
    images?: SortOrder
    primaryImage?: SortOrderInput | SortOrder
    status?: SortOrder
    minimumSpace?: SortOrder
    weightLimit?: SortOrder
    ageRange?: SortOrder
    weatherRestrictions?: SortOrder
    businessId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    quantity?: SortOrder
    bookingItems?: BookingItemOrderByRelationAggregateInput
    business?: BusinessOrderByWithRelationInput
  }

  export type InventoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InventoryWhereInput | InventoryWhereInput[]
    OR?: InventoryWhereInput[]
    NOT?: InventoryWhereInput | InventoryWhereInput[]
    type?: EnumInventoryTypeFilter<"Inventory"> | $Enums.InventoryType
    name?: StringFilter<"Inventory"> | string
    description?: StringNullableFilter<"Inventory"> | string | null
    dimensions?: StringFilter<"Inventory"> | string
    capacity?: IntFilter<"Inventory"> | number
    price?: FloatFilter<"Inventory"> | number
    setupTime?: IntFilter<"Inventory"> | number
    teardownTime?: IntFilter<"Inventory"> | number
    images?: StringNullableListFilter<"Inventory">
    primaryImage?: StringNullableFilter<"Inventory"> | string | null
    status?: EnumInventoryStatusFilter<"Inventory"> | $Enums.InventoryStatus
    minimumSpace?: StringFilter<"Inventory"> | string
    weightLimit?: IntFilter<"Inventory"> | number
    ageRange?: StringFilter<"Inventory"> | string
    weatherRestrictions?: StringNullableListFilter<"Inventory">
    businessId?: StringFilter<"Inventory"> | string
    createdAt?: DateTimeFilter<"Inventory"> | Date | string
    updatedAt?: DateTimeFilter<"Inventory"> | Date | string
    quantity?: IntFilter<"Inventory"> | number
    bookingItems?: BookingItemListRelationFilter
    business?: XOR<BusinessScalarRelationFilter, BusinessWhereInput>
  }, "id">

  export type InventoryOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    dimensions?: SortOrder
    capacity?: SortOrder
    price?: SortOrder
    setupTime?: SortOrder
    teardownTime?: SortOrder
    images?: SortOrder
    primaryImage?: SortOrderInput | SortOrder
    status?: SortOrder
    minimumSpace?: SortOrder
    weightLimit?: SortOrder
    ageRange?: SortOrder
    weatherRestrictions?: SortOrder
    businessId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    quantity?: SortOrder
    _count?: InventoryCountOrderByAggregateInput
    _avg?: InventoryAvgOrderByAggregateInput
    _max?: InventoryMaxOrderByAggregateInput
    _min?: InventoryMinOrderByAggregateInput
    _sum?: InventorySumOrderByAggregateInput
  }

  export type InventoryScalarWhereWithAggregatesInput = {
    AND?: InventoryScalarWhereWithAggregatesInput | InventoryScalarWhereWithAggregatesInput[]
    OR?: InventoryScalarWhereWithAggregatesInput[]
    NOT?: InventoryScalarWhereWithAggregatesInput | InventoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Inventory"> | string
    type?: EnumInventoryTypeWithAggregatesFilter<"Inventory"> | $Enums.InventoryType
    name?: StringWithAggregatesFilter<"Inventory"> | string
    description?: StringNullableWithAggregatesFilter<"Inventory"> | string | null
    dimensions?: StringWithAggregatesFilter<"Inventory"> | string
    capacity?: IntWithAggregatesFilter<"Inventory"> | number
    price?: FloatWithAggregatesFilter<"Inventory"> | number
    setupTime?: IntWithAggregatesFilter<"Inventory"> | number
    teardownTime?: IntWithAggregatesFilter<"Inventory"> | number
    images?: StringNullableListFilter<"Inventory">
    primaryImage?: StringNullableWithAggregatesFilter<"Inventory"> | string | null
    status?: EnumInventoryStatusWithAggregatesFilter<"Inventory"> | $Enums.InventoryStatus
    minimumSpace?: StringWithAggregatesFilter<"Inventory"> | string
    weightLimit?: IntWithAggregatesFilter<"Inventory"> | number
    ageRange?: StringWithAggregatesFilter<"Inventory"> | string
    weatherRestrictions?: StringNullableListFilter<"Inventory">
    businessId?: StringWithAggregatesFilter<"Inventory"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Inventory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Inventory"> | Date | string
    quantity?: IntWithAggregatesFilter<"Inventory"> | number
  }

  export type CustomerWhereInput = {
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    id?: StringFilter<"Customer"> | string
    name?: StringFilter<"Customer"> | string
    email?: StringFilter<"Customer"> | string
    phone?: StringFilter<"Customer"> | string
    address?: StringNullableFilter<"Customer"> | string | null
    city?: StringNullableFilter<"Customer"> | string | null
    state?: StringNullableFilter<"Customer"> | string | null
    zipCode?: StringNullableFilter<"Customer"> | string | null
    notes?: StringNullableFilter<"Customer"> | string | null
    bookingCount?: IntFilter<"Customer"> | number
    totalSpent?: FloatFilter<"Customer"> | number
    lastBooking?: DateTimeNullableFilter<"Customer"> | Date | string | null
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    businessId?: StringFilter<"Customer"> | string
    isLead?: BoolFilter<"Customer"> | boolean
    status?: StringFilter<"Customer"> | string
    type?: StringFilter<"Customer"> | string
    bookings?: BookingListRelationFilter
    waivers?: WaiverListRelationFilter
    business?: XOR<BusinessScalarRelationFilter, BusinessWhereInput>
  }

  export type CustomerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    zipCode?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    bookingCount?: SortOrder
    totalSpent?: SortOrder
    lastBooking?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    isLead?: SortOrder
    status?: SortOrder
    type?: SortOrder
    bookings?: BookingOrderByRelationAggregateInput
    waivers?: WaiverOrderByRelationAggregateInput
    business?: BusinessOrderByWithRelationInput
  }

  export type CustomerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email_businessId?: CustomerEmailBusinessIdCompoundUniqueInput
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    name?: StringFilter<"Customer"> | string
    email?: StringFilter<"Customer"> | string
    phone?: StringFilter<"Customer"> | string
    address?: StringNullableFilter<"Customer"> | string | null
    city?: StringNullableFilter<"Customer"> | string | null
    state?: StringNullableFilter<"Customer"> | string | null
    zipCode?: StringNullableFilter<"Customer"> | string | null
    notes?: StringNullableFilter<"Customer"> | string | null
    bookingCount?: IntFilter<"Customer"> | number
    totalSpent?: FloatFilter<"Customer"> | number
    lastBooking?: DateTimeNullableFilter<"Customer"> | Date | string | null
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    businessId?: StringFilter<"Customer"> | string
    isLead?: BoolFilter<"Customer"> | boolean
    status?: StringFilter<"Customer"> | string
    type?: StringFilter<"Customer"> | string
    bookings?: BookingListRelationFilter
    waivers?: WaiverListRelationFilter
    business?: XOR<BusinessScalarRelationFilter, BusinessWhereInput>
  }, "id" | "email_businessId">

  export type CustomerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    zipCode?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    bookingCount?: SortOrder
    totalSpent?: SortOrder
    lastBooking?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    isLead?: SortOrder
    status?: SortOrder
    type?: SortOrder
    _count?: CustomerCountOrderByAggregateInput
    _avg?: CustomerAvgOrderByAggregateInput
    _max?: CustomerMaxOrderByAggregateInput
    _min?: CustomerMinOrderByAggregateInput
    _sum?: CustomerSumOrderByAggregateInput
  }

  export type CustomerScalarWhereWithAggregatesInput = {
    AND?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    OR?: CustomerScalarWhereWithAggregatesInput[]
    NOT?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Customer"> | string
    name?: StringWithAggregatesFilter<"Customer"> | string
    email?: StringWithAggregatesFilter<"Customer"> | string
    phone?: StringWithAggregatesFilter<"Customer"> | string
    address?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    city?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    state?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    zipCode?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    bookingCount?: IntWithAggregatesFilter<"Customer"> | number
    totalSpent?: FloatWithAggregatesFilter<"Customer"> | number
    lastBooking?: DateTimeNullableWithAggregatesFilter<"Customer"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
    businessId?: StringWithAggregatesFilter<"Customer"> | string
    isLead?: BoolWithAggregatesFilter<"Customer"> | boolean
    status?: StringWithAggregatesFilter<"Customer"> | string
    type?: StringWithAggregatesFilter<"Customer"> | string
  }

  export type BookingWhereInput = {
    AND?: BookingWhereInput | BookingWhereInput[]
    OR?: BookingWhereInput[]
    NOT?: BookingWhereInput | BookingWhereInput[]
    id?: StringFilter<"Booking"> | string
    eventDate?: DateTimeFilter<"Booking"> | Date | string
    startTime?: DateTimeFilter<"Booking"> | Date | string
    endTime?: DateTimeFilter<"Booking"> | Date | string
    status?: EnumBookingStatusFilter<"Booking"> | $Enums.BookingStatus
    totalAmount?: FloatFilter<"Booking"> | number
    depositAmount?: FloatNullableFilter<"Booking"> | number | null
    depositPaid?: BoolFilter<"Booking"> | boolean
    eventType?: StringNullableFilter<"Booking"> | string | null
    eventAddress?: StringFilter<"Booking"> | string
    eventCity?: StringFilter<"Booking"> | string
    eventState?: StringFilter<"Booking"> | string
    eventZipCode?: StringFilter<"Booking"> | string
    participantAge?: IntNullableFilter<"Booking"> | number | null
    participantCount?: IntFilter<"Booking"> | number
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    businessId?: StringFilter<"Booking"> | string
    customerId?: StringFilter<"Booking"> | string
    isCompleted?: BoolFilter<"Booking"> | boolean
    isCancelled?: BoolFilter<"Booking"> | boolean
    specialInstructions?: StringNullableFilter<"Booking"> | string | null
    subtotalAmount?: FloatFilter<"Booking"> | number
    taxAmount?: FloatFilter<"Booking"> | number
    taxRate?: FloatFilter<"Booking"> | number
    business?: XOR<BusinessScalarRelationFilter, BusinessWhereInput>
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
    inventoryItems?: BookingItemListRelationFilter
    payments?: PaymentListRelationFilter
    waivers?: WaiverListRelationFilter
  }

  export type BookingOrderByWithRelationInput = {
    id?: SortOrder
    eventDate?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    totalAmount?: SortOrder
    depositAmount?: SortOrderInput | SortOrder
    depositPaid?: SortOrder
    eventType?: SortOrderInput | SortOrder
    eventAddress?: SortOrder
    eventCity?: SortOrder
    eventState?: SortOrder
    eventZipCode?: SortOrder
    participantAge?: SortOrderInput | SortOrder
    participantCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    customerId?: SortOrder
    isCompleted?: SortOrder
    isCancelled?: SortOrder
    specialInstructions?: SortOrderInput | SortOrder
    subtotalAmount?: SortOrder
    taxAmount?: SortOrder
    taxRate?: SortOrder
    business?: BusinessOrderByWithRelationInput
    customer?: CustomerOrderByWithRelationInput
    inventoryItems?: BookingItemOrderByRelationAggregateInput
    payments?: PaymentOrderByRelationAggregateInput
    waivers?: WaiverOrderByRelationAggregateInput
  }

  export type BookingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BookingWhereInput | BookingWhereInput[]
    OR?: BookingWhereInput[]
    NOT?: BookingWhereInput | BookingWhereInput[]
    eventDate?: DateTimeFilter<"Booking"> | Date | string
    startTime?: DateTimeFilter<"Booking"> | Date | string
    endTime?: DateTimeFilter<"Booking"> | Date | string
    status?: EnumBookingStatusFilter<"Booking"> | $Enums.BookingStatus
    totalAmount?: FloatFilter<"Booking"> | number
    depositAmount?: FloatNullableFilter<"Booking"> | number | null
    depositPaid?: BoolFilter<"Booking"> | boolean
    eventType?: StringNullableFilter<"Booking"> | string | null
    eventAddress?: StringFilter<"Booking"> | string
    eventCity?: StringFilter<"Booking"> | string
    eventState?: StringFilter<"Booking"> | string
    eventZipCode?: StringFilter<"Booking"> | string
    participantAge?: IntNullableFilter<"Booking"> | number | null
    participantCount?: IntFilter<"Booking"> | number
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    businessId?: StringFilter<"Booking"> | string
    customerId?: StringFilter<"Booking"> | string
    isCompleted?: BoolFilter<"Booking"> | boolean
    isCancelled?: BoolFilter<"Booking"> | boolean
    specialInstructions?: StringNullableFilter<"Booking"> | string | null
    subtotalAmount?: FloatFilter<"Booking"> | number
    taxAmount?: FloatFilter<"Booking"> | number
    taxRate?: FloatFilter<"Booking"> | number
    business?: XOR<BusinessScalarRelationFilter, BusinessWhereInput>
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
    inventoryItems?: BookingItemListRelationFilter
    payments?: PaymentListRelationFilter
    waivers?: WaiverListRelationFilter
  }, "id">

  export type BookingOrderByWithAggregationInput = {
    id?: SortOrder
    eventDate?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    totalAmount?: SortOrder
    depositAmount?: SortOrderInput | SortOrder
    depositPaid?: SortOrder
    eventType?: SortOrderInput | SortOrder
    eventAddress?: SortOrder
    eventCity?: SortOrder
    eventState?: SortOrder
    eventZipCode?: SortOrder
    participantAge?: SortOrderInput | SortOrder
    participantCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    customerId?: SortOrder
    isCompleted?: SortOrder
    isCancelled?: SortOrder
    specialInstructions?: SortOrderInput | SortOrder
    subtotalAmount?: SortOrder
    taxAmount?: SortOrder
    taxRate?: SortOrder
    _count?: BookingCountOrderByAggregateInput
    _avg?: BookingAvgOrderByAggregateInput
    _max?: BookingMaxOrderByAggregateInput
    _min?: BookingMinOrderByAggregateInput
    _sum?: BookingSumOrderByAggregateInput
  }

  export type BookingScalarWhereWithAggregatesInput = {
    AND?: BookingScalarWhereWithAggregatesInput | BookingScalarWhereWithAggregatesInput[]
    OR?: BookingScalarWhereWithAggregatesInput[]
    NOT?: BookingScalarWhereWithAggregatesInput | BookingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Booking"> | string
    eventDate?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    startTime?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    endTime?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    status?: EnumBookingStatusWithAggregatesFilter<"Booking"> | $Enums.BookingStatus
    totalAmount?: FloatWithAggregatesFilter<"Booking"> | number
    depositAmount?: FloatNullableWithAggregatesFilter<"Booking"> | number | null
    depositPaid?: BoolWithAggregatesFilter<"Booking"> | boolean
    eventType?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    eventAddress?: StringWithAggregatesFilter<"Booking"> | string
    eventCity?: StringWithAggregatesFilter<"Booking"> | string
    eventState?: StringWithAggregatesFilter<"Booking"> | string
    eventZipCode?: StringWithAggregatesFilter<"Booking"> | string
    participantAge?: IntNullableWithAggregatesFilter<"Booking"> | number | null
    participantCount?: IntWithAggregatesFilter<"Booking"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    businessId?: StringWithAggregatesFilter<"Booking"> | string
    customerId?: StringWithAggregatesFilter<"Booking"> | string
    isCompleted?: BoolWithAggregatesFilter<"Booking"> | boolean
    isCancelled?: BoolWithAggregatesFilter<"Booking"> | boolean
    specialInstructions?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    subtotalAmount?: FloatWithAggregatesFilter<"Booking"> | number
    taxAmount?: FloatWithAggregatesFilter<"Booking"> | number
    taxRate?: FloatWithAggregatesFilter<"Booking"> | number
  }

  export type BookingItemWhereInput = {
    AND?: BookingItemWhereInput | BookingItemWhereInput[]
    OR?: BookingItemWhereInput[]
    NOT?: BookingItemWhereInput | BookingItemWhereInput[]
    id?: StringFilter<"BookingItem"> | string
    bookingId?: StringFilter<"BookingItem"> | string
    inventoryId?: StringFilter<"BookingItem"> | string
    quantity?: IntFilter<"BookingItem"> | number
    price?: FloatFilter<"BookingItem"> | number
    booking?: XOR<BookingScalarRelationFilter, BookingWhereInput>
    inventory?: XOR<InventoryScalarRelationFilter, InventoryWhereInput>
  }

  export type BookingItemOrderByWithRelationInput = {
    id?: SortOrder
    bookingId?: SortOrder
    inventoryId?: SortOrder
    quantity?: SortOrder
    price?: SortOrder
    booking?: BookingOrderByWithRelationInput
    inventory?: InventoryOrderByWithRelationInput
  }

  export type BookingItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BookingItemWhereInput | BookingItemWhereInput[]
    OR?: BookingItemWhereInput[]
    NOT?: BookingItemWhereInput | BookingItemWhereInput[]
    bookingId?: StringFilter<"BookingItem"> | string
    inventoryId?: StringFilter<"BookingItem"> | string
    quantity?: IntFilter<"BookingItem"> | number
    price?: FloatFilter<"BookingItem"> | number
    booking?: XOR<BookingScalarRelationFilter, BookingWhereInput>
    inventory?: XOR<InventoryScalarRelationFilter, InventoryWhereInput>
  }, "id">

  export type BookingItemOrderByWithAggregationInput = {
    id?: SortOrder
    bookingId?: SortOrder
    inventoryId?: SortOrder
    quantity?: SortOrder
    price?: SortOrder
    _count?: BookingItemCountOrderByAggregateInput
    _avg?: BookingItemAvgOrderByAggregateInput
    _max?: BookingItemMaxOrderByAggregateInput
    _min?: BookingItemMinOrderByAggregateInput
    _sum?: BookingItemSumOrderByAggregateInput
  }

  export type BookingItemScalarWhereWithAggregatesInput = {
    AND?: BookingItemScalarWhereWithAggregatesInput | BookingItemScalarWhereWithAggregatesInput[]
    OR?: BookingItemScalarWhereWithAggregatesInput[]
    NOT?: BookingItemScalarWhereWithAggregatesInput | BookingItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BookingItem"> | string
    bookingId?: StringWithAggregatesFilter<"BookingItem"> | string
    inventoryId?: StringWithAggregatesFilter<"BookingItem"> | string
    quantity?: IntWithAggregatesFilter<"BookingItem"> | number
    price?: FloatWithAggregatesFilter<"BookingItem"> | number
  }

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: StringFilter<"Payment"> | string
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    type?: EnumPaymentTypeFilter<"Payment"> | $Enums.PaymentType
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    bookingId?: StringFilter<"Payment"> | string
    businessId?: StringFilter<"Payment"> | string
    currency?: StringFilter<"Payment"> | string
    metadata?: JsonNullableFilter<"Payment">
    paidAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    refundAmount?: DecimalNullableFilter<"Payment"> | Decimal | DecimalJsLike | number | string | null
    refundReason?: StringNullableFilter<"Payment"> | string | null
    stripeClientSecret?: StringNullableFilter<"Payment"> | string | null
    stripePaymentId?: StringNullableFilter<"Payment"> | string | null
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
    booking?: XOR<BookingScalarRelationFilter, BookingWhereInput>
    business?: XOR<BusinessScalarRelationFilter, BusinessWhereInput>
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    amount?: SortOrder
    type?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    bookingId?: SortOrder
    businessId?: SortOrder
    currency?: SortOrder
    metadata?: SortOrderInput | SortOrder
    paidAt?: SortOrderInput | SortOrder
    refundAmount?: SortOrderInput | SortOrder
    refundReason?: SortOrderInput | SortOrder
    stripeClientSecret?: SortOrderInput | SortOrder
    stripePaymentId?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    booking?: BookingOrderByWithRelationInput
    business?: BusinessOrderByWithRelationInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    type?: EnumPaymentTypeFilter<"Payment"> | $Enums.PaymentType
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    bookingId?: StringFilter<"Payment"> | string
    businessId?: StringFilter<"Payment"> | string
    currency?: StringFilter<"Payment"> | string
    metadata?: JsonNullableFilter<"Payment">
    paidAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    refundAmount?: DecimalNullableFilter<"Payment"> | Decimal | DecimalJsLike | number | string | null
    refundReason?: StringNullableFilter<"Payment"> | string | null
    stripeClientSecret?: StringNullableFilter<"Payment"> | string | null
    stripePaymentId?: StringNullableFilter<"Payment"> | string | null
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
    booking?: XOR<BookingScalarRelationFilter, BookingWhereInput>
    business?: XOR<BusinessScalarRelationFilter, BusinessWhereInput>
  }, "id">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    amount?: SortOrder
    type?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    bookingId?: SortOrder
    businessId?: SortOrder
    currency?: SortOrder
    metadata?: SortOrderInput | SortOrder
    paidAt?: SortOrderInput | SortOrder
    refundAmount?: SortOrderInput | SortOrder
    refundReason?: SortOrderInput | SortOrder
    stripeClientSecret?: SortOrderInput | SortOrder
    stripePaymentId?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Payment"> | string
    amount?: DecimalWithAggregatesFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    type?: EnumPaymentTypeWithAggregatesFilter<"Payment"> | $Enums.PaymentType
    status?: EnumPaymentStatusWithAggregatesFilter<"Payment"> | $Enums.PaymentStatus
    createdAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    bookingId?: StringWithAggregatesFilter<"Payment"> | string
    businessId?: StringWithAggregatesFilter<"Payment"> | string
    currency?: StringWithAggregatesFilter<"Payment"> | string
    metadata?: JsonNullableWithAggregatesFilter<"Payment">
    paidAt?: DateTimeNullableWithAggregatesFilter<"Payment"> | Date | string | null
    refundAmount?: DecimalNullableWithAggregatesFilter<"Payment"> | Decimal | DecimalJsLike | number | string | null
    refundReason?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    stripeClientSecret?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    stripePaymentId?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
  }

  export type CouponWhereInput = {
    AND?: CouponWhereInput | CouponWhereInput[]
    OR?: CouponWhereInput[]
    NOT?: CouponWhereInput | CouponWhereInput[]
    id?: StringFilter<"Coupon"> | string
    code?: StringFilter<"Coupon"> | string
    description?: StringNullableFilter<"Coupon"> | string | null
    discountType?: EnumDiscountTypeFilter<"Coupon"> | $Enums.DiscountType
    discountAmount?: FloatFilter<"Coupon"> | number
    maxUses?: IntNullableFilter<"Coupon"> | number | null
    usedCount?: IntFilter<"Coupon"> | number
    startDate?: DateTimeNullableFilter<"Coupon"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Coupon"> | Date | string | null
    isActive?: BoolFilter<"Coupon"> | boolean
    minimumAmount?: FloatNullableFilter<"Coupon"> | number | null
    businessId?: StringFilter<"Coupon"> | string
    createdAt?: DateTimeFilter<"Coupon"> | Date | string
    updatedAt?: DateTimeFilter<"Coupon"> | Date | string
    business?: XOR<BusinessScalarRelationFilter, BusinessWhereInput>
  }

  export type CouponOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    description?: SortOrderInput | SortOrder
    discountType?: SortOrder
    discountAmount?: SortOrder
    maxUses?: SortOrderInput | SortOrder
    usedCount?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    isActive?: SortOrder
    minimumAmount?: SortOrderInput | SortOrder
    businessId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    business?: BusinessOrderByWithRelationInput
  }

  export type CouponWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code_businessId?: CouponCodeBusinessIdCompoundUniqueInput
    AND?: CouponWhereInput | CouponWhereInput[]
    OR?: CouponWhereInput[]
    NOT?: CouponWhereInput | CouponWhereInput[]
    code?: StringFilter<"Coupon"> | string
    description?: StringNullableFilter<"Coupon"> | string | null
    discountType?: EnumDiscountTypeFilter<"Coupon"> | $Enums.DiscountType
    discountAmount?: FloatFilter<"Coupon"> | number
    maxUses?: IntNullableFilter<"Coupon"> | number | null
    usedCount?: IntFilter<"Coupon"> | number
    startDate?: DateTimeNullableFilter<"Coupon"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Coupon"> | Date | string | null
    isActive?: BoolFilter<"Coupon"> | boolean
    minimumAmount?: FloatNullableFilter<"Coupon"> | number | null
    businessId?: StringFilter<"Coupon"> | string
    createdAt?: DateTimeFilter<"Coupon"> | Date | string
    updatedAt?: DateTimeFilter<"Coupon"> | Date | string
    business?: XOR<BusinessScalarRelationFilter, BusinessWhereInput>
  }, "id" | "code_businessId">

  export type CouponOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    description?: SortOrderInput | SortOrder
    discountType?: SortOrder
    discountAmount?: SortOrder
    maxUses?: SortOrderInput | SortOrder
    usedCount?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    isActive?: SortOrder
    minimumAmount?: SortOrderInput | SortOrder
    businessId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CouponCountOrderByAggregateInput
    _avg?: CouponAvgOrderByAggregateInput
    _max?: CouponMaxOrderByAggregateInput
    _min?: CouponMinOrderByAggregateInput
    _sum?: CouponSumOrderByAggregateInput
  }

  export type CouponScalarWhereWithAggregatesInput = {
    AND?: CouponScalarWhereWithAggregatesInput | CouponScalarWhereWithAggregatesInput[]
    OR?: CouponScalarWhereWithAggregatesInput[]
    NOT?: CouponScalarWhereWithAggregatesInput | CouponScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Coupon"> | string
    code?: StringWithAggregatesFilter<"Coupon"> | string
    description?: StringNullableWithAggregatesFilter<"Coupon"> | string | null
    discountType?: EnumDiscountTypeWithAggregatesFilter<"Coupon"> | $Enums.DiscountType
    discountAmount?: FloatWithAggregatesFilter<"Coupon"> | number
    maxUses?: IntNullableWithAggregatesFilter<"Coupon"> | number | null
    usedCount?: IntWithAggregatesFilter<"Coupon"> | number
    startDate?: DateTimeNullableWithAggregatesFilter<"Coupon"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"Coupon"> | Date | string | null
    isActive?: BoolWithAggregatesFilter<"Coupon"> | boolean
    minimumAmount?: FloatNullableWithAggregatesFilter<"Coupon"> | number | null
    businessId?: StringWithAggregatesFilter<"Coupon"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Coupon"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Coupon"> | Date | string
  }

  export type SalesFunnelWhereInput = {
    AND?: SalesFunnelWhereInput | SalesFunnelWhereInput[]
    OR?: SalesFunnelWhereInput[]
    NOT?: SalesFunnelWhereInput | SalesFunnelWhereInput[]
    id?: StringFilter<"SalesFunnel"> | string
    name?: StringFilter<"SalesFunnel"> | string
    isActive?: BoolFilter<"SalesFunnel"> | boolean
    popupTitle?: StringFilter<"SalesFunnel"> | string
    popupText?: StringFilter<"SalesFunnel"> | string
    popupImage?: StringNullableFilter<"SalesFunnel"> | string | null
    formTitle?: StringFilter<"SalesFunnel"> | string
    thankYouMessage?: StringFilter<"SalesFunnel"> | string
    couponId?: StringNullableFilter<"SalesFunnel"> | string | null
    businessId?: StringFilter<"SalesFunnel"> | string
    createdAt?: DateTimeFilter<"SalesFunnel"> | Date | string
    updatedAt?: DateTimeFilter<"SalesFunnel"> | Date | string
    business?: XOR<BusinessScalarRelationFilter, BusinessWhereInput>
  }

  export type SalesFunnelOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    popupTitle?: SortOrder
    popupText?: SortOrder
    popupImage?: SortOrderInput | SortOrder
    formTitle?: SortOrder
    thankYouMessage?: SortOrder
    couponId?: SortOrderInput | SortOrder
    businessId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    business?: BusinessOrderByWithRelationInput
  }

  export type SalesFunnelWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SalesFunnelWhereInput | SalesFunnelWhereInput[]
    OR?: SalesFunnelWhereInput[]
    NOT?: SalesFunnelWhereInput | SalesFunnelWhereInput[]
    name?: StringFilter<"SalesFunnel"> | string
    isActive?: BoolFilter<"SalesFunnel"> | boolean
    popupTitle?: StringFilter<"SalesFunnel"> | string
    popupText?: StringFilter<"SalesFunnel"> | string
    popupImage?: StringNullableFilter<"SalesFunnel"> | string | null
    formTitle?: StringFilter<"SalesFunnel"> | string
    thankYouMessage?: StringFilter<"SalesFunnel"> | string
    couponId?: StringNullableFilter<"SalesFunnel"> | string | null
    businessId?: StringFilter<"SalesFunnel"> | string
    createdAt?: DateTimeFilter<"SalesFunnel"> | Date | string
    updatedAt?: DateTimeFilter<"SalesFunnel"> | Date | string
    business?: XOR<BusinessScalarRelationFilter, BusinessWhereInput>
  }, "id">

  export type SalesFunnelOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    popupTitle?: SortOrder
    popupText?: SortOrder
    popupImage?: SortOrderInput | SortOrder
    formTitle?: SortOrder
    thankYouMessage?: SortOrder
    couponId?: SortOrderInput | SortOrder
    businessId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SalesFunnelCountOrderByAggregateInput
    _max?: SalesFunnelMaxOrderByAggregateInput
    _min?: SalesFunnelMinOrderByAggregateInput
  }

  export type SalesFunnelScalarWhereWithAggregatesInput = {
    AND?: SalesFunnelScalarWhereWithAggregatesInput | SalesFunnelScalarWhereWithAggregatesInput[]
    OR?: SalesFunnelScalarWhereWithAggregatesInput[]
    NOT?: SalesFunnelScalarWhereWithAggregatesInput | SalesFunnelScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SalesFunnel"> | string
    name?: StringWithAggregatesFilter<"SalesFunnel"> | string
    isActive?: BoolWithAggregatesFilter<"SalesFunnel"> | boolean
    popupTitle?: StringWithAggregatesFilter<"SalesFunnel"> | string
    popupText?: StringWithAggregatesFilter<"SalesFunnel"> | string
    popupImage?: StringNullableWithAggregatesFilter<"SalesFunnel"> | string | null
    formTitle?: StringWithAggregatesFilter<"SalesFunnel"> | string
    thankYouMessage?: StringWithAggregatesFilter<"SalesFunnel"> | string
    couponId?: StringNullableWithAggregatesFilter<"SalesFunnel"> | string | null
    businessId?: StringWithAggregatesFilter<"SalesFunnel"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SalesFunnel"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SalesFunnel"> | Date | string
  }

  export type WaiverWhereInput = {
    AND?: WaiverWhereInput | WaiverWhereInput[]
    OR?: WaiverWhereInput[]
    NOT?: WaiverWhereInput | WaiverWhereInput[]
    id?: StringFilter<"Waiver"> | string
    businessId?: StringFilter<"Waiver"> | string
    customerId?: StringFilter<"Waiver"> | string
    bookingId?: StringFilter<"Waiver"> | string
    status?: EnumWaiverStatusFilter<"Waiver"> | $Enums.WaiverStatus
    templateVersion?: StringFilter<"Waiver"> | string
    documentUrl?: StringFilter<"Waiver"> | string
    openSignDocumentId?: StringFilter<"Waiver"> | string
    createdAt?: DateTimeFilter<"Waiver"> | Date | string
    updatedAt?: DateTimeFilter<"Waiver"> | Date | string
    business?: XOR<BusinessScalarRelationFilter, BusinessWhereInput>
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
    booking?: XOR<BookingScalarRelationFilter, BookingWhereInput>
  }

  export type WaiverOrderByWithRelationInput = {
    id?: SortOrder
    businessId?: SortOrder
    customerId?: SortOrder
    bookingId?: SortOrder
    status?: SortOrder
    templateVersion?: SortOrder
    documentUrl?: SortOrder
    openSignDocumentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    business?: BusinessOrderByWithRelationInput
    customer?: CustomerOrderByWithRelationInput
    booking?: BookingOrderByWithRelationInput
  }

  export type WaiverWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    openSignDocumentId?: string
    AND?: WaiverWhereInput | WaiverWhereInput[]
    OR?: WaiverWhereInput[]
    NOT?: WaiverWhereInput | WaiverWhereInput[]
    businessId?: StringFilter<"Waiver"> | string
    customerId?: StringFilter<"Waiver"> | string
    bookingId?: StringFilter<"Waiver"> | string
    status?: EnumWaiverStatusFilter<"Waiver"> | $Enums.WaiverStatus
    templateVersion?: StringFilter<"Waiver"> | string
    documentUrl?: StringFilter<"Waiver"> | string
    createdAt?: DateTimeFilter<"Waiver"> | Date | string
    updatedAt?: DateTimeFilter<"Waiver"> | Date | string
    business?: XOR<BusinessScalarRelationFilter, BusinessWhereInput>
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>
    booking?: XOR<BookingScalarRelationFilter, BookingWhereInput>
  }, "id" | "openSignDocumentId">

  export type WaiverOrderByWithAggregationInput = {
    id?: SortOrder
    businessId?: SortOrder
    customerId?: SortOrder
    bookingId?: SortOrder
    status?: SortOrder
    templateVersion?: SortOrder
    documentUrl?: SortOrder
    openSignDocumentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WaiverCountOrderByAggregateInput
    _max?: WaiverMaxOrderByAggregateInput
    _min?: WaiverMinOrderByAggregateInput
  }

  export type WaiverScalarWhereWithAggregatesInput = {
    AND?: WaiverScalarWhereWithAggregatesInput | WaiverScalarWhereWithAggregatesInput[]
    OR?: WaiverScalarWhereWithAggregatesInput[]
    NOT?: WaiverScalarWhereWithAggregatesInput | WaiverScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Waiver"> | string
    businessId?: StringWithAggregatesFilter<"Waiver"> | string
    customerId?: StringWithAggregatesFilter<"Waiver"> | string
    bookingId?: StringWithAggregatesFilter<"Waiver"> | string
    status?: EnumWaiverStatusWithAggregatesFilter<"Waiver"> | $Enums.WaiverStatus
    templateVersion?: StringWithAggregatesFilter<"Waiver"> | string
    documentUrl?: StringWithAggregatesFilter<"Waiver"> | string
    openSignDocumentId?: StringWithAggregatesFilter<"Waiver"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Waiver"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Waiver"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email?: string | null
    name?: string | null
    createdAt?: Date | string
    image?: string | null
    updatedAt?: Date | string
    onboarded?: boolean
    clerkUserId?: string | null
    businesses?: BusinessCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email?: string | null
    name?: string | null
    createdAt?: Date | string
    image?: string | null
    updatedAt?: Date | string
    onboarded?: boolean
    clerkUserId?: string | null
    businesses?: BusinessUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboarded?: BoolFieldUpdateOperationsInput | boolean
    clerkUserId?: NullableStringFieldUpdateOperationsInput | string | null
    businesses?: BusinessUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboarded?: BoolFieldUpdateOperationsInput | boolean
    clerkUserId?: NullableStringFieldUpdateOperationsInput | string | null
    businesses?: BusinessUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email?: string | null
    name?: string | null
    createdAt?: Date | string
    image?: string | null
    updatedAt?: Date | string
    onboarded?: boolean
    clerkUserId?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboarded?: BoolFieldUpdateOperationsInput | boolean
    clerkUserId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboarded?: BoolFieldUpdateOperationsInput | boolean
    clerkUserId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BusinessCreateInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
    bookings?: BookingCreateNestedManyWithoutBusinessInput
    user: UserCreateNestedOneWithoutBusinessesInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    inventory?: InventoryCreateNestedManyWithoutBusinessInput
    payments?: PaymentCreateNestedManyWithoutBusinessInput
    coupons?: CouponCreateNestedManyWithoutBusinessInput
    salesFunnels?: SalesFunnelCreateNestedManyWithoutBusinessInput
    waivers?: WaiverCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    userId: string
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
    bookings?: BookingUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    inventory?: InventoryUncheckedCreateNestedManyWithoutBusinessInput
    payments?: PaymentUncheckedCreateNestedManyWithoutBusinessInput
    coupons?: CouponUncheckedCreateNestedManyWithoutBusinessInput
    salesFunnels?: SalesFunnelUncheckedCreateNestedManyWithoutBusinessInput
    waivers?: WaiverUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUpdateManyWithoutBusinessNestedInput
    user?: UserUpdateOneRequiredWithoutBusinessesNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    inventory?: InventoryUpdateManyWithoutBusinessNestedInput
    payments?: PaymentUpdateManyWithoutBusinessNestedInput
    coupons?: CouponUpdateManyWithoutBusinessNestedInput
    salesFunnels?: SalesFunnelUpdateManyWithoutBusinessNestedInput
    waivers?: WaiverUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    inventory?: InventoryUncheckedUpdateManyWithoutBusinessNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutBusinessNestedInput
    coupons?: CouponUncheckedUpdateManyWithoutBusinessNestedInput
    salesFunnels?: SalesFunnelUncheckedUpdateManyWithoutBusinessNestedInput
    waivers?: WaiverUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    userId: string
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
  }

  export type BusinessUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BusinessUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InventoryCreateInput = {
    id?: string
    type: $Enums.InventoryType
    name: string
    description?: string | null
    dimensions: string
    capacity: number
    price: number
    setupTime: number
    teardownTime: number
    images?: InventoryCreateimagesInput | string[]
    primaryImage?: string | null
    status: $Enums.InventoryStatus
    minimumSpace: string
    weightLimit: number
    ageRange: string
    weatherRestrictions?: InventoryCreateweatherRestrictionsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    quantity?: number
    bookingItems?: BookingItemCreateNestedManyWithoutInventoryInput
    business: BusinessCreateNestedOneWithoutInventoryInput
  }

  export type InventoryUncheckedCreateInput = {
    id?: string
    type: $Enums.InventoryType
    name: string
    description?: string | null
    dimensions: string
    capacity: number
    price: number
    setupTime: number
    teardownTime: number
    images?: InventoryCreateimagesInput | string[]
    primaryImage?: string | null
    status: $Enums.InventoryStatus
    minimumSpace: string
    weightLimit: number
    ageRange: string
    weatherRestrictions?: InventoryCreateweatherRestrictionsInput | string[]
    businessId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    quantity?: number
    bookingItems?: BookingItemUncheckedCreateNestedManyWithoutInventoryInput
  }

  export type InventoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumInventoryTypeFieldUpdateOperationsInput | $Enums.InventoryType
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimensions?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    setupTime?: IntFieldUpdateOperationsInput | number
    teardownTime?: IntFieldUpdateOperationsInput | number
    images?: InventoryUpdateimagesInput | string[]
    primaryImage?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInventoryStatusFieldUpdateOperationsInput | $Enums.InventoryStatus
    minimumSpace?: StringFieldUpdateOperationsInput | string
    weightLimit?: IntFieldUpdateOperationsInput | number
    ageRange?: StringFieldUpdateOperationsInput | string
    weatherRestrictions?: InventoryUpdateweatherRestrictionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    bookingItems?: BookingItemUpdateManyWithoutInventoryNestedInput
    business?: BusinessUpdateOneRequiredWithoutInventoryNestedInput
  }

  export type InventoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumInventoryTypeFieldUpdateOperationsInput | $Enums.InventoryType
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimensions?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    setupTime?: IntFieldUpdateOperationsInput | number
    teardownTime?: IntFieldUpdateOperationsInput | number
    images?: InventoryUpdateimagesInput | string[]
    primaryImage?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInventoryStatusFieldUpdateOperationsInput | $Enums.InventoryStatus
    minimumSpace?: StringFieldUpdateOperationsInput | string
    weightLimit?: IntFieldUpdateOperationsInput | number
    ageRange?: StringFieldUpdateOperationsInput | string
    weatherRestrictions?: InventoryUpdateweatherRestrictionsInput | string[]
    businessId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    bookingItems?: BookingItemUncheckedUpdateManyWithoutInventoryNestedInput
  }

  export type InventoryCreateManyInput = {
    id?: string
    type: $Enums.InventoryType
    name: string
    description?: string | null
    dimensions: string
    capacity: number
    price: number
    setupTime: number
    teardownTime: number
    images?: InventoryCreateimagesInput | string[]
    primaryImage?: string | null
    status: $Enums.InventoryStatus
    minimumSpace: string
    weightLimit: number
    ageRange: string
    weatherRestrictions?: InventoryCreateweatherRestrictionsInput | string[]
    businessId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    quantity?: number
  }

  export type InventoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumInventoryTypeFieldUpdateOperationsInput | $Enums.InventoryType
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimensions?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    setupTime?: IntFieldUpdateOperationsInput | number
    teardownTime?: IntFieldUpdateOperationsInput | number
    images?: InventoryUpdateimagesInput | string[]
    primaryImage?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInventoryStatusFieldUpdateOperationsInput | $Enums.InventoryStatus
    minimumSpace?: StringFieldUpdateOperationsInput | string
    weightLimit?: IntFieldUpdateOperationsInput | number
    ageRange?: StringFieldUpdateOperationsInput | string
    weatherRestrictions?: InventoryUpdateweatherRestrictionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type InventoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumInventoryTypeFieldUpdateOperationsInput | $Enums.InventoryType
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimensions?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    setupTime?: IntFieldUpdateOperationsInput | number
    teardownTime?: IntFieldUpdateOperationsInput | number
    images?: InventoryUpdateimagesInput | string[]
    primaryImage?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInventoryStatusFieldUpdateOperationsInput | $Enums.InventoryStatus
    minimumSpace?: StringFieldUpdateOperationsInput | string
    weightLimit?: IntFieldUpdateOperationsInput | number
    ageRange?: StringFieldUpdateOperationsInput | string
    weatherRestrictions?: InventoryUpdateweatherRestrictionsInput | string[]
    businessId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type CustomerCreateInput = {
    id?: string
    name: string
    email: string
    phone: string
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    notes?: string | null
    bookingCount?: number
    totalSpent?: number
    lastBooking?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isLead?: boolean
    status?: string
    type?: string
    bookings?: BookingCreateNestedManyWithoutCustomerInput
    waivers?: WaiverCreateNestedManyWithoutCustomerInput
    business: BusinessCreateNestedOneWithoutCustomersInput
  }

  export type CustomerUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    phone: string
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    notes?: string | null
    bookingCount?: number
    totalSpent?: number
    lastBooking?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    isLead?: boolean
    status?: string
    type?: string
    bookings?: BookingUncheckedCreateNestedManyWithoutCustomerInput
    waivers?: WaiverUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    bookingCount?: IntFieldUpdateOperationsInput | number
    totalSpent?: FloatFieldUpdateOperationsInput | number
    lastBooking?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isLead?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    bookings?: BookingUpdateManyWithoutCustomerNestedInput
    waivers?: WaiverUpdateManyWithoutCustomerNestedInput
    business?: BusinessUpdateOneRequiredWithoutCustomersNestedInput
  }

  export type CustomerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    bookingCount?: IntFieldUpdateOperationsInput | number
    totalSpent?: FloatFieldUpdateOperationsInput | number
    lastBooking?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    isLead?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    bookings?: BookingUncheckedUpdateManyWithoutCustomerNestedInput
    waivers?: WaiverUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerCreateManyInput = {
    id?: string
    name: string
    email: string
    phone: string
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    notes?: string | null
    bookingCount?: number
    totalSpent?: number
    lastBooking?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    isLead?: boolean
    status?: string
    type?: string
  }

  export type CustomerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    bookingCount?: IntFieldUpdateOperationsInput | number
    totalSpent?: FloatFieldUpdateOperationsInput | number
    lastBooking?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isLead?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
  }

  export type CustomerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    bookingCount?: IntFieldUpdateOperationsInput | number
    totalSpent?: FloatFieldUpdateOperationsInput | number
    lastBooking?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    isLead?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
  }

  export type BookingCreateInput = {
    id?: string
    eventDate: Date | string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    totalAmount: number
    depositAmount?: number | null
    depositPaid?: boolean
    eventType?: string | null
    eventAddress: string
    eventCity: string
    eventState: string
    eventZipCode: string
    participantAge?: number | null
    participantCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: string | null
    subtotalAmount?: number
    taxAmount?: number
    taxRate?: number
    business: BusinessCreateNestedOneWithoutBookingsInput
    customer: CustomerCreateNestedOneWithoutBookingsInput
    inventoryItems?: BookingItemCreateNestedManyWithoutBookingInput
    payments?: PaymentCreateNestedManyWithoutBookingInput
    waivers?: WaiverCreateNestedManyWithoutBookingInput
  }

  export type BookingUncheckedCreateInput = {
    id?: string
    eventDate: Date | string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    totalAmount: number
    depositAmount?: number | null
    depositPaid?: boolean
    eventType?: string | null
    eventAddress: string
    eventCity: string
    eventState: string
    eventZipCode: string
    participantAge?: number | null
    participantCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    customerId: string
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: string | null
    subtotalAmount?: number
    taxAmount?: number
    taxRate?: number
    inventoryItems?: BookingItemUncheckedCreateNestedManyWithoutBookingInput
    payments?: PaymentUncheckedCreateNestedManyWithoutBookingInput
    waivers?: WaiverUncheckedCreateNestedManyWithoutBookingInput
  }

  export type BookingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    totalAmount?: FloatFieldUpdateOperationsInput | number
    depositAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    depositPaid?: BoolFieldUpdateOperationsInput | boolean
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    eventAddress?: StringFieldUpdateOperationsInput | string
    eventCity?: StringFieldUpdateOperationsInput | string
    eventState?: StringFieldUpdateOperationsInput | string
    eventZipCode?: StringFieldUpdateOperationsInput | string
    participantAge?: NullableIntFieldUpdateOperationsInput | number | null
    participantCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    isCancelled?: BoolFieldUpdateOperationsInput | boolean
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    subtotalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    business?: BusinessUpdateOneRequiredWithoutBookingsNestedInput
    customer?: CustomerUpdateOneRequiredWithoutBookingsNestedInput
    inventoryItems?: BookingItemUpdateManyWithoutBookingNestedInput
    payments?: PaymentUpdateManyWithoutBookingNestedInput
    waivers?: WaiverUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    totalAmount?: FloatFieldUpdateOperationsInput | number
    depositAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    depositPaid?: BoolFieldUpdateOperationsInput | boolean
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    eventAddress?: StringFieldUpdateOperationsInput | string
    eventCity?: StringFieldUpdateOperationsInput | string
    eventState?: StringFieldUpdateOperationsInput | string
    eventZipCode?: StringFieldUpdateOperationsInput | string
    participantAge?: NullableIntFieldUpdateOperationsInput | number | null
    participantCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    isCancelled?: BoolFieldUpdateOperationsInput | boolean
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    subtotalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    inventoryItems?: BookingItemUncheckedUpdateManyWithoutBookingNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutBookingNestedInput
    waivers?: WaiverUncheckedUpdateManyWithoutBookingNestedInput
  }

  export type BookingCreateManyInput = {
    id?: string
    eventDate: Date | string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    totalAmount: number
    depositAmount?: number | null
    depositPaid?: boolean
    eventType?: string | null
    eventAddress: string
    eventCity: string
    eventState: string
    eventZipCode: string
    participantAge?: number | null
    participantCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    customerId: string
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: string | null
    subtotalAmount?: number
    taxAmount?: number
    taxRate?: number
  }

  export type BookingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    totalAmount?: FloatFieldUpdateOperationsInput | number
    depositAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    depositPaid?: BoolFieldUpdateOperationsInput | boolean
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    eventAddress?: StringFieldUpdateOperationsInput | string
    eventCity?: StringFieldUpdateOperationsInput | string
    eventState?: StringFieldUpdateOperationsInput | string
    eventZipCode?: StringFieldUpdateOperationsInput | string
    participantAge?: NullableIntFieldUpdateOperationsInput | number | null
    participantCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    isCancelled?: BoolFieldUpdateOperationsInput | boolean
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    subtotalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
  }

  export type BookingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    totalAmount?: FloatFieldUpdateOperationsInput | number
    depositAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    depositPaid?: BoolFieldUpdateOperationsInput | boolean
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    eventAddress?: StringFieldUpdateOperationsInput | string
    eventCity?: StringFieldUpdateOperationsInput | string
    eventState?: StringFieldUpdateOperationsInput | string
    eventZipCode?: StringFieldUpdateOperationsInput | string
    participantAge?: NullableIntFieldUpdateOperationsInput | number | null
    participantCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    isCancelled?: BoolFieldUpdateOperationsInput | boolean
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    subtotalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
  }

  export type BookingItemCreateInput = {
    id?: string
    quantity?: number
    price: number
    booking: BookingCreateNestedOneWithoutInventoryItemsInput
    inventory: InventoryCreateNestedOneWithoutBookingItemsInput
  }

  export type BookingItemUncheckedCreateInput = {
    id?: string
    bookingId: string
    inventoryId: string
    quantity?: number
    price: number
  }

  export type BookingItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    booking?: BookingUpdateOneRequiredWithoutInventoryItemsNestedInput
    inventory?: InventoryUpdateOneRequiredWithoutBookingItemsNestedInput
  }

  export type BookingItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    inventoryId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
  }

  export type BookingItemCreateManyInput = {
    id?: string
    bookingId: string
    inventoryId: string
    quantity?: number
    price: number
  }

  export type BookingItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
  }

  export type BookingItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    inventoryId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
  }

  export type PaymentCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    type: $Enums.PaymentType
    status: $Enums.PaymentStatus
    createdAt?: Date | string
    currency?: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string | null
    refundReason?: string | null
    stripeClientSecret?: string | null
    stripePaymentId?: string | null
    updatedAt?: Date | string
    booking: BookingCreateNestedOneWithoutPaymentsInput
    business: BusinessCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    type: $Enums.PaymentType
    status: $Enums.PaymentStatus
    createdAt?: Date | string
    bookingId: string
    businessId: string
    currency?: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string | null
    refundReason?: string | null
    stripeClientSecret?: string | null
    stripePaymentId?: string | null
    updatedAt?: Date | string
  }

  export type PaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    currency?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    refundReason?: NullableStringFieldUpdateOperationsInput | string | null
    stripeClientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    booking?: BookingUpdateOneRequiredWithoutPaymentsNestedInput
    business?: BusinessUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookingId?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    refundReason?: NullableStringFieldUpdateOperationsInput | string | null
    stripeClientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateManyInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    type: $Enums.PaymentType
    status: $Enums.PaymentStatus
    createdAt?: Date | string
    bookingId: string
    businessId: string
    currency?: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string | null
    refundReason?: string | null
    stripeClientSecret?: string | null
    stripePaymentId?: string | null
    updatedAt?: Date | string
  }

  export type PaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    currency?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    refundReason?: NullableStringFieldUpdateOperationsInput | string | null
    stripeClientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookingId?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    refundReason?: NullableStringFieldUpdateOperationsInput | string | null
    stripeClientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CouponCreateInput = {
    id?: string
    code: string
    description?: string | null
    discountType: $Enums.DiscountType
    discountAmount: number
    maxUses?: number | null
    usedCount?: number
    startDate?: Date | string | null
    endDate?: Date | string | null
    isActive?: boolean
    minimumAmount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutCouponsInput
  }

  export type CouponUncheckedCreateInput = {
    id?: string
    code: string
    description?: string | null
    discountType: $Enums.DiscountType
    discountAmount: number
    maxUses?: number | null
    usedCount?: number
    startDate?: Date | string | null
    endDate?: Date | string | null
    isActive?: boolean
    minimumAmount?: number | null
    businessId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CouponUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    discountType?: EnumDiscountTypeFieldUpdateOperationsInput | $Enums.DiscountType
    discountAmount?: FloatFieldUpdateOperationsInput | number
    maxUses?: NullableIntFieldUpdateOperationsInput | number | null
    usedCount?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    minimumAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutCouponsNestedInput
  }

  export type CouponUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    discountType?: EnumDiscountTypeFieldUpdateOperationsInput | $Enums.DiscountType
    discountAmount?: FloatFieldUpdateOperationsInput | number
    maxUses?: NullableIntFieldUpdateOperationsInput | number | null
    usedCount?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    minimumAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    businessId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CouponCreateManyInput = {
    id?: string
    code: string
    description?: string | null
    discountType: $Enums.DiscountType
    discountAmount: number
    maxUses?: number | null
    usedCount?: number
    startDate?: Date | string | null
    endDate?: Date | string | null
    isActive?: boolean
    minimumAmount?: number | null
    businessId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CouponUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    discountType?: EnumDiscountTypeFieldUpdateOperationsInput | $Enums.DiscountType
    discountAmount?: FloatFieldUpdateOperationsInput | number
    maxUses?: NullableIntFieldUpdateOperationsInput | number | null
    usedCount?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    minimumAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CouponUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    discountType?: EnumDiscountTypeFieldUpdateOperationsInput | $Enums.DiscountType
    discountAmount?: FloatFieldUpdateOperationsInput | number
    maxUses?: NullableIntFieldUpdateOperationsInput | number | null
    usedCount?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    minimumAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    businessId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesFunnelCreateInput = {
    id?: string
    name: string
    isActive?: boolean
    popupTitle: string
    popupText: string
    popupImage?: string | null
    formTitle: string
    thankYouMessage: string
    couponId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutSalesFunnelsInput
  }

  export type SalesFunnelUncheckedCreateInput = {
    id?: string
    name: string
    isActive?: boolean
    popupTitle: string
    popupText: string
    popupImage?: string | null
    formTitle: string
    thankYouMessage: string
    couponId?: string | null
    businessId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalesFunnelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    popupTitle?: StringFieldUpdateOperationsInput | string
    popupText?: StringFieldUpdateOperationsInput | string
    popupImage?: NullableStringFieldUpdateOperationsInput | string | null
    formTitle?: StringFieldUpdateOperationsInput | string
    thankYouMessage?: StringFieldUpdateOperationsInput | string
    couponId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutSalesFunnelsNestedInput
  }

  export type SalesFunnelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    popupTitle?: StringFieldUpdateOperationsInput | string
    popupText?: StringFieldUpdateOperationsInput | string
    popupImage?: NullableStringFieldUpdateOperationsInput | string | null
    formTitle?: StringFieldUpdateOperationsInput | string
    thankYouMessage?: StringFieldUpdateOperationsInput | string
    couponId?: NullableStringFieldUpdateOperationsInput | string | null
    businessId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesFunnelCreateManyInput = {
    id?: string
    name: string
    isActive?: boolean
    popupTitle: string
    popupText: string
    popupImage?: string | null
    formTitle: string
    thankYouMessage: string
    couponId?: string | null
    businessId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalesFunnelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    popupTitle?: StringFieldUpdateOperationsInput | string
    popupText?: StringFieldUpdateOperationsInput | string
    popupImage?: NullableStringFieldUpdateOperationsInput | string | null
    formTitle?: StringFieldUpdateOperationsInput | string
    thankYouMessage?: StringFieldUpdateOperationsInput | string
    couponId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesFunnelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    popupTitle?: StringFieldUpdateOperationsInput | string
    popupText?: StringFieldUpdateOperationsInput | string
    popupImage?: NullableStringFieldUpdateOperationsInput | string | null
    formTitle?: StringFieldUpdateOperationsInput | string
    thankYouMessage?: StringFieldUpdateOperationsInput | string
    couponId?: NullableStringFieldUpdateOperationsInput | string | null
    businessId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WaiverCreateInput = {
    id?: string
    status?: $Enums.WaiverStatus
    templateVersion: string
    documentUrl: string
    openSignDocumentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutWaiversInput
    customer: CustomerCreateNestedOneWithoutWaiversInput
    booking: BookingCreateNestedOneWithoutWaiversInput
  }

  export type WaiverUncheckedCreateInput = {
    id?: string
    businessId: string
    customerId: string
    bookingId: string
    status?: $Enums.WaiverStatus
    templateVersion: string
    documentUrl: string
    openSignDocumentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WaiverUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumWaiverStatusFieldUpdateOperationsInput | $Enums.WaiverStatus
    templateVersion?: StringFieldUpdateOperationsInput | string
    documentUrl?: StringFieldUpdateOperationsInput | string
    openSignDocumentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutWaiversNestedInput
    customer?: CustomerUpdateOneRequiredWithoutWaiversNestedInput
    booking?: BookingUpdateOneRequiredWithoutWaiversNestedInput
  }

  export type WaiverUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    status?: EnumWaiverStatusFieldUpdateOperationsInput | $Enums.WaiverStatus
    templateVersion?: StringFieldUpdateOperationsInput | string
    documentUrl?: StringFieldUpdateOperationsInput | string
    openSignDocumentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WaiverCreateManyInput = {
    id?: string
    businessId: string
    customerId: string
    bookingId: string
    status?: $Enums.WaiverStatus
    templateVersion: string
    documentUrl: string
    openSignDocumentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WaiverUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumWaiverStatusFieldUpdateOperationsInput | $Enums.WaiverStatus
    templateVersion?: StringFieldUpdateOperationsInput | string
    documentUrl?: StringFieldUpdateOperationsInput | string
    openSignDocumentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WaiverUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    status?: EnumWaiverStatusFieldUpdateOperationsInput | $Enums.WaiverStatus
    templateVersion?: StringFieldUpdateOperationsInput | string
    documentUrl?: StringFieldUpdateOperationsInput | string
    openSignDocumentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type BusinessListRelationFilter = {
    every?: BusinessWhereInput
    some?: BusinessWhereInput
    none?: BusinessWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type BusinessOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    image?: SortOrder
    updatedAt?: SortOrder
    onboarded?: SortOrder
    clerkUserId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    image?: SortOrder
    updatedAt?: SortOrder
    onboarded?: SortOrder
    clerkUserId?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    image?: SortOrder
    updatedAt?: SortOrder
    onboarded?: SortOrder
    clerkUserId?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BookingListRelationFilter = {
    every?: BookingWhereInput
    some?: BookingWhereInput
    none?: BookingWhereInput
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type CustomerListRelationFilter = {
    every?: CustomerWhereInput
    some?: CustomerWhereInput
    none?: CustomerWhereInput
  }

  export type InventoryListRelationFilter = {
    every?: InventoryWhereInput
    some?: InventoryWhereInput
    none?: InventoryWhereInput
  }

  export type PaymentListRelationFilter = {
    every?: PaymentWhereInput
    some?: PaymentWhereInput
    none?: PaymentWhereInput
  }

  export type CouponListRelationFilter = {
    every?: CouponWhereInput
    some?: CouponWhereInput
    none?: CouponWhereInput
  }

  export type SalesFunnelListRelationFilter = {
    every?: SalesFunnelWhereInput
    some?: SalesFunnelWhereInput
    none?: SalesFunnelWhereInput
  }

  export type WaiverListRelationFilter = {
    every?: WaiverWhereInput
    some?: WaiverWhereInput
    none?: WaiverWhereInput
  }

  export type BookingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CustomerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InventoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CouponOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SalesFunnelOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WaiverOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BusinessCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    serviceArea?: SortOrder
    logo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    minAdvanceBooking?: SortOrder
    maxAdvanceBooking?: SortOrder
    minimumPurchase?: SortOrder
    userId?: SortOrder
    stripeAccountId?: SortOrder
    socialMedia?: SortOrder
    customDomain?: SortOrder
    subdomain?: SortOrder
    siteConfig?: SortOrder
    onboardingError?: SortOrder
  }

  export type BusinessAvgOrderByAggregateInput = {
    minAdvanceBooking?: SortOrder
    maxAdvanceBooking?: SortOrder
    minimumPurchase?: SortOrder
  }

  export type BusinessMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    logo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    minAdvanceBooking?: SortOrder
    maxAdvanceBooking?: SortOrder
    minimumPurchase?: SortOrder
    userId?: SortOrder
    stripeAccountId?: SortOrder
    customDomain?: SortOrder
    subdomain?: SortOrder
    onboardingError?: SortOrder
  }

  export type BusinessMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    logo?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    minAdvanceBooking?: SortOrder
    maxAdvanceBooking?: SortOrder
    minimumPurchase?: SortOrder
    userId?: SortOrder
    stripeAccountId?: SortOrder
    customDomain?: SortOrder
    subdomain?: SortOrder
    onboardingError?: SortOrder
  }

  export type BusinessSumOrderByAggregateInput = {
    minAdvanceBooking?: SortOrder
    maxAdvanceBooking?: SortOrder
    minimumPurchase?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumInventoryTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.InventoryType | EnumInventoryTypeFieldRefInput<$PrismaModel>
    in?: $Enums.InventoryType[] | ListEnumInventoryTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InventoryType[] | ListEnumInventoryTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumInventoryTypeFilter<$PrismaModel> | $Enums.InventoryType
  }

  export type EnumInventoryStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InventoryStatus | EnumInventoryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InventoryStatus[] | ListEnumInventoryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InventoryStatus[] | ListEnumInventoryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInventoryStatusFilter<$PrismaModel> | $Enums.InventoryStatus
  }

  export type BookingItemListRelationFilter = {
    every?: BookingItemWhereInput
    some?: BookingItemWhereInput
    none?: BookingItemWhereInput
  }

  export type BusinessScalarRelationFilter = {
    is?: BusinessWhereInput
    isNot?: BusinessWhereInput
  }

  export type BookingItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InventoryCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    name?: SortOrder
    description?: SortOrder
    dimensions?: SortOrder
    capacity?: SortOrder
    price?: SortOrder
    setupTime?: SortOrder
    teardownTime?: SortOrder
    images?: SortOrder
    primaryImage?: SortOrder
    status?: SortOrder
    minimumSpace?: SortOrder
    weightLimit?: SortOrder
    ageRange?: SortOrder
    weatherRestrictions?: SortOrder
    businessId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    quantity?: SortOrder
  }

  export type InventoryAvgOrderByAggregateInput = {
    capacity?: SortOrder
    price?: SortOrder
    setupTime?: SortOrder
    teardownTime?: SortOrder
    weightLimit?: SortOrder
    quantity?: SortOrder
  }

  export type InventoryMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    name?: SortOrder
    description?: SortOrder
    dimensions?: SortOrder
    capacity?: SortOrder
    price?: SortOrder
    setupTime?: SortOrder
    teardownTime?: SortOrder
    primaryImage?: SortOrder
    status?: SortOrder
    minimumSpace?: SortOrder
    weightLimit?: SortOrder
    ageRange?: SortOrder
    businessId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    quantity?: SortOrder
  }

  export type InventoryMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    name?: SortOrder
    description?: SortOrder
    dimensions?: SortOrder
    capacity?: SortOrder
    price?: SortOrder
    setupTime?: SortOrder
    teardownTime?: SortOrder
    primaryImage?: SortOrder
    status?: SortOrder
    minimumSpace?: SortOrder
    weightLimit?: SortOrder
    ageRange?: SortOrder
    businessId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    quantity?: SortOrder
  }

  export type InventorySumOrderByAggregateInput = {
    capacity?: SortOrder
    price?: SortOrder
    setupTime?: SortOrder
    teardownTime?: SortOrder
    weightLimit?: SortOrder
    quantity?: SortOrder
  }

  export type EnumInventoryTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InventoryType | EnumInventoryTypeFieldRefInput<$PrismaModel>
    in?: $Enums.InventoryType[] | ListEnumInventoryTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InventoryType[] | ListEnumInventoryTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumInventoryTypeWithAggregatesFilter<$PrismaModel> | $Enums.InventoryType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInventoryTypeFilter<$PrismaModel>
    _max?: NestedEnumInventoryTypeFilter<$PrismaModel>
  }

  export type EnumInventoryStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InventoryStatus | EnumInventoryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InventoryStatus[] | ListEnumInventoryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InventoryStatus[] | ListEnumInventoryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInventoryStatusWithAggregatesFilter<$PrismaModel> | $Enums.InventoryStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInventoryStatusFilter<$PrismaModel>
    _max?: NestedEnumInventoryStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type CustomerEmailBusinessIdCompoundUniqueInput = {
    email: string
    businessId: string
  }

  export type CustomerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    notes?: SortOrder
    bookingCount?: SortOrder
    totalSpent?: SortOrder
    lastBooking?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    isLead?: SortOrder
    status?: SortOrder
    type?: SortOrder
  }

  export type CustomerAvgOrderByAggregateInput = {
    bookingCount?: SortOrder
    totalSpent?: SortOrder
  }

  export type CustomerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    notes?: SortOrder
    bookingCount?: SortOrder
    totalSpent?: SortOrder
    lastBooking?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    isLead?: SortOrder
    status?: SortOrder
    type?: SortOrder
  }

  export type CustomerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zipCode?: SortOrder
    notes?: SortOrder
    bookingCount?: SortOrder
    totalSpent?: SortOrder
    lastBooking?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    isLead?: SortOrder
    status?: SortOrder
    type?: SortOrder
  }

  export type CustomerSumOrderByAggregateInput = {
    bookingCount?: SortOrder
    totalSpent?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumBookingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStatusFilter<$PrismaModel> | $Enums.BookingStatus
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type CustomerScalarRelationFilter = {
    is?: CustomerWhereInput
    isNot?: CustomerWhereInput
  }

  export type BookingCountOrderByAggregateInput = {
    id?: SortOrder
    eventDate?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    totalAmount?: SortOrder
    depositAmount?: SortOrder
    depositPaid?: SortOrder
    eventType?: SortOrder
    eventAddress?: SortOrder
    eventCity?: SortOrder
    eventState?: SortOrder
    eventZipCode?: SortOrder
    participantAge?: SortOrder
    participantCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    customerId?: SortOrder
    isCompleted?: SortOrder
    isCancelled?: SortOrder
    specialInstructions?: SortOrder
    subtotalAmount?: SortOrder
    taxAmount?: SortOrder
    taxRate?: SortOrder
  }

  export type BookingAvgOrderByAggregateInput = {
    totalAmount?: SortOrder
    depositAmount?: SortOrder
    participantAge?: SortOrder
    participantCount?: SortOrder
    subtotalAmount?: SortOrder
    taxAmount?: SortOrder
    taxRate?: SortOrder
  }

  export type BookingMaxOrderByAggregateInput = {
    id?: SortOrder
    eventDate?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    totalAmount?: SortOrder
    depositAmount?: SortOrder
    depositPaid?: SortOrder
    eventType?: SortOrder
    eventAddress?: SortOrder
    eventCity?: SortOrder
    eventState?: SortOrder
    eventZipCode?: SortOrder
    participantAge?: SortOrder
    participantCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    customerId?: SortOrder
    isCompleted?: SortOrder
    isCancelled?: SortOrder
    specialInstructions?: SortOrder
    subtotalAmount?: SortOrder
    taxAmount?: SortOrder
    taxRate?: SortOrder
  }

  export type BookingMinOrderByAggregateInput = {
    id?: SortOrder
    eventDate?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    totalAmount?: SortOrder
    depositAmount?: SortOrder
    depositPaid?: SortOrder
    eventType?: SortOrder
    eventAddress?: SortOrder
    eventCity?: SortOrder
    eventState?: SortOrder
    eventZipCode?: SortOrder
    participantAge?: SortOrder
    participantCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    businessId?: SortOrder
    customerId?: SortOrder
    isCompleted?: SortOrder
    isCancelled?: SortOrder
    specialInstructions?: SortOrder
    subtotalAmount?: SortOrder
    taxAmount?: SortOrder
    taxRate?: SortOrder
  }

  export type BookingSumOrderByAggregateInput = {
    totalAmount?: SortOrder
    depositAmount?: SortOrder
    participantAge?: SortOrder
    participantCount?: SortOrder
    subtotalAmount?: SortOrder
    taxAmount?: SortOrder
    taxRate?: SortOrder
  }

  export type EnumBookingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBookingStatusFilter<$PrismaModel>
    _max?: NestedEnumBookingStatusFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BookingScalarRelationFilter = {
    is?: BookingWhereInput
    isNot?: BookingWhereInput
  }

  export type InventoryScalarRelationFilter = {
    is?: InventoryWhereInput
    isNot?: InventoryWhereInput
  }

  export type BookingItemCountOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    inventoryId?: SortOrder
    quantity?: SortOrder
    price?: SortOrder
  }

  export type BookingItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
    price?: SortOrder
  }

  export type BookingItemMaxOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    inventoryId?: SortOrder
    quantity?: SortOrder
    price?: SortOrder
  }

  export type BookingItemMinOrderByAggregateInput = {
    id?: SortOrder
    bookingId?: SortOrder
    inventoryId?: SortOrder
    quantity?: SortOrder
    price?: SortOrder
  }

  export type BookingItemSumOrderByAggregateInput = {
    quantity?: SortOrder
    price?: SortOrder
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type EnumPaymentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentType | EnumPaymentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentTypeFilter<$PrismaModel> | $Enums.PaymentType
  }

  export type EnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    type?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    bookingId?: SortOrder
    businessId?: SortOrder
    currency?: SortOrder
    metadata?: SortOrder
    paidAt?: SortOrder
    refundAmount?: SortOrder
    refundReason?: SortOrder
    stripeClientSecret?: SortOrder
    stripePaymentId?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    amount?: SortOrder
    refundAmount?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    type?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    bookingId?: SortOrder
    businessId?: SortOrder
    currency?: SortOrder
    paidAt?: SortOrder
    refundAmount?: SortOrder
    refundReason?: SortOrder
    stripeClientSecret?: SortOrder
    stripePaymentId?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    type?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    bookingId?: SortOrder
    businessId?: SortOrder
    currency?: SortOrder
    paidAt?: SortOrder
    refundAmount?: SortOrder
    refundReason?: SortOrder
    stripeClientSecret?: SortOrder
    stripePaymentId?: SortOrder
    updatedAt?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    amount?: SortOrder
    refundAmount?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type EnumPaymentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentType | EnumPaymentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentTypeWithAggregatesFilter<$PrismaModel> | $Enums.PaymentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentTypeFilter<$PrismaModel>
    _max?: NestedEnumPaymentTypeFilter<$PrismaModel>
  }

  export type EnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type EnumDiscountTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DiscountType | EnumDiscountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DiscountType[] | ListEnumDiscountTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DiscountType[] | ListEnumDiscountTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDiscountTypeFilter<$PrismaModel> | $Enums.DiscountType
  }

  export type CouponCodeBusinessIdCompoundUniqueInput = {
    code: string
    businessId: string
  }

  export type CouponCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    description?: SortOrder
    discountType?: SortOrder
    discountAmount?: SortOrder
    maxUses?: SortOrder
    usedCount?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    minimumAmount?: SortOrder
    businessId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CouponAvgOrderByAggregateInput = {
    discountAmount?: SortOrder
    maxUses?: SortOrder
    usedCount?: SortOrder
    minimumAmount?: SortOrder
  }

  export type CouponMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    description?: SortOrder
    discountType?: SortOrder
    discountAmount?: SortOrder
    maxUses?: SortOrder
    usedCount?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    minimumAmount?: SortOrder
    businessId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CouponMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    description?: SortOrder
    discountType?: SortOrder
    discountAmount?: SortOrder
    maxUses?: SortOrder
    usedCount?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    isActive?: SortOrder
    minimumAmount?: SortOrder
    businessId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CouponSumOrderByAggregateInput = {
    discountAmount?: SortOrder
    maxUses?: SortOrder
    usedCount?: SortOrder
    minimumAmount?: SortOrder
  }

  export type EnumDiscountTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DiscountType | EnumDiscountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DiscountType[] | ListEnumDiscountTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DiscountType[] | ListEnumDiscountTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDiscountTypeWithAggregatesFilter<$PrismaModel> | $Enums.DiscountType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDiscountTypeFilter<$PrismaModel>
    _max?: NestedEnumDiscountTypeFilter<$PrismaModel>
  }

  export type SalesFunnelCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    popupTitle?: SortOrder
    popupText?: SortOrder
    popupImage?: SortOrder
    formTitle?: SortOrder
    thankYouMessage?: SortOrder
    couponId?: SortOrder
    businessId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SalesFunnelMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    popupTitle?: SortOrder
    popupText?: SortOrder
    popupImage?: SortOrder
    formTitle?: SortOrder
    thankYouMessage?: SortOrder
    couponId?: SortOrder
    businessId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SalesFunnelMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    popupTitle?: SortOrder
    popupText?: SortOrder
    popupImage?: SortOrder
    formTitle?: SortOrder
    thankYouMessage?: SortOrder
    couponId?: SortOrder
    businessId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumWaiverStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.WaiverStatus | EnumWaiverStatusFieldRefInput<$PrismaModel>
    in?: $Enums.WaiverStatus[] | ListEnumWaiverStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.WaiverStatus[] | ListEnumWaiverStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumWaiverStatusFilter<$PrismaModel> | $Enums.WaiverStatus
  }

  export type WaiverCountOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    customerId?: SortOrder
    bookingId?: SortOrder
    status?: SortOrder
    templateVersion?: SortOrder
    documentUrl?: SortOrder
    openSignDocumentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WaiverMaxOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    customerId?: SortOrder
    bookingId?: SortOrder
    status?: SortOrder
    templateVersion?: SortOrder
    documentUrl?: SortOrder
    openSignDocumentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WaiverMinOrderByAggregateInput = {
    id?: SortOrder
    businessId?: SortOrder
    customerId?: SortOrder
    bookingId?: SortOrder
    status?: SortOrder
    templateVersion?: SortOrder
    documentUrl?: SortOrder
    openSignDocumentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumWaiverStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WaiverStatus | EnumWaiverStatusFieldRefInput<$PrismaModel>
    in?: $Enums.WaiverStatus[] | ListEnumWaiverStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.WaiverStatus[] | ListEnumWaiverStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumWaiverStatusWithAggregatesFilter<$PrismaModel> | $Enums.WaiverStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumWaiverStatusFilter<$PrismaModel>
    _max?: NestedEnumWaiverStatusFilter<$PrismaModel>
  }

  export type BusinessCreateNestedManyWithoutUserInput = {
    create?: XOR<BusinessCreateWithoutUserInput, BusinessUncheckedCreateWithoutUserInput> | BusinessCreateWithoutUserInput[] | BusinessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BusinessCreateOrConnectWithoutUserInput | BusinessCreateOrConnectWithoutUserInput[]
    createMany?: BusinessCreateManyUserInputEnvelope
    connect?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
  }

  export type BusinessUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BusinessCreateWithoutUserInput, BusinessUncheckedCreateWithoutUserInput> | BusinessCreateWithoutUserInput[] | BusinessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BusinessCreateOrConnectWithoutUserInput | BusinessCreateOrConnectWithoutUserInput[]
    createMany?: BusinessCreateManyUserInputEnvelope
    connect?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type BusinessUpdateManyWithoutUserNestedInput = {
    create?: XOR<BusinessCreateWithoutUserInput, BusinessUncheckedCreateWithoutUserInput> | BusinessCreateWithoutUserInput[] | BusinessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BusinessCreateOrConnectWithoutUserInput | BusinessCreateOrConnectWithoutUserInput[]
    upsert?: BusinessUpsertWithWhereUniqueWithoutUserInput | BusinessUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BusinessCreateManyUserInputEnvelope
    set?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    disconnect?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    delete?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    connect?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    update?: BusinessUpdateWithWhereUniqueWithoutUserInput | BusinessUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BusinessUpdateManyWithWhereWithoutUserInput | BusinessUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BusinessScalarWhereInput | BusinessScalarWhereInput[]
  }

  export type BusinessUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BusinessCreateWithoutUserInput, BusinessUncheckedCreateWithoutUserInput> | BusinessCreateWithoutUserInput[] | BusinessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BusinessCreateOrConnectWithoutUserInput | BusinessCreateOrConnectWithoutUserInput[]
    upsert?: BusinessUpsertWithWhereUniqueWithoutUserInput | BusinessUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BusinessCreateManyUserInputEnvelope
    set?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    disconnect?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    delete?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    connect?: BusinessWhereUniqueInput | BusinessWhereUniqueInput[]
    update?: BusinessUpdateWithWhereUniqueWithoutUserInput | BusinessUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BusinessUpdateManyWithWhereWithoutUserInput | BusinessUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BusinessScalarWhereInput | BusinessScalarWhereInput[]
  }

  export type BusinessCreateserviceAreaInput = {
    set: string[]
  }

  export type BookingCreateNestedManyWithoutBusinessInput = {
    create?: XOR<BookingCreateWithoutBusinessInput, BookingUncheckedCreateWithoutBusinessInput> | BookingCreateWithoutBusinessInput[] | BookingUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutBusinessInput | BookingCreateOrConnectWithoutBusinessInput[]
    createMany?: BookingCreateManyBusinessInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutBusinessesInput = {
    create?: XOR<UserCreateWithoutBusinessesInput, UserUncheckedCreateWithoutBusinessesInput>
    connectOrCreate?: UserCreateOrConnectWithoutBusinessesInput
    connect?: UserWhereUniqueInput
  }

  export type CustomerCreateNestedManyWithoutBusinessInput = {
    create?: XOR<CustomerCreateWithoutBusinessInput, CustomerUncheckedCreateWithoutBusinessInput> | CustomerCreateWithoutBusinessInput[] | CustomerUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutBusinessInput | CustomerCreateOrConnectWithoutBusinessInput[]
    createMany?: CustomerCreateManyBusinessInputEnvelope
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
  }

  export type InventoryCreateNestedManyWithoutBusinessInput = {
    create?: XOR<InventoryCreateWithoutBusinessInput, InventoryUncheckedCreateWithoutBusinessInput> | InventoryCreateWithoutBusinessInput[] | InventoryUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: InventoryCreateOrConnectWithoutBusinessInput | InventoryCreateOrConnectWithoutBusinessInput[]
    createMany?: InventoryCreateManyBusinessInputEnvelope
    connect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
  }

  export type PaymentCreateNestedManyWithoutBusinessInput = {
    create?: XOR<PaymentCreateWithoutBusinessInput, PaymentUncheckedCreateWithoutBusinessInput> | PaymentCreateWithoutBusinessInput[] | PaymentUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutBusinessInput | PaymentCreateOrConnectWithoutBusinessInput[]
    createMany?: PaymentCreateManyBusinessInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type CouponCreateNestedManyWithoutBusinessInput = {
    create?: XOR<CouponCreateWithoutBusinessInput, CouponUncheckedCreateWithoutBusinessInput> | CouponCreateWithoutBusinessInput[] | CouponUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: CouponCreateOrConnectWithoutBusinessInput | CouponCreateOrConnectWithoutBusinessInput[]
    createMany?: CouponCreateManyBusinessInputEnvelope
    connect?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
  }

  export type SalesFunnelCreateNestedManyWithoutBusinessInput = {
    create?: XOR<SalesFunnelCreateWithoutBusinessInput, SalesFunnelUncheckedCreateWithoutBusinessInput> | SalesFunnelCreateWithoutBusinessInput[] | SalesFunnelUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: SalesFunnelCreateOrConnectWithoutBusinessInput | SalesFunnelCreateOrConnectWithoutBusinessInput[]
    createMany?: SalesFunnelCreateManyBusinessInputEnvelope
    connect?: SalesFunnelWhereUniqueInput | SalesFunnelWhereUniqueInput[]
  }

  export type WaiverCreateNestedManyWithoutBusinessInput = {
    create?: XOR<WaiverCreateWithoutBusinessInput, WaiverUncheckedCreateWithoutBusinessInput> | WaiverCreateWithoutBusinessInput[] | WaiverUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: WaiverCreateOrConnectWithoutBusinessInput | WaiverCreateOrConnectWithoutBusinessInput[]
    createMany?: WaiverCreateManyBusinessInputEnvelope
    connect?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
  }

  export type BookingUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<BookingCreateWithoutBusinessInput, BookingUncheckedCreateWithoutBusinessInput> | BookingCreateWithoutBusinessInput[] | BookingUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutBusinessInput | BookingCreateOrConnectWithoutBusinessInput[]
    createMany?: BookingCreateManyBusinessInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type CustomerUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<CustomerCreateWithoutBusinessInput, CustomerUncheckedCreateWithoutBusinessInput> | CustomerCreateWithoutBusinessInput[] | CustomerUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutBusinessInput | CustomerCreateOrConnectWithoutBusinessInput[]
    createMany?: CustomerCreateManyBusinessInputEnvelope
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
  }

  export type InventoryUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<InventoryCreateWithoutBusinessInput, InventoryUncheckedCreateWithoutBusinessInput> | InventoryCreateWithoutBusinessInput[] | InventoryUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: InventoryCreateOrConnectWithoutBusinessInput | InventoryCreateOrConnectWithoutBusinessInput[]
    createMany?: InventoryCreateManyBusinessInputEnvelope
    connect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<PaymentCreateWithoutBusinessInput, PaymentUncheckedCreateWithoutBusinessInput> | PaymentCreateWithoutBusinessInput[] | PaymentUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutBusinessInput | PaymentCreateOrConnectWithoutBusinessInput[]
    createMany?: PaymentCreateManyBusinessInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type CouponUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<CouponCreateWithoutBusinessInput, CouponUncheckedCreateWithoutBusinessInput> | CouponCreateWithoutBusinessInput[] | CouponUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: CouponCreateOrConnectWithoutBusinessInput | CouponCreateOrConnectWithoutBusinessInput[]
    createMany?: CouponCreateManyBusinessInputEnvelope
    connect?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
  }

  export type SalesFunnelUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<SalesFunnelCreateWithoutBusinessInput, SalesFunnelUncheckedCreateWithoutBusinessInput> | SalesFunnelCreateWithoutBusinessInput[] | SalesFunnelUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: SalesFunnelCreateOrConnectWithoutBusinessInput | SalesFunnelCreateOrConnectWithoutBusinessInput[]
    createMany?: SalesFunnelCreateManyBusinessInputEnvelope
    connect?: SalesFunnelWhereUniqueInput | SalesFunnelWhereUniqueInput[]
  }

  export type WaiverUncheckedCreateNestedManyWithoutBusinessInput = {
    create?: XOR<WaiverCreateWithoutBusinessInput, WaiverUncheckedCreateWithoutBusinessInput> | WaiverCreateWithoutBusinessInput[] | WaiverUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: WaiverCreateOrConnectWithoutBusinessInput | WaiverCreateOrConnectWithoutBusinessInput[]
    createMany?: WaiverCreateManyBusinessInputEnvelope
    connect?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
  }

  export type BusinessUpdateserviceAreaInput = {
    set?: string[]
    push?: string | string[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BookingUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<BookingCreateWithoutBusinessInput, BookingUncheckedCreateWithoutBusinessInput> | BookingCreateWithoutBusinessInput[] | BookingUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutBusinessInput | BookingCreateOrConnectWithoutBusinessInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutBusinessInput | BookingUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: BookingCreateManyBusinessInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutBusinessInput | BookingUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutBusinessInput | BookingUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type UserUpdateOneRequiredWithoutBusinessesNestedInput = {
    create?: XOR<UserCreateWithoutBusinessesInput, UserUncheckedCreateWithoutBusinessesInput>
    connectOrCreate?: UserCreateOrConnectWithoutBusinessesInput
    upsert?: UserUpsertWithoutBusinessesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBusinessesInput, UserUpdateWithoutBusinessesInput>, UserUncheckedUpdateWithoutBusinessesInput>
  }

  export type CustomerUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<CustomerCreateWithoutBusinessInput, CustomerUncheckedCreateWithoutBusinessInput> | CustomerCreateWithoutBusinessInput[] | CustomerUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutBusinessInput | CustomerCreateOrConnectWithoutBusinessInput[]
    upsert?: CustomerUpsertWithWhereUniqueWithoutBusinessInput | CustomerUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: CustomerCreateManyBusinessInputEnvelope
    set?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    disconnect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    delete?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    update?: CustomerUpdateWithWhereUniqueWithoutBusinessInput | CustomerUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: CustomerUpdateManyWithWhereWithoutBusinessInput | CustomerUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
  }

  export type InventoryUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<InventoryCreateWithoutBusinessInput, InventoryUncheckedCreateWithoutBusinessInput> | InventoryCreateWithoutBusinessInput[] | InventoryUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: InventoryCreateOrConnectWithoutBusinessInput | InventoryCreateOrConnectWithoutBusinessInput[]
    upsert?: InventoryUpsertWithWhereUniqueWithoutBusinessInput | InventoryUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: InventoryCreateManyBusinessInputEnvelope
    set?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    disconnect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    delete?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    connect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    update?: InventoryUpdateWithWhereUniqueWithoutBusinessInput | InventoryUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: InventoryUpdateManyWithWhereWithoutBusinessInput | InventoryUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: InventoryScalarWhereInput | InventoryScalarWhereInput[]
  }

  export type PaymentUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<PaymentCreateWithoutBusinessInput, PaymentUncheckedCreateWithoutBusinessInput> | PaymentCreateWithoutBusinessInput[] | PaymentUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutBusinessInput | PaymentCreateOrConnectWithoutBusinessInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutBusinessInput | PaymentUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: PaymentCreateManyBusinessInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutBusinessInput | PaymentUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutBusinessInput | PaymentUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type CouponUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<CouponCreateWithoutBusinessInput, CouponUncheckedCreateWithoutBusinessInput> | CouponCreateWithoutBusinessInput[] | CouponUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: CouponCreateOrConnectWithoutBusinessInput | CouponCreateOrConnectWithoutBusinessInput[]
    upsert?: CouponUpsertWithWhereUniqueWithoutBusinessInput | CouponUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: CouponCreateManyBusinessInputEnvelope
    set?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
    disconnect?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
    delete?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
    connect?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
    update?: CouponUpdateWithWhereUniqueWithoutBusinessInput | CouponUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: CouponUpdateManyWithWhereWithoutBusinessInput | CouponUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: CouponScalarWhereInput | CouponScalarWhereInput[]
  }

  export type SalesFunnelUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<SalesFunnelCreateWithoutBusinessInput, SalesFunnelUncheckedCreateWithoutBusinessInput> | SalesFunnelCreateWithoutBusinessInput[] | SalesFunnelUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: SalesFunnelCreateOrConnectWithoutBusinessInput | SalesFunnelCreateOrConnectWithoutBusinessInput[]
    upsert?: SalesFunnelUpsertWithWhereUniqueWithoutBusinessInput | SalesFunnelUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: SalesFunnelCreateManyBusinessInputEnvelope
    set?: SalesFunnelWhereUniqueInput | SalesFunnelWhereUniqueInput[]
    disconnect?: SalesFunnelWhereUniqueInput | SalesFunnelWhereUniqueInput[]
    delete?: SalesFunnelWhereUniqueInput | SalesFunnelWhereUniqueInput[]
    connect?: SalesFunnelWhereUniqueInput | SalesFunnelWhereUniqueInput[]
    update?: SalesFunnelUpdateWithWhereUniqueWithoutBusinessInput | SalesFunnelUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: SalesFunnelUpdateManyWithWhereWithoutBusinessInput | SalesFunnelUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: SalesFunnelScalarWhereInput | SalesFunnelScalarWhereInput[]
  }

  export type WaiverUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<WaiverCreateWithoutBusinessInput, WaiverUncheckedCreateWithoutBusinessInput> | WaiverCreateWithoutBusinessInput[] | WaiverUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: WaiverCreateOrConnectWithoutBusinessInput | WaiverCreateOrConnectWithoutBusinessInput[]
    upsert?: WaiverUpsertWithWhereUniqueWithoutBusinessInput | WaiverUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: WaiverCreateManyBusinessInputEnvelope
    set?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    disconnect?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    delete?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    connect?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    update?: WaiverUpdateWithWhereUniqueWithoutBusinessInput | WaiverUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: WaiverUpdateManyWithWhereWithoutBusinessInput | WaiverUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: WaiverScalarWhereInput | WaiverScalarWhereInput[]
  }

  export type BookingUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<BookingCreateWithoutBusinessInput, BookingUncheckedCreateWithoutBusinessInput> | BookingCreateWithoutBusinessInput[] | BookingUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutBusinessInput | BookingCreateOrConnectWithoutBusinessInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutBusinessInput | BookingUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: BookingCreateManyBusinessInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutBusinessInput | BookingUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutBusinessInput | BookingUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type CustomerUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<CustomerCreateWithoutBusinessInput, CustomerUncheckedCreateWithoutBusinessInput> | CustomerCreateWithoutBusinessInput[] | CustomerUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: CustomerCreateOrConnectWithoutBusinessInput | CustomerCreateOrConnectWithoutBusinessInput[]
    upsert?: CustomerUpsertWithWhereUniqueWithoutBusinessInput | CustomerUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: CustomerCreateManyBusinessInputEnvelope
    set?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    disconnect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    delete?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    connect?: CustomerWhereUniqueInput | CustomerWhereUniqueInput[]
    update?: CustomerUpdateWithWhereUniqueWithoutBusinessInput | CustomerUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: CustomerUpdateManyWithWhereWithoutBusinessInput | CustomerUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
  }

  export type InventoryUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<InventoryCreateWithoutBusinessInput, InventoryUncheckedCreateWithoutBusinessInput> | InventoryCreateWithoutBusinessInput[] | InventoryUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: InventoryCreateOrConnectWithoutBusinessInput | InventoryCreateOrConnectWithoutBusinessInput[]
    upsert?: InventoryUpsertWithWhereUniqueWithoutBusinessInput | InventoryUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: InventoryCreateManyBusinessInputEnvelope
    set?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    disconnect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    delete?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    connect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    update?: InventoryUpdateWithWhereUniqueWithoutBusinessInput | InventoryUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: InventoryUpdateManyWithWhereWithoutBusinessInput | InventoryUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: InventoryScalarWhereInput | InventoryScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<PaymentCreateWithoutBusinessInput, PaymentUncheckedCreateWithoutBusinessInput> | PaymentCreateWithoutBusinessInput[] | PaymentUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutBusinessInput | PaymentCreateOrConnectWithoutBusinessInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutBusinessInput | PaymentUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: PaymentCreateManyBusinessInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutBusinessInput | PaymentUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutBusinessInput | PaymentUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type CouponUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<CouponCreateWithoutBusinessInput, CouponUncheckedCreateWithoutBusinessInput> | CouponCreateWithoutBusinessInput[] | CouponUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: CouponCreateOrConnectWithoutBusinessInput | CouponCreateOrConnectWithoutBusinessInput[]
    upsert?: CouponUpsertWithWhereUniqueWithoutBusinessInput | CouponUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: CouponCreateManyBusinessInputEnvelope
    set?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
    disconnect?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
    delete?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
    connect?: CouponWhereUniqueInput | CouponWhereUniqueInput[]
    update?: CouponUpdateWithWhereUniqueWithoutBusinessInput | CouponUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: CouponUpdateManyWithWhereWithoutBusinessInput | CouponUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: CouponScalarWhereInput | CouponScalarWhereInput[]
  }

  export type SalesFunnelUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<SalesFunnelCreateWithoutBusinessInput, SalesFunnelUncheckedCreateWithoutBusinessInput> | SalesFunnelCreateWithoutBusinessInput[] | SalesFunnelUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: SalesFunnelCreateOrConnectWithoutBusinessInput | SalesFunnelCreateOrConnectWithoutBusinessInput[]
    upsert?: SalesFunnelUpsertWithWhereUniqueWithoutBusinessInput | SalesFunnelUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: SalesFunnelCreateManyBusinessInputEnvelope
    set?: SalesFunnelWhereUniqueInput | SalesFunnelWhereUniqueInput[]
    disconnect?: SalesFunnelWhereUniqueInput | SalesFunnelWhereUniqueInput[]
    delete?: SalesFunnelWhereUniqueInput | SalesFunnelWhereUniqueInput[]
    connect?: SalesFunnelWhereUniqueInput | SalesFunnelWhereUniqueInput[]
    update?: SalesFunnelUpdateWithWhereUniqueWithoutBusinessInput | SalesFunnelUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: SalesFunnelUpdateManyWithWhereWithoutBusinessInput | SalesFunnelUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: SalesFunnelScalarWhereInput | SalesFunnelScalarWhereInput[]
  }

  export type WaiverUncheckedUpdateManyWithoutBusinessNestedInput = {
    create?: XOR<WaiverCreateWithoutBusinessInput, WaiverUncheckedCreateWithoutBusinessInput> | WaiverCreateWithoutBusinessInput[] | WaiverUncheckedCreateWithoutBusinessInput[]
    connectOrCreate?: WaiverCreateOrConnectWithoutBusinessInput | WaiverCreateOrConnectWithoutBusinessInput[]
    upsert?: WaiverUpsertWithWhereUniqueWithoutBusinessInput | WaiverUpsertWithWhereUniqueWithoutBusinessInput[]
    createMany?: WaiverCreateManyBusinessInputEnvelope
    set?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    disconnect?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    delete?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    connect?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    update?: WaiverUpdateWithWhereUniqueWithoutBusinessInput | WaiverUpdateWithWhereUniqueWithoutBusinessInput[]
    updateMany?: WaiverUpdateManyWithWhereWithoutBusinessInput | WaiverUpdateManyWithWhereWithoutBusinessInput[]
    deleteMany?: WaiverScalarWhereInput | WaiverScalarWhereInput[]
  }

  export type InventoryCreateimagesInput = {
    set: string[]
  }

  export type InventoryCreateweatherRestrictionsInput = {
    set: string[]
  }

  export type BookingItemCreateNestedManyWithoutInventoryInput = {
    create?: XOR<BookingItemCreateWithoutInventoryInput, BookingItemUncheckedCreateWithoutInventoryInput> | BookingItemCreateWithoutInventoryInput[] | BookingItemUncheckedCreateWithoutInventoryInput[]
    connectOrCreate?: BookingItemCreateOrConnectWithoutInventoryInput | BookingItemCreateOrConnectWithoutInventoryInput[]
    createMany?: BookingItemCreateManyInventoryInputEnvelope
    connect?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
  }

  export type BusinessCreateNestedOneWithoutInventoryInput = {
    create?: XOR<BusinessCreateWithoutInventoryInput, BusinessUncheckedCreateWithoutInventoryInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutInventoryInput
    connect?: BusinessWhereUniqueInput
  }

  export type BookingItemUncheckedCreateNestedManyWithoutInventoryInput = {
    create?: XOR<BookingItemCreateWithoutInventoryInput, BookingItemUncheckedCreateWithoutInventoryInput> | BookingItemCreateWithoutInventoryInput[] | BookingItemUncheckedCreateWithoutInventoryInput[]
    connectOrCreate?: BookingItemCreateOrConnectWithoutInventoryInput | BookingItemCreateOrConnectWithoutInventoryInput[]
    createMany?: BookingItemCreateManyInventoryInputEnvelope
    connect?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
  }

  export type EnumInventoryTypeFieldUpdateOperationsInput = {
    set?: $Enums.InventoryType
  }

  export type InventoryUpdateimagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumInventoryStatusFieldUpdateOperationsInput = {
    set?: $Enums.InventoryStatus
  }

  export type InventoryUpdateweatherRestrictionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type BookingItemUpdateManyWithoutInventoryNestedInput = {
    create?: XOR<BookingItemCreateWithoutInventoryInput, BookingItemUncheckedCreateWithoutInventoryInput> | BookingItemCreateWithoutInventoryInput[] | BookingItemUncheckedCreateWithoutInventoryInput[]
    connectOrCreate?: BookingItemCreateOrConnectWithoutInventoryInput | BookingItemCreateOrConnectWithoutInventoryInput[]
    upsert?: BookingItemUpsertWithWhereUniqueWithoutInventoryInput | BookingItemUpsertWithWhereUniqueWithoutInventoryInput[]
    createMany?: BookingItemCreateManyInventoryInputEnvelope
    set?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
    disconnect?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
    delete?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
    connect?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
    update?: BookingItemUpdateWithWhereUniqueWithoutInventoryInput | BookingItemUpdateWithWhereUniqueWithoutInventoryInput[]
    updateMany?: BookingItemUpdateManyWithWhereWithoutInventoryInput | BookingItemUpdateManyWithWhereWithoutInventoryInput[]
    deleteMany?: BookingItemScalarWhereInput | BookingItemScalarWhereInput[]
  }

  export type BusinessUpdateOneRequiredWithoutInventoryNestedInput = {
    create?: XOR<BusinessCreateWithoutInventoryInput, BusinessUncheckedCreateWithoutInventoryInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutInventoryInput
    upsert?: BusinessUpsertWithoutInventoryInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutInventoryInput, BusinessUpdateWithoutInventoryInput>, BusinessUncheckedUpdateWithoutInventoryInput>
  }

  export type BookingItemUncheckedUpdateManyWithoutInventoryNestedInput = {
    create?: XOR<BookingItemCreateWithoutInventoryInput, BookingItemUncheckedCreateWithoutInventoryInput> | BookingItemCreateWithoutInventoryInput[] | BookingItemUncheckedCreateWithoutInventoryInput[]
    connectOrCreate?: BookingItemCreateOrConnectWithoutInventoryInput | BookingItemCreateOrConnectWithoutInventoryInput[]
    upsert?: BookingItemUpsertWithWhereUniqueWithoutInventoryInput | BookingItemUpsertWithWhereUniqueWithoutInventoryInput[]
    createMany?: BookingItemCreateManyInventoryInputEnvelope
    set?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
    disconnect?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
    delete?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
    connect?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
    update?: BookingItemUpdateWithWhereUniqueWithoutInventoryInput | BookingItemUpdateWithWhereUniqueWithoutInventoryInput[]
    updateMany?: BookingItemUpdateManyWithWhereWithoutInventoryInput | BookingItemUpdateManyWithWhereWithoutInventoryInput[]
    deleteMany?: BookingItemScalarWhereInput | BookingItemScalarWhereInput[]
  }

  export type BookingCreateNestedManyWithoutCustomerInput = {
    create?: XOR<BookingCreateWithoutCustomerInput, BookingUncheckedCreateWithoutCustomerInput> | BookingCreateWithoutCustomerInput[] | BookingUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutCustomerInput | BookingCreateOrConnectWithoutCustomerInput[]
    createMany?: BookingCreateManyCustomerInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type WaiverCreateNestedManyWithoutCustomerInput = {
    create?: XOR<WaiverCreateWithoutCustomerInput, WaiverUncheckedCreateWithoutCustomerInput> | WaiverCreateWithoutCustomerInput[] | WaiverUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: WaiverCreateOrConnectWithoutCustomerInput | WaiverCreateOrConnectWithoutCustomerInput[]
    createMany?: WaiverCreateManyCustomerInputEnvelope
    connect?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
  }

  export type BusinessCreateNestedOneWithoutCustomersInput = {
    create?: XOR<BusinessCreateWithoutCustomersInput, BusinessUncheckedCreateWithoutCustomersInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutCustomersInput
    connect?: BusinessWhereUniqueInput
  }

  export type BookingUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<BookingCreateWithoutCustomerInput, BookingUncheckedCreateWithoutCustomerInput> | BookingCreateWithoutCustomerInput[] | BookingUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutCustomerInput | BookingCreateOrConnectWithoutCustomerInput[]
    createMany?: BookingCreateManyCustomerInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type WaiverUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<WaiverCreateWithoutCustomerInput, WaiverUncheckedCreateWithoutCustomerInput> | WaiverCreateWithoutCustomerInput[] | WaiverUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: WaiverCreateOrConnectWithoutCustomerInput | WaiverCreateOrConnectWithoutCustomerInput[]
    createMany?: WaiverCreateManyCustomerInputEnvelope
    connect?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BookingUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<BookingCreateWithoutCustomerInput, BookingUncheckedCreateWithoutCustomerInput> | BookingCreateWithoutCustomerInput[] | BookingUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutCustomerInput | BookingCreateOrConnectWithoutCustomerInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutCustomerInput | BookingUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: BookingCreateManyCustomerInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutCustomerInput | BookingUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutCustomerInput | BookingUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type WaiverUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<WaiverCreateWithoutCustomerInput, WaiverUncheckedCreateWithoutCustomerInput> | WaiverCreateWithoutCustomerInput[] | WaiverUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: WaiverCreateOrConnectWithoutCustomerInput | WaiverCreateOrConnectWithoutCustomerInput[]
    upsert?: WaiverUpsertWithWhereUniqueWithoutCustomerInput | WaiverUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: WaiverCreateManyCustomerInputEnvelope
    set?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    disconnect?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    delete?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    connect?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    update?: WaiverUpdateWithWhereUniqueWithoutCustomerInput | WaiverUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: WaiverUpdateManyWithWhereWithoutCustomerInput | WaiverUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: WaiverScalarWhereInput | WaiverScalarWhereInput[]
  }

  export type BusinessUpdateOneRequiredWithoutCustomersNestedInput = {
    create?: XOR<BusinessCreateWithoutCustomersInput, BusinessUncheckedCreateWithoutCustomersInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutCustomersInput
    upsert?: BusinessUpsertWithoutCustomersInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutCustomersInput, BusinessUpdateWithoutCustomersInput>, BusinessUncheckedUpdateWithoutCustomersInput>
  }

  export type BookingUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<BookingCreateWithoutCustomerInput, BookingUncheckedCreateWithoutCustomerInput> | BookingCreateWithoutCustomerInput[] | BookingUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutCustomerInput | BookingCreateOrConnectWithoutCustomerInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutCustomerInput | BookingUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: BookingCreateManyCustomerInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutCustomerInput | BookingUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutCustomerInput | BookingUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type WaiverUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<WaiverCreateWithoutCustomerInput, WaiverUncheckedCreateWithoutCustomerInput> | WaiverCreateWithoutCustomerInput[] | WaiverUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: WaiverCreateOrConnectWithoutCustomerInput | WaiverCreateOrConnectWithoutCustomerInput[]
    upsert?: WaiverUpsertWithWhereUniqueWithoutCustomerInput | WaiverUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: WaiverCreateManyCustomerInputEnvelope
    set?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    disconnect?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    delete?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    connect?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    update?: WaiverUpdateWithWhereUniqueWithoutCustomerInput | WaiverUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: WaiverUpdateManyWithWhereWithoutCustomerInput | WaiverUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: WaiverScalarWhereInput | WaiverScalarWhereInput[]
  }

  export type BusinessCreateNestedOneWithoutBookingsInput = {
    create?: XOR<BusinessCreateWithoutBookingsInput, BusinessUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutBookingsInput
    connect?: BusinessWhereUniqueInput
  }

  export type CustomerCreateNestedOneWithoutBookingsInput = {
    create?: XOR<CustomerCreateWithoutBookingsInput, CustomerUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutBookingsInput
    connect?: CustomerWhereUniqueInput
  }

  export type BookingItemCreateNestedManyWithoutBookingInput = {
    create?: XOR<BookingItemCreateWithoutBookingInput, BookingItemUncheckedCreateWithoutBookingInput> | BookingItemCreateWithoutBookingInput[] | BookingItemUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: BookingItemCreateOrConnectWithoutBookingInput | BookingItemCreateOrConnectWithoutBookingInput[]
    createMany?: BookingItemCreateManyBookingInputEnvelope
    connect?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
  }

  export type PaymentCreateNestedManyWithoutBookingInput = {
    create?: XOR<PaymentCreateWithoutBookingInput, PaymentUncheckedCreateWithoutBookingInput> | PaymentCreateWithoutBookingInput[] | PaymentUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutBookingInput | PaymentCreateOrConnectWithoutBookingInput[]
    createMany?: PaymentCreateManyBookingInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type WaiverCreateNestedManyWithoutBookingInput = {
    create?: XOR<WaiverCreateWithoutBookingInput, WaiverUncheckedCreateWithoutBookingInput> | WaiverCreateWithoutBookingInput[] | WaiverUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: WaiverCreateOrConnectWithoutBookingInput | WaiverCreateOrConnectWithoutBookingInput[]
    createMany?: WaiverCreateManyBookingInputEnvelope
    connect?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
  }

  export type BookingItemUncheckedCreateNestedManyWithoutBookingInput = {
    create?: XOR<BookingItemCreateWithoutBookingInput, BookingItemUncheckedCreateWithoutBookingInput> | BookingItemCreateWithoutBookingInput[] | BookingItemUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: BookingItemCreateOrConnectWithoutBookingInput | BookingItemCreateOrConnectWithoutBookingInput[]
    createMany?: BookingItemCreateManyBookingInputEnvelope
    connect?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutBookingInput = {
    create?: XOR<PaymentCreateWithoutBookingInput, PaymentUncheckedCreateWithoutBookingInput> | PaymentCreateWithoutBookingInput[] | PaymentUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutBookingInput | PaymentCreateOrConnectWithoutBookingInput[]
    createMany?: PaymentCreateManyBookingInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type WaiverUncheckedCreateNestedManyWithoutBookingInput = {
    create?: XOR<WaiverCreateWithoutBookingInput, WaiverUncheckedCreateWithoutBookingInput> | WaiverCreateWithoutBookingInput[] | WaiverUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: WaiverCreateOrConnectWithoutBookingInput | WaiverCreateOrConnectWithoutBookingInput[]
    createMany?: WaiverCreateManyBookingInputEnvelope
    connect?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
  }

  export type EnumBookingStatusFieldUpdateOperationsInput = {
    set?: $Enums.BookingStatus
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BusinessUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: XOR<BusinessCreateWithoutBookingsInput, BusinessUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutBookingsInput
    upsert?: BusinessUpsertWithoutBookingsInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutBookingsInput, BusinessUpdateWithoutBookingsInput>, BusinessUncheckedUpdateWithoutBookingsInput>
  }

  export type CustomerUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: XOR<CustomerCreateWithoutBookingsInput, CustomerUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutBookingsInput
    upsert?: CustomerUpsertWithoutBookingsInput
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutBookingsInput, CustomerUpdateWithoutBookingsInput>, CustomerUncheckedUpdateWithoutBookingsInput>
  }

  export type BookingItemUpdateManyWithoutBookingNestedInput = {
    create?: XOR<BookingItemCreateWithoutBookingInput, BookingItemUncheckedCreateWithoutBookingInput> | BookingItemCreateWithoutBookingInput[] | BookingItemUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: BookingItemCreateOrConnectWithoutBookingInput | BookingItemCreateOrConnectWithoutBookingInput[]
    upsert?: BookingItemUpsertWithWhereUniqueWithoutBookingInput | BookingItemUpsertWithWhereUniqueWithoutBookingInput[]
    createMany?: BookingItemCreateManyBookingInputEnvelope
    set?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
    disconnect?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
    delete?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
    connect?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
    update?: BookingItemUpdateWithWhereUniqueWithoutBookingInput | BookingItemUpdateWithWhereUniqueWithoutBookingInput[]
    updateMany?: BookingItemUpdateManyWithWhereWithoutBookingInput | BookingItemUpdateManyWithWhereWithoutBookingInput[]
    deleteMany?: BookingItemScalarWhereInput | BookingItemScalarWhereInput[]
  }

  export type PaymentUpdateManyWithoutBookingNestedInput = {
    create?: XOR<PaymentCreateWithoutBookingInput, PaymentUncheckedCreateWithoutBookingInput> | PaymentCreateWithoutBookingInput[] | PaymentUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutBookingInput | PaymentCreateOrConnectWithoutBookingInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutBookingInput | PaymentUpsertWithWhereUniqueWithoutBookingInput[]
    createMany?: PaymentCreateManyBookingInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutBookingInput | PaymentUpdateWithWhereUniqueWithoutBookingInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutBookingInput | PaymentUpdateManyWithWhereWithoutBookingInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type WaiverUpdateManyWithoutBookingNestedInput = {
    create?: XOR<WaiverCreateWithoutBookingInput, WaiverUncheckedCreateWithoutBookingInput> | WaiverCreateWithoutBookingInput[] | WaiverUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: WaiverCreateOrConnectWithoutBookingInput | WaiverCreateOrConnectWithoutBookingInput[]
    upsert?: WaiverUpsertWithWhereUniqueWithoutBookingInput | WaiverUpsertWithWhereUniqueWithoutBookingInput[]
    createMany?: WaiverCreateManyBookingInputEnvelope
    set?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    disconnect?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    delete?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    connect?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    update?: WaiverUpdateWithWhereUniqueWithoutBookingInput | WaiverUpdateWithWhereUniqueWithoutBookingInput[]
    updateMany?: WaiverUpdateManyWithWhereWithoutBookingInput | WaiverUpdateManyWithWhereWithoutBookingInput[]
    deleteMany?: WaiverScalarWhereInput | WaiverScalarWhereInput[]
  }

  export type BookingItemUncheckedUpdateManyWithoutBookingNestedInput = {
    create?: XOR<BookingItemCreateWithoutBookingInput, BookingItemUncheckedCreateWithoutBookingInput> | BookingItemCreateWithoutBookingInput[] | BookingItemUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: BookingItemCreateOrConnectWithoutBookingInput | BookingItemCreateOrConnectWithoutBookingInput[]
    upsert?: BookingItemUpsertWithWhereUniqueWithoutBookingInput | BookingItemUpsertWithWhereUniqueWithoutBookingInput[]
    createMany?: BookingItemCreateManyBookingInputEnvelope
    set?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
    disconnect?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
    delete?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
    connect?: BookingItemWhereUniqueInput | BookingItemWhereUniqueInput[]
    update?: BookingItemUpdateWithWhereUniqueWithoutBookingInput | BookingItemUpdateWithWhereUniqueWithoutBookingInput[]
    updateMany?: BookingItemUpdateManyWithWhereWithoutBookingInput | BookingItemUpdateManyWithWhereWithoutBookingInput[]
    deleteMany?: BookingItemScalarWhereInput | BookingItemScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutBookingNestedInput = {
    create?: XOR<PaymentCreateWithoutBookingInput, PaymentUncheckedCreateWithoutBookingInput> | PaymentCreateWithoutBookingInput[] | PaymentUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutBookingInput | PaymentCreateOrConnectWithoutBookingInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutBookingInput | PaymentUpsertWithWhereUniqueWithoutBookingInput[]
    createMany?: PaymentCreateManyBookingInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutBookingInput | PaymentUpdateWithWhereUniqueWithoutBookingInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutBookingInput | PaymentUpdateManyWithWhereWithoutBookingInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type WaiverUncheckedUpdateManyWithoutBookingNestedInput = {
    create?: XOR<WaiverCreateWithoutBookingInput, WaiverUncheckedCreateWithoutBookingInput> | WaiverCreateWithoutBookingInput[] | WaiverUncheckedCreateWithoutBookingInput[]
    connectOrCreate?: WaiverCreateOrConnectWithoutBookingInput | WaiverCreateOrConnectWithoutBookingInput[]
    upsert?: WaiverUpsertWithWhereUniqueWithoutBookingInput | WaiverUpsertWithWhereUniqueWithoutBookingInput[]
    createMany?: WaiverCreateManyBookingInputEnvelope
    set?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    disconnect?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    delete?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    connect?: WaiverWhereUniqueInput | WaiverWhereUniqueInput[]
    update?: WaiverUpdateWithWhereUniqueWithoutBookingInput | WaiverUpdateWithWhereUniqueWithoutBookingInput[]
    updateMany?: WaiverUpdateManyWithWhereWithoutBookingInput | WaiverUpdateManyWithWhereWithoutBookingInput[]
    deleteMany?: WaiverScalarWhereInput | WaiverScalarWhereInput[]
  }

  export type BookingCreateNestedOneWithoutInventoryItemsInput = {
    create?: XOR<BookingCreateWithoutInventoryItemsInput, BookingUncheckedCreateWithoutInventoryItemsInput>
    connectOrCreate?: BookingCreateOrConnectWithoutInventoryItemsInput
    connect?: BookingWhereUniqueInput
  }

  export type InventoryCreateNestedOneWithoutBookingItemsInput = {
    create?: XOR<InventoryCreateWithoutBookingItemsInput, InventoryUncheckedCreateWithoutBookingItemsInput>
    connectOrCreate?: InventoryCreateOrConnectWithoutBookingItemsInput
    connect?: InventoryWhereUniqueInput
  }

  export type BookingUpdateOneRequiredWithoutInventoryItemsNestedInput = {
    create?: XOR<BookingCreateWithoutInventoryItemsInput, BookingUncheckedCreateWithoutInventoryItemsInput>
    connectOrCreate?: BookingCreateOrConnectWithoutInventoryItemsInput
    upsert?: BookingUpsertWithoutInventoryItemsInput
    connect?: BookingWhereUniqueInput
    update?: XOR<XOR<BookingUpdateToOneWithWhereWithoutInventoryItemsInput, BookingUpdateWithoutInventoryItemsInput>, BookingUncheckedUpdateWithoutInventoryItemsInput>
  }

  export type InventoryUpdateOneRequiredWithoutBookingItemsNestedInput = {
    create?: XOR<InventoryCreateWithoutBookingItemsInput, InventoryUncheckedCreateWithoutBookingItemsInput>
    connectOrCreate?: InventoryCreateOrConnectWithoutBookingItemsInput
    upsert?: InventoryUpsertWithoutBookingItemsInput
    connect?: InventoryWhereUniqueInput
    update?: XOR<XOR<InventoryUpdateToOneWithWhereWithoutBookingItemsInput, InventoryUpdateWithoutBookingItemsInput>, InventoryUncheckedUpdateWithoutBookingItemsInput>
  }

  export type BookingCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<BookingCreateWithoutPaymentsInput, BookingUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: BookingCreateOrConnectWithoutPaymentsInput
    connect?: BookingWhereUniqueInput
  }

  export type BusinessCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<BusinessCreateWithoutPaymentsInput, BusinessUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutPaymentsInput
    connect?: BusinessWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumPaymentTypeFieldUpdateOperationsInput = {
    set?: $Enums.PaymentType
  }

  export type EnumPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentStatus
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type BookingUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<BookingCreateWithoutPaymentsInput, BookingUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: BookingCreateOrConnectWithoutPaymentsInput
    upsert?: BookingUpsertWithoutPaymentsInput
    connect?: BookingWhereUniqueInput
    update?: XOR<XOR<BookingUpdateToOneWithWhereWithoutPaymentsInput, BookingUpdateWithoutPaymentsInput>, BookingUncheckedUpdateWithoutPaymentsInput>
  }

  export type BusinessUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<BusinessCreateWithoutPaymentsInput, BusinessUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutPaymentsInput
    upsert?: BusinessUpsertWithoutPaymentsInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutPaymentsInput, BusinessUpdateWithoutPaymentsInput>, BusinessUncheckedUpdateWithoutPaymentsInput>
  }

  export type BusinessCreateNestedOneWithoutCouponsInput = {
    create?: XOR<BusinessCreateWithoutCouponsInput, BusinessUncheckedCreateWithoutCouponsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutCouponsInput
    connect?: BusinessWhereUniqueInput
  }

  export type EnumDiscountTypeFieldUpdateOperationsInput = {
    set?: $Enums.DiscountType
  }

  export type BusinessUpdateOneRequiredWithoutCouponsNestedInput = {
    create?: XOR<BusinessCreateWithoutCouponsInput, BusinessUncheckedCreateWithoutCouponsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutCouponsInput
    upsert?: BusinessUpsertWithoutCouponsInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutCouponsInput, BusinessUpdateWithoutCouponsInput>, BusinessUncheckedUpdateWithoutCouponsInput>
  }

  export type BusinessCreateNestedOneWithoutSalesFunnelsInput = {
    create?: XOR<BusinessCreateWithoutSalesFunnelsInput, BusinessUncheckedCreateWithoutSalesFunnelsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutSalesFunnelsInput
    connect?: BusinessWhereUniqueInput
  }

  export type BusinessUpdateOneRequiredWithoutSalesFunnelsNestedInput = {
    create?: XOR<BusinessCreateWithoutSalesFunnelsInput, BusinessUncheckedCreateWithoutSalesFunnelsInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutSalesFunnelsInput
    upsert?: BusinessUpsertWithoutSalesFunnelsInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutSalesFunnelsInput, BusinessUpdateWithoutSalesFunnelsInput>, BusinessUncheckedUpdateWithoutSalesFunnelsInput>
  }

  export type BusinessCreateNestedOneWithoutWaiversInput = {
    create?: XOR<BusinessCreateWithoutWaiversInput, BusinessUncheckedCreateWithoutWaiversInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutWaiversInput
    connect?: BusinessWhereUniqueInput
  }

  export type CustomerCreateNestedOneWithoutWaiversInput = {
    create?: XOR<CustomerCreateWithoutWaiversInput, CustomerUncheckedCreateWithoutWaiversInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutWaiversInput
    connect?: CustomerWhereUniqueInput
  }

  export type BookingCreateNestedOneWithoutWaiversInput = {
    create?: XOR<BookingCreateWithoutWaiversInput, BookingUncheckedCreateWithoutWaiversInput>
    connectOrCreate?: BookingCreateOrConnectWithoutWaiversInput
    connect?: BookingWhereUniqueInput
  }

  export type EnumWaiverStatusFieldUpdateOperationsInput = {
    set?: $Enums.WaiverStatus
  }

  export type BusinessUpdateOneRequiredWithoutWaiversNestedInput = {
    create?: XOR<BusinessCreateWithoutWaiversInput, BusinessUncheckedCreateWithoutWaiversInput>
    connectOrCreate?: BusinessCreateOrConnectWithoutWaiversInput
    upsert?: BusinessUpsertWithoutWaiversInput
    connect?: BusinessWhereUniqueInput
    update?: XOR<XOR<BusinessUpdateToOneWithWhereWithoutWaiversInput, BusinessUpdateWithoutWaiversInput>, BusinessUncheckedUpdateWithoutWaiversInput>
  }

  export type CustomerUpdateOneRequiredWithoutWaiversNestedInput = {
    create?: XOR<CustomerCreateWithoutWaiversInput, CustomerUncheckedCreateWithoutWaiversInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutWaiversInput
    upsert?: CustomerUpsertWithoutWaiversInput
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutWaiversInput, CustomerUpdateWithoutWaiversInput>, CustomerUncheckedUpdateWithoutWaiversInput>
  }

  export type BookingUpdateOneRequiredWithoutWaiversNestedInput = {
    create?: XOR<BookingCreateWithoutWaiversInput, BookingUncheckedCreateWithoutWaiversInput>
    connectOrCreate?: BookingCreateOrConnectWithoutWaiversInput
    upsert?: BookingUpsertWithoutWaiversInput
    connect?: BookingWhereUniqueInput
    update?: XOR<XOR<BookingUpdateToOneWithWhereWithoutWaiversInput, BookingUpdateWithoutWaiversInput>, BookingUncheckedUpdateWithoutWaiversInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumInventoryTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.InventoryType | EnumInventoryTypeFieldRefInput<$PrismaModel>
    in?: $Enums.InventoryType[] | ListEnumInventoryTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InventoryType[] | ListEnumInventoryTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumInventoryTypeFilter<$PrismaModel> | $Enums.InventoryType
  }

  export type NestedEnumInventoryStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InventoryStatus | EnumInventoryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InventoryStatus[] | ListEnumInventoryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InventoryStatus[] | ListEnumInventoryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInventoryStatusFilter<$PrismaModel> | $Enums.InventoryStatus
  }

  export type NestedEnumInventoryTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InventoryType | EnumInventoryTypeFieldRefInput<$PrismaModel>
    in?: $Enums.InventoryType[] | ListEnumInventoryTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InventoryType[] | ListEnumInventoryTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumInventoryTypeWithAggregatesFilter<$PrismaModel> | $Enums.InventoryType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInventoryTypeFilter<$PrismaModel>
    _max?: NestedEnumInventoryTypeFilter<$PrismaModel>
  }

  export type NestedEnumInventoryStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InventoryStatus | EnumInventoryStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InventoryStatus[] | ListEnumInventoryStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InventoryStatus[] | ListEnumInventoryStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInventoryStatusWithAggregatesFilter<$PrismaModel> | $Enums.InventoryStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInventoryStatusFilter<$PrismaModel>
    _max?: NestedEnumInventoryStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumBookingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStatusFilter<$PrismaModel> | $Enums.BookingStatus
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBookingStatusFilter<$PrismaModel>
    _max?: NestedEnumBookingStatusFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumPaymentTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentType | EnumPaymentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentTypeFilter<$PrismaModel> | $Enums.PaymentType
  }

  export type NestedEnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumPaymentTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentType | EnumPaymentTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentType[] | ListEnumPaymentTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentTypeWithAggregatesFilter<$PrismaModel> | $Enums.PaymentType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentTypeFilter<$PrismaModel>
    _max?: NestedEnumPaymentTypeFilter<$PrismaModel>
  }

  export type NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentStatus | EnumPaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentStatus[] | ListEnumPaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.PaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedEnumDiscountTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DiscountType | EnumDiscountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DiscountType[] | ListEnumDiscountTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DiscountType[] | ListEnumDiscountTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDiscountTypeFilter<$PrismaModel> | $Enums.DiscountType
  }

  export type NestedEnumDiscountTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DiscountType | EnumDiscountTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DiscountType[] | ListEnumDiscountTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.DiscountType[] | ListEnumDiscountTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumDiscountTypeWithAggregatesFilter<$PrismaModel> | $Enums.DiscountType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDiscountTypeFilter<$PrismaModel>
    _max?: NestedEnumDiscountTypeFilter<$PrismaModel>
  }

  export type NestedEnumWaiverStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.WaiverStatus | EnumWaiverStatusFieldRefInput<$PrismaModel>
    in?: $Enums.WaiverStatus[] | ListEnumWaiverStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.WaiverStatus[] | ListEnumWaiverStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumWaiverStatusFilter<$PrismaModel> | $Enums.WaiverStatus
  }

  export type NestedEnumWaiverStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WaiverStatus | EnumWaiverStatusFieldRefInput<$PrismaModel>
    in?: $Enums.WaiverStatus[] | ListEnumWaiverStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.WaiverStatus[] | ListEnumWaiverStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumWaiverStatusWithAggregatesFilter<$PrismaModel> | $Enums.WaiverStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumWaiverStatusFilter<$PrismaModel>
    _max?: NestedEnumWaiverStatusFilter<$PrismaModel>
  }

  export type BusinessCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
    bookings?: BookingCreateNestedManyWithoutBusinessInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    inventory?: InventoryCreateNestedManyWithoutBusinessInput
    payments?: PaymentCreateNestedManyWithoutBusinessInput
    coupons?: CouponCreateNestedManyWithoutBusinessInput
    salesFunnels?: SalesFunnelCreateNestedManyWithoutBusinessInput
    waivers?: WaiverCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
    bookings?: BookingUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    inventory?: InventoryUncheckedCreateNestedManyWithoutBusinessInput
    payments?: PaymentUncheckedCreateNestedManyWithoutBusinessInput
    coupons?: CouponUncheckedCreateNestedManyWithoutBusinessInput
    salesFunnels?: SalesFunnelUncheckedCreateNestedManyWithoutBusinessInput
    waivers?: WaiverUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutUserInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutUserInput, BusinessUncheckedCreateWithoutUserInput>
  }

  export type BusinessCreateManyUserInputEnvelope = {
    data: BusinessCreateManyUserInput | BusinessCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type BusinessUpsertWithWhereUniqueWithoutUserInput = {
    where: BusinessWhereUniqueInput
    update: XOR<BusinessUpdateWithoutUserInput, BusinessUncheckedUpdateWithoutUserInput>
    create: XOR<BusinessCreateWithoutUserInput, BusinessUncheckedCreateWithoutUserInput>
  }

  export type BusinessUpdateWithWhereUniqueWithoutUserInput = {
    where: BusinessWhereUniqueInput
    data: XOR<BusinessUpdateWithoutUserInput, BusinessUncheckedUpdateWithoutUserInput>
  }

  export type BusinessUpdateManyWithWhereWithoutUserInput = {
    where: BusinessScalarWhereInput
    data: XOR<BusinessUpdateManyMutationInput, BusinessUncheckedUpdateManyWithoutUserInput>
  }

  export type BusinessScalarWhereInput = {
    AND?: BusinessScalarWhereInput | BusinessScalarWhereInput[]
    OR?: BusinessScalarWhereInput[]
    NOT?: BusinessScalarWhereInput | BusinessScalarWhereInput[]
    id?: StringFilter<"Business"> | string
    name?: StringFilter<"Business"> | string
    description?: StringNullableFilter<"Business"> | string | null
    address?: StringNullableFilter<"Business"> | string | null
    city?: StringNullableFilter<"Business"> | string | null
    state?: StringNullableFilter<"Business"> | string | null
    zipCode?: StringNullableFilter<"Business"> | string | null
    phone?: StringNullableFilter<"Business"> | string | null
    email?: StringNullableFilter<"Business"> | string | null
    serviceArea?: StringNullableListFilter<"Business">
    logo?: StringNullableFilter<"Business"> | string | null
    createdAt?: DateTimeFilter<"Business"> | Date | string
    updatedAt?: DateTimeFilter<"Business"> | Date | string
    minAdvanceBooking?: IntFilter<"Business"> | number
    maxAdvanceBooking?: IntFilter<"Business"> | number
    minimumPurchase?: FloatFilter<"Business"> | number
    userId?: StringFilter<"Business"> | string
    stripeAccountId?: StringNullableFilter<"Business"> | string | null
    socialMedia?: JsonNullableFilter<"Business">
    customDomain?: StringNullableFilter<"Business"> | string | null
    subdomain?: StringNullableFilter<"Business"> | string | null
    siteConfig?: JsonNullableFilter<"Business">
    onboardingError?: StringNullableFilter<"Business"> | string | null
  }

  export type BookingCreateWithoutBusinessInput = {
    id?: string
    eventDate: Date | string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    totalAmount: number
    depositAmount?: number | null
    depositPaid?: boolean
    eventType?: string | null
    eventAddress: string
    eventCity: string
    eventState: string
    eventZipCode: string
    participantAge?: number | null
    participantCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: string | null
    subtotalAmount?: number
    taxAmount?: number
    taxRate?: number
    customer: CustomerCreateNestedOneWithoutBookingsInput
    inventoryItems?: BookingItemCreateNestedManyWithoutBookingInput
    payments?: PaymentCreateNestedManyWithoutBookingInput
    waivers?: WaiverCreateNestedManyWithoutBookingInput
  }

  export type BookingUncheckedCreateWithoutBusinessInput = {
    id?: string
    eventDate: Date | string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    totalAmount: number
    depositAmount?: number | null
    depositPaid?: boolean
    eventType?: string | null
    eventAddress: string
    eventCity: string
    eventState: string
    eventZipCode: string
    participantAge?: number | null
    participantCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    customerId: string
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: string | null
    subtotalAmount?: number
    taxAmount?: number
    taxRate?: number
    inventoryItems?: BookingItemUncheckedCreateNestedManyWithoutBookingInput
    payments?: PaymentUncheckedCreateNestedManyWithoutBookingInput
    waivers?: WaiverUncheckedCreateNestedManyWithoutBookingInput
  }

  export type BookingCreateOrConnectWithoutBusinessInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutBusinessInput, BookingUncheckedCreateWithoutBusinessInput>
  }

  export type BookingCreateManyBusinessInputEnvelope = {
    data: BookingCreateManyBusinessInput | BookingCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutBusinessesInput = {
    id?: string
    email?: string | null
    name?: string | null
    createdAt?: Date | string
    image?: string | null
    updatedAt?: Date | string
    onboarded?: boolean
    clerkUserId?: string | null
  }

  export type UserUncheckedCreateWithoutBusinessesInput = {
    id?: string
    email?: string | null
    name?: string | null
    createdAt?: Date | string
    image?: string | null
    updatedAt?: Date | string
    onboarded?: boolean
    clerkUserId?: string | null
  }

  export type UserCreateOrConnectWithoutBusinessesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBusinessesInput, UserUncheckedCreateWithoutBusinessesInput>
  }

  export type CustomerCreateWithoutBusinessInput = {
    id?: string
    name: string
    email: string
    phone: string
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    notes?: string | null
    bookingCount?: number
    totalSpent?: number
    lastBooking?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isLead?: boolean
    status?: string
    type?: string
    bookings?: BookingCreateNestedManyWithoutCustomerInput
    waivers?: WaiverCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateWithoutBusinessInput = {
    id?: string
    name: string
    email: string
    phone: string
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    notes?: string | null
    bookingCount?: number
    totalSpent?: number
    lastBooking?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isLead?: boolean
    status?: string
    type?: string
    bookings?: BookingUncheckedCreateNestedManyWithoutCustomerInput
    waivers?: WaiverUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutBusinessInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutBusinessInput, CustomerUncheckedCreateWithoutBusinessInput>
  }

  export type CustomerCreateManyBusinessInputEnvelope = {
    data: CustomerCreateManyBusinessInput | CustomerCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type InventoryCreateWithoutBusinessInput = {
    id?: string
    type: $Enums.InventoryType
    name: string
    description?: string | null
    dimensions: string
    capacity: number
    price: number
    setupTime: number
    teardownTime: number
    images?: InventoryCreateimagesInput | string[]
    primaryImage?: string | null
    status: $Enums.InventoryStatus
    minimumSpace: string
    weightLimit: number
    ageRange: string
    weatherRestrictions?: InventoryCreateweatherRestrictionsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    quantity?: number
    bookingItems?: BookingItemCreateNestedManyWithoutInventoryInput
  }

  export type InventoryUncheckedCreateWithoutBusinessInput = {
    id?: string
    type: $Enums.InventoryType
    name: string
    description?: string | null
    dimensions: string
    capacity: number
    price: number
    setupTime: number
    teardownTime: number
    images?: InventoryCreateimagesInput | string[]
    primaryImage?: string | null
    status: $Enums.InventoryStatus
    minimumSpace: string
    weightLimit: number
    ageRange: string
    weatherRestrictions?: InventoryCreateweatherRestrictionsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    quantity?: number
    bookingItems?: BookingItemUncheckedCreateNestedManyWithoutInventoryInput
  }

  export type InventoryCreateOrConnectWithoutBusinessInput = {
    where: InventoryWhereUniqueInput
    create: XOR<InventoryCreateWithoutBusinessInput, InventoryUncheckedCreateWithoutBusinessInput>
  }

  export type InventoryCreateManyBusinessInputEnvelope = {
    data: InventoryCreateManyBusinessInput | InventoryCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type PaymentCreateWithoutBusinessInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    type: $Enums.PaymentType
    status: $Enums.PaymentStatus
    createdAt?: Date | string
    currency?: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string | null
    refundReason?: string | null
    stripeClientSecret?: string | null
    stripePaymentId?: string | null
    updatedAt?: Date | string
    booking: BookingCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateWithoutBusinessInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    type: $Enums.PaymentType
    status: $Enums.PaymentStatus
    createdAt?: Date | string
    bookingId: string
    currency?: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string | null
    refundReason?: string | null
    stripeClientSecret?: string | null
    stripePaymentId?: string | null
    updatedAt?: Date | string
  }

  export type PaymentCreateOrConnectWithoutBusinessInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutBusinessInput, PaymentUncheckedCreateWithoutBusinessInput>
  }

  export type PaymentCreateManyBusinessInputEnvelope = {
    data: PaymentCreateManyBusinessInput | PaymentCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type CouponCreateWithoutBusinessInput = {
    id?: string
    code: string
    description?: string | null
    discountType: $Enums.DiscountType
    discountAmount: number
    maxUses?: number | null
    usedCount?: number
    startDate?: Date | string | null
    endDate?: Date | string | null
    isActive?: boolean
    minimumAmount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CouponUncheckedCreateWithoutBusinessInput = {
    id?: string
    code: string
    description?: string | null
    discountType: $Enums.DiscountType
    discountAmount: number
    maxUses?: number | null
    usedCount?: number
    startDate?: Date | string | null
    endDate?: Date | string | null
    isActive?: boolean
    minimumAmount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CouponCreateOrConnectWithoutBusinessInput = {
    where: CouponWhereUniqueInput
    create: XOR<CouponCreateWithoutBusinessInput, CouponUncheckedCreateWithoutBusinessInput>
  }

  export type CouponCreateManyBusinessInputEnvelope = {
    data: CouponCreateManyBusinessInput | CouponCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type SalesFunnelCreateWithoutBusinessInput = {
    id?: string
    name: string
    isActive?: boolean
    popupTitle: string
    popupText: string
    popupImage?: string | null
    formTitle: string
    thankYouMessage: string
    couponId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalesFunnelUncheckedCreateWithoutBusinessInput = {
    id?: string
    name: string
    isActive?: boolean
    popupTitle: string
    popupText: string
    popupImage?: string | null
    formTitle: string
    thankYouMessage: string
    couponId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalesFunnelCreateOrConnectWithoutBusinessInput = {
    where: SalesFunnelWhereUniqueInput
    create: XOR<SalesFunnelCreateWithoutBusinessInput, SalesFunnelUncheckedCreateWithoutBusinessInput>
  }

  export type SalesFunnelCreateManyBusinessInputEnvelope = {
    data: SalesFunnelCreateManyBusinessInput | SalesFunnelCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type WaiverCreateWithoutBusinessInput = {
    id?: string
    status?: $Enums.WaiverStatus
    templateVersion: string
    documentUrl: string
    openSignDocumentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    customer: CustomerCreateNestedOneWithoutWaiversInput
    booking: BookingCreateNestedOneWithoutWaiversInput
  }

  export type WaiverUncheckedCreateWithoutBusinessInput = {
    id?: string
    customerId: string
    bookingId: string
    status?: $Enums.WaiverStatus
    templateVersion: string
    documentUrl: string
    openSignDocumentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WaiverCreateOrConnectWithoutBusinessInput = {
    where: WaiverWhereUniqueInput
    create: XOR<WaiverCreateWithoutBusinessInput, WaiverUncheckedCreateWithoutBusinessInput>
  }

  export type WaiverCreateManyBusinessInputEnvelope = {
    data: WaiverCreateManyBusinessInput | WaiverCreateManyBusinessInput[]
    skipDuplicates?: boolean
  }

  export type BookingUpsertWithWhereUniqueWithoutBusinessInput = {
    where: BookingWhereUniqueInput
    update: XOR<BookingUpdateWithoutBusinessInput, BookingUncheckedUpdateWithoutBusinessInput>
    create: XOR<BookingCreateWithoutBusinessInput, BookingUncheckedCreateWithoutBusinessInput>
  }

  export type BookingUpdateWithWhereUniqueWithoutBusinessInput = {
    where: BookingWhereUniqueInput
    data: XOR<BookingUpdateWithoutBusinessInput, BookingUncheckedUpdateWithoutBusinessInput>
  }

  export type BookingUpdateManyWithWhereWithoutBusinessInput = {
    where: BookingScalarWhereInput
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyWithoutBusinessInput>
  }

  export type BookingScalarWhereInput = {
    AND?: BookingScalarWhereInput | BookingScalarWhereInput[]
    OR?: BookingScalarWhereInput[]
    NOT?: BookingScalarWhereInput | BookingScalarWhereInput[]
    id?: StringFilter<"Booking"> | string
    eventDate?: DateTimeFilter<"Booking"> | Date | string
    startTime?: DateTimeFilter<"Booking"> | Date | string
    endTime?: DateTimeFilter<"Booking"> | Date | string
    status?: EnumBookingStatusFilter<"Booking"> | $Enums.BookingStatus
    totalAmount?: FloatFilter<"Booking"> | number
    depositAmount?: FloatNullableFilter<"Booking"> | number | null
    depositPaid?: BoolFilter<"Booking"> | boolean
    eventType?: StringNullableFilter<"Booking"> | string | null
    eventAddress?: StringFilter<"Booking"> | string
    eventCity?: StringFilter<"Booking"> | string
    eventState?: StringFilter<"Booking"> | string
    eventZipCode?: StringFilter<"Booking"> | string
    participantAge?: IntNullableFilter<"Booking"> | number | null
    participantCount?: IntFilter<"Booking"> | number
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    businessId?: StringFilter<"Booking"> | string
    customerId?: StringFilter<"Booking"> | string
    isCompleted?: BoolFilter<"Booking"> | boolean
    isCancelled?: BoolFilter<"Booking"> | boolean
    specialInstructions?: StringNullableFilter<"Booking"> | string | null
    subtotalAmount?: FloatFilter<"Booking"> | number
    taxAmount?: FloatFilter<"Booking"> | number
    taxRate?: FloatFilter<"Booking"> | number
  }

  export type UserUpsertWithoutBusinessesInput = {
    update: XOR<UserUpdateWithoutBusinessesInput, UserUncheckedUpdateWithoutBusinessesInput>
    create: XOR<UserCreateWithoutBusinessesInput, UserUncheckedCreateWithoutBusinessesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBusinessesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBusinessesInput, UserUncheckedUpdateWithoutBusinessesInput>
  }

  export type UserUpdateWithoutBusinessesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboarded?: BoolFieldUpdateOperationsInput | boolean
    clerkUserId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateWithoutBusinessesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboarded?: BoolFieldUpdateOperationsInput | boolean
    clerkUserId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CustomerUpsertWithWhereUniqueWithoutBusinessInput = {
    where: CustomerWhereUniqueInput
    update: XOR<CustomerUpdateWithoutBusinessInput, CustomerUncheckedUpdateWithoutBusinessInput>
    create: XOR<CustomerCreateWithoutBusinessInput, CustomerUncheckedCreateWithoutBusinessInput>
  }

  export type CustomerUpdateWithWhereUniqueWithoutBusinessInput = {
    where: CustomerWhereUniqueInput
    data: XOR<CustomerUpdateWithoutBusinessInput, CustomerUncheckedUpdateWithoutBusinessInput>
  }

  export type CustomerUpdateManyWithWhereWithoutBusinessInput = {
    where: CustomerScalarWhereInput
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyWithoutBusinessInput>
  }

  export type CustomerScalarWhereInput = {
    AND?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
    OR?: CustomerScalarWhereInput[]
    NOT?: CustomerScalarWhereInput | CustomerScalarWhereInput[]
    id?: StringFilter<"Customer"> | string
    name?: StringFilter<"Customer"> | string
    email?: StringFilter<"Customer"> | string
    phone?: StringFilter<"Customer"> | string
    address?: StringNullableFilter<"Customer"> | string | null
    city?: StringNullableFilter<"Customer"> | string | null
    state?: StringNullableFilter<"Customer"> | string | null
    zipCode?: StringNullableFilter<"Customer"> | string | null
    notes?: StringNullableFilter<"Customer"> | string | null
    bookingCount?: IntFilter<"Customer"> | number
    totalSpent?: FloatFilter<"Customer"> | number
    lastBooking?: DateTimeNullableFilter<"Customer"> | Date | string | null
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    updatedAt?: DateTimeFilter<"Customer"> | Date | string
    businessId?: StringFilter<"Customer"> | string
    isLead?: BoolFilter<"Customer"> | boolean
    status?: StringFilter<"Customer"> | string
    type?: StringFilter<"Customer"> | string
  }

  export type InventoryUpsertWithWhereUniqueWithoutBusinessInput = {
    where: InventoryWhereUniqueInput
    update: XOR<InventoryUpdateWithoutBusinessInput, InventoryUncheckedUpdateWithoutBusinessInput>
    create: XOR<InventoryCreateWithoutBusinessInput, InventoryUncheckedCreateWithoutBusinessInput>
  }

  export type InventoryUpdateWithWhereUniqueWithoutBusinessInput = {
    where: InventoryWhereUniqueInput
    data: XOR<InventoryUpdateWithoutBusinessInput, InventoryUncheckedUpdateWithoutBusinessInput>
  }

  export type InventoryUpdateManyWithWhereWithoutBusinessInput = {
    where: InventoryScalarWhereInput
    data: XOR<InventoryUpdateManyMutationInput, InventoryUncheckedUpdateManyWithoutBusinessInput>
  }

  export type InventoryScalarWhereInput = {
    AND?: InventoryScalarWhereInput | InventoryScalarWhereInput[]
    OR?: InventoryScalarWhereInput[]
    NOT?: InventoryScalarWhereInput | InventoryScalarWhereInput[]
    id?: StringFilter<"Inventory"> | string
    type?: EnumInventoryTypeFilter<"Inventory"> | $Enums.InventoryType
    name?: StringFilter<"Inventory"> | string
    description?: StringNullableFilter<"Inventory"> | string | null
    dimensions?: StringFilter<"Inventory"> | string
    capacity?: IntFilter<"Inventory"> | number
    price?: FloatFilter<"Inventory"> | number
    setupTime?: IntFilter<"Inventory"> | number
    teardownTime?: IntFilter<"Inventory"> | number
    images?: StringNullableListFilter<"Inventory">
    primaryImage?: StringNullableFilter<"Inventory"> | string | null
    status?: EnumInventoryStatusFilter<"Inventory"> | $Enums.InventoryStatus
    minimumSpace?: StringFilter<"Inventory"> | string
    weightLimit?: IntFilter<"Inventory"> | number
    ageRange?: StringFilter<"Inventory"> | string
    weatherRestrictions?: StringNullableListFilter<"Inventory">
    businessId?: StringFilter<"Inventory"> | string
    createdAt?: DateTimeFilter<"Inventory"> | Date | string
    updatedAt?: DateTimeFilter<"Inventory"> | Date | string
    quantity?: IntFilter<"Inventory"> | number
  }

  export type PaymentUpsertWithWhereUniqueWithoutBusinessInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutBusinessInput, PaymentUncheckedUpdateWithoutBusinessInput>
    create: XOR<PaymentCreateWithoutBusinessInput, PaymentUncheckedCreateWithoutBusinessInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutBusinessInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutBusinessInput, PaymentUncheckedUpdateWithoutBusinessInput>
  }

  export type PaymentUpdateManyWithWhereWithoutBusinessInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutBusinessInput>
  }

  export type PaymentScalarWhereInput = {
    AND?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    OR?: PaymentScalarWhereInput[]
    NOT?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    id?: StringFilter<"Payment"> | string
    amount?: DecimalFilter<"Payment"> | Decimal | DecimalJsLike | number | string
    type?: EnumPaymentTypeFilter<"Payment"> | $Enums.PaymentType
    status?: EnumPaymentStatusFilter<"Payment"> | $Enums.PaymentStatus
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    bookingId?: StringFilter<"Payment"> | string
    businessId?: StringFilter<"Payment"> | string
    currency?: StringFilter<"Payment"> | string
    metadata?: JsonNullableFilter<"Payment">
    paidAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    refundAmount?: DecimalNullableFilter<"Payment"> | Decimal | DecimalJsLike | number | string | null
    refundReason?: StringNullableFilter<"Payment"> | string | null
    stripeClientSecret?: StringNullableFilter<"Payment"> | string | null
    stripePaymentId?: StringNullableFilter<"Payment"> | string | null
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
  }

  export type CouponUpsertWithWhereUniqueWithoutBusinessInput = {
    where: CouponWhereUniqueInput
    update: XOR<CouponUpdateWithoutBusinessInput, CouponUncheckedUpdateWithoutBusinessInput>
    create: XOR<CouponCreateWithoutBusinessInput, CouponUncheckedCreateWithoutBusinessInput>
  }

  export type CouponUpdateWithWhereUniqueWithoutBusinessInput = {
    where: CouponWhereUniqueInput
    data: XOR<CouponUpdateWithoutBusinessInput, CouponUncheckedUpdateWithoutBusinessInput>
  }

  export type CouponUpdateManyWithWhereWithoutBusinessInput = {
    where: CouponScalarWhereInput
    data: XOR<CouponUpdateManyMutationInput, CouponUncheckedUpdateManyWithoutBusinessInput>
  }

  export type CouponScalarWhereInput = {
    AND?: CouponScalarWhereInput | CouponScalarWhereInput[]
    OR?: CouponScalarWhereInput[]
    NOT?: CouponScalarWhereInput | CouponScalarWhereInput[]
    id?: StringFilter<"Coupon"> | string
    code?: StringFilter<"Coupon"> | string
    description?: StringNullableFilter<"Coupon"> | string | null
    discountType?: EnumDiscountTypeFilter<"Coupon"> | $Enums.DiscountType
    discountAmount?: FloatFilter<"Coupon"> | number
    maxUses?: IntNullableFilter<"Coupon"> | number | null
    usedCount?: IntFilter<"Coupon"> | number
    startDate?: DateTimeNullableFilter<"Coupon"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Coupon"> | Date | string | null
    isActive?: BoolFilter<"Coupon"> | boolean
    minimumAmount?: FloatNullableFilter<"Coupon"> | number | null
    businessId?: StringFilter<"Coupon"> | string
    createdAt?: DateTimeFilter<"Coupon"> | Date | string
    updatedAt?: DateTimeFilter<"Coupon"> | Date | string
  }

  export type SalesFunnelUpsertWithWhereUniqueWithoutBusinessInput = {
    where: SalesFunnelWhereUniqueInput
    update: XOR<SalesFunnelUpdateWithoutBusinessInput, SalesFunnelUncheckedUpdateWithoutBusinessInput>
    create: XOR<SalesFunnelCreateWithoutBusinessInput, SalesFunnelUncheckedCreateWithoutBusinessInput>
  }

  export type SalesFunnelUpdateWithWhereUniqueWithoutBusinessInput = {
    where: SalesFunnelWhereUniqueInput
    data: XOR<SalesFunnelUpdateWithoutBusinessInput, SalesFunnelUncheckedUpdateWithoutBusinessInput>
  }

  export type SalesFunnelUpdateManyWithWhereWithoutBusinessInput = {
    where: SalesFunnelScalarWhereInput
    data: XOR<SalesFunnelUpdateManyMutationInput, SalesFunnelUncheckedUpdateManyWithoutBusinessInput>
  }

  export type SalesFunnelScalarWhereInput = {
    AND?: SalesFunnelScalarWhereInput | SalesFunnelScalarWhereInput[]
    OR?: SalesFunnelScalarWhereInput[]
    NOT?: SalesFunnelScalarWhereInput | SalesFunnelScalarWhereInput[]
    id?: StringFilter<"SalesFunnel"> | string
    name?: StringFilter<"SalesFunnel"> | string
    isActive?: BoolFilter<"SalesFunnel"> | boolean
    popupTitle?: StringFilter<"SalesFunnel"> | string
    popupText?: StringFilter<"SalesFunnel"> | string
    popupImage?: StringNullableFilter<"SalesFunnel"> | string | null
    formTitle?: StringFilter<"SalesFunnel"> | string
    thankYouMessage?: StringFilter<"SalesFunnel"> | string
    couponId?: StringNullableFilter<"SalesFunnel"> | string | null
    businessId?: StringFilter<"SalesFunnel"> | string
    createdAt?: DateTimeFilter<"SalesFunnel"> | Date | string
    updatedAt?: DateTimeFilter<"SalesFunnel"> | Date | string
  }

  export type WaiverUpsertWithWhereUniqueWithoutBusinessInput = {
    where: WaiverWhereUniqueInput
    update: XOR<WaiverUpdateWithoutBusinessInput, WaiverUncheckedUpdateWithoutBusinessInput>
    create: XOR<WaiverCreateWithoutBusinessInput, WaiverUncheckedCreateWithoutBusinessInput>
  }

  export type WaiverUpdateWithWhereUniqueWithoutBusinessInput = {
    where: WaiverWhereUniqueInput
    data: XOR<WaiverUpdateWithoutBusinessInput, WaiverUncheckedUpdateWithoutBusinessInput>
  }

  export type WaiverUpdateManyWithWhereWithoutBusinessInput = {
    where: WaiverScalarWhereInput
    data: XOR<WaiverUpdateManyMutationInput, WaiverUncheckedUpdateManyWithoutBusinessInput>
  }

  export type WaiverScalarWhereInput = {
    AND?: WaiverScalarWhereInput | WaiverScalarWhereInput[]
    OR?: WaiverScalarWhereInput[]
    NOT?: WaiverScalarWhereInput | WaiverScalarWhereInput[]
    id?: StringFilter<"Waiver"> | string
    businessId?: StringFilter<"Waiver"> | string
    customerId?: StringFilter<"Waiver"> | string
    bookingId?: StringFilter<"Waiver"> | string
    status?: EnumWaiverStatusFilter<"Waiver"> | $Enums.WaiverStatus
    templateVersion?: StringFilter<"Waiver"> | string
    documentUrl?: StringFilter<"Waiver"> | string
    openSignDocumentId?: StringFilter<"Waiver"> | string
    createdAt?: DateTimeFilter<"Waiver"> | Date | string
    updatedAt?: DateTimeFilter<"Waiver"> | Date | string
  }

  export type BookingItemCreateWithoutInventoryInput = {
    id?: string
    quantity?: number
    price: number
    booking: BookingCreateNestedOneWithoutInventoryItemsInput
  }

  export type BookingItemUncheckedCreateWithoutInventoryInput = {
    id?: string
    bookingId: string
    quantity?: number
    price: number
  }

  export type BookingItemCreateOrConnectWithoutInventoryInput = {
    where: BookingItemWhereUniqueInput
    create: XOR<BookingItemCreateWithoutInventoryInput, BookingItemUncheckedCreateWithoutInventoryInput>
  }

  export type BookingItemCreateManyInventoryInputEnvelope = {
    data: BookingItemCreateManyInventoryInput | BookingItemCreateManyInventoryInput[]
    skipDuplicates?: boolean
  }

  export type BusinessCreateWithoutInventoryInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
    bookings?: BookingCreateNestedManyWithoutBusinessInput
    user: UserCreateNestedOneWithoutBusinessesInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    payments?: PaymentCreateNestedManyWithoutBusinessInput
    coupons?: CouponCreateNestedManyWithoutBusinessInput
    salesFunnels?: SalesFunnelCreateNestedManyWithoutBusinessInput
    waivers?: WaiverCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutInventoryInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    userId: string
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
    bookings?: BookingUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    payments?: PaymentUncheckedCreateNestedManyWithoutBusinessInput
    coupons?: CouponUncheckedCreateNestedManyWithoutBusinessInput
    salesFunnels?: SalesFunnelUncheckedCreateNestedManyWithoutBusinessInput
    waivers?: WaiverUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutInventoryInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutInventoryInput, BusinessUncheckedCreateWithoutInventoryInput>
  }

  export type BookingItemUpsertWithWhereUniqueWithoutInventoryInput = {
    where: BookingItemWhereUniqueInput
    update: XOR<BookingItemUpdateWithoutInventoryInput, BookingItemUncheckedUpdateWithoutInventoryInput>
    create: XOR<BookingItemCreateWithoutInventoryInput, BookingItemUncheckedCreateWithoutInventoryInput>
  }

  export type BookingItemUpdateWithWhereUniqueWithoutInventoryInput = {
    where: BookingItemWhereUniqueInput
    data: XOR<BookingItemUpdateWithoutInventoryInput, BookingItemUncheckedUpdateWithoutInventoryInput>
  }

  export type BookingItemUpdateManyWithWhereWithoutInventoryInput = {
    where: BookingItemScalarWhereInput
    data: XOR<BookingItemUpdateManyMutationInput, BookingItemUncheckedUpdateManyWithoutInventoryInput>
  }

  export type BookingItemScalarWhereInput = {
    AND?: BookingItemScalarWhereInput | BookingItemScalarWhereInput[]
    OR?: BookingItemScalarWhereInput[]
    NOT?: BookingItemScalarWhereInput | BookingItemScalarWhereInput[]
    id?: StringFilter<"BookingItem"> | string
    bookingId?: StringFilter<"BookingItem"> | string
    inventoryId?: StringFilter<"BookingItem"> | string
    quantity?: IntFilter<"BookingItem"> | number
    price?: FloatFilter<"BookingItem"> | number
  }

  export type BusinessUpsertWithoutInventoryInput = {
    update: XOR<BusinessUpdateWithoutInventoryInput, BusinessUncheckedUpdateWithoutInventoryInput>
    create: XOR<BusinessCreateWithoutInventoryInput, BusinessUncheckedCreateWithoutInventoryInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutInventoryInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutInventoryInput, BusinessUncheckedUpdateWithoutInventoryInput>
  }

  export type BusinessUpdateWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUpdateManyWithoutBusinessNestedInput
    user?: UserUpdateOneRequiredWithoutBusinessesNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    payments?: PaymentUpdateManyWithoutBusinessNestedInput
    coupons?: CouponUpdateManyWithoutBusinessNestedInput
    salesFunnels?: SalesFunnelUpdateManyWithoutBusinessNestedInput
    waivers?: WaiverUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutBusinessNestedInput
    coupons?: CouponUncheckedUpdateManyWithoutBusinessNestedInput
    salesFunnels?: SalesFunnelUncheckedUpdateManyWithoutBusinessNestedInput
    waivers?: WaiverUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type BookingCreateWithoutCustomerInput = {
    id?: string
    eventDate: Date | string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    totalAmount: number
    depositAmount?: number | null
    depositPaid?: boolean
    eventType?: string | null
    eventAddress: string
    eventCity: string
    eventState: string
    eventZipCode: string
    participantAge?: number | null
    participantCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: string | null
    subtotalAmount?: number
    taxAmount?: number
    taxRate?: number
    business: BusinessCreateNestedOneWithoutBookingsInput
    inventoryItems?: BookingItemCreateNestedManyWithoutBookingInput
    payments?: PaymentCreateNestedManyWithoutBookingInput
    waivers?: WaiverCreateNestedManyWithoutBookingInput
  }

  export type BookingUncheckedCreateWithoutCustomerInput = {
    id?: string
    eventDate: Date | string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    totalAmount: number
    depositAmount?: number | null
    depositPaid?: boolean
    eventType?: string | null
    eventAddress: string
    eventCity: string
    eventState: string
    eventZipCode: string
    participantAge?: number | null
    participantCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: string | null
    subtotalAmount?: number
    taxAmount?: number
    taxRate?: number
    inventoryItems?: BookingItemUncheckedCreateNestedManyWithoutBookingInput
    payments?: PaymentUncheckedCreateNestedManyWithoutBookingInput
    waivers?: WaiverUncheckedCreateNestedManyWithoutBookingInput
  }

  export type BookingCreateOrConnectWithoutCustomerInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutCustomerInput, BookingUncheckedCreateWithoutCustomerInput>
  }

  export type BookingCreateManyCustomerInputEnvelope = {
    data: BookingCreateManyCustomerInput | BookingCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type WaiverCreateWithoutCustomerInput = {
    id?: string
    status?: $Enums.WaiverStatus
    templateVersion: string
    documentUrl: string
    openSignDocumentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutWaiversInput
    booking: BookingCreateNestedOneWithoutWaiversInput
  }

  export type WaiverUncheckedCreateWithoutCustomerInput = {
    id?: string
    businessId: string
    bookingId: string
    status?: $Enums.WaiverStatus
    templateVersion: string
    documentUrl: string
    openSignDocumentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WaiverCreateOrConnectWithoutCustomerInput = {
    where: WaiverWhereUniqueInput
    create: XOR<WaiverCreateWithoutCustomerInput, WaiverUncheckedCreateWithoutCustomerInput>
  }

  export type WaiverCreateManyCustomerInputEnvelope = {
    data: WaiverCreateManyCustomerInput | WaiverCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type BusinessCreateWithoutCustomersInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
    bookings?: BookingCreateNestedManyWithoutBusinessInput
    user: UserCreateNestedOneWithoutBusinessesInput
    inventory?: InventoryCreateNestedManyWithoutBusinessInput
    payments?: PaymentCreateNestedManyWithoutBusinessInput
    coupons?: CouponCreateNestedManyWithoutBusinessInput
    salesFunnels?: SalesFunnelCreateNestedManyWithoutBusinessInput
    waivers?: WaiverCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutCustomersInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    userId: string
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
    bookings?: BookingUncheckedCreateNestedManyWithoutBusinessInput
    inventory?: InventoryUncheckedCreateNestedManyWithoutBusinessInput
    payments?: PaymentUncheckedCreateNestedManyWithoutBusinessInput
    coupons?: CouponUncheckedCreateNestedManyWithoutBusinessInput
    salesFunnels?: SalesFunnelUncheckedCreateNestedManyWithoutBusinessInput
    waivers?: WaiverUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutCustomersInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutCustomersInput, BusinessUncheckedCreateWithoutCustomersInput>
  }

  export type BookingUpsertWithWhereUniqueWithoutCustomerInput = {
    where: BookingWhereUniqueInput
    update: XOR<BookingUpdateWithoutCustomerInput, BookingUncheckedUpdateWithoutCustomerInput>
    create: XOR<BookingCreateWithoutCustomerInput, BookingUncheckedCreateWithoutCustomerInput>
  }

  export type BookingUpdateWithWhereUniqueWithoutCustomerInput = {
    where: BookingWhereUniqueInput
    data: XOR<BookingUpdateWithoutCustomerInput, BookingUncheckedUpdateWithoutCustomerInput>
  }

  export type BookingUpdateManyWithWhereWithoutCustomerInput = {
    where: BookingScalarWhereInput
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyWithoutCustomerInput>
  }

  export type WaiverUpsertWithWhereUniqueWithoutCustomerInput = {
    where: WaiverWhereUniqueInput
    update: XOR<WaiverUpdateWithoutCustomerInput, WaiverUncheckedUpdateWithoutCustomerInput>
    create: XOR<WaiverCreateWithoutCustomerInput, WaiverUncheckedCreateWithoutCustomerInput>
  }

  export type WaiverUpdateWithWhereUniqueWithoutCustomerInput = {
    where: WaiverWhereUniqueInput
    data: XOR<WaiverUpdateWithoutCustomerInput, WaiverUncheckedUpdateWithoutCustomerInput>
  }

  export type WaiverUpdateManyWithWhereWithoutCustomerInput = {
    where: WaiverScalarWhereInput
    data: XOR<WaiverUpdateManyMutationInput, WaiverUncheckedUpdateManyWithoutCustomerInput>
  }

  export type BusinessUpsertWithoutCustomersInput = {
    update: XOR<BusinessUpdateWithoutCustomersInput, BusinessUncheckedUpdateWithoutCustomersInput>
    create: XOR<BusinessCreateWithoutCustomersInput, BusinessUncheckedCreateWithoutCustomersInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutCustomersInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutCustomersInput, BusinessUncheckedUpdateWithoutCustomersInput>
  }

  export type BusinessUpdateWithoutCustomersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUpdateManyWithoutBusinessNestedInput
    user?: UserUpdateOneRequiredWithoutBusinessesNestedInput
    inventory?: InventoryUpdateManyWithoutBusinessNestedInput
    payments?: PaymentUpdateManyWithoutBusinessNestedInput
    coupons?: CouponUpdateManyWithoutBusinessNestedInput
    salesFunnels?: SalesFunnelUpdateManyWithoutBusinessNestedInput
    waivers?: WaiverUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutCustomersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUncheckedUpdateManyWithoutBusinessNestedInput
    inventory?: InventoryUncheckedUpdateManyWithoutBusinessNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutBusinessNestedInput
    coupons?: CouponUncheckedUpdateManyWithoutBusinessNestedInput
    salesFunnels?: SalesFunnelUncheckedUpdateManyWithoutBusinessNestedInput
    waivers?: WaiverUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessCreateWithoutBookingsInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
    user: UserCreateNestedOneWithoutBusinessesInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    inventory?: InventoryCreateNestedManyWithoutBusinessInput
    payments?: PaymentCreateNestedManyWithoutBusinessInput
    coupons?: CouponCreateNestedManyWithoutBusinessInput
    salesFunnels?: SalesFunnelCreateNestedManyWithoutBusinessInput
    waivers?: WaiverCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutBookingsInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    userId: string
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    inventory?: InventoryUncheckedCreateNestedManyWithoutBusinessInput
    payments?: PaymentUncheckedCreateNestedManyWithoutBusinessInput
    coupons?: CouponUncheckedCreateNestedManyWithoutBusinessInput
    salesFunnels?: SalesFunnelUncheckedCreateNestedManyWithoutBusinessInput
    waivers?: WaiverUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutBookingsInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutBookingsInput, BusinessUncheckedCreateWithoutBookingsInput>
  }

  export type CustomerCreateWithoutBookingsInput = {
    id?: string
    name: string
    email: string
    phone: string
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    notes?: string | null
    bookingCount?: number
    totalSpent?: number
    lastBooking?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isLead?: boolean
    status?: string
    type?: string
    waivers?: WaiverCreateNestedManyWithoutCustomerInput
    business: BusinessCreateNestedOneWithoutCustomersInput
  }

  export type CustomerUncheckedCreateWithoutBookingsInput = {
    id?: string
    name: string
    email: string
    phone: string
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    notes?: string | null
    bookingCount?: number
    totalSpent?: number
    lastBooking?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    isLead?: boolean
    status?: string
    type?: string
    waivers?: WaiverUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutBookingsInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutBookingsInput, CustomerUncheckedCreateWithoutBookingsInput>
  }

  export type BookingItemCreateWithoutBookingInput = {
    id?: string
    quantity?: number
    price: number
    inventory: InventoryCreateNestedOneWithoutBookingItemsInput
  }

  export type BookingItemUncheckedCreateWithoutBookingInput = {
    id?: string
    inventoryId: string
    quantity?: number
    price: number
  }

  export type BookingItemCreateOrConnectWithoutBookingInput = {
    where: BookingItemWhereUniqueInput
    create: XOR<BookingItemCreateWithoutBookingInput, BookingItemUncheckedCreateWithoutBookingInput>
  }

  export type BookingItemCreateManyBookingInputEnvelope = {
    data: BookingItemCreateManyBookingInput | BookingItemCreateManyBookingInput[]
    skipDuplicates?: boolean
  }

  export type PaymentCreateWithoutBookingInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    type: $Enums.PaymentType
    status: $Enums.PaymentStatus
    createdAt?: Date | string
    currency?: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string | null
    refundReason?: string | null
    stripeClientSecret?: string | null
    stripePaymentId?: string | null
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateWithoutBookingInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    type: $Enums.PaymentType
    status: $Enums.PaymentStatus
    createdAt?: Date | string
    businessId: string
    currency?: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string | null
    refundReason?: string | null
    stripeClientSecret?: string | null
    stripePaymentId?: string | null
    updatedAt?: Date | string
  }

  export type PaymentCreateOrConnectWithoutBookingInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutBookingInput, PaymentUncheckedCreateWithoutBookingInput>
  }

  export type PaymentCreateManyBookingInputEnvelope = {
    data: PaymentCreateManyBookingInput | PaymentCreateManyBookingInput[]
    skipDuplicates?: boolean
  }

  export type WaiverCreateWithoutBookingInput = {
    id?: string
    status?: $Enums.WaiverStatus
    templateVersion: string
    documentUrl: string
    openSignDocumentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    business: BusinessCreateNestedOneWithoutWaiversInput
    customer: CustomerCreateNestedOneWithoutWaiversInput
  }

  export type WaiverUncheckedCreateWithoutBookingInput = {
    id?: string
    businessId: string
    customerId: string
    status?: $Enums.WaiverStatus
    templateVersion: string
    documentUrl: string
    openSignDocumentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WaiverCreateOrConnectWithoutBookingInput = {
    where: WaiverWhereUniqueInput
    create: XOR<WaiverCreateWithoutBookingInput, WaiverUncheckedCreateWithoutBookingInput>
  }

  export type WaiverCreateManyBookingInputEnvelope = {
    data: WaiverCreateManyBookingInput | WaiverCreateManyBookingInput[]
    skipDuplicates?: boolean
  }

  export type BusinessUpsertWithoutBookingsInput = {
    update: XOR<BusinessUpdateWithoutBookingsInput, BusinessUncheckedUpdateWithoutBookingsInput>
    create: XOR<BusinessCreateWithoutBookingsInput, BusinessUncheckedCreateWithoutBookingsInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutBookingsInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutBookingsInput, BusinessUncheckedUpdateWithoutBookingsInput>
  }

  export type BusinessUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutBusinessesNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    inventory?: InventoryUpdateManyWithoutBusinessNestedInput
    payments?: PaymentUpdateManyWithoutBusinessNestedInput
    coupons?: CouponUpdateManyWithoutBusinessNestedInput
    salesFunnels?: SalesFunnelUpdateManyWithoutBusinessNestedInput
    waivers?: WaiverUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    inventory?: InventoryUncheckedUpdateManyWithoutBusinessNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutBusinessNestedInput
    coupons?: CouponUncheckedUpdateManyWithoutBusinessNestedInput
    salesFunnels?: SalesFunnelUncheckedUpdateManyWithoutBusinessNestedInput
    waivers?: WaiverUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type CustomerUpsertWithoutBookingsInput = {
    update: XOR<CustomerUpdateWithoutBookingsInput, CustomerUncheckedUpdateWithoutBookingsInput>
    create: XOR<CustomerCreateWithoutBookingsInput, CustomerUncheckedCreateWithoutBookingsInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutBookingsInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutBookingsInput, CustomerUncheckedUpdateWithoutBookingsInput>
  }

  export type CustomerUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    bookingCount?: IntFieldUpdateOperationsInput | number
    totalSpent?: FloatFieldUpdateOperationsInput | number
    lastBooking?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isLead?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    waivers?: WaiverUpdateManyWithoutCustomerNestedInput
    business?: BusinessUpdateOneRequiredWithoutCustomersNestedInput
  }

  export type CustomerUncheckedUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    bookingCount?: IntFieldUpdateOperationsInput | number
    totalSpent?: FloatFieldUpdateOperationsInput | number
    lastBooking?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    isLead?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    waivers?: WaiverUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type BookingItemUpsertWithWhereUniqueWithoutBookingInput = {
    where: BookingItemWhereUniqueInput
    update: XOR<BookingItemUpdateWithoutBookingInput, BookingItemUncheckedUpdateWithoutBookingInput>
    create: XOR<BookingItemCreateWithoutBookingInput, BookingItemUncheckedCreateWithoutBookingInput>
  }

  export type BookingItemUpdateWithWhereUniqueWithoutBookingInput = {
    where: BookingItemWhereUniqueInput
    data: XOR<BookingItemUpdateWithoutBookingInput, BookingItemUncheckedUpdateWithoutBookingInput>
  }

  export type BookingItemUpdateManyWithWhereWithoutBookingInput = {
    where: BookingItemScalarWhereInput
    data: XOR<BookingItemUpdateManyMutationInput, BookingItemUncheckedUpdateManyWithoutBookingInput>
  }

  export type PaymentUpsertWithWhereUniqueWithoutBookingInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutBookingInput, PaymentUncheckedUpdateWithoutBookingInput>
    create: XOR<PaymentCreateWithoutBookingInput, PaymentUncheckedCreateWithoutBookingInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutBookingInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutBookingInput, PaymentUncheckedUpdateWithoutBookingInput>
  }

  export type PaymentUpdateManyWithWhereWithoutBookingInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutBookingInput>
  }

  export type WaiverUpsertWithWhereUniqueWithoutBookingInput = {
    where: WaiverWhereUniqueInput
    update: XOR<WaiverUpdateWithoutBookingInput, WaiverUncheckedUpdateWithoutBookingInput>
    create: XOR<WaiverCreateWithoutBookingInput, WaiverUncheckedCreateWithoutBookingInput>
  }

  export type WaiverUpdateWithWhereUniqueWithoutBookingInput = {
    where: WaiverWhereUniqueInput
    data: XOR<WaiverUpdateWithoutBookingInput, WaiverUncheckedUpdateWithoutBookingInput>
  }

  export type WaiverUpdateManyWithWhereWithoutBookingInput = {
    where: WaiverScalarWhereInput
    data: XOR<WaiverUpdateManyMutationInput, WaiverUncheckedUpdateManyWithoutBookingInput>
  }

  export type BookingCreateWithoutInventoryItemsInput = {
    id?: string
    eventDate: Date | string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    totalAmount: number
    depositAmount?: number | null
    depositPaid?: boolean
    eventType?: string | null
    eventAddress: string
    eventCity: string
    eventState: string
    eventZipCode: string
    participantAge?: number | null
    participantCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: string | null
    subtotalAmount?: number
    taxAmount?: number
    taxRate?: number
    business: BusinessCreateNestedOneWithoutBookingsInput
    customer: CustomerCreateNestedOneWithoutBookingsInput
    payments?: PaymentCreateNestedManyWithoutBookingInput
    waivers?: WaiverCreateNestedManyWithoutBookingInput
  }

  export type BookingUncheckedCreateWithoutInventoryItemsInput = {
    id?: string
    eventDate: Date | string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    totalAmount: number
    depositAmount?: number | null
    depositPaid?: boolean
    eventType?: string | null
    eventAddress: string
    eventCity: string
    eventState: string
    eventZipCode: string
    participantAge?: number | null
    participantCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    customerId: string
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: string | null
    subtotalAmount?: number
    taxAmount?: number
    taxRate?: number
    payments?: PaymentUncheckedCreateNestedManyWithoutBookingInput
    waivers?: WaiverUncheckedCreateNestedManyWithoutBookingInput
  }

  export type BookingCreateOrConnectWithoutInventoryItemsInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutInventoryItemsInput, BookingUncheckedCreateWithoutInventoryItemsInput>
  }

  export type InventoryCreateWithoutBookingItemsInput = {
    id?: string
    type: $Enums.InventoryType
    name: string
    description?: string | null
    dimensions: string
    capacity: number
    price: number
    setupTime: number
    teardownTime: number
    images?: InventoryCreateimagesInput | string[]
    primaryImage?: string | null
    status: $Enums.InventoryStatus
    minimumSpace: string
    weightLimit: number
    ageRange: string
    weatherRestrictions?: InventoryCreateweatherRestrictionsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    quantity?: number
    business: BusinessCreateNestedOneWithoutInventoryInput
  }

  export type InventoryUncheckedCreateWithoutBookingItemsInput = {
    id?: string
    type: $Enums.InventoryType
    name: string
    description?: string | null
    dimensions: string
    capacity: number
    price: number
    setupTime: number
    teardownTime: number
    images?: InventoryCreateimagesInput | string[]
    primaryImage?: string | null
    status: $Enums.InventoryStatus
    minimumSpace: string
    weightLimit: number
    ageRange: string
    weatherRestrictions?: InventoryCreateweatherRestrictionsInput | string[]
    businessId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    quantity?: number
  }

  export type InventoryCreateOrConnectWithoutBookingItemsInput = {
    where: InventoryWhereUniqueInput
    create: XOR<InventoryCreateWithoutBookingItemsInput, InventoryUncheckedCreateWithoutBookingItemsInput>
  }

  export type BookingUpsertWithoutInventoryItemsInput = {
    update: XOR<BookingUpdateWithoutInventoryItemsInput, BookingUncheckedUpdateWithoutInventoryItemsInput>
    create: XOR<BookingCreateWithoutInventoryItemsInput, BookingUncheckedCreateWithoutInventoryItemsInput>
    where?: BookingWhereInput
  }

  export type BookingUpdateToOneWithWhereWithoutInventoryItemsInput = {
    where?: BookingWhereInput
    data: XOR<BookingUpdateWithoutInventoryItemsInput, BookingUncheckedUpdateWithoutInventoryItemsInput>
  }

  export type BookingUpdateWithoutInventoryItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    totalAmount?: FloatFieldUpdateOperationsInput | number
    depositAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    depositPaid?: BoolFieldUpdateOperationsInput | boolean
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    eventAddress?: StringFieldUpdateOperationsInput | string
    eventCity?: StringFieldUpdateOperationsInput | string
    eventState?: StringFieldUpdateOperationsInput | string
    eventZipCode?: StringFieldUpdateOperationsInput | string
    participantAge?: NullableIntFieldUpdateOperationsInput | number | null
    participantCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    isCancelled?: BoolFieldUpdateOperationsInput | boolean
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    subtotalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    business?: BusinessUpdateOneRequiredWithoutBookingsNestedInput
    customer?: CustomerUpdateOneRequiredWithoutBookingsNestedInput
    payments?: PaymentUpdateManyWithoutBookingNestedInput
    waivers?: WaiverUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateWithoutInventoryItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    totalAmount?: FloatFieldUpdateOperationsInput | number
    depositAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    depositPaid?: BoolFieldUpdateOperationsInput | boolean
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    eventAddress?: StringFieldUpdateOperationsInput | string
    eventCity?: StringFieldUpdateOperationsInput | string
    eventState?: StringFieldUpdateOperationsInput | string
    eventZipCode?: StringFieldUpdateOperationsInput | string
    participantAge?: NullableIntFieldUpdateOperationsInput | number | null
    participantCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    isCancelled?: BoolFieldUpdateOperationsInput | boolean
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    subtotalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    payments?: PaymentUncheckedUpdateManyWithoutBookingNestedInput
    waivers?: WaiverUncheckedUpdateManyWithoutBookingNestedInput
  }

  export type InventoryUpsertWithoutBookingItemsInput = {
    update: XOR<InventoryUpdateWithoutBookingItemsInput, InventoryUncheckedUpdateWithoutBookingItemsInput>
    create: XOR<InventoryCreateWithoutBookingItemsInput, InventoryUncheckedCreateWithoutBookingItemsInput>
    where?: InventoryWhereInput
  }

  export type InventoryUpdateToOneWithWhereWithoutBookingItemsInput = {
    where?: InventoryWhereInput
    data: XOR<InventoryUpdateWithoutBookingItemsInput, InventoryUncheckedUpdateWithoutBookingItemsInput>
  }

  export type InventoryUpdateWithoutBookingItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumInventoryTypeFieldUpdateOperationsInput | $Enums.InventoryType
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimensions?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    setupTime?: IntFieldUpdateOperationsInput | number
    teardownTime?: IntFieldUpdateOperationsInput | number
    images?: InventoryUpdateimagesInput | string[]
    primaryImage?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInventoryStatusFieldUpdateOperationsInput | $Enums.InventoryStatus
    minimumSpace?: StringFieldUpdateOperationsInput | string
    weightLimit?: IntFieldUpdateOperationsInput | number
    ageRange?: StringFieldUpdateOperationsInput | string
    weatherRestrictions?: InventoryUpdateweatherRestrictionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    business?: BusinessUpdateOneRequiredWithoutInventoryNestedInput
  }

  export type InventoryUncheckedUpdateWithoutBookingItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumInventoryTypeFieldUpdateOperationsInput | $Enums.InventoryType
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimensions?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    setupTime?: IntFieldUpdateOperationsInput | number
    teardownTime?: IntFieldUpdateOperationsInput | number
    images?: InventoryUpdateimagesInput | string[]
    primaryImage?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInventoryStatusFieldUpdateOperationsInput | $Enums.InventoryStatus
    minimumSpace?: StringFieldUpdateOperationsInput | string
    weightLimit?: IntFieldUpdateOperationsInput | number
    ageRange?: StringFieldUpdateOperationsInput | string
    weatherRestrictions?: InventoryUpdateweatherRestrictionsInput | string[]
    businessId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type BookingCreateWithoutPaymentsInput = {
    id?: string
    eventDate: Date | string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    totalAmount: number
    depositAmount?: number | null
    depositPaid?: boolean
    eventType?: string | null
    eventAddress: string
    eventCity: string
    eventState: string
    eventZipCode: string
    participantAge?: number | null
    participantCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: string | null
    subtotalAmount?: number
    taxAmount?: number
    taxRate?: number
    business: BusinessCreateNestedOneWithoutBookingsInput
    customer: CustomerCreateNestedOneWithoutBookingsInput
    inventoryItems?: BookingItemCreateNestedManyWithoutBookingInput
    waivers?: WaiverCreateNestedManyWithoutBookingInput
  }

  export type BookingUncheckedCreateWithoutPaymentsInput = {
    id?: string
    eventDate: Date | string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    totalAmount: number
    depositAmount?: number | null
    depositPaid?: boolean
    eventType?: string | null
    eventAddress: string
    eventCity: string
    eventState: string
    eventZipCode: string
    participantAge?: number | null
    participantCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    customerId: string
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: string | null
    subtotalAmount?: number
    taxAmount?: number
    taxRate?: number
    inventoryItems?: BookingItemUncheckedCreateNestedManyWithoutBookingInput
    waivers?: WaiverUncheckedCreateNestedManyWithoutBookingInput
  }

  export type BookingCreateOrConnectWithoutPaymentsInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutPaymentsInput, BookingUncheckedCreateWithoutPaymentsInput>
  }

  export type BusinessCreateWithoutPaymentsInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
    bookings?: BookingCreateNestedManyWithoutBusinessInput
    user: UserCreateNestedOneWithoutBusinessesInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    inventory?: InventoryCreateNestedManyWithoutBusinessInput
    coupons?: CouponCreateNestedManyWithoutBusinessInput
    salesFunnels?: SalesFunnelCreateNestedManyWithoutBusinessInput
    waivers?: WaiverCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutPaymentsInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    userId: string
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
    bookings?: BookingUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    inventory?: InventoryUncheckedCreateNestedManyWithoutBusinessInput
    coupons?: CouponUncheckedCreateNestedManyWithoutBusinessInput
    salesFunnels?: SalesFunnelUncheckedCreateNestedManyWithoutBusinessInput
    waivers?: WaiverUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutPaymentsInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutPaymentsInput, BusinessUncheckedCreateWithoutPaymentsInput>
  }

  export type BookingUpsertWithoutPaymentsInput = {
    update: XOR<BookingUpdateWithoutPaymentsInput, BookingUncheckedUpdateWithoutPaymentsInput>
    create: XOR<BookingCreateWithoutPaymentsInput, BookingUncheckedCreateWithoutPaymentsInput>
    where?: BookingWhereInput
  }

  export type BookingUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: BookingWhereInput
    data: XOR<BookingUpdateWithoutPaymentsInput, BookingUncheckedUpdateWithoutPaymentsInput>
  }

  export type BookingUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    totalAmount?: FloatFieldUpdateOperationsInput | number
    depositAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    depositPaid?: BoolFieldUpdateOperationsInput | boolean
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    eventAddress?: StringFieldUpdateOperationsInput | string
    eventCity?: StringFieldUpdateOperationsInput | string
    eventState?: StringFieldUpdateOperationsInput | string
    eventZipCode?: StringFieldUpdateOperationsInput | string
    participantAge?: NullableIntFieldUpdateOperationsInput | number | null
    participantCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    isCancelled?: BoolFieldUpdateOperationsInput | boolean
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    subtotalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    business?: BusinessUpdateOneRequiredWithoutBookingsNestedInput
    customer?: CustomerUpdateOneRequiredWithoutBookingsNestedInput
    inventoryItems?: BookingItemUpdateManyWithoutBookingNestedInput
    waivers?: WaiverUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    totalAmount?: FloatFieldUpdateOperationsInput | number
    depositAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    depositPaid?: BoolFieldUpdateOperationsInput | boolean
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    eventAddress?: StringFieldUpdateOperationsInput | string
    eventCity?: StringFieldUpdateOperationsInput | string
    eventState?: StringFieldUpdateOperationsInput | string
    eventZipCode?: StringFieldUpdateOperationsInput | string
    participantAge?: NullableIntFieldUpdateOperationsInput | number | null
    participantCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    isCancelled?: BoolFieldUpdateOperationsInput | boolean
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    subtotalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    inventoryItems?: BookingItemUncheckedUpdateManyWithoutBookingNestedInput
    waivers?: WaiverUncheckedUpdateManyWithoutBookingNestedInput
  }

  export type BusinessUpsertWithoutPaymentsInput = {
    update: XOR<BusinessUpdateWithoutPaymentsInput, BusinessUncheckedUpdateWithoutPaymentsInput>
    create: XOR<BusinessCreateWithoutPaymentsInput, BusinessUncheckedCreateWithoutPaymentsInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutPaymentsInput, BusinessUncheckedUpdateWithoutPaymentsInput>
  }

  export type BusinessUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUpdateManyWithoutBusinessNestedInput
    user?: UserUpdateOneRequiredWithoutBusinessesNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    inventory?: InventoryUpdateManyWithoutBusinessNestedInput
    coupons?: CouponUpdateManyWithoutBusinessNestedInput
    salesFunnels?: SalesFunnelUpdateManyWithoutBusinessNestedInput
    waivers?: WaiverUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    inventory?: InventoryUncheckedUpdateManyWithoutBusinessNestedInput
    coupons?: CouponUncheckedUpdateManyWithoutBusinessNestedInput
    salesFunnels?: SalesFunnelUncheckedUpdateManyWithoutBusinessNestedInput
    waivers?: WaiverUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessCreateWithoutCouponsInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
    bookings?: BookingCreateNestedManyWithoutBusinessInput
    user: UserCreateNestedOneWithoutBusinessesInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    inventory?: InventoryCreateNestedManyWithoutBusinessInput
    payments?: PaymentCreateNestedManyWithoutBusinessInput
    salesFunnels?: SalesFunnelCreateNestedManyWithoutBusinessInput
    waivers?: WaiverCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutCouponsInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    userId: string
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
    bookings?: BookingUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    inventory?: InventoryUncheckedCreateNestedManyWithoutBusinessInput
    payments?: PaymentUncheckedCreateNestedManyWithoutBusinessInput
    salesFunnels?: SalesFunnelUncheckedCreateNestedManyWithoutBusinessInput
    waivers?: WaiverUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutCouponsInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutCouponsInput, BusinessUncheckedCreateWithoutCouponsInput>
  }

  export type BusinessUpsertWithoutCouponsInput = {
    update: XOR<BusinessUpdateWithoutCouponsInput, BusinessUncheckedUpdateWithoutCouponsInput>
    create: XOR<BusinessCreateWithoutCouponsInput, BusinessUncheckedCreateWithoutCouponsInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutCouponsInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutCouponsInput, BusinessUncheckedUpdateWithoutCouponsInput>
  }

  export type BusinessUpdateWithoutCouponsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUpdateManyWithoutBusinessNestedInput
    user?: UserUpdateOneRequiredWithoutBusinessesNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    inventory?: InventoryUpdateManyWithoutBusinessNestedInput
    payments?: PaymentUpdateManyWithoutBusinessNestedInput
    salesFunnels?: SalesFunnelUpdateManyWithoutBusinessNestedInput
    waivers?: WaiverUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutCouponsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    inventory?: InventoryUncheckedUpdateManyWithoutBusinessNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutBusinessNestedInput
    salesFunnels?: SalesFunnelUncheckedUpdateManyWithoutBusinessNestedInput
    waivers?: WaiverUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessCreateWithoutSalesFunnelsInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
    bookings?: BookingCreateNestedManyWithoutBusinessInput
    user: UserCreateNestedOneWithoutBusinessesInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    inventory?: InventoryCreateNestedManyWithoutBusinessInput
    payments?: PaymentCreateNestedManyWithoutBusinessInput
    coupons?: CouponCreateNestedManyWithoutBusinessInput
    waivers?: WaiverCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutSalesFunnelsInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    userId: string
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
    bookings?: BookingUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    inventory?: InventoryUncheckedCreateNestedManyWithoutBusinessInput
    payments?: PaymentUncheckedCreateNestedManyWithoutBusinessInput
    coupons?: CouponUncheckedCreateNestedManyWithoutBusinessInput
    waivers?: WaiverUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutSalesFunnelsInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutSalesFunnelsInput, BusinessUncheckedCreateWithoutSalesFunnelsInput>
  }

  export type BusinessUpsertWithoutSalesFunnelsInput = {
    update: XOR<BusinessUpdateWithoutSalesFunnelsInput, BusinessUncheckedUpdateWithoutSalesFunnelsInput>
    create: XOR<BusinessCreateWithoutSalesFunnelsInput, BusinessUncheckedCreateWithoutSalesFunnelsInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutSalesFunnelsInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutSalesFunnelsInput, BusinessUncheckedUpdateWithoutSalesFunnelsInput>
  }

  export type BusinessUpdateWithoutSalesFunnelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUpdateManyWithoutBusinessNestedInput
    user?: UserUpdateOneRequiredWithoutBusinessesNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    inventory?: InventoryUpdateManyWithoutBusinessNestedInput
    payments?: PaymentUpdateManyWithoutBusinessNestedInput
    coupons?: CouponUpdateManyWithoutBusinessNestedInput
    waivers?: WaiverUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutSalesFunnelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    inventory?: InventoryUncheckedUpdateManyWithoutBusinessNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutBusinessNestedInput
    coupons?: CouponUncheckedUpdateManyWithoutBusinessNestedInput
    waivers?: WaiverUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessCreateWithoutWaiversInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
    bookings?: BookingCreateNestedManyWithoutBusinessInput
    user: UserCreateNestedOneWithoutBusinessesInput
    customers?: CustomerCreateNestedManyWithoutBusinessInput
    inventory?: InventoryCreateNestedManyWithoutBusinessInput
    payments?: PaymentCreateNestedManyWithoutBusinessInput
    coupons?: CouponCreateNestedManyWithoutBusinessInput
    salesFunnels?: SalesFunnelCreateNestedManyWithoutBusinessInput
  }

  export type BusinessUncheckedCreateWithoutWaiversInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    userId: string
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
    bookings?: BookingUncheckedCreateNestedManyWithoutBusinessInput
    customers?: CustomerUncheckedCreateNestedManyWithoutBusinessInput
    inventory?: InventoryUncheckedCreateNestedManyWithoutBusinessInput
    payments?: PaymentUncheckedCreateNestedManyWithoutBusinessInput
    coupons?: CouponUncheckedCreateNestedManyWithoutBusinessInput
    salesFunnels?: SalesFunnelUncheckedCreateNestedManyWithoutBusinessInput
  }

  export type BusinessCreateOrConnectWithoutWaiversInput = {
    where: BusinessWhereUniqueInput
    create: XOR<BusinessCreateWithoutWaiversInput, BusinessUncheckedCreateWithoutWaiversInput>
  }

  export type CustomerCreateWithoutWaiversInput = {
    id?: string
    name: string
    email: string
    phone: string
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    notes?: string | null
    bookingCount?: number
    totalSpent?: number
    lastBooking?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isLead?: boolean
    status?: string
    type?: string
    bookings?: BookingCreateNestedManyWithoutCustomerInput
    business: BusinessCreateNestedOneWithoutCustomersInput
  }

  export type CustomerUncheckedCreateWithoutWaiversInput = {
    id?: string
    name: string
    email: string
    phone: string
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    notes?: string | null
    bookingCount?: number
    totalSpent?: number
    lastBooking?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    isLead?: boolean
    status?: string
    type?: string
    bookings?: BookingUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerCreateOrConnectWithoutWaiversInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutWaiversInput, CustomerUncheckedCreateWithoutWaiversInput>
  }

  export type BookingCreateWithoutWaiversInput = {
    id?: string
    eventDate: Date | string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    totalAmount: number
    depositAmount?: number | null
    depositPaid?: boolean
    eventType?: string | null
    eventAddress: string
    eventCity: string
    eventState: string
    eventZipCode: string
    participantAge?: number | null
    participantCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: string | null
    subtotalAmount?: number
    taxAmount?: number
    taxRate?: number
    business: BusinessCreateNestedOneWithoutBookingsInput
    customer: CustomerCreateNestedOneWithoutBookingsInput
    inventoryItems?: BookingItemCreateNestedManyWithoutBookingInput
    payments?: PaymentCreateNestedManyWithoutBookingInput
  }

  export type BookingUncheckedCreateWithoutWaiversInput = {
    id?: string
    eventDate: Date | string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    totalAmount: number
    depositAmount?: number | null
    depositPaid?: boolean
    eventType?: string | null
    eventAddress: string
    eventCity: string
    eventState: string
    eventZipCode: string
    participantAge?: number | null
    participantCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    customerId: string
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: string | null
    subtotalAmount?: number
    taxAmount?: number
    taxRate?: number
    inventoryItems?: BookingItemUncheckedCreateNestedManyWithoutBookingInput
    payments?: PaymentUncheckedCreateNestedManyWithoutBookingInput
  }

  export type BookingCreateOrConnectWithoutWaiversInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutWaiversInput, BookingUncheckedCreateWithoutWaiversInput>
  }

  export type BusinessUpsertWithoutWaiversInput = {
    update: XOR<BusinessUpdateWithoutWaiversInput, BusinessUncheckedUpdateWithoutWaiversInput>
    create: XOR<BusinessCreateWithoutWaiversInput, BusinessUncheckedCreateWithoutWaiversInput>
    where?: BusinessWhereInput
  }

  export type BusinessUpdateToOneWithWhereWithoutWaiversInput = {
    where?: BusinessWhereInput
    data: XOR<BusinessUpdateWithoutWaiversInput, BusinessUncheckedUpdateWithoutWaiversInput>
  }

  export type BusinessUpdateWithoutWaiversInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUpdateManyWithoutBusinessNestedInput
    user?: UserUpdateOneRequiredWithoutBusinessesNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    inventory?: InventoryUpdateManyWithoutBusinessNestedInput
    payments?: PaymentUpdateManyWithoutBusinessNestedInput
    coupons?: CouponUpdateManyWithoutBusinessNestedInput
    salesFunnels?: SalesFunnelUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutWaiversInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    inventory?: InventoryUncheckedUpdateManyWithoutBusinessNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutBusinessNestedInput
    coupons?: CouponUncheckedUpdateManyWithoutBusinessNestedInput
    salesFunnels?: SalesFunnelUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type CustomerUpsertWithoutWaiversInput = {
    update: XOR<CustomerUpdateWithoutWaiversInput, CustomerUncheckedUpdateWithoutWaiversInput>
    create: XOR<CustomerCreateWithoutWaiversInput, CustomerUncheckedCreateWithoutWaiversInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutWaiversInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutWaiversInput, CustomerUncheckedUpdateWithoutWaiversInput>
  }

  export type CustomerUpdateWithoutWaiversInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    bookingCount?: IntFieldUpdateOperationsInput | number
    totalSpent?: FloatFieldUpdateOperationsInput | number
    lastBooking?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isLead?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    bookings?: BookingUpdateManyWithoutCustomerNestedInput
    business?: BusinessUpdateOneRequiredWithoutCustomersNestedInput
  }

  export type CustomerUncheckedUpdateWithoutWaiversInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    bookingCount?: IntFieldUpdateOperationsInput | number
    totalSpent?: FloatFieldUpdateOperationsInput | number
    lastBooking?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    isLead?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    bookings?: BookingUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type BookingUpsertWithoutWaiversInput = {
    update: XOR<BookingUpdateWithoutWaiversInput, BookingUncheckedUpdateWithoutWaiversInput>
    create: XOR<BookingCreateWithoutWaiversInput, BookingUncheckedCreateWithoutWaiversInput>
    where?: BookingWhereInput
  }

  export type BookingUpdateToOneWithWhereWithoutWaiversInput = {
    where?: BookingWhereInput
    data: XOR<BookingUpdateWithoutWaiversInput, BookingUncheckedUpdateWithoutWaiversInput>
  }

  export type BookingUpdateWithoutWaiversInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    totalAmount?: FloatFieldUpdateOperationsInput | number
    depositAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    depositPaid?: BoolFieldUpdateOperationsInput | boolean
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    eventAddress?: StringFieldUpdateOperationsInput | string
    eventCity?: StringFieldUpdateOperationsInput | string
    eventState?: StringFieldUpdateOperationsInput | string
    eventZipCode?: StringFieldUpdateOperationsInput | string
    participantAge?: NullableIntFieldUpdateOperationsInput | number | null
    participantCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    isCancelled?: BoolFieldUpdateOperationsInput | boolean
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    subtotalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    business?: BusinessUpdateOneRequiredWithoutBookingsNestedInput
    customer?: CustomerUpdateOneRequiredWithoutBookingsNestedInput
    inventoryItems?: BookingItemUpdateManyWithoutBookingNestedInput
    payments?: PaymentUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateWithoutWaiversInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    totalAmount?: FloatFieldUpdateOperationsInput | number
    depositAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    depositPaid?: BoolFieldUpdateOperationsInput | boolean
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    eventAddress?: StringFieldUpdateOperationsInput | string
    eventCity?: StringFieldUpdateOperationsInput | string
    eventState?: StringFieldUpdateOperationsInput | string
    eventZipCode?: StringFieldUpdateOperationsInput | string
    participantAge?: NullableIntFieldUpdateOperationsInput | number | null
    participantCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    isCancelled?: BoolFieldUpdateOperationsInput | boolean
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    subtotalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    inventoryItems?: BookingItemUncheckedUpdateManyWithoutBookingNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutBookingNestedInput
  }

  export type BusinessCreateManyUserInput = {
    id?: string
    name: string
    description?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    phone?: string | null
    email?: string | null
    serviceArea?: BusinessCreateserviceAreaInput | string[]
    logo?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    minAdvanceBooking?: number
    maxAdvanceBooking?: number
    minimumPurchase?: number
    stripeAccountId?: string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: string | null
    subdomain?: string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: string | null
  }

  export type BusinessUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUpdateManyWithoutBusinessNestedInput
    inventory?: InventoryUpdateManyWithoutBusinessNestedInput
    payments?: PaymentUpdateManyWithoutBusinessNestedInput
    coupons?: CouponUpdateManyWithoutBusinessNestedInput
    salesFunnels?: SalesFunnelUpdateManyWithoutBusinessNestedInput
    waivers?: WaiverUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUncheckedUpdateManyWithoutBusinessNestedInput
    customers?: CustomerUncheckedUpdateManyWithoutBusinessNestedInput
    inventory?: InventoryUncheckedUpdateManyWithoutBusinessNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutBusinessNestedInput
    coupons?: CouponUncheckedUpdateManyWithoutBusinessNestedInput
    salesFunnels?: SalesFunnelUncheckedUpdateManyWithoutBusinessNestedInput
    waivers?: WaiverUncheckedUpdateManyWithoutBusinessNestedInput
  }

  export type BusinessUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    serviceArea?: BusinessUpdateserviceAreaInput | string[]
    logo?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    minAdvanceBooking?: IntFieldUpdateOperationsInput | number
    maxAdvanceBooking?: IntFieldUpdateOperationsInput | number
    minimumPurchase?: FloatFieldUpdateOperationsInput | number
    stripeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    socialMedia?: NullableJsonNullValueInput | InputJsonValue
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    subdomain?: NullableStringFieldUpdateOperationsInput | string | null
    siteConfig?: NullableJsonNullValueInput | InputJsonValue
    onboardingError?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BookingCreateManyBusinessInput = {
    id?: string
    eventDate: Date | string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    totalAmount: number
    depositAmount?: number | null
    depositPaid?: boolean
    eventType?: string | null
    eventAddress: string
    eventCity: string
    eventState: string
    eventZipCode: string
    participantAge?: number | null
    participantCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    customerId: string
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: string | null
    subtotalAmount?: number
    taxAmount?: number
    taxRate?: number
  }

  export type CustomerCreateManyBusinessInput = {
    id?: string
    name: string
    email: string
    phone: string
    address?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
    notes?: string | null
    bookingCount?: number
    totalSpent?: number
    lastBooking?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    isLead?: boolean
    status?: string
    type?: string
  }

  export type InventoryCreateManyBusinessInput = {
    id?: string
    type: $Enums.InventoryType
    name: string
    description?: string | null
    dimensions: string
    capacity: number
    price: number
    setupTime: number
    teardownTime: number
    images?: InventoryCreateimagesInput | string[]
    primaryImage?: string | null
    status: $Enums.InventoryStatus
    minimumSpace: string
    weightLimit: number
    ageRange: string
    weatherRestrictions?: InventoryCreateweatherRestrictionsInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    quantity?: number
  }

  export type PaymentCreateManyBusinessInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    type: $Enums.PaymentType
    status: $Enums.PaymentStatus
    createdAt?: Date | string
    bookingId: string
    currency?: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string | null
    refundReason?: string | null
    stripeClientSecret?: string | null
    stripePaymentId?: string | null
    updatedAt?: Date | string
  }

  export type CouponCreateManyBusinessInput = {
    id?: string
    code: string
    description?: string | null
    discountType: $Enums.DiscountType
    discountAmount: number
    maxUses?: number | null
    usedCount?: number
    startDate?: Date | string | null
    endDate?: Date | string | null
    isActive?: boolean
    minimumAmount?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalesFunnelCreateManyBusinessInput = {
    id?: string
    name: string
    isActive?: boolean
    popupTitle: string
    popupText: string
    popupImage?: string | null
    formTitle: string
    thankYouMessage: string
    couponId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WaiverCreateManyBusinessInput = {
    id?: string
    customerId: string
    bookingId: string
    status?: $Enums.WaiverStatus
    templateVersion: string
    documentUrl: string
    openSignDocumentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    totalAmount?: FloatFieldUpdateOperationsInput | number
    depositAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    depositPaid?: BoolFieldUpdateOperationsInput | boolean
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    eventAddress?: StringFieldUpdateOperationsInput | string
    eventCity?: StringFieldUpdateOperationsInput | string
    eventState?: StringFieldUpdateOperationsInput | string
    eventZipCode?: StringFieldUpdateOperationsInput | string
    participantAge?: NullableIntFieldUpdateOperationsInput | number | null
    participantCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    isCancelled?: BoolFieldUpdateOperationsInput | boolean
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    subtotalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    customer?: CustomerUpdateOneRequiredWithoutBookingsNestedInput
    inventoryItems?: BookingItemUpdateManyWithoutBookingNestedInput
    payments?: PaymentUpdateManyWithoutBookingNestedInput
    waivers?: WaiverUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    totalAmount?: FloatFieldUpdateOperationsInput | number
    depositAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    depositPaid?: BoolFieldUpdateOperationsInput | boolean
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    eventAddress?: StringFieldUpdateOperationsInput | string
    eventCity?: StringFieldUpdateOperationsInput | string
    eventState?: StringFieldUpdateOperationsInput | string
    eventZipCode?: StringFieldUpdateOperationsInput | string
    participantAge?: NullableIntFieldUpdateOperationsInput | number | null
    participantCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    isCancelled?: BoolFieldUpdateOperationsInput | boolean
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    subtotalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    inventoryItems?: BookingItemUncheckedUpdateManyWithoutBookingNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutBookingNestedInput
    waivers?: WaiverUncheckedUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    totalAmount?: FloatFieldUpdateOperationsInput | number
    depositAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    depositPaid?: BoolFieldUpdateOperationsInput | boolean
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    eventAddress?: StringFieldUpdateOperationsInput | string
    eventCity?: StringFieldUpdateOperationsInput | string
    eventState?: StringFieldUpdateOperationsInput | string
    eventZipCode?: StringFieldUpdateOperationsInput | string
    participantAge?: NullableIntFieldUpdateOperationsInput | number | null
    participantCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customerId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    isCancelled?: BoolFieldUpdateOperationsInput | boolean
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    subtotalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
  }

  export type CustomerUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    bookingCount?: IntFieldUpdateOperationsInput | number
    totalSpent?: FloatFieldUpdateOperationsInput | number
    lastBooking?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isLead?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    bookings?: BookingUpdateManyWithoutCustomerNestedInput
    waivers?: WaiverUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    bookingCount?: IntFieldUpdateOperationsInput | number
    totalSpent?: FloatFieldUpdateOperationsInput | number
    lastBooking?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isLead?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    bookings?: BookingUncheckedUpdateManyWithoutCustomerNestedInput
    waivers?: WaiverUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipCode?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    bookingCount?: IntFieldUpdateOperationsInput | number
    totalSpent?: FloatFieldUpdateOperationsInput | number
    lastBooking?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isLead?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
  }

  export type InventoryUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumInventoryTypeFieldUpdateOperationsInput | $Enums.InventoryType
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimensions?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    setupTime?: IntFieldUpdateOperationsInput | number
    teardownTime?: IntFieldUpdateOperationsInput | number
    images?: InventoryUpdateimagesInput | string[]
    primaryImage?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInventoryStatusFieldUpdateOperationsInput | $Enums.InventoryStatus
    minimumSpace?: StringFieldUpdateOperationsInput | string
    weightLimit?: IntFieldUpdateOperationsInput | number
    ageRange?: StringFieldUpdateOperationsInput | string
    weatherRestrictions?: InventoryUpdateweatherRestrictionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    bookingItems?: BookingItemUpdateManyWithoutInventoryNestedInput
  }

  export type InventoryUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumInventoryTypeFieldUpdateOperationsInput | $Enums.InventoryType
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimensions?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    setupTime?: IntFieldUpdateOperationsInput | number
    teardownTime?: IntFieldUpdateOperationsInput | number
    images?: InventoryUpdateimagesInput | string[]
    primaryImage?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInventoryStatusFieldUpdateOperationsInput | $Enums.InventoryStatus
    minimumSpace?: StringFieldUpdateOperationsInput | string
    weightLimit?: IntFieldUpdateOperationsInput | number
    ageRange?: StringFieldUpdateOperationsInput | string
    weatherRestrictions?: InventoryUpdateweatherRestrictionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
    bookingItems?: BookingItemUncheckedUpdateManyWithoutInventoryNestedInput
  }

  export type InventoryUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumInventoryTypeFieldUpdateOperationsInput | $Enums.InventoryType
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimensions?: StringFieldUpdateOperationsInput | string
    capacity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    setupTime?: IntFieldUpdateOperationsInput | number
    teardownTime?: IntFieldUpdateOperationsInput | number
    images?: InventoryUpdateimagesInput | string[]
    primaryImage?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumInventoryStatusFieldUpdateOperationsInput | $Enums.InventoryStatus
    minimumSpace?: StringFieldUpdateOperationsInput | string
    weightLimit?: IntFieldUpdateOperationsInput | number
    ageRange?: StringFieldUpdateOperationsInput | string
    weatherRestrictions?: InventoryUpdateweatherRestrictionsInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type PaymentUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    currency?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    refundReason?: NullableStringFieldUpdateOperationsInput | string | null
    stripeClientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    booking?: BookingUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookingId?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    refundReason?: NullableStringFieldUpdateOperationsInput | string | null
    stripeClientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookingId?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    refundReason?: NullableStringFieldUpdateOperationsInput | string | null
    stripeClientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CouponUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    discountType?: EnumDiscountTypeFieldUpdateOperationsInput | $Enums.DiscountType
    discountAmount?: FloatFieldUpdateOperationsInput | number
    maxUses?: NullableIntFieldUpdateOperationsInput | number | null
    usedCount?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    minimumAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CouponUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    discountType?: EnumDiscountTypeFieldUpdateOperationsInput | $Enums.DiscountType
    discountAmount?: FloatFieldUpdateOperationsInput | number
    maxUses?: NullableIntFieldUpdateOperationsInput | number | null
    usedCount?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    minimumAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CouponUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    discountType?: EnumDiscountTypeFieldUpdateOperationsInput | $Enums.DiscountType
    discountAmount?: FloatFieldUpdateOperationsInput | number
    maxUses?: NullableIntFieldUpdateOperationsInput | number | null
    usedCount?: IntFieldUpdateOperationsInput | number
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    minimumAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesFunnelUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    popupTitle?: StringFieldUpdateOperationsInput | string
    popupText?: StringFieldUpdateOperationsInput | string
    popupImage?: NullableStringFieldUpdateOperationsInput | string | null
    formTitle?: StringFieldUpdateOperationsInput | string
    thankYouMessage?: StringFieldUpdateOperationsInput | string
    couponId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesFunnelUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    popupTitle?: StringFieldUpdateOperationsInput | string
    popupText?: StringFieldUpdateOperationsInput | string
    popupImage?: NullableStringFieldUpdateOperationsInput | string | null
    formTitle?: StringFieldUpdateOperationsInput | string
    thankYouMessage?: StringFieldUpdateOperationsInput | string
    couponId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesFunnelUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    popupTitle?: StringFieldUpdateOperationsInput | string
    popupText?: StringFieldUpdateOperationsInput | string
    popupImage?: NullableStringFieldUpdateOperationsInput | string | null
    formTitle?: StringFieldUpdateOperationsInput | string
    thankYouMessage?: StringFieldUpdateOperationsInput | string
    couponId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WaiverUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumWaiverStatusFieldUpdateOperationsInput | $Enums.WaiverStatus
    templateVersion?: StringFieldUpdateOperationsInput | string
    documentUrl?: StringFieldUpdateOperationsInput | string
    openSignDocumentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customer?: CustomerUpdateOneRequiredWithoutWaiversNestedInput
    booking?: BookingUpdateOneRequiredWithoutWaiversNestedInput
  }

  export type WaiverUncheckedUpdateWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    status?: EnumWaiverStatusFieldUpdateOperationsInput | $Enums.WaiverStatus
    templateVersion?: StringFieldUpdateOperationsInput | string
    documentUrl?: StringFieldUpdateOperationsInput | string
    openSignDocumentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WaiverUncheckedUpdateManyWithoutBusinessInput = {
    id?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    status?: EnumWaiverStatusFieldUpdateOperationsInput | $Enums.WaiverStatus
    templateVersion?: StringFieldUpdateOperationsInput | string
    documentUrl?: StringFieldUpdateOperationsInput | string
    openSignDocumentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingItemCreateManyInventoryInput = {
    id?: string
    bookingId: string
    quantity?: number
    price: number
  }

  export type BookingItemUpdateWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    booking?: BookingUpdateOneRequiredWithoutInventoryItemsNestedInput
  }

  export type BookingItemUncheckedUpdateWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
  }

  export type BookingItemUncheckedUpdateManyWithoutInventoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
  }

  export type BookingCreateManyCustomerInput = {
    id?: string
    eventDate: Date | string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    totalAmount: number
    depositAmount?: number | null
    depositPaid?: boolean
    eventType?: string | null
    eventAddress: string
    eventCity: string
    eventState: string
    eventZipCode: string
    participantAge?: number | null
    participantCount: number
    createdAt?: Date | string
    updatedAt?: Date | string
    businessId: string
    isCompleted?: boolean
    isCancelled?: boolean
    specialInstructions?: string | null
    subtotalAmount?: number
    taxAmount?: number
    taxRate?: number
  }

  export type WaiverCreateManyCustomerInput = {
    id?: string
    businessId: string
    bookingId: string
    status?: $Enums.WaiverStatus
    templateVersion: string
    documentUrl: string
    openSignDocumentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    totalAmount?: FloatFieldUpdateOperationsInput | number
    depositAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    depositPaid?: BoolFieldUpdateOperationsInput | boolean
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    eventAddress?: StringFieldUpdateOperationsInput | string
    eventCity?: StringFieldUpdateOperationsInput | string
    eventState?: StringFieldUpdateOperationsInput | string
    eventZipCode?: StringFieldUpdateOperationsInput | string
    participantAge?: NullableIntFieldUpdateOperationsInput | number | null
    participantCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    isCancelled?: BoolFieldUpdateOperationsInput | boolean
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    subtotalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    business?: BusinessUpdateOneRequiredWithoutBookingsNestedInput
    inventoryItems?: BookingItemUpdateManyWithoutBookingNestedInput
    payments?: PaymentUpdateManyWithoutBookingNestedInput
    waivers?: WaiverUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    totalAmount?: FloatFieldUpdateOperationsInput | number
    depositAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    depositPaid?: BoolFieldUpdateOperationsInput | boolean
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    eventAddress?: StringFieldUpdateOperationsInput | string
    eventCity?: StringFieldUpdateOperationsInput | string
    eventState?: StringFieldUpdateOperationsInput | string
    eventZipCode?: StringFieldUpdateOperationsInput | string
    participantAge?: NullableIntFieldUpdateOperationsInput | number | null
    participantCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    isCancelled?: BoolFieldUpdateOperationsInput | boolean
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    subtotalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
    inventoryItems?: BookingItemUncheckedUpdateManyWithoutBookingNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutBookingNestedInput
    waivers?: WaiverUncheckedUpdateManyWithoutBookingNestedInput
  }

  export type BookingUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    eventDate?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    totalAmount?: FloatFieldUpdateOperationsInput | number
    depositAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    depositPaid?: BoolFieldUpdateOperationsInput | boolean
    eventType?: NullableStringFieldUpdateOperationsInput | string | null
    eventAddress?: StringFieldUpdateOperationsInput | string
    eventCity?: StringFieldUpdateOperationsInput | string
    eventState?: StringFieldUpdateOperationsInput | string
    eventZipCode?: StringFieldUpdateOperationsInput | string
    participantAge?: NullableIntFieldUpdateOperationsInput | number | null
    participantCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    isCancelled?: BoolFieldUpdateOperationsInput | boolean
    specialInstructions?: NullableStringFieldUpdateOperationsInput | string | null
    subtotalAmount?: FloatFieldUpdateOperationsInput | number
    taxAmount?: FloatFieldUpdateOperationsInput | number
    taxRate?: FloatFieldUpdateOperationsInput | number
  }

  export type WaiverUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumWaiverStatusFieldUpdateOperationsInput | $Enums.WaiverStatus
    templateVersion?: StringFieldUpdateOperationsInput | string
    documentUrl?: StringFieldUpdateOperationsInput | string
    openSignDocumentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutWaiversNestedInput
    booking?: BookingUpdateOneRequiredWithoutWaiversNestedInput
  }

  export type WaiverUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    status?: EnumWaiverStatusFieldUpdateOperationsInput | $Enums.WaiverStatus
    templateVersion?: StringFieldUpdateOperationsInput | string
    documentUrl?: StringFieldUpdateOperationsInput | string
    openSignDocumentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WaiverUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    bookingId?: StringFieldUpdateOperationsInput | string
    status?: EnumWaiverStatusFieldUpdateOperationsInput | $Enums.WaiverStatus
    templateVersion?: StringFieldUpdateOperationsInput | string
    documentUrl?: StringFieldUpdateOperationsInput | string
    openSignDocumentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingItemCreateManyBookingInput = {
    id?: string
    inventoryId: string
    quantity?: number
    price: number
  }

  export type PaymentCreateManyBookingInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    type: $Enums.PaymentType
    status: $Enums.PaymentStatus
    createdAt?: Date | string
    businessId: string
    currency?: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: Date | string | null
    refundAmount?: Decimal | DecimalJsLike | number | string | null
    refundReason?: string | null
    stripeClientSecret?: string | null
    stripePaymentId?: string | null
    updatedAt?: Date | string
  }

  export type WaiverCreateManyBookingInput = {
    id?: string
    businessId: string
    customerId: string
    status?: $Enums.WaiverStatus
    templateVersion: string
    documentUrl: string
    openSignDocumentId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BookingItemUpdateWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    inventory?: InventoryUpdateOneRequiredWithoutBookingItemsNestedInput
  }

  export type BookingItemUncheckedUpdateWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    inventoryId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
  }

  export type BookingItemUncheckedUpdateManyWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    inventoryId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
  }

  export type PaymentUpdateWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    currency?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    refundReason?: NullableStringFieldUpdateOperationsInput | string | null
    stripeClientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    refundReason?: NullableStringFieldUpdateOperationsInput | string | null
    stripeClientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUncheckedUpdateManyWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    type?: EnumPaymentTypeFieldUpdateOperationsInput | $Enums.PaymentType
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    businessId?: StringFieldUpdateOperationsInput | string
    currency?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refundAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    refundReason?: NullableStringFieldUpdateOperationsInput | string | null
    stripeClientSecret?: NullableStringFieldUpdateOperationsInput | string | null
    stripePaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WaiverUpdateWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumWaiverStatusFieldUpdateOperationsInput | $Enums.WaiverStatus
    templateVersion?: StringFieldUpdateOperationsInput | string
    documentUrl?: StringFieldUpdateOperationsInput | string
    openSignDocumentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    business?: BusinessUpdateOneRequiredWithoutWaiversNestedInput
    customer?: CustomerUpdateOneRequiredWithoutWaiversNestedInput
  }

  export type WaiverUncheckedUpdateWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    status?: EnumWaiverStatusFieldUpdateOperationsInput | $Enums.WaiverStatus
    templateVersion?: StringFieldUpdateOperationsInput | string
    documentUrl?: StringFieldUpdateOperationsInput | string
    openSignDocumentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WaiverUncheckedUpdateManyWithoutBookingInput = {
    id?: StringFieldUpdateOperationsInput | string
    businessId?: StringFieldUpdateOperationsInput | string
    customerId?: StringFieldUpdateOperationsInput | string
    status?: EnumWaiverStatusFieldUpdateOperationsInput | $Enums.WaiverStatus
    templateVersion?: StringFieldUpdateOperationsInput | string
    documentUrl?: StringFieldUpdateOperationsInput | string
    openSignDocumentId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}