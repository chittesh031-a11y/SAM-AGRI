import { useState } from "react";
import "./FarmerTools.css";
import "./AdminTools.css";

const initialFertilizers = [
  { id: 1, name: "Compost", type: "Organic", note: "Sample catalog item" },
  { id: 2, name: "Urea", type: "Nitrogen source", note: "Use only according to soil-test advice and label" },
  { id: 3, name: "NPK blend", type: "Compound fertilizer", note: "Product composition varies by blend" },
];

const initialPestReports = [
  { id: 1, crop: "Rice", issue: "Leaf symptoms reported", district: "Thanjavur", status: "Review" },
  { id: 2, crop: "Tomato", issue: "Possible insect activity", district: "Salem", status: "Monitoring" },
  { id: 3, crop: "Cotton", issue: "Unusual plant wilting", district: "Madurai", status: "Review" },
];

const initialMarkets = [
  { id: 1, name: "Central sample market", district: "Coimbatore", crop: "Rice", price: "2100" },
  { id: 2, name: "South sample market", district: "Madurai", crop: "Tomato", price: "1800" },
  { id: 3, name: "Delta sample market", district: "Thanjavur", crop: "Maize", price: "2250" },
];

const initialProducts = [
  { id: 1, name: "Rice seeds", category: "Seeds", stock: 24, unit: "packs" },
  { id: 2, name: "Maize seeds", category: "Seeds", stock: 16, unit: "packs" },
  { id: 3, name: "Tomato seeds", category: "Seeds", stock: 30, unit: "packs" },
  { id: 4, name: "Millet seeds", category: "Seeds", stock: 12, unit: "packs" },
  { id: 5, name: "Groundnut seeds", category: "Seeds", stock: 14, unit: "packs" },
  { id: 6, name: "Onion seeds", category: "Seeds", stock: 21, unit: "packs" },
  { id: 7, name: "Chilli seeds", category: "Seeds", stock: 18, unit: "packs" },
  { id: 8, name: "Okra seeds", category: "Seeds", stock: 25, unit: "packs" },
  { id: 9, name: "Compost", category: "Soil care", stock: 18, unit: "bags" },
  { id: 10, name: "Neem cake", category: "Soil care", stock: 12, unit: "bags" },
  { id: 11, name: "Soil test kit", category: "Soil care", stock: 9, unit: "kits" },
  { id: 12, name: "NPK blend", category: "Soil care", stock: 15, unit: "bags" },
  { id: 13, name: "Drip starter kit", category: "Equipment", stock: 7, unit: "kits" },
  { id: 14, name: "Garden sprinkler", category: "Equipment", stock: 10, unit: "units" },
  { id: 15, name: "Watering can", category: "Equipment", stock: 8, unit: "units" },
  { id: 16, name: "Hand cultivator", category: "Equipment", stock: 11, unit: "units" },
  { id: 17, name: "Farm work gloves", category: "Other", stock: 20, unit: "pairs" },
  { id: 18, name: "Seedling tray", category: "Other", stock: 32, unit: "trays" },
];

const initialSeasons = [
  { id: 1, name: "North-East Monsoon 2026", start: "2026-10-01", end: "2027-01-31", status: "Active" },
  { id: 2, name: "Summer 2027", start: "2027-02-01", end: "2027-05-31", status: "Planned" },
];

const initialMessages = [
  { id: 1, sender: "Farmer F-103", topic: "Profile help", message: "I need help updating my farm area.", status: "Open" },
  { id: 2, sender: "Farmer F-108", topic: "Irrigation", message: "The sample irrigation reminder appeared twice.", status: "Open" },
];

const educationItems = [
  { id: 1, topic: "Soil health", title: "Reading a basic soil test", detail: "Understand what a soil report measures and when to ask for local interpretation." },
  { id: 2, topic: "Water", title: "Planning efficient irrigation", detail: "Review field moisture, crop stage, and local weather before scheduling water." },
  { id: 3, topic: "Crop health", title: "Field scouting fundamentals", detail: "Record the crop, date, location, and visible symptoms for expert follow-up." },
  { id: 4, topic: "Farm safety", title: "Safe product handling", detail: "Follow product labels, protective equipment guidance, and local regulations." },
];

