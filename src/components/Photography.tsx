const Photography = () => {
  const albums = [
    {
      id: 1,
      title: "NYC Friends",
      subtitle: "Portrait Collection",
      count: "24 photos",
      cover: "https://images.unsplash.com/photo-1539571696267-84afb9a8772f?w=800&h=600&fit=crop"
    },
    {
      id: 2,
      title: "Central Park",
      subtitle: "Autumn Session",
      count: "18 photos", 
      cover: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=800&h=600&fit=crop"
    },
    {
      id: 3,
      title: "Jersey City",
      subtitle: "Sunset Vibes", 
      count: "31 photos",
      cover: "https://images.unsplash.com/photo-1516681100942-77d8e7f9dd97?w=800&h=600&fit=crop"
    },
    {
      id: 4,
      title: "Brooklyn Streets",
      subtitle: "Urban Stories",
      count: "27 photos",
      cover: "https://images.unsplash.com/photo-1529258283598-8d6fe60b27f4?w=800&h=600&fit=crop"
    },
    {
      id: 5,
      title: "Manhattan Nights",
      subtitle: "City Lights",
      count: "22 photos", 
      cover: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&h=600&fit=crop"
    },
    {
      id: 6,
      title: "Weekend Hangouts",
      subtitle: "Candid Moments",
      count: "35 photos",
      cover: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop"
    }
  ];

  return (
    <section id="photography" data-section="3" className="min-h-screen bg-black text-white py-20 snap-start">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-8xl font-light tracking-tight mb-4">
            Photography
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Capturing moments, telling stories through the lens
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div
              key={album.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer transform transition-all duration-500 hover:scale-105"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${album.cover})` }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-light text-white mb-2">
                  {album.title}
                </h3>
                <p className="text-gray-300 text-lg mb-1">
                  {album.subtitle}
                </p>
                <p className="text-gray-400 text-sm">
                  {album.count}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 border-2 border-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-lg">
            More albums coming soon...
          </p>
        </div>
      </div>
    </section>
  );
};

export default Photography;