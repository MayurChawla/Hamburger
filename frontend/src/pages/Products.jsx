import { Link } from 'react-router-dom';
import '../App.css';

const Products = () => {
  return (
    <div className="page-container">
      <h1>Our Products</h1>
      <p>Explore our wide range of products designed to meet your needs.</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '1rem 0' }}>
          <Link to="/products/product1" style={{ textDecoration: 'none', color: '#646cff' }}>
            → Product 1
          </Link>
        </li>
        <li style={{ margin: '1rem 0' }}>
          <Link to="/products/product2" style={{ textDecoration: 'none', color: '#646cff' }}>
            → Product 2
          </Link>
        </li>
        <li style={{ margin: '1rem 0' }}>
          <Link to="/products/product3" style={{ textDecoration: 'none', color: '#646cff' }}>
            → Product 3
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Products;

