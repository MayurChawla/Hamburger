import { Link } from 'react-router-dom';
import '../App.css';

const Services = () => {
  return (
    <div className="page-container">
      <h1>Our Services</h1>
      <p>We offer a comprehensive range of services to help you achieve your goals.</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '1rem 0' }}>
          <Link to="/services/service1" style={{ textDecoration: 'none', color: '#646cff' }}>
            → Service 1
          </Link>
        </li>
        <li style={{ margin: '1rem 0' }}>
          <Link to="/services/service2" style={{ textDecoration: 'none', color: '#646cff' }}>
            → Service 2
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Services;

