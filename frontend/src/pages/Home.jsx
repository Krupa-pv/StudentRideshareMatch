import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center text-center pt-12">
      <h2 className="text-4xl font-bold mb-6">Welcome</h2>
      <p className="text-lg mb-8 max-w-2xl mx-auto">
        Match with students traveling to the same destination and split rideshare costs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-12">
        {/* View Students Card */}
        <Link to="/students" className="border-2 border-black p-8 hover:bg-black hover:text-white transition-colors">
          <h3 className="text-xl font-bold mb-2">View Students</h3>
          <p className="text-sm">See all registered students</p>
        </Link>

        {/* Find Matches Card */}
        <Link to="/matches" className="border-2 border-black p-8 hover:bg-black hover:text-white transition-colors">
          <h3 className="text-xl font-bold mb-2">Find Matches</h3>
          <p className="text-sm">Find rideshare partners</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
