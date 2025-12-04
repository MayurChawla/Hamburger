import '../App.css';

const Location = () => {
  return (
    <div className="page-container">
      <h1>Our Location</h1>
      <p>Visit us at our office:</p>
      <address style={{ fontStyle: 'normal', lineHeight: '1.8' }}>
        123 Business Street<br />
        Suite 100<br />
        City, State 12345<br />
        United States
      </address>
      <p style={{ marginTop: '1rem' }}>We're open Monday to Friday, 9 AM to 5 PM.</p>
    </div>
  );
};

export default Location;

