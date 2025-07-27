import { useLocation } from 'react-router-dom';

export function PaymentStatusPage() {
  const query = new URLSearchParams(useLocation().search);
  const status = query.get('status');

  return (
    <div className="payment-status">
      {status === 'success' ? (
        <h1>✅ Payment Successful</h1>
      ) : (
        <h1>❌ Payment Failed or Cancelled</h1>
      )}
    </div>
  );
}
