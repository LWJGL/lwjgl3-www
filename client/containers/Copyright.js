import React from 'react'
import Link from 'react-router-dom/Link'

const Copyright = () => (
  <section className="copyright">
    <div className="container">
      <p>Copyright &copy; 2012-{new Date().getFullYear()} Lightweight Java Game Library 3</p>
      <p>Licensed under <Link to="/license">BSD</Link></p>
    </div>
  </section>
);

export default Copyright
