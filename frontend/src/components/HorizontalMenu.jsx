import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import './HorizontalMenu.css';
import './HamburgerMenu.css';

const HorizontalMenu = () => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [activeHamburgerSubmenu, setActiveHamburgerSubmenu] = useState(null);

  const menuItems = [
    // {
    //   id: 'home',
    //   label: 'Home',
    //   link: '#',
    //   hasSubmenu: false
    // },
    // {
    //   id: 'products',
    //   label: 'Products',
    //   link: '#',
    //   hasSubmenu: true,
    //   submenu: [
    //     { id: 'product1', label: 'Product 1', link: '#' },
    //     { id: 'product2', label: 'Product 2', link: '#' },
    //     { id: 'product3', label: 'Product 3', link: '#' }
    //   ]
    // },
    // {
    //   id: 'services',
    //   label: 'Services',
    //   link: '#',
    //   hasSubmenu: true,
    //   submenu: [
    //     { id: 'service1', label: 'Service 1', link: '#' },
    //     { id: 'service2', label: 'Service 2', link: '#' },
    //     { id: 'service3', label: 'Service 3', link: '#' }
    //   ]
    // },
    // {
    //   id: 'about',
    //   label: 'About',
    //   link: '#',
    //   hasSubmenu: false
    // },
    // {
    //   id: 'contact',
    //   label: 'Contact',
    //   link: '#',
    //   hasSubmenu: false
    // },
    // {
    //   id: 'blog',
    //   label: 'Blog',
    //   link: '#',
    //   hasSubmenu: false
    // }
  ];

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
    if (item.hasSubmenu) {
      e.preventDefault();
      toggleHamburgerSubmenu(item.id);
    }
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

export default HorizontalMenu;



