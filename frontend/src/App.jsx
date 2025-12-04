import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Students from './pages/Students';
import FindMatches from './pages/FindMatches';
import Groups from './pages/Groups';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-black flex flex-col">
        {/* Simple Header */}
        <header className="border-b-2 border-black py-4">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-2xl font-bold text-center">STUDENT RIDESHARE MATCHER</h1>
            <p className="text-center text-sm mt-1">Find students to split Uber/Lyft costs</p>
          </div>
        </header>

        {/* Navigation */}
        <nav className="border-b border-gray-300 py-3">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-center gap-8">
              <Link to="/" className="hover:underline font-medium">Home</Link>
              <Link to="/students" className="hover:underline font-medium">Students</Link>
              <Link to="/groups" className="hover:underline font-medium">Groups</Link>
              <Link to="/matches" className="hover:underline font-medium">Find Matches</Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/students" element={<Students />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/matches" element={<FindMatches />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-300 py-4">
          <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-600">
            CSDS 341 Database Project • Fall 2025
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
