import { FaGithub, FaLinkedin, FaCameraRetro } from 'react-icons/fa6';


export default function Home() {
  const fontSize = 24;
  return (
    <div className="min-h-screen flex items-center justify-center">
      <main>
        <h1 className="font-semibold text-4xl">ashwin john chempolil</h1>
        <h3 className='flex gap-4 justify-center mt-4 text-lg'>
          <a 
            href="https://aws.amazon.com/ram/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative inline-block group"
          >
            sde 2 at aws ram
            <span className="hidden group-hover:inline absolute"> 🐏</span>
            {/* <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-[length:200%_100%] animate-gradient"></span> */}
          </a>
        </h3>
        <h3 className="flex gap-4 justify-center mt-4">
          <a href="https://www.linkedin.com/in/ashwinjohn3/" target="_blank" rel="noopener noreferrer" >
            <FaLinkedin size={fontSize} />
          </a>
          <a href="https://vsco.co/thelegendashw1n/gallery" target="_blank" rel="noopener noreferrer">
            <FaCameraRetro size={fontSize} />
          </a>
          <a href="https://github.com/ashwinjohn3" target="_blank" rel="noopener noreferrer">
            <FaGithub size={fontSize} />
          </a>
        </h3>
      </main>
    </div>
  );
}
