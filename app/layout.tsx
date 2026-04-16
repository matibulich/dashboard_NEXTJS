import { montserrat} from "./(frontend)/ui/fonts";
import "./(frontend)/ui/global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className= {`${montserrat.className} antialiased`}>
        
        {children}

        <footer>Hecho con ❤️ por mi</footer>
        
      </body>
    </html>
  );
}