function AdminHeading({ eyebrow, title, description, trailing }) {
  return (
    <div className="farmer-tool-heading">
      <div>
        <p className="farmer-tool-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="farmer-tool-description">{description}</p>
      </div>
      {trailing}
    </div>
  );
}

function AdminNotice({ children, tone = "info" }) {
  return <div className={`farmer-tool-notice farmer-tool-notice--${tone}`}>{children}</div>;
}

function AdminTools({
  page,
  crops = [],
  farmers = [],
  weatherData,
  weatherLoading,
  weatherError,
  weatherUpdated,
  weatherLocation,
  onRefreshWeather,
}) {
  const [requests, setRequests] = useState(() =>
    farmers.filter(farmer => farmer.status === "Pending")
      .map(farmer => ({ ...farmer, reviewStatus: "Pending" }))
  );
  const [requestFilter, setRequestFilter] = useState("Pending");
  const [soilTrigger, setSoilTrigger] = useState(35);
  const [soilSaved, setSoilSaved] = useState(false);
  const [fertilizers, setFertilizers] = useState(initialFertilizers);
  const [fertilizerName, setFertilizerName] = useState("");
  const [fertilizerType, setFertilizerType] = useState("");
  const [pestReports, setPestReports] = useState(initialPestReports);
  const [markets, setMarkets] = useState(initialMarkets);
  const [marketSaved, setMarketSaved] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("Seeds");
  const [productStock, setProductStock] = useState("");
  const [seasons, setSeasons] = useState(initialSeasons);
  const [seasonName, setSeasonName] = useState("");
  const [seasonStart, setSeasonStart] = useState("");
  const [seasonEnd, setSeasonEnd] = useState("");
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: "Welcome to the farmer portal", message: "Review your profile and keep crop records up to date.", time: "Sample notice" },
  ]);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [selectedLocationFarmer, setSelectedLocationFarmer] = useState(farmers[0]?.id || "");
  const [farmLocationName, setFarmLocationName] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [manualLatitude, setManualLatitude] = useState("");
  const [manualLongitude, setManualLongitude] = useState("");
  const [savedLocations, setSavedLocations] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const cropCounts = {
    Growing: crops.filter(crop => crop.status === "Growing").length,
    Planned: crops.filter(crop => crop.status === "Planned").length,
    Harvested: crops.filter(crop => crop.status === "Harvested").length,
  };
  const totalFarmers = farmers.length;
  const pendingRequests = requests.filter(request => request.reviewStatus === "Pending").length;
  const visibleRequests = requests.filter(request =>
    requestFilter === "All" || request.reviewStatus === requestFilter
  );

  const addFertilizer = event => {
    event.preventDefault();
    if (!fertilizerName.trim() || !fertilizerType.trim()) return;
    setFertilizers([
      ...fertilizers,
      { id: Date.now(), name: fertilizerName.trim(), type: fertilizerType.trim(), note: "Added in this session" },
    ]);
    setFertilizerName("");
    setFertilizerType("");
  };

  const addProduct = event => {
    event.preventDefault();
    if (!productName.trim() || productStock === "") return;
    setProducts([
      ...products,
      {
        id: Date.now(),
        name: productName.trim(),
        category: productCategory,
        stock: Number(productStock),
        unit: "items",
      },
    ]);
    setProductName("");
    setProductStock("");
  };

  const addSeason = event => {
    event.preventDefault();
    if (!seasonName.trim() || !seasonStart || !seasonEnd) return;
    setSeasons([
      ...seasons,
      { id: Date.now(), name: seasonName.trim(), start: seasonStart, end: seasonEnd, status: "Planned" },
    ]);
    setSeasonName("");
    setSeasonStart("");
    setSeasonEnd("");
  };

  const sendAnnouncement = event => {
    event.preventDefault();
    if (!announcementTitle.trim() || !announcementMessage.trim()) return;
    setAnnouncements([
      { id: Date.now(), title: announcementTitle.trim(), message: announcementMessage.trim(), time: "Just now" },
      ...announcements,
    ]);
    setAnnouncementTitle("");
    setAnnouncementMessage("");
  };

  const locateFarmDevice = () => {
    if (!navigator.geolocation) {
      setLocationError("Location is not available in this browser. You can enter the farm coordinates manually.");
      return;
    }

    setLocationLoading(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      position => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          recordedAt: new Date(position.timestamp).toISOString(),
        });
        setLocationLoading(false);
      },
      error => {
        const messages = {
          1: "Location permission was denied. Allow location access in your browser or enter coordinates manually.",
          2: "Your location could not be determined. Try again or enter coordinates manually.",
          3: "Location request timed out. Try again or enter coordinates manually.",
        };
        setLocationError(messages[error.code] || "Unable to get your location. Enter coordinates manually.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const useManualCoordinates = event => {
    event.preventDefault();
    const latitude = Number(manualLatitude);
    const longitude = Number(manualLongitude);

    if (
      manualLatitude === "" ||
      manualLongitude === "" ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      setLocationError("Enter a valid latitude from -90 to 90 and longitude from -180 to 180.");
      return;
    }

    setLocationError("");
    setCurrentLocation({
      latitude,
      longitude,
      accuracy: null,
      recordedAt: new Date().toISOString(),
    });
  };

  const saveFarmLocation = () => {
    if (!currentLocation || !selectedLocationFarmer) return;

    const farmer = farmers.find(item => item.id === selectedLocationFarmer);
    const locationRecord = {
      ...currentLocation,
      farmerId: selectedLocationFarmer,
      farmerName: farmer?.name || selectedLocationFarmer,
      district: farmer?.location || "District unavailable",
      farmName: farmLocationName.trim() || `${farmer?.name || "Farm"} location`,
    };

    setSavedLocations(current => [
      locationRecord,
      ...current.filter(item => item.farmerId !== selectedLocationFarmer),
    ]);
  };

  const mapUrl = location => `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=16/${location.latitude}/${location.longitude}`;

  if (page === "Farmer Requests") {
    return (
      <section className="farmer-tool-page">
        <AdminHeading
          eyebrow="PROFILE REVIEW"
          title="Farmer requests"
          description="Review sample farmer profiles awaiting approval."
          trailing={<span className="farmer-tool-count">{pendingRequests} pending</span>}
        />
        <AdminNotice>Review actions are local to this demo and do not change the sample Farmers directory.</AdminNotice>
        <div className="farmer-tool-filter-row">
          {["Pending", "Approved", "Declined", "All"].map(filter => (
            <button type="button" className={requestFilter === filter ? "farmer-tool-filter is-selected" : "farmer-tool-filter"} onClick={() => setRequestFilter(filter)} key={filter}>
              {filter}
            </button>
          ))}
        </div>
        {visibleRequests.length ? (
          <div className="admin-tool-card-grid">
            {visibleRequests.map(request => (
              <article className="farmer-tool-card admin-tool-card" key={request.id}>
                <div className="farmer-tool-panel-heading">
                  <span className="farmer-tool-icon" aria-hidden="true">👤</span>
                  <span className={`farmer-tool-badge ${request.reviewStatus === "Pending" ? "badge-warn" : "badge-good"}`}>{request.reviewStatus}</span>
                </div>
                <p className="farmer-tool-eyebrow">{request.id} · {request.location}</p>
                <h3>{request.name}</h3>
                <p>{request.farmArea} · {request.mainCrops}</p>
                {request.reviewStatus === "Pending" && (
                  <div className="admin-tool-actions">
                    <button type="button" className="farmer-tool-button" onClick={() => setRequests(requests.map(item => item.id === request.id ? { ...item, reviewStatus: "Approved" } : item))}>Approve</button>
                    <button type="button" className="admin-tool-secondary-button" onClick={() => setRequests(requests.map(item => item.id === request.id ? { ...item, reviewStatus: "Declined" } : item))}>Decline</button>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : <div className="farmer-tool-panel"><p className="farmer-tool-empty">No requests in this category.</p></div>}
      </section>
    );
  }

  if (page === "Reports & Analytics") {
    const summaries = [
      { label: "Registered farmers", value: totalFarmers },
      { label: "Pending requests", value: pendingRequests },
      { label: "Crop records", value: crops.length },
      { label: "Growing crops", value: cropCounts.Growing },
    ];
    return (
      <section className="farmer-tool-page">
        <AdminHeading eyebrow="PROGRAM OVERVIEW" title="Reports & analytics" description="A summary of sample farmer and crop records in this workspace." />
        <div className="analytics-summary">
          {summaries.map(item => <article key={item.label}><span>{item.label}</span><strong>{item.value}</strong></article>)}
        </div>
        <div className="farmer-tool-panel analytics-panel">
          <div className="farmer-tool-panel-heading"><h3>Crop records by status</h3><span className="farmer-tool-muted">Current sample records</span></div>
          {Object.entries(cropCounts).map(([status, count], index) => (
            <div className="analytics-row" key={status}>
              <div className="analytics-row-label"><span>{status}</span><strong>{count}</strong></div>
              <div className="analytics-track"><span className={`analytics-fill fill-${["green", "gold", "blue"][index]}`} style={{ width: `${crops.length ? count / crops.length * 100 : 0}%` }} /></div>
            </div>
          ))}
        </div>
        <AdminNotice>Reports summarize the sample records currently loaded in the app; they are not exported or saved to a server.</AdminNotice>
      </section>
    );
  }

  if (page === "Weather Management") {
    return (
      <section className="farmer-tool-page">
        <AdminHeading
          eyebrow="REGIONAL CONDITIONS"
          title="Weather management"
          description={`${weatherLocation?.label || "Tamil Nadu"} · regional forecast`}
          trailing={
            <button type="button" className="farmer-tool-button" onClick={onRefreshWeather} disabled={weatherLoading}>
              {weatherLoading ? "Updating..." : "Refresh weather"}
            </button>
          }
        />
        {weatherError && <AdminNotice tone="warning">{weatherError}</AdminNotice>}
        {!weatherData && (
          <div className="farmer-tool-panel">
            <h3>{weatherLoading ? "Loading regional conditions..." : "Weather data unavailable"}</h3>
            <p className="farmer-tool-muted">Live weather is supplied by the existing forecast service when a connection is available.</p>
          </div>
        )}
        {weatherData && (
          <>
            <div className="admin-tool-weather-current">
              <div><span className="weather-current-icon" aria-hidden="true">{weatherData.condition.icon}</span><div><span>Current regional conditions</span><strong>{weatherData.temperature}°C · {weatherData.condition.condition}</strong></div></div>
              <span className="farmer-tool-badge badge-good">{weatherLoading ? "Updating" : "Live feed"}</span>
            </div>
            <div className="admin-tool-card-grid">
              <article className="farmer-tool-card"><p className="farmer-tool-eyebrow">Humidity</p><h3>{weatherData.humidity}%</h3></article>
              <article className="farmer-tool-card"><p className="farmer-tool-eyebrow">Wind</p><h3>{weatherData.windSpeed} km/h</h3></article>
              <article className="farmer-tool-card"><p className="farmer-tool-eyebrow">Rain chance</p><h3>{typeof weatherData.rainChance === "number" ? `${weatherData.rainChance}%` : "Unavailable"}</h3></article>
            </div>
            <div className="farmer-tool-panel">
              <div className="farmer-tool-panel-heading"><h3>Five-day outlook</h3><span className="farmer-tool-muted">{weatherUpdated ? `Updated ${weatherUpdated.replace("T", " ")}` : "Forecast"}</span></div>
              <div className="admin-tool-forecast">
                {weatherData.forecast.map((day, index) => <article key={`${day.day}-${index}`}><strong>{day.day}</strong><span aria-hidden="true">{day.icon}</span><small>{day.condition}</small><b>{Math.round(day.high)}° / {Math.round(day.low)}°</b></article>)}
              </div>
            </div>
          </>
        )}
        <AdminNotice>Forecast values are regional estimates, not field-level sensor readings.</AdminNotice>
      </section>
    );
  }

  if (page === "Soil & Irrigation Management") {
    return (
      <section className="farmer-tool-page">
        <AdminHeading eyebrow="FIELD RESOURCE SETTINGS" title="Soil & irrigation management" description="Review sample crop records and configure a demo moisture reminder threshold." />
        <form className="farmer-tool-panel admin-threshold-form" onSubmit={event => {
          event.preventDefault();
          setSoilSaved(true);
        }} onChange={() => setSoilSaved(false)}>
          <div className="farmer-tool-panel-heading"><h3>Moisture reminder trigger</h3><strong>{soilTrigger}%</strong></div>
          <label htmlFor="admin-soil-trigger">Show a reminder when moisture falls below this value</label>
          <input id="admin-soil-trigger" type="range" min="15" max="60" step="1" value={soilTrigger} onChange={event => setSoilTrigger(Number(event.target.value))} />
          <div className="admin-tool-range-labels"><span>15% · drier</span><span>60% · wetter</span></div>
          <button type="submit" className="farmer-tool-button">Save reminder setting</button>
          {soilSaved && <p className="farmer-tool-status" role="status">Threshold saved for this session.</p>}
        </form>
        <div className="farmer-tool-panel">
          <div className="farmer-tool-panel-heading"><h3>Crop records to monitor</h3><span className="farmer-tool-muted">{crops.length} records</span></div>
          <div className="farmer-tool-table-wrap">
            <table className="farmer-tool-table">
              <thead><tr><th>Crop</th><th>Area</th><th>Status</th><th>Reminder rule</th></tr></thead>
              <tbody>{crops.map(crop => <tr key={crop.id}><td><strong>{crop.name}</strong></td><td>{crop.area}</td><td>{crop.status}</td><td>Alert below {soilTrigger}%</td></tr>)}</tbody>
            </table>
          </div>
        </div>
        <AdminNotice>The threshold is a configurable demo reminder, not agronomic irrigation advice. Crop water needs vary by soil, crop stage, and local conditions.</AdminNotice>
      </section>
    );
  }

  if (page === "Fertilizer Management") {
    return (
      <section className="farmer-tool-page">
        <AdminHeading eyebrow="INPUT CATALOG" title="Fertilizer management" description="Maintain a simple list of fertilizer product references for this workspace." />
        <AdminNotice>This is a product catalog only. It does not calculate fertilizer doses or recommend application rates.</AdminNotice>
        <form className="farmer-tool-panel admin-inline-form" onSubmit={addFertilizer}>
          <label>Product name<input value={fertilizerName} onChange={event => setFertilizerName(event.target.value)} placeholder="e.g. Compost" required /></label>
          <label>Type or nutrient group<input value={fertilizerType} onChange={event => setFertilizerType(event.target.value)} placeholder="e.g. Organic" required /></label>
          <button type="submit" className="farmer-tool-button">Add product</button>
        </form>
        <div className="admin-tool-card-grid">
          {fertilizers.map(item => (
            <article className="farmer-tool-card" key={item.id}>
              <span className="farmer-tool-icon" aria-hidden="true">🌿</span>
              <p className="farmer-tool-eyebrow">{item.type}</p>
              <h3>{item.name}</h3>
              <p>{item.note}</p>
              <button type="button" className="farmer-tool-link-button" onClick={() => setFertilizers(fertilizers.filter(fertilizer => fertilizer.id !== item.id))}>Remove from catalog</button>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (page === "Pest & Disease Management") {
    return (
      <section className="farmer-tool-page">
        <AdminHeading eyebrow="CROP HEALTH REVIEW" title="Pest & disease management" description="Track reported field observations and their follow-up status." />
        <AdminNotice tone="warning">Reports are unverified observations, not confirmed diagnoses. Route suspected outbreaks to a qualified local crop advisor.</AdminNotice>
        <div className="farmer-tool-panel">
          <div className="farmer-tool-table-wrap">
            <table className="farmer-tool-table">
              <thead><tr><th>Crop</th><th>Observation</th><th>District</th><th>Follow-up</th><th>Action</th></tr></thead>
              <tbody>
                {pestReports.map(report => (
                  <tr key={report.id}>
                    <td><strong>{report.crop}</strong></td><td>{report.issue}</td><td>{report.district}</td>
                    <td><span className={`farmer-tool-badge ${report.status === "Review" ? "badge-warn" : "badge-good"}`}>{report.status}</span></td>
                    <td><button type="button" className="farmer-tool-link-button" onClick={() => setPestReports(pestReports.map(item => item.id === report.id ? { ...item, status: item.status === "Resolved" ? "Review" : "Resolved" } : item))}>{report.status === "Resolved" ? "Reopen" : "Mark resolved"}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  if (page === "Market Management") {
    return (
      <section className="farmer-tool-page">
        <AdminHeading eyebrow="MARKET REFERENCES" title="Market management" description="Edit sample market references for the demo catalog." />
        <AdminNotice tone="warning">Rates are sample values only and are not live market data. Verify actual prices with local markets before sharing them with farmers.</AdminNotice>
        <form className="farmer-tool-panel" onSubmit={event => {
          event.preventDefault();
          setMarketSaved(true);
        }} onChange={() => setMarketSaved(false)}>
          <div className="farmer-tool-panel-heading"><h3>Sample rates (₹ / quintal)</h3><button type="submit" className="farmer-tool-button">Save rates</button></div>
          <div className="farmer-tool-table-wrap">
            <table className="farmer-tool-table">
              <thead><tr><th>Market label</th><th>District</th><th>Crop</th><th>Sample rate (₹ / quintal)</th></tr></thead>
              <tbody>{markets.map(market => (
                <tr key={market.id}>
                  <td>{market.name}</td><td>{market.district}</td><td>{market.crop}</td>
                  <td><input aria-label={`${market.crop} sample rate`} type="number" min="0" value={market.price} onChange={event => setMarkets(markets.map(item => item.id === market.id ? { ...item, price: event.target.value } : item))} /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          {marketSaved && <p className="farmer-tool-status" role="status">Sample rates saved for this session.</p>}
        </form>
      </section>
    );
  }

  if (page === "Product Management") {
    return (
      <section className="farmer-tool-page">
        <AdminHeading eyebrow="CATALOG ADMINISTRATION" title="Product management" description="Manage sample seed, soil-care, and equipment catalog entries." trailing={<span className="farmer-tool-count">{products.length} products</span>} />
        <form className="farmer-tool-panel admin-inline-form" onSubmit={addProduct}>
          <label>Product name<input value={productName} onChange={event => setProductName(event.target.value)} placeholder="Enter product name" required /></label>
          <label>Category<select value={productCategory} onChange={event => setProductCategory(event.target.value)}><option>Seeds</option><option>Soil care</option><option>Equipment</option><option>Other</option></select></label>
          <label>Stock quantity<input type="number" min="0" value={productStock} onChange={event => setProductStock(event.target.value)} required /></label>
          <button type="submit" className="farmer-tool-button">Add listing</button>
        </form>
        <div className="farmer-tool-panel">
          <div className="farmer-tool-table-wrap">
            <table className="farmer-tool-table">
              <thead><tr><th>Product</th><th>Category</th><th>Stock</th><th>Action</th></tr></thead>
              <tbody>{products.map(product => <tr key={product.id}><td><strong>{product.name}</strong></td><td>{product.category}</td><td>{product.stock} {product.unit}</td><td><button type="button" className="farmer-tool-link-button" onClick={() => setProducts(products.filter(item => item.id !== product.id))}>Remove</button></td></tr>)}</tbody>
            </table>
          </div>
        </div>
        <AdminNotice>Product listings and stock values are local demo data; no order or payment service is connected.</AdminNotice>
      </section>
    );
  }

  if (page === "Season Management") {
    return (
      <section className="farmer-tool-page">
        <AdminHeading eyebrow="PLANNING CYCLE" title="Season management" description="Create seasonal planning periods and set the active season." />
        <form className="farmer-tool-panel admin-inline-form season-form" onSubmit={addSeason}>
          <label>Season name<input value={seasonName} onChange={event => setSeasonName(event.target.value)} placeholder="e.g. Main season 2027" required /></label>
          <label>Start date<input type="date" value={seasonStart} onChange={event => setSeasonStart(event.target.value)} required /></label>
          <label>End date<input type="date" min={seasonStart || undefined} value={seasonEnd} onChange={event => setSeasonEnd(event.target.value)} required /></label>
          <button type="submit" className="farmer-tool-button">Add season</button>
        </form>
        <div className="admin-tool-card-grid">
          {seasons.map(season => (
            <article className="farmer-tool-card" key={season.id}>
              <div className="farmer-tool-panel-heading"><span className="farmer-tool-icon" aria-hidden="true">🗓️</span><span className={`farmer-tool-badge ${season.status === "Active" ? "badge-good" : ""}`}>{season.status}</span></div>
              <h3>{season.name}</h3>
              <p>{season.start} — {season.end}</p>
              {season.status !== "Active" && <button type="button" className="farmer-tool-link-button" onClick={() => setSeasons(seasons.map(item => ({ ...item, status: item.id === season.id ? "Active" : "Planned" })))}>Set active season</button>}
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (page === "Farm Location Tracking") {
    return (
      <section className="farmer-tool-page">
        <AdminHeading
          eyebrow="OPT-IN GPS LOCATION"
          title="Farm location tracking"
          description="Record a farm coordinate with the farmer's permission and open it on a map."
          trailing={<span className="farmer-tool-count">{savedLocations.length} saved locations</span>}
        />
        <AdminNotice>
          Location is requested only when you press the button. Ask the farmer for permission before using a device at their farm. Coordinates stay in this page session; there is no background tracking or server storage.
        </AdminNotice>
        <section className="farmer-tool-panel farm-location-form">
          <div className="profile-field-grid">
            <label>
              Farmer profile
              <select value={selectedLocationFarmer} onChange={event => setSelectedLocationFarmer(event.target.value)} required>
                {farmers.map(farmer => <option value={farmer.id} key={farmer.id}>{farmer.name} · {farmer.location}</option>)}
              </select>
            </label>
            <label>
              Farm name or field
              <input value={farmLocationName} onChange={event => setFarmLocationName(event.target.value)} placeholder="e.g. North rice field" />
            </label>
          </div>
          <div className="farm-location-actions">
            <button type="button" className="farmer-tool-button" onClick={locateFarmDevice} disabled={locationLoading}>
              {locationLoading ? "Getting location..." : "Use this device's current location"}
            </button>
            {currentLocation && (
              <span className="farmer-tool-muted">
                Location captured · {currentLocation.accuracy
                  ? `accuracy about ${Math.round(currentLocation.accuracy)} m`
                  : "coordinates entered manually"}
              </span>
            )}
          </div>
          <form className="farm-location-manual" onSubmit={useManualCoordinates}>
            <label>
              Latitude
              <input type="number" min="-90" max="90" step="any" value={manualLatitude} onChange={event => setManualLatitude(event.target.value)} placeholder="e.g. 11.0168" required />
            </label>
            <label>
              Longitude
              <input type="number" min="-180" max="180" step="any" value={manualLongitude} onChange={event => setManualLongitude(event.target.value)} placeholder="e.g. 76.9558" required />
            </label>
            <button type="submit" className="admin-tool-secondary-button">Use coordinates</button>
          </form>
          {locationError && <p className="farm-location-error" role="alert">{locationError}</p>}
          {currentLocation && (
            <div className="farm-location-preview">
              <div>
                <span className="farmer-tool-eyebrow">CURRENT LOCATION PREVIEW</span>
                <strong>{currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}</strong>
                <span>Captured {new Date(currentLocation.recordedAt).toLocaleString()}</span>
              </div>
              <a className="farmer-tool-link-button" href={mapUrl(currentLocation)} target="_blank" rel="noreferrer">
                Preview on OpenStreetMap ↗
              </a>
            </div>
          )}
          <button type="button" className="farmer-tool-button" onClick={saveFarmLocation} disabled={!currentLocation}>
            Save farm location
          </button>
        </section>
        <div className="farmer-tool-panel">
          <div className="farmer-tool-panel-heading">
            <h3>Saved farm locations</h3>
            <span className="farmer-tool-muted">Session only</span>
          </div>
          {savedLocations.length === 0 ? (
            <p className="farmer-tool-empty">No locations saved yet. Capture a location near a farm and save it to a farmer profile.</p>
          ) : (
            <div className="farm-location-list">
              {savedLocations.map(location => (
                <article className="farm-location-record" key={location.farmerId}>
                  <span className="farmer-tool-icon" aria-hidden="true">📍</span>
                  <div className="farm-location-record-details">
                    <strong>{location.farmName}</strong>
                    <span>{location.farmerName} · {location.district}</span>
                    <span>
                      {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                      {location.accuracy ? ` · ±${Math.round(location.accuracy)} m` : " · manual"}
                    </span>
                    <small>Recorded {new Date(location.recordedAt).toLocaleString()}</small>
                  </div>
                  <div className="farm-location-record-actions">
                    <a className="farmer-tool-link-button" href={mapUrl(location)} target="_blank" rel="noreferrer">Open map ↗</a>
                    <button type="button" className="farmer-tool-link-button" onClick={() => setSavedLocations(savedLocations.filter(item => item.farmerId !== location.farmerId))}>Remove</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (page === "Notifications") {
    return (
      <section className="farmer-tool-page">
        <AdminHeading eyebrow="FARMER COMMUNICATIONS" title="Notifications" description="Prepare a sample announcement for the farmer workspace." trailing={<span className="farmer-tool-count">{announcements.length} notices</span>} />
        <AdminNotice>Announcements are only displayed in this admin session. They are not delivered to farmer accounts.</AdminNotice>
        <form className="farmer-tool-panel admin-announcement-form" onSubmit={sendAnnouncement}>
          <label>Announcement title<input value={announcementTitle} onChange={event => setAnnouncementTitle(event.target.value)} placeholder="Short title" required /></label>
          <label>Message<textarea rows="3" value={announcementMessage} onChange={event => setAnnouncementMessage(event.target.value)} placeholder="Write a brief update for farmers" required /></label>
          <button type="submit" className="farmer-tool-button">Add announcement</button>
        </form>
        <div className="admin-tool-announcements">
          {announcements.map(item => <article className="farmer-tool-panel" key={item.id}><div className="farmer-tool-panel-heading"><h3>{item.title}</h3><span className="farmer-tool-muted">{item.time}</span></div><p>{item.message}</p></article>)}
        </div>
      </section>
    );
  }

  if (page === "Feedback & Complaints") {
    return (
      <section className="farmer-tool-page">
        <AdminHeading eyebrow="FARMER FEEDBACK" title="Feedback & complaints" description="Review and update the status of sample support items." />
        <AdminNotice>These sample messages are not submitted by real users. Status updates are session-only.</AdminNotice>
        <div className="farmer-tool-panel">
          <div className="farmer-tool-table-wrap">
            <table className="farmer-tool-table">
              <thead><tr><th>Sender</th><th>Topic</th><th>Message</th><th>Status</th><th>Update</th></tr></thead>
              <tbody>{messages.map(message => (
                <tr key={message.id}>
                  <td>{message.sender}</td><td>{message.topic}</td><td>{message.message}</td>
                  <td><span className={`farmer-tool-badge ${message.status === "Open" ? "badge-warn" : "badge-good"}`}>{message.status}</span></td>
                  <td><button type="button" className="farmer-tool-link-button" onClick={() => setMessages(messages.map(item => item.id === message.id ? { ...item, status: item.status === "Open" ? "Addressed" : "Open" } : item))}>{message.status === "Open" ? "Mark addressed" : "Reopen"}</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  if (page === "Farming Education") {
    return (
      <section className="farmer-tool-page">
        <AdminHeading eyebrow="LEARNING LIBRARY" title="Farming education" description="Curate short learning topics for farmers and field teams." />
        <AdminNotice>These materials are general learning prompts. Share local, crop-specific recommendations from qualified sources.</AdminNotice>
        <div className="admin-tool-card-grid">
          {educationItems.map(item => {
            const completed = completedLessons.includes(item.id);
            return (
              <article className="farmer-tool-card" key={item.id}>
                <span className="farmer-tool-badge">{item.topic}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <button type="button" className="farmer-tool-link-button" onClick={() => setCompletedLessons(completed ? completedLessons.filter(id => id !== item.id) : [...completedLessons, item.id])}>{completed ? "Marked reviewed" : "Mark reviewed"}</button>
              </article>
            );
          })}
        </div>
        <p className="farmer-tool-muted">{completedLessons.length} of {educationItems.length} topics marked reviewed in this session.</p>
      </section>
    );
  }

  return null;
}

export default AdminTools;
