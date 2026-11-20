import { useEffect, useState } from "react";
import "./App.css";
import FarmerTools from "./FarmerTools";
import AdminTools from "./AdminTools";
import { adminToolPages } from "./adminToolPages";

const weatherLocation = {
  label: "Tamil Nadu, India",
  latitude: 11.1271,
  longitude: 78.6569,
};

const farmerToolPages = [
  "Pest & Disease Detection",
  "Crop Disease Scanner",
  "Farm Calendar",
  "Farm Equipment",
  "Crop Growth Analytics",
  "Market Prices",
  "Buy Seeds & Products",
  "Farming Tips",
  "Notifications",
  "Farmer Community",
  "My Profile",
  "Help & Support",
];

function getWeatherInfo(code) {
  if (code === 0) return { condition: "Clear sky", icon: "☀️" };
  if (code === 1) return { condition: "Mostly clear", icon: "🌤️" };
  if (code === 2) return { condition: "Partly cloudy", icon: "⛅" };
  if (code === 3) return { condition: "Overcast", icon: "☁️" };
  if ([45, 48].includes(code)) return { condition: "Fog", icon: "🌫️" };
  if ([51, 53, 55, 56, 57].includes(code)) return { condition: "Drizzle", icon: "🌦️" };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { condition: "Rain", icon: "🌧️" };
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { condition: "Snow", icon: "🌨️" };
  }
  if ([95, 96, 99].includes(code)) return { condition: "Thunderstorm", icon: "⛈️" };
  return { condition: "Conditions unavailable", icon: "🌡️" };
}

const sampleFarmers = [
  { id: "F-101", name: "Farmer 101", location: "Coimbatore", farmArea: "2.5 acres", mainCrops: "Maize, cotton", crops: 3, status: "Active" },
  { id: "F-102", name: "Farmer 102", location: "Thanjavur", farmArea: "4 acres", mainCrops: "Rice, banana", crops: 2, status: "Active" },
  { id: "F-103", name: "Farmer 103", location: "Salem", farmArea: "1.5 acres", mainCrops: "Tomato", crops: 1, status: "Pending" },
  { id: "F-104", name: "Farmer 104", location: "Madurai", farmArea: "3.2 acres", mainCrops: "Cotton, onion", crops: 4, status: "Active" },
  { id: "F-105", name: "Farmer 105", location: "Erode", farmArea: "2 acres", mainCrops: "Turmeric, sugarcane", crops: 2, status: "Active" },
  { id: "F-106", name: "Farmer 106", location: "Tiruchirappalli", farmArea: "1.8 acres", mainCrops: "Rice, maize", crops: 2, status: "Active" },
  { id: "F-107", name: "Farmer 107", location: "Dindigul", farmArea: "2.1 acres", mainCrops: "Tomato, chili", crops: 3, status: "Active" },
  { id: "F-108", name: "Farmer 108", location: "Tirunelveli", farmArea: "3.5 acres", mainCrops: "Rice, banana", crops: 2, status: "Pending" },
  { id: "F-109", name: "Farmer 109", location: "Cuddalore", farmArea: "2.8 acres", mainCrops: "Groundnut, cashew", crops: 3, status: "Active" },
  { id: "F-110", name: "Farmer 110", location: "Vellore", farmArea: "1.2 acres", mainCrops: "Millet", crops: 1, status: "Active" },
  { id: "F-111", name: "Farmer 111", location: "Villupuram", farmArea: "3 acres", mainCrops: "Sugarcane, rice", crops: 2, status: "Active" },
  { id: "F-112", name: "Farmer 112", location: "Tiruppur", farmArea: "2.4 acres", mainCrops: "Cotton, maize", crops: 2, status: "Active" },
  { id: "F-113", name: "Farmer 113", location: "Kanyakumari", farmArea: "1 acre", mainCrops: "Banana, coconut", crops: 2, status: "Active" },
  { id: "F-114", name: "Farmer 114", location: "Namakkal", farmArea: "1.7 acres", mainCrops: "Tapioca", crops: 1, status: "Pending" },
  { id: "F-115", name: "Farmer 115", location: "Theni", farmArea: "2.2 acres", mainCrops: "Grapes, vegetables", crops: 3, status: "Active" },
];

const cropCatalogue = [
  "Rice",
  "Wheat",
  "Maize",
  "Barley",
  "Millet",
  "Sorghum",
  "Cotton",
  "Sugarcane",
  "Soybean",
  "Groundnut",
  "Chickpea",
  "Lentil",
  "Mustard",
  "Potato",
  "Tomato",
  "Onion",
  "Chili pepper",
  "Eggplant",
  "Cabbage",
  "Cauliflower",
  "Banana",
  "Mango",
  "Coffee",
  "Tea",
  "Sunflower",
];

function getIrrigationRecommendation(moisture, rainChance) {
  if (moisture <= 25) {
    return {
      priority: "High priority",
      title: "Very dry - irrigate soon",
      detail:
        "Soil moisture is very low. Apply water carefully and check the sensor again afterward.",
      tone: "urgent",
    };
  }

  if (moisture <= 40 && rainChance >= 60) {
    return {
      priority: "Rain expected",
      title: "Wait for rain, then recheck",
      detail:
        "Moisture is getting low, but rain is likely. Check the soil again after the expected rainfall before irrigating.",
      tone: "wait",
    };
  }

  if (moisture <= 40) {
    return {
      priority: "Water today",
      title: "Irrigate today",
      detail:
        "Moisture is below the sample trigger and little rain is expected. Consider watering, then recheck the soil.",
      tone: "water",
    };
  }

  if (moisture <= 55) {
    return {
      priority: "Keep monitoring",
      title: "Check again later",
      detail:
        "Moisture is currently moderate. Recheck later today and irrigate if it drops below the sample trigger.",
      tone: "monitor",
    };
  }

  return {
    priority: "No action needed",
    title: "No irrigation right now",
    detail:
      "Moisture is above the sample trigger. Continue monitoring and avoid watering until the soil needs it.",
    tone: "good",
  };
}

