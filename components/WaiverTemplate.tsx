interface Customer {
  id: string;
  name: string;
  email: string;

}

interface Business {
  id: string;
  name: string;
  logo?: string | null;
  phone?: string | null;
  email?: string | null;
}

interface Booking {
  id: string;
  eventDate: Date;
  eventAddress: string;
  eventCity: string;
  eventState: string;
  eventZipCode: string;
  participantCount: number;
  participantAge?: number;
}

interface WaiverTemplateProps {
  business: Business;
  customer: Customer;
  booking?: Booking;
  templateVersion: string;
}

export default function WaiverTemplate({
  business,
  customer,
  booking,
  templateVersion,
}: WaiverTemplateProps) {
  const today = new Date().toLocaleDateString();
  
  return (
    <div className="max-w-[8.5in] mx-auto p-8 font-serif text-black">
      {/* Header with Business Logo */}
      <header className="text-center mb-8">
        {business.logo && (
          <img 
            src={business.logo} 
            alt={`${business.name} logo`}
            className="h-20 mx-auto mb-4"
          />
        )}
        <h1 className="text-2xl font-bold mb-2">{business.name}</h1>
        <h2 className="text-xl font-semibold mb-4">Waiver and Release of Liability</h2>
        <div className="text-sm text-gray-600">
          <p>Version: {templateVersion}</p>
          <p>Date: {today}</p>
        </div>
      </header>

      {/* Customer Information */}
      <section className="mb-6">
        <p className="mb-4">
          I, <span className="font-bold">{customer.name}</span> hereby agree to the following:
        </p>
      </section>

      {/* Event Details (if booking exists) */}
      {booking && (
        <section className="mb-6">
          <h3 className="font-bold mb-2">Event Details:</h3>
          <p>Date: {new Date(booking.eventDate).toLocaleDateString()}</p>
          <p>Location: {booking.eventAddress}, {booking.eventCity}, {booking.eventState} {booking.eventZipCode}</p>
          <p>Number of Participants: {booking.participantCount}</p>
          {booking.participantAge && <p>Age of Participants: {booking.participantAge}</p>}
        </section>
      )}

      {/* Waiver Content */}
      <section className="mb-6 text-justify">
        <h3 className="font-bold mb-2">1. Assumption of Risk</h3>
        <p className="mb-4">
          I understand and acknowledge that the activities provided by {business.name} involve inherent risks, 
          including but not limited to physical injury, and I voluntarily assume all such risks.
        </p>

        <h3 className="font-bold mb-2">2. Release of Liability</h3>
        <p className="mb-4">
          I hereby release and hold harmless {business.name}, its owners, operators, employees, and agents 
          from any and all claims, demands, or causes of action which are in any way connected with my 
          participation in these activities.
        </p>

        <h3 className="font-bold mb-2">3. Indemnification</h3>
        <p className="mb-4">
          I agree to indemnify and defend {business.name} against all claims, causes of action, damages, 
          judgments, costs or expenses, including attorney fees and other litigation costs.
        </p>

        <h3 className="font-bold mb-2">4. Medical Authorization</h3>
        <p className="mb-4">
          In the event of an emergency, I authorize {business.name} to secure from any licensed hospital, 
          physician, or medical personnel any treatment deemed necessary for immediate care.
        </p>
      </section>

      {/* Signature Block */}
      <section className="mt-12">
        <div className="border-t border-gray-300 pt-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex-1">
              <div className="border-b border-black min-w-[300px] mb-2"></div>
              <p>Signature of Participant/Guardian</p>
            </div>
            <div className="flex-1 ml-8">
              <div className="border-b border-black min-w-[300px] mb-2"></div>
              <p>Date</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="border-b border-black min-w-[300px] mb-2"></div>
              <p>Print Name</p>
            </div>
            <div className="flex-1 ml-8">
              <div className="border-b border-black min-w-[300px] mb-2"></div>
              <p>Emergency Contact Phone</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-12 text-center text-sm text-gray-600">
        <p>{business.name}</p>
        <p>Phone: {business.phone} | Email: {business.email}</p>
      </footer>
    </div>
  );
} 