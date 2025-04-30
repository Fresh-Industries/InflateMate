'use server';
import React from 'react';

// —— type defs ——
interface Customer { id: string; name: string; email: string; phone: string }
interface Business { id: string; name: string; logo?: string | null; phone?: string | null; email?: string | null }
interface Booking { id: string; eventDate: string; eventAddress: string; eventCity: string; eventState: string; eventZipCode: string; participantCount: number; participantAge?: number }
interface Props { business: Business; customer: Customer; booking: Booking; templateVersion: string }

export default function WaiverHtml({ business, customer, booking, templateVersion }: Props) {
  const today = new Date().toLocaleDateString();
  const eventDate = new Date(booking.eventDate).toLocaleDateString();
  const abs = (top:number,left:number,w:number,h:number):React.CSSProperties => ({ position:'absolute', top, left, width:w, height:h })

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <style>{`
          body { font-family: Helvetica, Arial, sans-serif; font-size:12px; margin:40px; line-height:1.45 }
          h1 { font-size:24px; margin:0 0 8px }
          h2 { font-size:18px; margin:0 0 15px }
          h3 { font-size:14px; margin:15px 0 8px }
          p  { margin:0 0 10px; text-align:justify }
          .sig-line { border-bottom:1px solid #000; height:30px }
          footer { position:fixed; bottom:30px; width:100%; text-align:center; font-size:10px; color:#666 }
        `}</style>
      </head>
      <body>
        {/* ——— HEADER ——— */}
        <div style={{ textAlign:'center', marginBottom:30 }}>
          {business.logo && <img src={business.logo} alt="logo" style={{ width:80, height:80, objectFit:'contain' }} />}
          <h1>{business.name}</h1>
          <h2>Participant Waiver & Release of Liability</h2>
          <p style={{ fontSize:10, color:'#666' }}>Template {templateVersion} • Generated {today}</p>
        </div>

        {/* ——— PARTY & EVENT DETAILS ——— */}
        <p>I, <strong>{customer.name}</strong>, am either the participant or the legal guardian of the participant(s) who will use the inflatable equipment and/or other rental items supplied by <strong>{business.name}</strong> (the “Company”) on <strong>{eventDate}</strong> at <strong>{booking.eventAddress}, {booking.eventCity}, {booking.eventState} {booking.eventZipCode}</strong> (the “Event”). Total expected participants: <strong>{booking.participantCount}</strong>{booking.participantAge ? ` (average age ${booking.participantAge})` : ''}.</p>

        {/* ——— ASSUMPTION OF RISK ——— */}
        <h3>1. Voluntary Participation &amp; Assumption of Risk</h3>
        <p>I understand that the use of inflatable bounce houses, slides, games, tents, tables, chairs and related equipment (“Rental Equipment”) involves inherent risks including, but not limited to, falls, collisions, flipping, entanglement, equipment failure, uneven surfaces, and acts of other participants. I voluntarily choose to participate and accept full responsibility for any injury, illness, property damage or death that may result.</p>

        {/* ——— RELEASE & INDEMNITY ——— */}
        <h3>2. Release of Liability &amp; Indemnification</h3>
        <p>To the fullest extent permitted by law, I hereby release, waive, discharge and covenant not to sue the Company, its owners, employees, agents, contractors and insurers from any and all claims arising out of or related to the Event, including claims of negligence. I further agree to defend, indemnify and hold the Company harmless from any claim, damage, loss or expense (including attorney fees) brought by or on behalf of any participant or third‑party.</p>

        {/* ——— SUPERVISION & SAFETY RULES ——— */}
        <h3>3. Participant Supervision</h3>
        <p>I agree that a competent adult (18 years or older) will supervise the Rental Equipment at all times and will enforce the safety rules provided by the Company, including maximum occupancy, height/weight limits, removal of shoes and sharp objects, prohibition of flips or rough play, and immediate exit during high winds or power loss.</p>

        {/* ——— MEDICAL AUTHORIZATION ——— */}
        <h3>4. Medical Treatment Authorization</h3>
        <p>In the event of an injury, I authorize the Company and emergency personnel to secure medical treatment deemed necessary, and I agree to be financially responsible for such treatment.</p>

        {/* ——— WEATHER & POWER ——— */}
        <h3>5. Weather / Electricity Disclaimer</h3>
        <p>I acknowledge that inflatables must be shut down if winds exceed 15 mph, during rain, lightning or other hazardous conditions, and that continuous 110‑volt power is required. Loss of power or adverse weather does not relieve me of payment obligations.</p>
        {/* ——— SEVERABILITY & GOVERNING LAW ——— */}
        <h3>7. Severability &amp; Governing Law</h3>
        <p>If any portion of this waiver is held invalid, the remaining provisions shall remain in full force. This agreement is governed by the laws of the state in which the Event is held.</p>

        {/* ——— ACKNOWLEDGEMENT ——— */}
        <h3>8. Acknowledgement of Understanding</h3>
        <p>I have read this Waiver & Release of Liability and fully understand its terms. I understand that I am giving up substantial rights, including the right to sue. I sign this document freely and voluntarily.</p>

        {/* —— SIGNATURE LINES —— */}
        <div style={{ marginTop:40, borderTop:'1px solid #ccc', paddingTop:30 }}>
          <div style={{ display:'flex', gap:40 }}>
            <div style={{ flex:1 }}>
              <div className="sig-line" />
              <div style={{ fontSize:10 }}>Signature of Participant / Guardian</div>
            </div>
            <div style={{ flex:1 }}>
              <div className="sig-line" />
              <div style={{ fontSize:10 }}>Date</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:40, marginTop:20 }}>
            <div style={{ flex:1 }}>
              <div className="sig-line" />
              <div style={{ fontSize:10 }}>Print Name</div>
            </div>
            <div style={{ flex:1 }}>
              <div className="sig-line" />
              <div style={{ fontSize:10 }}>Emergency Contact Phone</div>
            </div>
          </div>
        </div>

        <signature-field role="customer" name="Signature" required style={abs(560,45,180,30)} />
        <date-field      role="customer" name="Date"       style={abs(560,330,120,30)} />
        <text-field      role="customer" name="Name"       style={abs(615,45,180,30)} />
        <phone-field     role="customer" name="Phone"      style={abs(615,330,150,30)} />

        <footer>
          {business.name}
          {(business.phone || business.email) && <> • {business.phone ?? ''}{business.phone && business.email ? ' | ' : ''}{business.email ?? ''}</>}
        </footer>
      </body>
    </html>
  );
}
