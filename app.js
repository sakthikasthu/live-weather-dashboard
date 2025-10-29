const { useState, useEffect } = React;

function App(){
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const API_KEY = "3944425b08987abcdc3868d531c2b848";

  useEffect(() => {
    // fetchWeatherByName('Tirunelveli');
  }, []);

  const fetchWeatherByName = async (name) => {
    if(!name) return;
    setLoading(true); setError(''); setWeather(null);
    try{
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(name)}&appid=${API_KEY}&units=metric`;
      const resp = await fetch(url);
      if(resp.status === 404){
        setError('City not found');
        setLoading(false);
        return;
      }
      const data = await resp.json();
      if(!resp.ok){
        setError((data && data.message) || 'Failed to get weather');
      } else {
        setWeather(data);
      }
    }catch(err){
      setError('Network or API error');
    }finally{
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true); setError(''); setWeather(null);
    try{
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      const resp = await fetch(url);
      const data = await resp.json();
      if(!resp.ok){
        setError((data && data.message) || 'Failed to get weather');
      } else {
        setWeather(data);
      }
    }catch(err){
      setError('Network or API error');
    }finally{
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    fetchWeatherByName(city.trim());
  };

  const useLocation = () => {
    if(!navigator.geolocation){
      setError('Geolocation not supported');
      return;
    }
    setLoading(true); setError('');
    navigator.geolocation.getCurrentPosition((pos) => {
      fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
    }, (err) => {
      setLoading(false);
      setError('Permission denied or unavailable');
    });
  };

  return (
    <div>
      <header>
        <div>
          <h1>Live Weather Dashboard</h1>
          <p>Enter a city name or use your location.</p>
        </div>
      </header>
      <form onSubmit={onSubmit} className="search-row" role="search">
        <input
          type="text"
          placeholder="e.g. Tirunelveli, Chennai..."
          value={city}
          onChange={(e)=>setCity(e.target.value)}
        />
        <button className="btn" type="submit">Search</button>
        <button type="button" className="btn secondary" onClick={useLocation}>Use my location</button>
      </form>
      <div className="grid" style={{marginTop:16}}>
        <div className="panel">
          {loading && <p style={{fontWeight:600}}>Loading...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && !weather && (
            <div style={{padding:20,color:'var(--muted)'}}>Search a city to see weather info.</div>
          )}
          {weather && (
            <div className="weather-main">
              <div>
                <div style={{fontSize:14,color:'var(--muted)'}}>Location</div>
                <div style={{fontWeight:700,fontSize:18}}>{weather.name}, {weather.sys.country}</div>
                <div className="desc">{weather.weather[0].description}</div>
                <div className="meta" style={{marginTop:10}}>
                  <div>Feels: {Math.round(weather.main.feels_like)}°C</div>
                  <div>Humidity: {weather.main.humidity}%</div>
                  <div>Wind: {Math.round(weather.wind.speed)} m/s</div>
                </div>
              </div>
              <div style={{marginLeft:'auto',textAlign:'center'}} className="right-card">
                <img className="icon-large" src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt="icon" />
                <div className="temp">{Math.round(weather.main.temp)}°C</div>
                <div className="small-note">Updated: {new Date(weather.dt*1000).toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>
        <aside className="panel" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <div style={{fontSize:13,color:'var(--muted)'}}>Quick actions</div>
          <div style={{height:12}}></div>
          <button className="btn" onClick={()=>{ fetchWeatherByName('Tirunelveli'); setCity('Tirunelveli'); }}>Show Tirunelveli</button>
          <div style={{height:10}}></div>
          <button className="btn secondary" onClick={()=>{ setCity(''); setWeather(null); setError(''); }}>Clear</button>
          <div style={{height:12}}></div>
          <div className="small-note">Powered by OpenWeatherMap</div>
        </aside>
      </div>
      <footer>
        <div>Tip: Replace the API key later to keep it private.</div>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
