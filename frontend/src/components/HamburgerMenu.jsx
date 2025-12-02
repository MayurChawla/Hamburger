import { useState } from 'react';
import './HamburgerMenu.css';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      link: '#',
      hasSubmenu: false
    },
    {
      id: 'products',
      label: 'Products',
      link: '#',
      hasSubmenu: true,
      submenu: [
        { id: 'product1', label: 'Product 1', link: '#' },
        { id: 'product2', label: 'Product 2', link: '#' },
        { id: 'product3', label: 'Product 3', link: '#' }
      ]
    },
    {
      id: 'services',
      label: 'Services',
      link: '#',
      hasSubmenu: true,
      submenu: [
        { id: 'service1', label: 'Service 1', link: '#' },
        { id: 'service2', label: 'Service 2', link: '#' }
      ]
    },
    {
      id: 'about',
      label: 'About',
      link: '#',
      hasSubmenu: false
    },
    {
      id: 'contact',
      label: 'Contact',
      link: '#',
      hasSubmenu: true,
      submenu: [
        { id: 'email', label: 'Email Us', link: '#' },
        { id: 'phone', label: 'Call Us', link: '#' },
        { id: 'location', label: 'Location', link: '#' }
      ]
    }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setActiveSubmenu(null);
    }
  };

  const toggleSubmenu = (itemId) => {
    setActiveSubmenu(activeSubmenu === itemId ? null : itemId);
  };

  const handleMenuItemClick = (e, item) => {
    if (item.hasSubmenu) {
      e.preventDefault();
      toggleSubmenu(item.id);
    }
  };

  return (
    <>
      <button 
        className={`hamburger-button ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`menu-overlay ${isOpen ? 'open' : ''}`} onClick={toggleMenu}></div>

      <nav className={`hamburger-menu ${isOpen ? 'open' : ''}`}>
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item.id} className="menu-item">
              <a
                href={item.link}
                className="menu-link"
                onClick={(e) => handleMenuItemClick(e, item)}
              >
                {item.label}
                {item.hasSubmenu && (
                  <span className={`submenu-arrow ${activeSubmenu === item.id ? 'open' : ''}`}>
                    ▼
                  </span>
                )}
              </a>
              {item.hasSubmenu && (
                <ul className={`submenu ${activeSubmenu === item.id ? 'open' : ''}`}>
                  {item.submenu.map((subItem) => (
                    <li key={subItem.id} className="submenu-item">
                      <a href={subItem.link} className="submenu-link">
                        {subItem.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default HamburgerMenu;

