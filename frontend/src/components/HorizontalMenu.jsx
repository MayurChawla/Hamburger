import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import '../styles/HorizontalMenu.css';

const HorizontalMenu = () => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [activeHamburgerSubmenu, setActiveHamburgerSubmenu] = useState(null);
  const navigate = useNavigate();

  const menuItems = [];

  const handleMenuItemClick = (e, item) => {
    if (item.hasSubmenu) {
      e.preventDefault();
      setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
    } else {
      setActiveSubmenu(null);
    }
  };
  
  const handleMouseEnter = (itemId) => {
    const item = menuItems.find(i => i.id === itemId);
    if (item && item.hasSubmenu) {
      setActiveSubmenu(itemId);
    }
  };
  
  const handleMouseLeave = () => {
    setActiveSubmenu(null);
  };

  const hamburgerMenuItems = [
    {
      id: 'home',
      label: 'Home',
      link: '/home',
      hasSubmenu: false
    },
    {
      id: 'employee',
      label: 'Employees',
      link: '/employees',
      hasSubmenu: false
    },
    {
      id: 'products',
      label: 'Products',
      link: '/products',
      hasSubmenu: true,
      submenu: [
        { id: 'product1', label: 'Product 1', link: '/products/product1' },
        { id: 'product2', label: 'Product 2', link: '/products/product2' },
        { id: 'product3', label: 'Product 3', link: '/products/product3' }
      ]
    },
    {
      id: 'services',
      label: 'Services',
      link: '/services',
      hasSubmenu: true,
      submenu: [
        { id: 'service1', label: 'Service 1', link: '/services/service1' },
        { id: 'service2', label: 'Service 2', link: '/services/service2' }
      ]
    },
    {
      id: 'about',
      label: 'About',
      link: '/about',
      hasSubmenu: false
    },
    {
      id: 'contact',
      label: 'Contact',
      link: '/contact',
      hasSubmenu: true,
      submenu: [
        { id: 'email', label: 'Email Us', link: '/contact/email' },
        { id: 'phone', label: 'Call Us', link: '/contact/phone' },
        { id: 'location', label: 'Location', link: '/contact/location' }
      ]
    }
  ];

  const toggleHamburgerMenu = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
    if (isHamburgerOpen) {
      setActiveHamburgerSubmenu(null);
    }
  };

  const toggleHamburgerSubmenu = (itemId) => {
    setActiveHamburgerSubmenu(activeHamburgerSubmenu === itemId ? null : itemId);
  };

  const handleHamburgerMenuItemClick = (e, item) => {
    e.preventDefault();
    if (item.hasSubmenu) {
      toggleHamburgerSubmenu(item.id);
    } else {
      setIsHamburgerOpen(false);
      navigate(item.link);
    }
  };

  const handleSubmenuItemClick = (link) => {
    setIsHamburgerOpen(false);
    setActiveHamburgerSubmenu(null);
    navigate(link);
  };

  const handleClickOutside = () => {
    setIsHamburgerOpen(false);
    setActiveHamburgerSubmenu(null);
  };

  return (
    <>
      <nav className="horizontal-menu">
        <div className="menu-container">
          <ul className="horizontal-menu-list">
            <li className="horizontal-menu-item horizontal-menu-item-left">
              <button 
                className={`hamburger-button-nav ${isHamburgerOpen ? 'open' : ''}`}
                onClick={toggleHamburgerMenu}
                aria-label="Toggle menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </li>
            <li className="horizontal-menu-item">
              <a
                href="/"
                className="company-name"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
              >
                Company Name
              </a>
            </li>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className="horizontal-menu-item"
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
            >
              <a
                href={item.link}
                className="horizontal-menu-link"
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
                <ul className={`horizontal-submenu ${activeSubmenu === item.id ? 'open' : ''}`}>
                  {item.submenu.map((subItem) => (
                    <li key={subItem.id} className="horizontal-submenu-item">
                      <a href={subItem.link} className="horizontal-submenu-link">
                        {subItem.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li className="horizontal-menu-item horizontal-menu-item-right">
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>

    <div className={`menu-overlay ${isHamburgerOpen ? 'open' : ''}`} onClick={handleClickOutside}></div>

    <nav className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}>
      <ul className="menu-list">
        {hamburgerMenuItems.map((item) => (
          <li key={item.id} className="menu-item">
            <div></div>
            <a
              href={item.link}
              className="menu-link"
              onClick={(e) => handleHamburgerMenuItemClick(e, item)}
            >
              {item.label}
              {item.hasSubmenu && (
                <span className={`submenu-arrow ${activeHamburgerSubmenu === item.id ? 'open' : ''}`}>
                  ▼
                </span>
              )}
            </a>
            {item.hasSubmenu && (
              <ul className={`submenu ${activeHamburgerSubmenu === item.id ? 'open' : ''}`}>
                {item.submenu.map((subItem) => (
                  <li key={subItem.id} className="submenu-item">
                    <a 
                      href={subItem.link} 
                      className="submenu-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmenuItemClick(subItem.link);
                      }}
                    >
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

export default HorizontalMenu;



