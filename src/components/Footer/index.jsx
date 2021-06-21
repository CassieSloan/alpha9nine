import React from 'react';
import { Logo } from 'components';
import './styles.scss';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <Logo />
      <div className="sitemap">© Copyright {new Date().getFullYear()}</div>
    </div>
  </footer>
);

export default Footer;