function App() {
  const [role, setRole] = useState("farmer");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("Dashboard");
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [weatherUpdated, setWeatherUpdated] = useState("");
  const [weatherRefreshToken, setWeatherRefreshToken] = useState(0);
  const [farmerSearch, setFarmerSearch] = useState("");
  const [farmerStatusFilter, setFarmerStatusFilter] = useState("All");
  const [fertilizerPlans, setFertilizerPlans] = useState([]);
  const [fertilizerCrop, setFertilizerCrop] = useState("Rice");
  const [fertilizerProduct, setFertilizerProduct] = useState("");
  const [fertilizerRate, setFertilizerRate] = useState("");
  const [fertilizerDate, setFertilizerDate] = useState("");
  const [nitrogenStatus, setNitrogenStatus] = useState("");
  const [phosphorusStatus, setPhosphorusStatus] = useState("");
  const [potassiumStatus, setPotassiumStatus] = useState("");
  const [fertilizerError, setFertilizerError] = useState("");

  const [crops, setCrops] = useState([
    { id: 1, name: "Rice", area: "2 Acres", date: "2026-11-01", status: "Growing" },
    { id: 2, name: "Wheat", area: "1 Acre", date: "2026-10-15", status: "Harvested" },
    { id: 3, name: "Tomato", area: "0.5 Acre", date: "2026-11-05", status: "Growing" },
    { id: 4, name: "Maize", area: "1.5 Acres", date: "2026-10-20", status: "Growing" },
    { id: 5, name: "Cotton", area: "2 Acres", date: "2026-09-18", status: "Growing" },
    { id: 6, name: "Sugarcane", area: "3 Acres", date: "2026-08-12", status: "Growing" },
    { id: 7, name: "Soybean", area: "1 Acre", date: "2026-07-25", status: "Harvested" },
    { id: 8, name: "Potato", area: "0.75 Acre", date: "2026-11-02", status: "Planned" },
    { id: 9, name: "Onion", area: "0.5 Acre", date: "2026-10-28", status: "Growing" },
    { id: 10, name: "Groundnut", area: "1 Acre", date: "2026-06-14", status: "Harvested" },
    { id: 11, name: "Chickpea", area: "0.8 Acre", date: "2026-11-10", status: "Planned" },
    { id: 12, name: "Mustard", area: "1.2 Acres", date: "2026-11-08", status: "Growing" },
    { id: 13, name: "Millet", area: "1.5 Acres", date: "2026-07-02", status: "Growing" },
  ]);

  const [farmSettings, setFarmSettings] = useState({
    farmName: "Green Valley Farm",
    emailAlerts: true,
    moistureAlerts: true,
    language: "English",
  });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("Rice");
  const [soilMoisture, setSoilMoisture] = useState(35);
  const [rainChance, setRainChance] = useState(20);
  const [cropName, setCropName] = useState("");
  const [cropArea, setCropArea] = useState("");
  const [cropDate, setCropDate] = useState("");
  const [cropStatus, setCropStatus] = useState("Growing");
  const [editingId, setEditingId] = useState(null);

  const menu = role === "admin"
    ? ["Dashboard", "Farmers", "Crop Management", "Reports", "Settings", ...adminToolPages]
    : ["Dashboard", "My Crops", "Soil Monitoring", "Weather", "Irrigation", "Fertilizer Planner", ...farmerToolPages];
  const fertilizerCrops = crops.filter(crop => crop.status !== "Harvested");
  const fertilizerCropName = fertilizerCrops.some(crop => crop.name === fertilizerCrop)
    ? fertilizerCrop
    : fertilizerCrops[0]?.name || "";
  const selectedCropName = crops.some(crop => crop.name === selectedCrop)
    ? selectedCrop
    : crops[0]?.name || "";
  const irrigationRecommendation = getIrrigationRecommendation(
    soilMoisture,
    rainChance
  );
  const growingCropCount = crops.filter(crop => crop.status === "Growing").length;
  const harvestedCropCount = crops.filter(crop => crop.status === "Harvested").length;
  const plannedCropCount = crops.filter(crop => crop.status === "Planned").length;
  const activeFarmerCount = sampleFarmers.filter(farmer => farmer.status === "Active").length;
  const pendingFarmerCount = sampleFarmers.filter(farmer => farmer.status === "Pending").length;
  const filteredFarmers = sampleFarmers.filter(farmer => {
    const query = farmerSearch.trim().toLowerCase();
    const matchesSearch = `${farmer.id} ${farmer.name} ${farmer.location} ${farmer.mainCrops}`
      .toLowerCase()
      .includes(query);

    return matchesSearch &&
      (farmerStatusFilter === "All" || farmer.status === farmerStatusFilter);
  });

  useEffect(() => {
    if (!loggedIn || (page !== "Weather" && page !== "Weather Management")) return undefined;

    let cancelled = false;
    let controller;

    const refreshWeather = async () => {
      if (cancelled) return;

      setWeatherLoading(true);
      const requestController = new AbortController();
      controller = requestController;

      try {
        const params = new URLSearchParams({
          latitude: String(weatherLocation.latitude),
          longitude: String(weatherLocation.longitude),
          current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
          daily:
            "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max",
          timezone: "auto",
          forecast_days: "5",
        });
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
          { signal: requestController.signal }
        );

        if (!response.ok) {
          throw new Error(`Weather service returned ${response.status}.`);
        }

        const payload = await response.json();
        const current = payload.current;
        const daily = payload.daily;
        const currentValues = [
          current?.temperature_2m,
          current?.relative_humidity_2m,
          current?.wind_speed_10m,
          current?.weather_code,
        ];

        if (
          currentValues.some(value => typeof value !== "number") ||
          !Array.isArray(daily?.time) ||
          daily.time.length === 0 ||
          !Array.isArray(daily.weather_code) ||
          !Array.isArray(daily.temperature_2m_max) ||
          !Array.isArray(daily.temperature_2m_min)
        ) {
          throw new Error("Weather service returned incomplete forecast data.");
        }

        const forecast = daily.time.map((date, index) => ({
          day: index === 0 ? "Today" : date.slice(5),
          ...getWeatherInfo(daily.weather_code[index]),
          high: daily.temperature_2m_max[index],
          low: daily.temperature_2m_min[index],
        }));

        if (cancelled) return;

        setWeatherData({
          temperature: Math.round(current.temperature_2m),
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          condition: getWeatherInfo(current.weather_code),
          rainChance: daily.precipitation_probability_max?.[0] ?? null,
          uvIndex: daily.uv_index_max?.[0] ?? null,
          forecast,
        });
        setWeatherUpdated(current.time || "");
        setWeatherError("");
      } catch (error) {
        if (cancelled || requestController.signal.aborted) return;

        console.error("Unable to refresh live weather:", error);
        setWeatherError(
          "Live weather could not be updated. Check your connection and try again."
        );
      } finally {
        if (!cancelled) setWeatherLoading(false);
      }
    };

    refreshWeather();
    const refreshTimer = window.setInterval(refreshWeather, 15 * 60 * 1000);

    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
      controller?.abort();
    };
  }, [loggedIn, page, weatherRefreshToken]);

  const login = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setLoginError("Enter both your username and password to continue.");
      return;
    }

    setLoginError("");
    setLoggedIn(true);
    setPage("Dashboard");
  };

  const saveCrop = (e) => {
    e.preventDefault();

    if (!cropName.trim() || !cropArea.trim() || !cropDate) {
      alert("Please fill all crop details");
      return;
    }

    const cropData = {
      id: editingId || Math.max(0, ...crops.map(crop => crop.id)) + 1,
      name: cropName,
      area: cropArea,
      date: cropDate,
      status: cropStatus
    };

    if (editingId) {
      setCrops(crops.map(c =>
        c.id === editingId ? cropData : c
      ));
    } else {
      setCrops([...crops, cropData]);
    }

    clearForm();
  };

  const clearForm = () => {
    setCropName("");
    setCropArea("");
    setCropDate("");
    setCropStatus("Growing");
    setEditingId(null);
  };

  const editCrop = (crop) => {
    setCropName(crop.name);
    setCropArea(crop.area);
    setCropDate(crop.date);
    setCropStatus(crop.status);
    setEditingId(crop.id);
  };

  const deleteCrop = (id) => {
    if (window.confirm("Delete this crop?")) {
      setCrops(crops.filter(c => c.id !== id));
    }
  };

  const saveSettings = (e) => {
    e.preventDefault();
    setSettingsSaved(true);
  };

  const saveFertilizerPlan = (e) => {
    e.preventDefault();

    const rate = Number(fertilizerRate);
    if (
      !fertilizerCropName ||
      !fertilizerProduct ||
      !fertilizerDate ||
      !nitrogenStatus ||
      !phosphorusStatus ||
      !potassiumStatus ||
      !Number.isFinite(rate) ||
      rate <= 0
    ) {
      setFertilizerError("Complete all fields and enter a rate greater than zero.");
      return;
    }

    const crop = fertilizerCrops.find(item => item.name === fertilizerCropName);
    const plan = {
      id: Math.max(0, ...fertilizerPlans.map(item => item.id)) + 1,
      crop: fertilizerCropName,
      area: crop?.area || "—",
      product: fertilizerProduct,
      rate,
      date: fertilizerDate,
      nitrogen: nitrogenStatus,
      phosphorus: phosphorusStatus,
      potassium: potassiumStatus,
      status: "Planned",
    };

    setFertilizerPlans([...fertilizerPlans, plan]);
    setFertilizerProduct("");
    setFertilizerRate("");
    setFertilizerDate("");
    setNitrogenStatus("");
    setPhosphorusStatus("");
    setPotassiumStatus("");
    setFertilizerError("");
  };

  const markFertilizerApplied = (planId) => {
    setFertilizerPlans(fertilizerPlans.map(plan =>
      plan.id === planId ? { ...plan, status: "Applied" } : plan
    ));
  };

  if (!loggedIn) {
    return (
      <div className="login-page">
        <section className="login-image" aria-label="SmartFarm introduction">
          <div className="login-brand">
            <span className="login-brand-mark" aria-hidden="true">S</span>
            <span>SmartFarm</span>
          </div>

          <div className="image-text">
            <p className="login-image-eyebrow">SMARTER FARMING, EVERY DAY</p>
            <h1>Grow a better future.</h1>
            <p>
              Keep your fields, crops, and farm decisions moving in the right
              direction.
            </p>
          </div>

          <div className="login-feature-list" aria-label="Farm tools">
            <span>Soil insights</span>
            <span>Weather updates</span>
            <span>Irrigation planning</span>
          </div>
        </section>

        <div className="login-container">
          <div className="login-box">
            <div className="login-mobile-brand">
              <span className="login-brand-mark" aria-hidden="true">S</span>
              <span>SmartFarm</span>
            </div>
            <p className="login-form-eyebrow">FARM MANAGEMENT PORTAL</p>
            <h2>Welcome back</h2>
            <p className="subtitle">Sign in to continue to your workspace.</p>
            {loginError && <p className="login-error" role="alert">{loginError}</p>}

            <form onSubmit={login}>
              <label htmlFor="login-role">Workspace</label>
              <select
                id="login-role"
                value={role}
                onChange={e => {
                  setRole(e.target.value);
                  setLoginError("");
                }}
              >
                <option value="farmer">Farmer Login</option>
                <option value="admin">Admin Login</option>
              </select>

              <label htmlFor="login-username">Username</label>
              <input
                id="login-username"
                autoComplete="username"
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  setLoginError("");
                }}
                placeholder="Enter username" />

              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setLoginError("");
                }}
                placeholder="Enter password" />

              <button type="submit" onClick={login}>
                Sign in to dashboard <span aria-hidden="true">→</span>
              </button>
            </form>

            <p className="login-footer">
              Demo mode: enter any username and password.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-dashboard">
      <aside className="sidebar">
        <h2>🌱 SmartFarm</h2>
        <p className="role-name">
          {role === "admin" ? "Administrator" : "Farmer"}
        </p>

        <nav className="sidebar-menu" aria-label="Main navigation">
          {menu.map(item => (
            <button
              key={item}
              className={page === item ? "active-menu" : "menu-button"}
              onClick={() => {
                setPage(item);
                clearForm();
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        <button className="logout"
          onClick={() => {
            setLoggedIn(false);
            setPassword("");
            clearForm();
          }}>
          ↪ Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>{page}</h2>
            <p>Smart Agriculture Management System</p>
          </div>
          <span>👤 {username}</span>
        </header>

        {page === "Dashboard" && (
          <>
            <section className="dashboard-welcome">
              <div>
                <p className="dashboard-eyebrow">
                  {role === "admin" ? "YOUR FARM PROGRAM" : "YOUR GROWING SEASON"}
                </p>
                <h2 className="welcome">Welcome, {username}! <span aria-hidden="true">🌿</span></h2>
                <p className="dashboard-subtitle">
                  {role === "admin"
                    ? "Here is your agriculture program overview."
                    : "Here's your farm overview today."}
                </p>
              </div>
              <span className="dashboard-date">
                <span aria-hidden="true">◷</span>
                {new Intl.DateTimeFormat(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                }).format(new Date())}
              </span>
            </section>

            <div className="dashboard-grid">
              {role === "admin" ? (
                <>
                  <div className="dash-card">
                    <span>👥</span>
                    <h3>Registered Farmers</h3>
                    <h2>{sampleFarmers.length}</h2>
                    <p className="dashboard-status">
                      {activeFarmerCount} active · {pendingFarmerCount} pending
                    </p>
                  </div>
                  <div className="dash-card">
                    <span>🌾</span>
                    <h3>Crop Records</h3>
                    <h2>{crops.length}</h2>
                    <p className="dashboard-status">
                      {growingCropCount} growing · {harvestedCropCount} harvested
                    </p>
                  </div>
                  <div className="dash-card">
                    <span>🌱</span>
                    <h3>Growing Crops</h3>
                    <h2>{growingCropCount}</h2>
                    <p className="dashboard-status">
                      Across {crops.length} crop records
                    </p>
                  </div>
                  <div className="dash-card">
                    <span>📋</span>
                    <h3>Pending Farmer Profiles</h3>
                    <h2>{pendingFarmerCount}</h2>
                    <p className={`dashboard-status ${pendingFarmerCount ? "status-pending" : "status-ok"}`}>
                      {pendingFarmerCount ? "Awaiting review" : "All profiles reviewed"}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="dash-card">
                    <span>🌾</span>
                    <h3>Total Crops</h3>
                    <h2>{crops.length}</h2>
                  </div>
                  <div className="dash-card">
                    <span>🌱</span>
                    <h3>Growing Crops</h3>
                    <h2>{growingCropCount}</h2>
                  </div>
                  <div className="dash-card">
                    <span>💧</span>
                    <h3>Water Level</h3>
                    <h2>75%</h2>
                  </div>
                  <div className="dash-card">
                    <span>🌤</span>
                    <h3>Temperature</h3>
                    <h2>28°C</h2>
                  </div>
                </>
              )}
            </div>

            <section className="dashboard-gallery" aria-labelledby="farm-inspiration-title">
              <div className="dashboard-gallery-heading">
                <div>
                  <p className="dashboard-gallery-eyebrow">GROW WITH CONFIDENCE</p>
                  <h2 id="farm-inspiration-title">Farm inspiration</h2>
                </div>
                <p>Simple ideas for healthier fields and stronger harvests.</p>
              </div>
              <div className="dashboard-gallery-grid">
                <article className="dashboard-gallery-card">
                  <img src="/images/field-landscape.svg" alt="Green crop rows across a sunny field" />
                  <div>
                    <h3>Healthy fields</h3>
                    <p>Keep a close eye on changing field conditions.</p>
                  </div>
                </article>
                <article className="dashboard-gallery-card">
                  <img src="/images/crop-growth.svg" alt="Young crop growing in rich soil" />
                  <div>
                    <h3>Growing crops</h3>
                    <p>Track each crop as it develops through the season.</p>
                  </div>
                </article>
                <article className="dashboard-gallery-card">
                  <img src="/images/smart-irrigation.svg" alt="Watering system nourishing rows of crops" />
                  <div>
                    <h3>Smart irrigation</h3>
                    <p>Use moisture readings to guide your watering.</p>
                  </div>
                </article>
              </div>
            </section>
          </>
        )}

        {(page === "Crop Management" || page === "My Crops") && (
          <section className="crop-section">
            <div className="crop-heading">
              <div>
                <h2>🌾 Crop Management</h2>
                <p>Add and manage your crop details.</p>
              </div>
              <span className="crop-count">
                Total: {crops.length}
              </span>
            </div>

            <form className="crop-form" onSubmit={saveCrop}>
              <h3>{editingId ? "Edit Crop" : "Add New Crop"}</h3>

              <label htmlFor="crop-name">Crop Name</label>
              <input
                id="crop-name"
                list="crop-options"
                value={cropName}
                onChange={e => setCropName(e.target.value)}
                placeholder="Choose or enter a crop"
              />
              <datalist id="crop-options">
                {cropCatalogue.map(crop => (
                  <option key={crop} value={crop} />
                ))}
              </datalist>

              <label>Land Area</label>
              <input
                value={cropArea}
                onChange={e => setCropArea(e.target.value)}
                placeholder="Example: 2 Acres"
              />

              <label>Planting Date</label>
              <input
                type="date"
                value={cropDate}
                onChange={e => setCropDate(e.target.value)}
              />

              <label>Crop Status</label>
              <select
                value={cropStatus}
                onChange={e => setCropStatus(e.target.value)}
              >
                <option>Growing</option>
                <option>Harvested</option>
                <option>Planned</option>
              </select>

              <button type="submit">
                {editingId ? "Update Crop" : "Add Crop"}
              </button>

              {editingId && (
                <button type="button" className="cancel-btn"
                  onClick={clearForm}>
                  Cancel Edit
                </button>
              )}
            </form>

            <div className="crop-table-wrapper">
              <h3>Crop Records</h3>
              <table className="crop-table">
                <thead>
                  <tr>
                    <th>Crop</th>
                    <th>Area</th>
                    <th>Planting Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {crops.map(crop => (
                    <tr key={crop.id}>
                      <td>{crop.name}</td>
                      <td>{crop.area}</td>
                      <td>{crop.date}</td>
                      <td>{crop.status}</td>
                      <td>
                        <button className="edit-btn"
                          onClick={() => editCrop(crop)}>
                          Edit
                        </button>
                        <button className="delete-btn"
                          onClick={() => deleteCrop(crop.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {crops.length === 0 && (
                    <tr>
                      <td colSpan="5">No crops added yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {page === "Soil Monitoring" && (
  <section className="soil-section">
    <h2>🌱 Soil Monitoring</h2>
    <p>Monitor your agricultural soil conditions.</p>

    <div className="soil-grid">
      <div className="soil-card">
        <h3>💧 Soil Moisture</h3>
        <h1>65%</h1>
        <p>Good moisture level</p>
        <div className="progress">
          <div style={{width:"65%"}}></div>
        </div>
      </div>

      <div className="soil-card">
        <h3>🧪 Soil pH</h3>
        <h1>6.8</h1>
        <p>Near neutral</p>
        <div className="progress">
          <div style={{width:"68%"}}></div>
        </div>
      </div>

      <div className="soil-card">
        <h3>🌡 Soil Temperature</h3>
        <h1>24°C</h1>
        <p>Illustrative reading</p>
      </div>

      <div className="soil-card">
        <h3>🌿 Soil Condition</h3>
        <h1>Good</h1>
        <p>Based on sample readings</p>
      </div>
    </div>

    <div className="soil-info">
      <h3>Soil Recommendations</h3>
      <ul>
        <li>Check soil moisture regularly.</li>
        <li>Maintain suitable irrigation.</li>
        <li>Test soil nutrients periodically.</li>
        <li>Use fertilizer according to soil test results.</li>
      </ul>
    </div>
  </section>
)}

{page === "Weather" && (
  <section className="weather-section">
    <div className="weather-heading">
      <div>
        <p className="weather-eyebrow">FARM CONDITIONS</p>
        <h2>Weather monitoring</h2>
        <p>{weatherLocation.label} · regional forecast</p>
      </div>
      <div className="weather-heading-actions">
        <span className="weather-sample-label">
          {weatherData ? "Live weather" : "Connecting to weather"}
        </span>
        <button
          className="weather-refresh-button"
          type="button"
          onClick={() => setWeatherRefreshToken(token => token + 1)}
          disabled={weatherLoading}
        >
          {weatherLoading ? "Updating..." : "Refresh"}
        </button>
      </div>
    </div>

    {weatherError && (
      <div className="weather-error" role="alert">
        <span>{weatherError}</span>
        {!weatherData && (
          <button
            type="button"
            onClick={() => setWeatherRefreshToken(token => token + 1)}
          >
            Try again
          </button>
        )}
      </div>
    )}

    {weatherLoading && !weatherData && (
      <p className="weather-loading" role="status">
        Loading live conditions for {weatherLocation.label}...
      </p>
    )}

    {weatherData && (
      <>
        <div className="weather-current">
          <div className="weather-current-main">
            <span className="weather-current-icon" aria-hidden="true">
              {weatherData.condition.icon}
            </span>
            <div>
              <p>Current conditions</p>
              <h3>{weatherData.temperature}°C</h3>
              <span>{weatherData.condition.condition}</span>
            </div>
          </div>
          <div className="weather-stats">
            <div className="weather-stat">
              <span>Humidity</span>
              <strong>{weatherData.humidity}%</strong>
            </div>
            <div className="weather-stat">
              <span>Wind</span>
              <strong>{weatherData.windSpeed} km/h</strong>
            </div>
            <div className="weather-stat">
              <span>Chance of rain</span>
              <strong>
                {typeof weatherData.rainChance === "number"
                  ? `${weatherData.rainChance}%`
                  : "Unavailable"}
              </strong>
            </div>
            <div className="weather-stat">
              <span>UV index</span>
              <strong>
                {typeof weatherData.uvIndex === "number"
                  ? Math.round(weatherData.uvIndex)
                  : "Unavailable"}
              </strong>
            </div>
          </div>
        </div>

        <div className="weather-forecast">
          <div className="weather-forecast-heading">
            <h3>5-day outlook</h3>
            <span>Live forecast</span>
          </div>
          <div className="weather-forecast-grid">
            {weatherData.forecast.map((forecast, index) => (
              <article className="weather-day" key={`${forecast.day}-${index}`}>
                <h4>{forecast.day}</h4>
                <span className="weather-day-icon" aria-hidden="true">
                  {forecast.icon}
                </span>
                <p>{forecast.condition}</p>
                <strong>
                  {typeof forecast.high === "number"
                    ? `${Math.round(forecast.high)}°`
                    : "—"}
                </strong>
                <span className="weather-low">
                  {typeof forecast.low === "number"
                    ? `${Math.round(forecast.low)}°`
                    : "—"}
                </span>
              </article>
            ))}
          </div>
          <p className="weather-note">
            Weather data from Open-Meteo · Regional estimate for Tamil Nadu.
            {weatherUpdated && ` Last updated ${weatherUpdated.replace("T", " ")}.`}
            {" "}Automatically refreshes every 15 minutes.
          </p>
        </div>
      </>
    )}
  </section>
)}

{page === "Irrigation" && (
  <section className="irrigation-section">
    <div className="irrigation-heading">
      <p className="irrigation-eyebrow">WATER MANAGEMENT</p>
      <h2>When should you irrigate?</h2>
      <p>
        Use your field readings and expected rain to decide whether crops need water.
      </p>
    </div>

    <div className="irrigation-layout">
      <article className="irrigation-panel irrigation-inputs">
        <h3>Field readings</h3>

        <label htmlFor="irrigation-crop">Crop</label>
        <select
          id="irrigation-crop"
          value={selectedCropName}
          onChange={event => setSelectedCrop(event.target.value)}
          disabled={crops.length === 0}
        >
          {crops.length === 0 ? (
            <option value="">No crops added</option>
          ) : (
            crops.map(crop => (
              <option key={crop.id} value={crop.name}>
                {crop.name}{crop.status === "Growing" ? "" : ` (${crop.status})`}
              </option>
            ))
          )}
        </select>

        <div className="irrigation-control">
          <label htmlFor="soil-moisture">
            Soil moisture <output htmlFor="soil-moisture">{soilMoisture}%</output>
          </label>
          <input
            id="soil-moisture"
            type="range"
            min="0"
            max="100"
            value={soilMoisture}
            onChange={event => setSoilMoisture(Number(event.target.value))}
          />
          <div className="irrigation-range-labels">
            <span>Dry</span>
            <span>Moist</span>
          </div>
        </div>

        <div className="irrigation-control">
          <label htmlFor="rain-chance">
            Chance of rain in next 24 hours
            <output htmlFor="rain-chance">{rainChance}%</output>
          </label>
          <input
            id="rain-chance"
            type="range"
            min="0"
            max="100"
            value={rainChance}
            onChange={event => setRainChance(Number(event.target.value))}
          />
          <div className="irrigation-range-labels">
            <span>Unlikely</span>
            <span>Likely</span>
          </div>
        </div>

        <p className="irrigation-input-note">
          Enter readings from your soil sensor and local forecast. Values are not
          connected to live sensors.
        </p>
      </article>

      <article
        className={`irrigation-panel irrigation-advice irrigation-advice-${irrigationRecommendation.tone}`}
        aria-live="polite"
      >
        <p className="irrigation-eyebrow">RECOMMENDATION FOR {selectedCropName || "YOUR FIELD"}</p>
        <span className="irrigation-priority">{irrigationRecommendation.priority}</span>
        <h3>{irrigationRecommendation.title}</h3>
        <p>{irrigationRecommendation.detail}</p>
        <div className="irrigation-reading-summary">
          <span>Moisture <strong>{soilMoisture}%</strong></span>
          <span>Rain chance <strong>{rainChance}%</strong></span>
        </div>
      </article>
    </div>

    <p className="irrigation-disclaimer">
      This is a general demo guide, not an automatic watering system. Moisture
      thresholds vary by crop, soil, sensor, and growth stage; calibrate readings
      and follow local agronomy guidance.
    </p>
  </section>
)}

{page === "Fertilizer Planner" && (
  <section className="fertilizer-page">
    <div className="fertilizer-heading">
      <div>
        <p className="fertilizer-eyebrow">CROP NUTRIENT MANAGEMENT</p>
        <h2>Fertilizer planner</h2>
        <p>Record a soil-test-based application plan and track its progress.</p>
      </div>
      <span className="fertilizer-plan-count">
        {fertilizerPlans.length} {fertilizerPlans.length === 1 ? "plan" : "plans"}
      </span>
    </div>

    <div className="fertilizer-layout">
      <form className="fertilizer-form" onSubmit={saveFertilizerPlan}>
        <h3>Create an application plan</h3>

        <label htmlFor="fertilizer-crop">Crop</label>
        <select
          id="fertilizer-crop"
          value={fertilizerCropName}
          onChange={event => setFertilizerCrop(event.target.value)}
          disabled={fertilizerCrops.length === 0}
          required
        >
          {fertilizerCrops.length === 0 ? (
            <option value="">No active crops available</option>
          ) : (
            fertilizerCrops.map(crop => (
              <option key={crop.id} value={crop.name}>
                {crop.name} · {crop.area}
              </option>
            ))
          )}
        </select>

        <fieldset className="fertilizer-soil-test">
          <legend>Soil-test nutrient status</legend>
          {[
            {
              id: "fertilizer-n",
              label: "Nitrogen (N)",
              value: nitrogenStatus,
              onChange: setNitrogenStatus,
            },
            {
              id: "fertilizer-p",
              label: "Phosphorus (P)",
              value: phosphorusStatus,
              onChange: setPhosphorusStatus,
            },
            {
              id: "fertilizer-k",
              label: "Potassium (K)",
              value: potassiumStatus,
              onChange: setPotassiumStatus,
            },
          ].map(nutrient => (
            <label key={nutrient.id} htmlFor={nutrient.id}>
              {nutrient.label}
              <select
                id={nutrient.id}
                value={nutrient.value}
                onChange={event => nutrient.onChange(event.target.value)}
                required
              >
                <option value="">Select status</option>
                <option value="Low">Low</option>
                <option value="Adequate">Adequate</option>
                <option value="High">High</option>
              </select>
            </label>
          ))}
        </fieldset>

        <label htmlFor="fertilizer-product">Fertilizer product</label>
        <select
          id="fertilizer-product"
          value={fertilizerProduct}
          onChange={event => setFertilizerProduct(event.target.value)}
          required
        >
          <option value="">Choose a product</option>
          <option>Compost</option>
          <option>Organic manure</option>
          <option>Urea</option>
          <option>DAP</option>
          <option>NPK blend</option>
          <option>Other / local recommendation</option>
        </select>

        <div className="fertilizer-form-row">
          <div>
            <label htmlFor="fertilizer-rate">Planned rate (kg/acre)</label>
            <input
              id="fertilizer-rate"
              type="number"
              min="0.1"
              step="0.1"
              value={fertilizerRate}
              onChange={event => setFertilizerRate(event.target.value)}
              placeholder="Use your advised rate"
              required
            />
          </div>
          <div>
            <label htmlFor="fertilizer-date">Application date</label>
            <input
              id="fertilizer-date"
              type="date"
              value={fertilizerDate}
              onChange={event => setFertilizerDate(event.target.value)}
              required
            />
          </div>
        </div>

        {fertilizerError && (
          <p className="fertilizer-error" role="alert">{fertilizerError}</p>
        )}
        <button type="submit">Add to fertilizer plan</button>
      </form>

      <aside className="fertilizer-guidance">
        <p className="fertilizer-eyebrow">PLANNING STEPS</p>
        <h3>Use your soil test first</h3>
        <ol>
          <li>Select the crop and review its soil-test N-P-K status.</li>
          <li>Enter the product and rate recommended for your field.</li>
          <li>Choose an application date and track it as planned or applied.</li>
        </ol>
        <p>
          This planner does not calculate fertilizer doses. Follow soil-test
          results, product labels, and local agricultural guidance.
        </p>
      </aside>
    </div>

    <div className="fertilizer-schedule">
      <div className="fertilizer-schedule-heading">
        <div>
          <h3>Application schedule</h3>
          <p>Plans are stored for this page session only.</p>
        </div>
      </div>

      {fertilizerPlans.length === 0 ? (
        <p className="fertilizer-empty">
          No fertilizer plans yet. Complete the form to add your first application.
        </p>
      ) : (
        <div className="fertilizer-table-wrapper">
          <table className="fertilizer-table">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Product</th>
                <th>Soil test (N/P/K)</th>
                <th>Rate</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {fertilizerPlans.map(plan => (
                <tr key={plan.id}>
                  <td>{plan.crop}<small>{plan.area}</small></td>
                  <td>{plan.product}</td>
                  <td>{plan.nitrogen} / {plan.phosphorus} / {plan.potassium}</td>
                  <td>{plan.rate} kg/acre</td>
                  <td>{plan.date}</td>
                  <td>
                    <span className={`fertilizer-status fertilizer-status-${plan.status.toLowerCase()}`}>
                      {plan.status}
                    </span>
                  </td>
                  <td>
                    {plan.status === "Planned" ? (
                      <button
                        className="fertilizer-applied-button"
                        type="button"
                        onClick={() => markFertilizerApplied(plan.id)}
                      >
                        Mark applied
                      </button>
                    ) : (
                      <span className="fertilizer-complete">Complete</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </section>
)}

{role === "admin" && page === "Farmers" && (
  <section className="admin-page">
    <div className="admin-page-heading">
      <div>
        <p className="admin-eyebrow">ADMINISTRATION</p>
        <h2>Farmers</h2>
        <p>Browse farmer profiles, farm sizes, and registered crop activity.</p>
      </div>
      <span className="admin-count">
        Showing {filteredFarmers.length} of {sampleFarmers.length} sample profiles
      </span>
    </div>

    <div className="admin-table-wrapper">
      <div className="farmer-filters">
        <label>
          <span>Search farmers</span>
          <input
            type="search"
            value={farmerSearch}
            onChange={event => setFarmerSearch(event.target.value)}
            placeholder="Search name, ID, district, or crop"
          />
        </label>
        <label>
          <span>Profile status</span>
          <select
            value={farmerStatusFilter}
            onChange={event => setFarmerStatusFilter(event.target.value)}
          >
            <option>All</option>
            <option>Active</option>
            <option>Pending</option>
          </select>
        </label>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Farmer ID</th>
            <th>Farmer</th>
            <th>District</th>
            <th>Farm area</th>
            <th>Main crops</th>
            <th>Crop records</th>
            <th>Profile status</th>
          </tr>
        </thead>
        <tbody>
          {filteredFarmers.map(farmer => (
            <tr key={farmer.id}>
              <td>{farmer.id}</td>
              <td>{farmer.name}</td>
              <td>{farmer.location}</td>
              <td>{farmer.farmArea}</td>
              <td>{farmer.mainCrops}</td>
              <td>{farmer.crops}</td>
              <td>
                <span className={`admin-status admin-status-${farmer.status.toLowerCase()}`}>
                  {farmer.status}
                </span>
              </td>
            </tr>
          ))}
          {filteredFarmers.length === 0 && (
            <tr>
              <td className="farmer-empty" colSpan="7">
                No farmers match the selected search and status.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <p className="admin-note">
        All farmer profiles are illustrative sample data. Replace them with registered farmer records when connected to your backend.
      </p>
    </div>
  </section>
)}

{role === "admin" && page === "Reports" && (
  <section className="admin-page">
    <div className="admin-page-heading">
      <div>
        <p className="admin-eyebrow">PROGRAM OVERVIEW</p>
        <h2>Reports</h2>
        <p>Crop activity summary based on the records in this session.</p>
      </div>
      <span className="admin-count">{crops.length} crop records</span>
    </div>

    <div className="report-summary">
      <article className="report-card">
        <span>Total crops</span>
        <strong>{crops.length}</strong>
      </article>
      <article className="report-card">
        <span>Growing</span>
        <strong>{growingCropCount}</strong>
      </article>
      <article className="report-card">
        <span>Harvested</span>
        <strong>{harvestedCropCount}</strong>
      </article>
      <article className="report-card">
        <span>Planned</span>
        <strong>{plannedCropCount}</strong>
      </article>
    </div>

    <div className="report-content">
      <article className="report-panel">
        <h3>Crop status breakdown</h3>
        {[
          { label: "Growing", count: growingCropCount, tone: "growing" },
          { label: "Harvested", count: harvestedCropCount, tone: "harvested" },
          { label: "Planned", count: plannedCropCount, tone: "planned" },
        ].map(status => (
          <div className="report-status-row" key={status.label}>
            <div className="report-status-label">
              <span>{status.label}</span>
              <strong>{status.count}</strong>
            </div>
            <div
              className="report-track"
              role="progressbar"
              aria-label={`${status.label} crops`}
              aria-valuenow={status.count}
              aria-valuemin="0"
              aria-valuemax={crops.length || 1}
            >
              <span
                className={`report-fill report-fill-${status.tone}`}
                style={{
                  width: `${crops.length ? (status.count / crops.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        ))}
      </article>

      <article className="report-panel">
        <h3>Farmer activity</h3>
        <div className="report-farmer-stat">
          <span>Registered sample profiles</span>
          <strong>{sampleFarmers.length}</strong>
        </div>
        <div className="report-farmer-stat">
          <span>Active profiles</span>
          <strong>{sampleFarmers.filter(farmer => farmer.status === "Active").length}</strong>
        </div>
        <div className="report-farmer-stat">
          <span>Profiles pending review</span>
          <strong>{sampleFarmers.filter(farmer => farmer.status === "Pending").length}</strong>
        </div>
        <p className="admin-note">
          Farmer counts are sample data; crop totals update as records change.
        </p>
      </article>
    </div>
  </section>
)}

{role === "admin" && page === "Settings" && (
  <section className="admin-page">
    <div className="admin-page-heading">
      <div>
        <p className="admin-eyebrow">PREFERENCES</p>
        <h2>Settings</h2>
        <p>Manage the basic preferences for this demo workspace.</p>
      </div>
    </div>

    <form
      className="admin-settings"
      onSubmit={saveSettings}
      onChange={() => setSettingsSaved(false)}
    >
      <div className="admin-settings-section">
        <h3>Farm profile</h3>
        <label htmlFor="admin-farm-name">Organization name</label>
        <input
          id="admin-farm-name"
          value={farmSettings.farmName}
          onChange={event => setFarmSettings({
            ...farmSettings,
            farmName: event.target.value,
          })}
          required
        />
      </div>

      <div className="admin-settings-section">
        <h3>Notifications</h3>
        <label className="admin-toggle">
          <span>
            <strong>Email updates</strong>
            <small>Receive general farm and crop updates.</small>
          </span>
          <input
            type="checkbox"
            checked={farmSettings.emailAlerts}
            onChange={event => setFarmSettings({
              ...farmSettings,
              emailAlerts: event.target.checked,
            })}
          />
        </label>
        <label className="admin-toggle">
          <span>
            <strong>Soil moisture alerts</strong>
            <small>Show a reminder when moisture readings need attention.</small>
          </span>
          <input
            type="checkbox"
            checked={farmSettings.moistureAlerts}
            onChange={event => setFarmSettings({
              ...farmSettings,
              moistureAlerts: event.target.checked,
            })}
          />
        </label>
      </div>

      <div className="admin-settings-section admin-language-setting">
        <label htmlFor="admin-language">Display language</label>
        <select
          id="admin-language"
          value={farmSettings.language}
          onChange={event => setFarmSettings({
            ...farmSettings,
            language: event.target.value,
          })}
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Spanish</option>
        </select>
      </div>

      <div className="admin-settings-actions">
        <button type="submit">Save settings</button>
        {settingsSaved && <p role="status">Settings saved for this session.</p>}
      </div>
      <p className="admin-note">
        Preferences are kept in the current page session and are not connected to a server.
      </p>
    </form>
  </section>
)}

<FarmerTools page={page} crops={crops} username={username} onNavigate={setPage} />
<AdminTools
  page={page}
  crops={crops}
  farmers={sampleFarmers}
  weatherData={weatherData}
  weatherLoading={weatherLoading}
  weatherError={weatherError}
  weatherUpdated={weatherUpdated}
  weatherLocation={weatherLocation}
  onRefreshWeather={() => setWeatherRefreshToken(token => token + 1)}
/>

{page !== "Dashboard" &&
 page !== "Crop Management" &&
 page !== "My Crops" &&
 page !== "Soil Monitoring" &&
 page !== "Weather" &&
 page !== "Irrigation" &&
 page !== "Fertilizer Planner" &&
 page !== "Farmers" &&
 page !== "Reports" &&
 page !== "Settings" &&
 !farmerToolPages.includes(page) &&
 !adminToolPages.includes(page) && (
  <section className="content-panel">
    <h2>{page}</h2>
    <p>This module will be developed next.</p>
  </section>
)}
      </main>
    </div>
  );
}

export default App;