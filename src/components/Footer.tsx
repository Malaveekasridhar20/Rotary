import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white text-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        
        {/* Main 4-column Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
          
          {/* Rotary Club Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-blue-900 font-bold text-lg">R</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Rotary Club of Tiruchirappalli</h3>
                <p className="text-blue-200 text-sm">Diamond City • RID 3000</p>
              </div>
            </div>
            <p className="text-blue-200 max-w-xs text-[15px] leading-relaxed">
              "Service Above Self" — Creating positive change through fellowship, integrity, diversity, and service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-blue-200 hover:text-yellow-400 transition-colors">About Us</Link></li>
              <li><Link to="/projects" className="text-blue-200 hover:text-yellow-400 transition-colors">Projects</Link></li>
              <li><Link to="/events" className="text-blue-200 hover:text-yellow-400 transition-colors">Events</Link></li>
              <li><Link to="/contact" className="text-blue-200 hover:text-yellow-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-2 text-blue-200">
              <p>📧 rotarytrichy@gmail.com</p>
              <p>📞 +91 431-2412345</p>
              <p>📍 Tiruchirappalli, Tamil Nadu</p>
            </div>
            <div className="flex space-x-4 mt-3">
              <a href="#" className="hover:text-yellow-400">Facebook</a>
              <a href="#" className="hover:text-yellow-400">Instagram</a>
              <a href="#" className="hover:text-yellow-400">LinkedIn</a>
            </div>
          </div>

          {/* Designed & Developed */}
          <div className="space-y-3">
            <h4 className="text-yellow-400 text-lg font-bold">Designed &amp; Developed by</h4>
            <h4 className="text-yellow-400 text-lg font-bold">Contact Us</h4>
            

            {/* Praveen */}
            <div className="flex items-center space-x-2">
              <p className="font-bold text-white">Praveen Kumar R E</p>
              <a href="https://www.linkedin.com/in/praveen-kumar-r-e-b0292836b/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg" className="w-5 h-5 invert" alt="LinkedIn" />
              </a>
              <a href="https://www.instagram.com/praveen_7b?igsh=NDU0dG9nZDRrdXNs" target="_blank" rel="noopener noreferrer" title="Instagram">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" className="w-5 h-5 invert" alt="Instagram" />
              </a>
              <a href="mailto:praveenkumar7bp@gmail.com" title="Gmail">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg" className="w-5 h-5 invert" alt="Gmail" />
              </a>
            </div>

            {/* Malaveeka */}
            <div className="flex items-center space-x-2">
              <p className="font-bold text-white">Malaveeka Sridhar</p>
              <a href="https://www.linkedin.com/in/malaveeka-sridhar-750b70252/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg" className="w-5 h-5 invert" alt="LinkedIn" />
              </a>
              <a href="https://www.instagram.com/malaveekasridhar?igsh=emM1MHNiOXF4dXhl" target="_blank" rel="noopener noreferrer" title="Instagram">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" className="w-5 h-5 invert" alt="Instagram" />
              </a>
              <a href="mailto:malaveekasridhar20072004@gmail.com" title="Gmail">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg" className="w-5 h-5 invert" alt="Gmail" />
              </a>
            </div>

            {/* Vignesh */}
            <div className="flex items-center space-x-2">
              <p className="font-bold text-white">Vignesh Hariraj   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
              <a href="https://www.linkedin.com/in/vigneshhariraj" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg" className="w-5 h-5 invert" alt="LinkedIn" />
              </a>
              <a href="https://www.instagram.com/_vignesh_exe_?igsh=MXhrd2NvbzhiaHV6cQ==" target="_blank" rel="noopener noreferrer" title="Instagram">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" className="w-5 h-5 invert" alt="Instagram" />
              </a>
              <a href="mailto:praveenkumar7bp@gmail.com" title="Gmail">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg" className="w-5 h-5 invert" alt="Gmail" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-blue-800 mt-12 pt-6 text-center text-base text-yellow-400">
          <p>&copy; 2024 Rotary Club of Tiruchirappalli Diamond City. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
