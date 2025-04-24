
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  name: 'name',
  createdAt: 'createdAt',
  image: 'image',
  updatedAt: 'updatedAt',
  onboarded: 'onboarded',
  clerkUserId: 'clerkUserId'
};

exports.Prisma.BusinessScalarFieldEnum = {
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

exports.Prisma.InventoryScalarFieldEnum = {
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

exports.Prisma.CustomerScalarFieldEnum = {
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

exports.Prisma.BookingScalarFieldEnum = {
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

exports.Prisma.BookingItemScalarFieldEnum = {
  id: 'id',
  bookingId: 'bookingId',
  inventoryId: 'inventoryId',
  quantity: 'quantity',
  price: 'price'
};

exports.Prisma.PaymentScalarFieldEnum = {
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

exports.Prisma.CouponScalarFieldEnum = {
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

exports.Prisma.SalesFunnelScalarFieldEnum = {
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

exports.Prisma.WaiverScalarFieldEnum = {
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

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.InventoryType = exports.$Enums.InventoryType = {
  BOUNCE_HOUSE: 'BOUNCE_HOUSE',
  INFLATABLE: 'INFLATABLE',
  GAME: 'GAME',
  OTHER: 'OTHER'
};

exports.InventoryStatus = exports.$Enums.InventoryStatus = {
  AVAILABLE: 'AVAILABLE',
  BOOKED: 'BOOKED',
  MAINTENANCE: 'MAINTENANCE',
  RETIRED: 'RETIRED'
};

exports.BookingStatus = exports.$Enums.BookingStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  NO_SHOW: 'NO_SHOW',
  WEATHER_HOLD: 'WEATHER_HOLD'
};

exports.PaymentType = exports.$Enums.PaymentType = {
  DEPOSIT: 'DEPOSIT',
  FULL_PAYMENT: 'FULL_PAYMENT',
  REFUND: 'REFUND'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

exports.DiscountType = exports.$Enums.DiscountType = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED: 'FIXED'
};

exports.WaiverStatus = exports.$Enums.WaiverStatus = {
  PENDING: 'PENDING',
  SIGNED: 'SIGNED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
};

exports.Prisma.ModelName = {
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

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
