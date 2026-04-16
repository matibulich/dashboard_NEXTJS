"use client"; // hay que avisarle que se renderize del lado del cliente, porque usePathname es un hook que solo funciona en el cliente

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Mensajes', href: '/dashboard/mensajes', icon: DocumentDuplicateIcon,
  },
  { name: 'Clientes', href: '/dashboard/clientes', icon: UserGroupIcon },
];

export default function NavLinks() {

 const pathname =  usePathname()

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link        // Link Se utiliza para no recargar toda la página, sino solo el contenido que cambia.  
            key={link.name}
            href={link.href}
            className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 
              
              ${pathname === link.href ? 'bg-sky-100 text-blue-600' : 'text-gray-700'}
              
              `}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>          
          </Link>
        );
      })}
    </>
  );
}
