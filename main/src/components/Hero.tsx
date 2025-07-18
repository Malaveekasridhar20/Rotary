
interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  height?: string;
}

const Hero = ({ title, subtitle, backgroundImage, height = "h-96" }: HeroProps) => {
  const defaultBg = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80";
  
  return (
    <div className={`relative ${height} bg-blue-900 overflow-hidden`}>
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage || defaultBg})` }}
      >
        <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
      </div>
      
      <div className="relative h-full flex items-center justify-center text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-blue-100 animate-fade-in">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
