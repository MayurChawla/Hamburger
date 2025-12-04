import { Link } from 'react-router-dom';
import '../App.css';

const Contact = () => {
  return (
    <div className="page-container">
      <h1>Contact Us</h1>
      <p>Get in touch with us through any of the following methods:</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '1rem 0' }}>
          <Link to="/contact/email" style={{ textDecoration: 'none', color: '#646cff' }}>
            → Email Us
          </Link>
        </li>
        <li style={{ margin: '1rem 0' }}>
          <Link to="/contact/phone" style={{ textDecoration: 'none', color: '#646cff' }}>
            → Call Us
          </Link>
        </li>
        <li style={{ margin: '1rem 0' }}>
          <Link to="/contact/location" style={{ textDecoration: 'none', color: '#646cff' }}>
            → Location
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Contact;

