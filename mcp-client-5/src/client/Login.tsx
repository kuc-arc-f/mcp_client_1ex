import ReactDOM from 'react-dom/client'
import React from 'react'

const App: React.FC = () => {

  const handleSubmit = async function(e){
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
 
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    console.log("response=", response.ok);
    if (response.ok) {
      alert("Login successful!");
      location.href = "/";
    } else {
      alert("Invalid credentials.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <p className="text-gray-500 mb-6">name , password input please</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              UserName :
            </label>
            <input
              type="text"
              id="username"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder=""
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password :
            </label>
            <input
              type="password"
              id="password"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder=""
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              GO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default App; 

/*
ReactDOM.createRoot(document.getElementById('app')).render(
  <div>
    <App />
  </div>
);
*/
