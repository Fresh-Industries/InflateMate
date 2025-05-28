import { Business, Customer, Booking, BookingItem, Inventory } from "@prisma/client";
import { formatCurrency, utcToLocal } from "./utils";
import { SiteConfig } from "./business/domain-utils";

// Extended booking type with relations for email template
export interface BookingWithDetails extends Booking {
  customer: Customer;
  business: Business & {
    siteConfig: SiteConfig | null;
  };
  eventTimeZone: string;
  inventoryItems: (BookingItem & {
    inventory: Inventory;
  })[];
}

export const bookingConfirmationEmailHtml = (
  booking: BookingWithDetails, 
  waiverUrl: string
) => {
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (time: Date | string, timeZone: string = 'America/Chicago') => {
    const t = typeof time === 'string' ? new Date(time) : time;
    return utcToLocal(t, timeZone, 'h:mm a');
  };

  const eventAddress = [
    booking.eventAddress,
    booking.eventCity,
    booking.eventState,
    booking.eventZipCode
  ].filter(Boolean).join(', ');

  // Extract colors from site config with modern fallbacks
  const colors = booking.business.siteConfig?.colors || {};
  const primaryColor = colors.primary || '#3b82f6'; // Modern blue
  const secondaryColor = colors.secondary || '#6366f1'; // Modern indigo
  const accentColor = colors.accent || '#10b981'; // Modern emerald
  const backgroundColor = colors.background || '#f8fafc';
  const textColor = colors.text || '#1e293b';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation - ${booking.business.name}</title>
    <style>
        * {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: ${textColor};
            background-color: ${backgroundColor};
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .email-wrapper {
            background-color: ${backgroundColor};
            padding: 40px 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(0, 0, 0, 0.06);
        }
        .header {
            background: ${primaryColor};
            color: #ffffff;
            padding: 48px 40px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 12px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
            font-weight: 500;
        }
        .content {
            padding: 48px 40px;
            background-color: #ffffff;
        }
        .greeting {
            font-size: 20px;
            margin-bottom: 32px;
            color: ${textColor};
            font-weight: 600;
        }
        .confirmation-box {
            background-color: ${backgroundColor};
            border: 1px solid ${primaryColor}20;
            border-radius: 12px;
            padding: 32px;
            margin: 32px 0;
            text-align: center;
        }
        .confirmation-box h2 {
            margin: 0 0 16px 0;
            font-size: 24px;
            font-weight: 700;
            color: ${textColor};
            letter-spacing: -0.3px;
        }
        .booking-id {
            font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            font-size: 14px;
            font-weight: 600;
            background-color: ${primaryColor};
            color: #ffffff;
            padding: 12px 20px;
            border-radius: 8px;
            display: inline-block;
            margin-top: 16px;
            letter-spacing: 0.5px;
        }
        .section {
            margin: 40px 0;
            padding: 0;
        }
        .section h3 {
            margin: 0 0 24px 0;
            color: ${textColor};
            font-size: 20px;
            font-weight: 700;
            letter-spacing: -0.3px;
            border-bottom: 2px solid ${backgroundColor};
            padding-bottom: 12px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-top: 24px;
        }
        .info-item {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid ${backgroundColor};
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        .info-label {
            font-weight: 600;
            color: ${primaryColor};
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }
        .info-value {
            color: ${textColor};
            font-size: 16px;
            font-weight: 600;
        }
        .items-list {
            margin: 24px 0 0 0;
        }
        .item {
            background-color: #ffffff;
            border: 1px solid ${backgroundColor};
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            transition: box-shadow 0.2s ease;
        }
        .item:hover {
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
        }
        .item-name {
            font-weight: 700;
            color: ${textColor};
            font-size: 18px;
            margin: 0;
            letter-spacing: -0.2px;
        }
        .item-price {
            text-align: right;
            color: ${primaryColor};
            font-size: 18px;
            font-weight: 700;
        }
        .item-description {
            color: ${textColor};
            opacity: 0.7;
            font-size: 14px;
            margin-bottom: 16px;
            line-height: 1.5;
        }
        .item-specs {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            font-size: 13px;
            color: ${textColor};
            opacity: 0.6;
            font-weight: 500;
        }
        .total-section {
            background-color: ${backgroundColor};
            border-radius: 12px;
            padding: 32px;
            margin: 40px 0;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 12px 0;
            font-size: 16px;
            color: ${textColor};
            font-weight: 500;
        }
        .total-final {
            border-top: 2px solid ${primaryColor}20;
            padding-top: 16px;
            margin-top: 16px;
            font-weight: 700;
            font-size: 20px;
            color: ${textColor};
        }
        .waiver-section {
            background-color: #fff9f0;
            border: 1px solid #fbbf24;
            border-radius: 12px;
            padding: 32px;
            margin: 40px 0;
            text-align: center;
        }
        .waiver-section h3 {
            margin: 0 0 16px 0;
            color: #92400e;
            font-size: 20px;
            font-weight: 700;
            border: none;
            padding: 0;
        }
        .waiver-section p {
            margin: 0 0 16px 0;
            color: #92400e;
            font-size: 15px;
            line-height: 1.5;
        }
        .waiver-button {
            display: inline-block;
            background-color: ${accentColor};
            color: #ffffff;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 16px;
            margin: 16px 0;
            transition: background-color 0.2s ease;
        }
        .waiver-button:hover {
            background-color: ${primaryColor};
        }
        .important-note {
            background-color: #f8f9fa;
            border-left: 4px solid ${secondaryColor};
            border-radius: 8px;
            padding: 24px;
            margin: 32px 0;
        }
        .important-note strong {
            color: ${textColor};
            font-weight: 700;
            font-size: 16px;
            display: block;
            margin-bottom: 12px;
        }
        .important-note ul {
            margin: 0;
            padding-left: 20px;
            color: ${textColor};
        }
        .important-note li {
            margin: 8px 0;
            font-weight: 500;
            line-height: 1.5;
        }
        .closing-text {
            color: ${textColor};
            font-size: 16px;
            line-height: 1.6;
            margin: 32px 0 16px 0;
        }
        .closing-text.final {
            font-weight: 700;
            margin: 0;
        }
        .footer {
            background-color: ${textColor};
            color: #ffffff;
            padding: 40px;
            text-align: center;
        }
        .footer h4 {
            margin: 0 0 20px 0;
            font-size: 20px;
            font-weight: 700;
        }
        .contact-info {
            margin: 8px 0;
            font-size: 15px;
            font-weight: 500;
        }
        .contact-info a {
            color: ${accentColor};
            text-decoration: none;
            font-weight: 600;
        }
        
        @media (max-width: 600px) {
            .email-wrapper {
                padding: 20px 10px;
            }
            .content, .header, .footer {
                padding: 32px 24px;
            }
            .info-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }
            .item-header {
                flex-direction: column;
                align-items: flex-start;
            }
            .item-price {
                text-align: left;
                margin-top: 8px;
            }
            .item-specs {
                gap: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="container">
            <!-- Header -->
            <div class="header">
                <h1>🎉 Booking Confirmed!</h1>
                <p>Your bounce house rental is all set</p>
            </div>

            <!-- Content -->
            <div class="content">
                <div class="greeting">
                    Hello ${booking.customer.name}! 👋
                </div>

                <div class="confirmation-box">
                    <h2>Your booking with ${booking.business.name} is confirmed!</h2>
                    <div class="booking-id">Booking ID: ${booking.id}</div>
                </div>

                <!-- Event Details -->
                <div class="section">
                    <h3>📅 Event Details</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Event Date</div>
                            <div class="info-value">${formatDate(booking.eventDate)}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Delivery Time</div>
                            <div class="info-value">${formatTime(booking.startTime, booking.eventTimeZone)}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Pickup Time</div>
                            <div class="info-value">${formatTime(booking.endTime, booking.eventTimeZone)}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Event Type</div>
                            <div class="info-value">${booking.eventType || 'Party/Event'}</div>
                        </div>
                    </div>
                    ${eventAddress ? `
                    <div style="margin-top: 15px;">
                        <div class="info-label">Event Location</div>
                        <div class="info-value">${eventAddress}</div>
                    </div>
                    ` : ''}
                    ${booking.participantCount ? `
                    <div style="margin-top: 15px;">
                        <div class="info-label">Expected Participants</div>
                        <div class="info-value">${booking.participantCount} ${booking.participantAge ? `(Age: ${booking.participantAge})` : ''}</div>
                    </div>
                    ` : ''}
                </div>

                <!-- Rental Items -->
                <div class="section">
                    <h3>🏰 Your Rental Items</h3>
                    <div class="items-list">
                        ${booking.inventoryItems.map(item => `
                        <div class="item">
                            <div class="item-header">
                                <h4 class="item-name">${item.inventory.name}</h4>
                                <div class="item-price">${formatCurrency(item.price)}</div>
                            </div>
                            ${item.inventory.description ? `<div class="item-description">${item.inventory.description}</div>` : ''}
                            <div class="item-specs">
                                <span>📏 ${item.inventory.dimensions}</span>
                                <span>👥 ${item.inventory.capacity}</span>
                                <span>🎂 ${item.inventory.ageRange}</span>
                                <span>📦 Qty: ${item.quantity}</span>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Pricing -->
                <div class="total-section">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>${formatCurrency(booking.subtotalAmount || 0)}</span>
                    </div>
                    ${booking.taxAmount ? `
                    <div class="total-row">
                        <span>Tax:</span>
                        <span>${formatCurrency(booking.taxAmount)}</span>
                    </div>
                    ` : ''}
                    <div class="total-row total-final">
                        <span>Total Amount:</span>
                        <span>${formatCurrency(booking.totalAmount || 0)}</span>
                    </div>
                    ${booking.depositAmount ? `
                    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(0,0,0,0.1); font-size: 14px; color: ${textColor}; opacity: 0.7;">
                        Deposit Required: ${formatCurrency(booking.depositAmount)}
                    </div>
                    ` : ''}
                </div>

                <!-- Important Waiver Section -->
                <div class="waiver-section">
                    <h3>⚠️ Important: Waiver Required</h3>
                    <p>
                        Before we can deliver your rental, all participants must sign our safety waiver. 
                        This is required for insurance and safety purposes.
                    </p>
                    <a href="${waiverUrl}" class="waiver-button">
                        📝 Sign Your Waiver Now
                    </a>
                    <p style="margin: 16px 0 0 0; font-size: 13px; color: #92400e; opacity: 0.8;">
                        Please complete this as soon as possible to ensure timely delivery.
                    </p>
                </div>

                ${booking.specialInstructions ? `
                <div class="section">
                    <h3>📝 Special Instructions</h3>
                    <p style="margin: 0; color: ${textColor}; font-size: 15px; line-height: 1.6;">${booking.specialInstructions}</p>
                </div>
                ` : ''}

                <!-- Important Notes -->
                <div class="important-note">
                    <strong>📋 Important Reminders:</strong>
                    <ul>
                        <li>Please ensure the setup area is clear and accessible</li>
                        <li>An adult must be present during delivery and pickup</li>
                        <li>Weather conditions may affect delivery (we'll contact you if needed)</li>
                        <li>All safety rules must be followed during the rental period</li>
                    </ul>
                </div>

                <p class="closing-text">
                    We're excited to make your event amazing! If you have any questions or need to make changes, 
                    please don't hesitate to contact us.
                </p>

                <p class="closing-text final">
                    Thank you for choosing ${booking.business.name}! 
                </p>
            </div>

            <!-- Footer -->
            <div class="footer">
                <h4>${booking.business.name}</h4>
                ${booking.business.phone ? `<div class="contact-info">📞 <a href="tel:${booking.business.phone}">${booking.business.phone}</a></div>` : ''}
                ${booking.business.email ? `<div class="contact-info">✉️ <a href="mailto:${booking.business.email}">${booking.business.email}</a></div>` : ''}
                ${booking.business.address ? `<div class="contact-info">📍 ${[booking.business.address, booking.business.city, booking.business.state].filter(Boolean).join(', ')}</div>` : ''}
            </div>
        </div>
    </div>
</body>
</html>
`;
};