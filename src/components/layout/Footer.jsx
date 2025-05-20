import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, } from 'lucide-react';
import { FaInstagram, FaFacebook, FaWhatsapp, FaSnapchat } from "react-icons/fa6";


const Footer = () => {
  return (
//     <footer className="bg-gray-900 text-white mt-auto">
//     <div className="container mx-auto px-4 py-12">
//       <div className="flex flex-col md:flex-row justify-center md:space-x-24 space-y-8 md:space-y-0">
        
//         {/* Brand / About */}
//         <div className="text-center md:text-left">
//           <h4 className="font-bold text-lg mb-4">ICE LUXURY WEARS</h4>
//           <p className="text-gray-400 max-w-xs mx-auto md:mx-0">
//             Your destination for modern and comfortable clothing that expresses your unique style.
//           </p>
//         </div>
        
//         {/* Contact Info */}
//         <div className="text-center md:text-left">
//           <h4 className="font-bold mb-4">Contact</h4>
//           <ul className="space-y-4 text-gray-400">
//             <li className="flex items-center justify-center md:justify-start space-x-2">
//               <MapPin size={18} />
//               <span>Walk-In Store: Surple Cube Mall, 3rd Avenue, Gwarinpa. Abuja</span>
//             </li>
//             <li className="flex items-center justify-center md:justify-start space-x-2">
//               <Phone size={18} />
//               <span>+234 913 200 4888</span>
//             </li>
//             {/* <li className="flex items-center justify-center md:justify-start space-x-2">
//               <span className="font-medium">Email:</span>
//               <span>info@clothstore.com</span>
//             </li> */}
//           </ul>
//         </div>

//       </div>

//       <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
//         <p>© 2025 CLOTH. All rights reserved.</p>
//       </div>
//     </div>
//   </footer>
<div id="contact" className='bg-gray-900 py-24 px-6 md:py-24 md:px-16 montserrat-400 text-center'>
<div data-aos="fade-up">
  <h1 className='text-white text-3xl md:text-4xl montserrat-600'>ICE LUXURY WEARS</h1>
  <p className='text-white text-sm mt-3 text-center box-con mx-auto'>Surple Cube Mall, 3rd Avenue, Gwarinpa. Abuja</p><br/>
  <p className='text-white text-center montserrat-400 mb-3'>FOLLOW US ON SOCIALS</p>

  <div className='flex justify-center items-center space-x-6'>
              <a href="https://www.instagram.com/ice_deluxewears/?igsh=NGwyeTA4cm83Z2Vp&utm_source=qr#" target="_blank" rel="noopener noreferrer" className="hover:opacity-75"><FaInstagram className='w-8 h-8 text-white' /></a>
              {/* <a href="https://www.snapchat.com/add/ciellagos" target="_blank" rel="noopener noreferrer" className="hover:opacity-75"><FaSnapchat className='w-8 h-8 text-[#C69657]' /></a> */}
              <a href="https://www.facebook.com/ice.de.luxe.2024?mibextid=wwXIfr&mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:opacity-75"><FaFacebook className='w-8 h-8 text-white' /></a>
              <a href="https://wa.me/2349132004888" target="_blank" rel="noopener noreferrer" className="hover:opacity-75"><FaWhatsapp className='w-8 h-8 text-white' /></a>
            </div>


  {/* <p className='text-white text-sm mt-3 text-center box-con mx-auto'>
    <a href="mailto:hello.ciellagos@gmail.com" className='underline'>
      hello.ciellagos@gmail.com 
    </a>
  </p> */}
  <br />
  <p className='text-white text-lg md:text-xl montserrat-500'>+234 913 200 4888</p>
 
</div>
</div>
  );
};

export default Footer;