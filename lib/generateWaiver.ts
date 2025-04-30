// lib/waiverTemplate.ts
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Business {
  id: string;
  name: string;
  logo?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface Booking {
  id: string;
  eventDate: string;    // ISO date string
  eventAddress: string;
  eventCity: string;
  eventState: string;
  eventZipCode: string;
  participantCount: number;
  participantAge?: number;
}

export function buildWaiverHtml({
  business,
  customer,
  booking,
  templateVersion,
}: {
  business: Business;
  customer: Customer;
  booking: Booking;
  templateVersion: string;
}): string {
  const today = new Date().toLocaleDateString();
  const eventDate = new Date(booking.eventDate).toLocaleDateString();

  // NOTE: you can extract CSS into its own const if you like
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: Helvetica, Arial, sans-serif; font-size:12px; margin:40px; line-height:1.45; }
      h1 { font-size:24px; margin:0 0 8px; }
      h2 { font-size:18px; margin:0 0 15px; }
      h3 { font-size:14px; margin:15px 0 8px; }
      p  { margin:0 0 10px; text-align:justify; }
      .sig-line { border-bottom:1px solid #000; height:30px; }
      footer { position:fixed; bottom:30px; width:100%; text-align:center; font-size:10px; color:#666; }
    </style>
  </head>
  <body>
    <div style="text-align:center; margin-bottom:30px;">
      ${business.logo ? `<img src="${business.logo}" alt="logo" style="width:80px; height:80px; object-fit:contain;" />` : ''}
      <h1>${business.name}</h1>
      <h2>Participant Waiver &amp; Release of Liability</h2>
      <p style="font-size:10px; color:#666">
        Template ${templateVersion} • Generated ${today}
      </p>
    </div>

    <p>
      I, <strong>${customer.name}</strong>, am either the participant or the legal guardian of the participant(s)
      who will use the inflatable equipment and/or other rental items supplied by
      <strong>${business.name}</strong> (the “Company”) on
      <strong>${eventDate}</strong> at
      <strong>${booking.eventAddress}, ${booking.eventCity}, ${booking.eventState} ${booking.eventZipCode}</strong>
      (the “Event”). Total expected participants:
      <strong>${booking.participantCount}</strong>
      ${booking.participantAge ? `(average age ${booking.participantAge})` : ''}.
    </p>

    <h3>1. Voluntary Participation &amp; Assumption of Risk</h3>
    <p>
      I understand that the use of inflatable bounce houses, slides, games, tents, tables,
      chairs and related equipment (“Rental Equipment”) involves inherent risks including,
      but not limited to, falls, collisions, flipping, entanglement, equipment failure,
      uneven surfaces, and acts of other participants. I voluntarily choose to participate
      and accept full responsibility for any injury, illness, property damage or death that
      may result.
    </p>

    <h3>2. Release of Liability &amp; Indemnification</h3>
    <p>
      To the fullest extent permitted by law, I hereby release, waive, discharge and covenant
      not to sue the Company, its owners, employees, agents, contractors and insurers from any
      and all claims arising out of or related to the Event, including claims of negligence. I
      further agree to defend, indemnify and hold the Company harmless from any claim, damage,
      loss or expense (including attorney fees) brought by or on behalf of any participant or
      third-party.
    </p>

    <h3>3. Participant Supervision</h3>
    <p>
      I agree that a competent adult (18 years or older) will supervise the Rental Equipment
      at all times and will enforce the safety rules provided by the Company, including maximum
      occupancy, height/weight limits, removal of shoes and sharp objects, prohibition of flips
      or rough play, and immediate exit during high winds or power loss.
    </p>

    <h3>4. Medical Treatment Authorization</h3>
    <p>
      In the event of an injury, I authorize the Company and emergency personnel to secure
      medical treatment deemed necessary, and I agree to be financially responsible for such
      treatment.
    </p>

    <h3>5. Weather / Electricity Disclaimer</h3>
    <p>
      I acknowledge that inflatables must be shut down if winds exceed 15 mph, during rain,
      lightning or other hazardous conditions, and that continuous 110-volt power is required.
      Loss of power or adverse weather does not relieve me of payment obligations.
    </p>

    <h3>7. Severability &amp; Governing Law</h3>
    <p>
      If any portion of this waiver is held invalid, the remaining provisions shall remain in
      full force. This agreement is governed by the laws of the state in which the Event is held.
    </p>

    <h3>8. Acknowledgement of Understanding</h3>
    <p>
      I have read this Waiver &amp; Release of Liability and fully understand its terms. I
      understand that I am giving up substantial rights, including the right to sue. I sign
      this document freely and voluntarily.
    </p>

    <div style="margin-top:40px; border-top:1px solid #ccc; padding-top:30px;">
      <div style="display:flex; gap:40px;">
        <div style="flex:1;">
          <div class="sig-line"></div>
          <signature-field role="customer" name="Signature" required style="abs(560,45,180,30)" />
          <div style="font-size:10px;">Signature of Participant / Guardian</div>
        </div>
        <div style="flex:1;">
          <div class="sig-line"></div>
          <date-field      role="customer" name="Date"       style="abs(560,330,120,30)" />
          <div style="font-size:10px;">Date</div>
        </div>
      </div>
      <div style="display:flex; gap:40px; margin-top:20px;">
        <div style="flex:1;">
          <div class="sig-line"></div>
          <text-field      role="customer" name="Name"       style="abs(615,45,180,30)" />
          <div style="font-size:10px;">Print Name</div>
        </div>
        <div style="flex:1;">
          <div class="sig-line"></div>
          <phone-field     role="customer" name="Phone"      style="abs(615,330,150,30)" />
          <div style="font-size:10px;">Emergency Contact Phone</div>
        </div>
      </div>
    </div>



    <footer>
      ${business.name}
      ${(business.phone || business.email) ? ` • ${business.phone ?? ''}${business.phone && business.email ? ' | ' : ''}${business.email ?? ''}` : ''}
    </footer>
  </body>
</html>`;
}
