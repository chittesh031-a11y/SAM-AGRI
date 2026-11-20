import { useEffect, useState } from "react";
import "./FarmerTools.css";

const symptomOptions = [
  "Leaf spots",
  "Yellowing",
  "Wilting",
  "Chewed leaves",
  "Unusual growth",
];

const samplePrices = [
  { crop: "Rice", market: "Sample local market", price: "₹2,100", unit: "per quintal" },
  { crop: "Maize", market: "Sample local market", price: "₹2,250", unit: "per quintal" },
  { crop: "Tomato", market: "Sample local market", price: "₹1,800", unit: "per quintal" },
  { crop: "Cotton", market: "Sample local market", price: "₹7,100", unit: "per quintal" },
];

const products = [
  { id: "seed-rice", name: "Rice seeds", category: "Seeds", detail: "Paddy seed pack · sample listing", price: "₹650 / pack", icon: "🌾" },
  { id: "seed-maize", name: "Maize seeds", category: "Seeds", detail: "Field crop seed pack · sample listing", price: "₹520 / pack", icon: "🌽" },
  { id: "seed-wheat", name: "Wheat seeds", category: "Seeds", detail: "Cereal seed pack · sample listing", price: "₹480 / pack", icon: "🌾" },
  { id: "seed-millet", name: "Millet seeds", category: "Seeds", detail: "Small-grain seed pack · sample listing", price: "₹360 / pack", icon: "🌿" },
  { id: "seed-groundnut", name: "Groundnut seeds", category: "Seeds", detail: "Oilseed pack · sample listing", price: "₹740 / pack", icon: "🥜" },
  { id: "seed-cotton", name: "Cotton seeds", category: "Seeds", detail: "Cotton seed pack · sample listing", price: "₹850 / pack", icon: "☁️" },
  { id: "seed-tomato", name: "Tomato seeds", category: "Seeds", detail: "Vegetable seed pack · sample listing", price: "₹180 / pack", icon: "🍅" },
  { id: "seed-onion", name: "Onion seeds", category: "Seeds", detail: "Vegetable seed pack · sample listing", price: "₹220 / pack", icon: "🧅" },
  { id: "seed-chilli", name: "Chilli seeds", category: "Seeds", detail: "Vegetable seed pack · sample listing", price: "₹240 / pack", icon: "🌶️" },
  { id: "seed-okra", name: "Okra seeds", category: "Seeds", detail: "Vegetable seed pack · sample listing", price: "₹160 / pack", icon: "🌱" },
  { id: "compost", name: "Compost", category: "Soil care", detail: "Soil amendment · sample listing", price: "₹320 / bag", icon: "🌱" },
  { id: "neem-cake", name: "Neem cake", category: "Soil care", detail: "Soil input · sample listing", price: "₹450 / bag", icon: "🍃" },
  { id: "soil-test-kit", name: "Soil test kit", category: "Soil care", detail: "Basic field test kit · sample listing", price: "₹390 / kit", icon: "🧪" },
  { id: "npk-blend", name: "NPK blend", category: "Soil care", detail: "Product composition varies · check label", price: "₹680 / bag", icon: "🪴" },
  { id: "drip-kit", name: "Drip starter kit", category: "Equipment", detail: "Small-field irrigation kit · sample listing", price: "₹1,250 / kit", icon: "💧" },
  { id: "sprinkler", name: "Garden sprinkler", category: "Equipment", detail: "Irrigation accessory · sample listing", price: "₹540 / unit", icon: "🚿" },
  { id: "watering-can", name: "Watering can", category: "Equipment", detail: "Hand watering tool · sample listing", price: "₹280 / unit", icon: "🪣" },
  { id: "hand-cultivator", name: "Hand cultivator", category: "Equipment", detail: "Field hand tool · sample listing", price: "₹350 / unit", icon: "🛠️" },
  { id: "work-gloves", name: "Farm work gloves", category: "Field supplies", detail: "General-purpose gloves · sample listing", price: "₹190 / pair", icon: "🧤" },
  { id: "seedling-tray", name: "Seedling tray", category: "Field supplies", detail: "Reusable nursery tray · sample listing", price: "₹130 / tray", icon: "🌱" },
];

const farmingTips = [
  { category: "Soil", title: "Test before you amend", detail: "Use a recent soil test and follow local recommendations before applying nutrients or soil amendments." },
  { category: "Water", title: "Check moisture before watering", detail: "Inspect soil moisture near the root zone and consider the crop stage and upcoming rain before irrigating." },
  { category: "Crop care", title: "Scout fields regularly", detail: "Walk the field and compare affected plants with healthy ones. Record where symptoms first appear." },
  { category: "Planning", title: "Rotate crop families where practical", detail: "A locally suitable rotation can support soil health and help interrupt some pest cycles." },
  { category: "Crop care", title: "Keep tools clean", detail: "Remove soil and plant residue from tools between plots, especially after working with visibly affected plants." },
  { category: "Water", title: "Maintain irrigation lines", detail: "Check filters, emitters, and leaks regularly so water is distributed as intended." },
];

const initialEquipment = [
  { id: "tractor", name: "Compact tractor", kind: "Field preparation", condition: "Ready", service: "Routine check due next month" },
  { id: "pump", name: "Water pump", kind: "Irrigation", condition: "Ready", service: "Inspect before next irrigation" },
  { id: "sprayer", name: "Backpack sprayer", kind: "Crop care", condition: "Service due", service: "Check seals and nozzle" },
  { id: "drip", name: "Drip irrigation set", kind: "Water management", condition: "Ready", service: "Flush filters weekly" },
];

const initialCommunityPosts = [
  { id: 1, author: "Anitha · Coimbatore", topic: "Water saving", message: "What simple checks do you use to spot a blocked drip emitter early?" },
  { id: 2, author: "Ravi · Thanjavur", topic: "Crop planning", message: "I am comparing crop calendars before the next planting. Share what works in your area." },
];

const initialNotifications = [
  { id: 1, title: "Soil moisture reminder", detail: "Review your latest field reading before the next irrigation.", time: "Today", read: false },
  { id: 2, title: "Crop scouting reminder", detail: "Take a walk through the field and note any unusual leaf changes.", time: "Yesterday", read: false },
  { id: 3, title: "Farm calendar", detail: "Your sample soil-test reminder is coming up soon.", time: "This week", read: true },
];

function PageHeading({ eyebrow, title, description, trailing }) {
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

function Notice({ children, tone = "info" }) {
  return <div className={`farmer-tool-notice farmer-tool-notice--${tone}`}>{children}</div>;
}

function formatEventDate(value) {
  if (!value) return "Date not set";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" })
    .format(new Date(`${value}T12:00:00`));
}

function FarmerTools({ page, crops = [], username = "farmer", onNavigate }) {
  const today = new Date().toISOString().slice(0, 10);
  const cropOptions = crops.length ? crops.map(crop => crop.name) : ["Rice", "Maize", "Tomato"];
  const [calendarEvents, setCalendarEvents] = useState(() => [
    { id: 1, title: "Inspect irrigation lines", date: today, category: "Water", done: false },
    { id: 2, title: "Scout crop leaves", date: today, category: "Crop care", done: false },
  ]);
  const [calendarTitle, setCalendarTitle] = useState("");
  const [calendarDate, setCalendarDate] = useState(today);
  const [calendarCategory, setCalendarCategory] = useState("Crop care");
  const [equipment, setEquipment] = useState(initialEquipment);
  const [equipmentFilter, setEquipmentFilter] = useState("All");
  const [scannerImage, setScannerImage] = useState(null);
  const [scannerCrop, setScannerCrop] = useState(cropOptions[0] || "Rice");
  const [scannerNotes, setScannerNotes] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [scannerMessage, setScannerMessage] = useState("");
  const [observations, setObservations] = useState([]);
  const [selectedTipCategory, setSelectedTipCategory] = useState("All");
  const [cart, setCart] = useState({});
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("All");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [communityPosts, setCommunityPosts] = useState(initialCommunityPosts);
  const [communityMessage, setCommunityMessage] = useState("");
  const [communityTopic, setCommunityTopic] = useState("Crop planning");
  const [profile, setProfile] = useState({
    farmName: "Green Valley Farm",
    district: "Coimbatore",
    farmArea: "2.5",
    phone: "",
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [supportSent, setSupportSent] = useState(false);

  useEffect(() => {
    if (!scannerImage?.url) return undefined;
    return () => URL.revokeObjectURL(scannerImage.url);
  }, [scannerImage]);

  const growingCrops = crops.filter(crop => crop.status === "Growing");
  const plannedCrops = crops.filter(crop => crop.status === "Planned");
  const harvestedCrops = crops.filter(crop => crop.status === "Harvested");
  const areaTotal = crops.reduce((total, crop) => total + (Number.parseFloat(crop.area) || 0), 0);
  const unreadCount = notifications.filter(notification => !notification.read).length;
  const filteredEquipment = equipment.filter(item =>
    equipmentFilter === "All" || item.condition === equipmentFilter
  );
  const visibleTips = farmingTips.filter(tip =>
    selectedTipCategory === "All" || tip.category === selectedTipCategory
  );
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const productCategories = ["All", ...new Set(products.map(product => product.category))];
  const visibleProducts = products.filter(product => {
    const query = productSearch.trim().toLowerCase();
    const matchesSearch = `${product.name} ${product.category} ${product.detail}`.toLowerCase().includes(query);
    return matchesSearch &&
      (productCategoryFilter === "All" || product.category === productCategoryFilter);
  });

  const addCalendarEvent = event => {
    event.preventDefault();
    if (!calendarTitle.trim() || !calendarDate) return;
    setCalendarEvents([
      ...calendarEvents,
      {
        id: Date.now(),
        title: calendarTitle.trim(),
        date: calendarDate,
        category: calendarCategory,
        done: false,
      },
    ].sort((first, second) => first.date.localeCompare(second.date)));
    setCalendarTitle("");
  };

  const handleScannerImage = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setScannerMessage("Choose an image file to continue.");
      return;
    }
    setScannerMessage("");
    setScannerImage({ name: file.name, url: URL.createObjectURL(file) });
  };

  const saveObservation = event => {
    event.preventDefault();
    if (!scannerImage && !scannerNotes.trim() && selectedSymptoms.length === 0) {
      setScannerMessage("Add a photo, symptom, or note before saving.");
      return;
    }
    setObservations([
      {
        id: Date.now(),
        crop: scannerCrop,
        fileName: scannerImage?.name || "",
        symptoms: selectedSymptoms,
        notes: scannerNotes.trim(),
        date: new Date().toLocaleDateString(),
      },
      ...observations,
    ]);
    setScannerMessage("Observation saved. This demo does not diagnose the crop; ask a local agricultural expert to review it.");
    setScannerNotes("");
    setSelectedSymptoms([]);
  };

  const toggleSymptom = symptom => {
    setSelectedSymptoms(current => current.includes(symptom)
      ? current.filter(item => item !== symptom)
      : [...current, symptom]
    );
    setScannerMessage("");
  };

  const addCommunityPost = event => {
    event.preventDefault();
    if (!communityMessage.trim()) return;
    setCommunityPosts([
      {
        id: Date.now(),
        author: `${username} · Your farm`,
        topic: communityTopic,
        message: communityMessage.trim(),
      },
      ...communityPosts,
    ]);
    setCommunityMessage("");
  };

  if (page === "Pest & Disease Detection") {
    return (
      <section className="farmer-tool-page">
        <PageHeading
          eyebrow="CROP HEALTH"
          title="Pest & disease detection"
          description="Use a regular field check to spot changes early and record what you see."
        />
        <Notice>
          These are general scouting prompts, not a diagnosis. Confirm suspected pests or diseases with a local agricultural expert before treatment.
        </Notice>
        <div className="farmer-tool-card-grid">
          {[
            ["🍃", "Leaf changes", "Look for new spots, yellowing, curling, or unusual growth. Compare several plants."],
            ["🐛", "Pest activity", "Check leaf undersides and nearby stems for insects, eggs, or fresh feeding marks."],
            ["💧", "Wilting", "Check soil moisture and drainage as well as the plant before deciding what action to take."],
            ["📍", "Spread pattern", "Note whether symptoms are isolated, along an edge, or across multiple rows."],
          ].map(([icon, title, detail]) => (
            <article className="farmer-tool-card scouting-card" key={title}>
              <span className="farmer-tool-icon" aria-hidden="true">{icon}</span>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
        <div className="farmer-tool-panel">
          <div className="farmer-tool-panel-heading">
            <div>
              <p className="farmer-tool-eyebrow">NEXT STEP</p>
              <h3>Keep a clear field record</h3>
            </div>
            <button type="button" className="farmer-tool-button" onClick={() => onNavigate("Crop Disease Scanner")}>
              Open crop disease scanner
            </button>
          </div>
          <p>Save a crop, photo, location, and symptom notes so a qualified advisor can review the observation.</p>
        </div>
      </section>
    );
  }

  if (page === "Crop Disease Scanner") {
    return (
      <section className="farmer-tool-page">
        <PageHeading
          eyebrow="FIELD OBSERVATION"
          title="Crop disease scanner"
          description="Upload a crop photo and record visible symptoms for follow-up."
        />
        <Notice>
          Image analysis is not connected in this demo. The scanner stores your observations only; it does not identify a disease or recommend treatment.
        </Notice>
        <form className="farmer-tool-panel scanner-form" onSubmit={saveObservation}>
          <div className="scanner-fields">
            <label>
              Crop
              <select value={scannerCrop} onChange={event => setScannerCrop(event.target.value)}>
                {cropOptions.map(crop => <option key={crop}>{crop}</option>)}
              </select>
            </label>
            <label>
              Add a crop photo
              <input type="file" accept="image/*" onChange={handleScannerImage} />
            </label>
          </div>
          {scannerImage && (
            <div className="scanner-preview">
              <img src={scannerImage.url} alt={`Selected crop photo: ${scannerImage.name}`} />
              <span>{scannerImage.name}</span>
            </div>
          )}
          <fieldset className="symptom-picker">
            <legend>What do you notice?</legend>
            <div className="farmer-tool-chip-list">
              {symptomOptions.map(symptom => (
                <label className="farmer-tool-chip" key={symptom}>
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(symptom)}
                    onChange={() => toggleSymptom(symptom)}
                  />
                  {symptom}
                </label>
              ))}
            </div>
          </fieldset>
          <label>
            Field notes
            <textarea
              value={scannerNotes}
              onChange={event => setScannerNotes(event.target.value)}
              placeholder="When did you notice it? Which part of the field is affected?"
              rows="3"
            />
          </label>
          <button type="submit" className="farmer-tool-button">Save field observation</button>
          {scannerMessage && <p className="farmer-tool-status" role="status">{scannerMessage}</p>}
        </form>
        {observations.length > 0 && (
          <div className="farmer-tool-panel">
            <h3>Saved observations</h3>
            <div className="observation-list">
              {observations.map(observation => (
                <article className="observation-item" key={observation.id}>
                  <div>
                    <strong>{observation.crop}</strong>
                    <span>{observation.date}{observation.fileName ? ` · ${observation.fileName}` : ""}</span>
                  </div>
                  <p>{[...observation.symptoms, observation.notes].filter(Boolean).join(" · ") || "Photo recorded"}</p>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  }

  if (page === "Farm Calendar") {
    return (
      <section className="farmer-tool-page">
        <PageHeading
          eyebrow="PLAN THE SEASON"
          title="Farm calendar"
          description="Keep upcoming field tasks in one simple checklist."
          trailing={<span className="farmer-tool-count">{calendarEvents.filter(item => !item.done).length} upcoming</span>}
        />
        <form className="farmer-tool-panel calendar-form" onSubmit={addCalendarEvent}>
          <label>
            Task
            <input value={calendarTitle} onChange={event => setCalendarTitle(event.target.value)} placeholder="e.g. Check water pump" required />
          </label>
          <label>
            Date
            <input type="date" value={calendarDate} onChange={event => setCalendarDate(event.target.value)} required />
          </label>
          <label>
            Category
            <select value={calendarCategory} onChange={event => setCalendarCategory(event.target.value)}>
              <option>Crop care</option>
              <option>Water</option>
              <option>Soil</option>
              <option>Harvest</option>
              <option>Other</option>
            </select>
          </label>
          <button type="submit" className="farmer-tool-button">Add task</button>
        </form>
        <div className="farmer-tool-panel">
          <div className="farmer-tool-panel-heading">
            <h3>Field tasks</h3>
            <span className="farmer-tool-muted">Saved for this session</span>
          </div>
          {calendarEvents.length === 0 ? (
            <p className="farmer-tool-empty">No tasks yet. Add your first field reminder above.</p>
          ) : (
            <div className="calendar-list">
              {calendarEvents.map(item => (
                <label className={`calendar-item ${item.done ? "is-done" : ""}`} key={item.id}>
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => setCalendarEvents(calendarEvents.map(event =>
                      event.id === item.id ? { ...event, done: !event.done } : event
                    ))}
                  />
                  <span className="calendar-date">{formatEventDate(item.date)}</span>
                  <span className="calendar-task">
                    <strong>{item.title}</strong>
                    <small>{item.category}</small>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (page === "Farm Equipment") {
    return (
      <section className="farmer-tool-page">
        <PageHeading
          eyebrow="FARM ASSETS"
          title="Farm equipment"
          description="Review equipment availability and keep service reminders visible."
          trailing={<span className="farmer-tool-count">{equipment.length} items</span>}
        />
        <div className="farmer-tool-filter-row" aria-label="Filter equipment">
          {["All", "Ready", "Service due"].map(filter => (
            <button
              type="button"
              className={equipmentFilter === filter ? "farmer-tool-filter is-selected" : "farmer-tool-filter"}
              onClick={() => setEquipmentFilter(filter)}
              key={filter}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="equipment-grid">
          {filteredEquipment.map(item => (
            <article className="farmer-tool-card equipment-card" key={item.id}>
              <div className="farmer-tool-panel-heading">
                <span className="farmer-tool-icon" aria-hidden="true">🚜</span>
                <span className={`farmer-tool-badge ${item.condition === "Ready" ? "badge-good" : "badge-warn"}`}>{item.condition}</span>
              </div>
              <p className="farmer-tool-eyebrow">{item.kind}</p>
              <h3>{item.name}</h3>
              <p>{item.service}</p>
              <button
                type="button"
                className="farmer-tool-link-button"
                onClick={() => setEquipment(equipment.map(equipmentItem =>
                  equipmentItem.id === item.id
                    ? { ...equipmentItem, condition: equipmentItem.condition === "Ready" ? "Service due" : "Ready" }
                    : equipmentItem
                ))}
              >
                {item.condition === "Ready" ? "Flag for service" : "Mark ready"}
              </button>
            </article>
          ))}
        </div>
        <Notice>Equipment records and service actions are stored in this page session only.</Notice>
      </section>
    );
  }

  if (page === "Crop Growth Analytics") {
    const statusGroups = [
      { label: "Growing", crops: growingCrops, tone: "green" },
      { label: "Planned", crops: plannedCrops, tone: "gold" },
      { label: "Harvested", crops: harvestedCrops, tone: "blue" },
    ];
    const total = crops.length;

    return (
      <section className="farmer-tool-page">
        <PageHeading
          eyebrow="CROP OVERVIEW"
          title="Crop growth analytics"
          description="A quick view of your recorded crop portfolio and its current status."
        />
        <div className="analytics-summary">
          <article className="farmer-tool-card"><span>Crop records</span><strong>{total}</strong></article>
          <article className="farmer-tool-card"><span>Growing now</span><strong>{growingCrops.length}</strong></article>
          <article className="farmer-tool-card"><span>Recorded area</span><strong>{areaTotal.toFixed(1)} <small>acres</small></strong></article>
        </div>
        <div className="farmer-tool-panel analytics-panel">
          <div className="farmer-tool-panel-heading">
            <h3>Crop status distribution</h3>
            <span className="farmer-tool-muted">Based on your crop records</span>
          </div>
          {statusGroups.map(group => (
            <div className="analytics-row" key={group.label}>
              <div className="analytics-row-label"><span>{group.label}</span><strong>{group.crops.length}</strong></div>
              <div className="analytics-track">
                <span className={`analytics-fill fill-${group.tone}`} style={{ width: `${total ? group.crops.length / total * 100 : 0}%` }} />
              </div>
              <div className="analytics-crop-names">
                {group.crops.length ? group.crops.map(crop => crop.name).join(", ") : "No crop records"}
              </div>
            </div>
          ))}
        </div>
        <Notice>These summaries use crop status and area entered in the app; they are not sensor-based growth measurements or yield predictions.</Notice>
      </section>
    );
  }

  if (page === "Market Prices") {
    return (
      <section className="farmer-tool-page">
        <PageHeading
          eyebrow="SELLING REFERENCE"
          title="Market prices"
          description="Compare sample crop references before checking your nearby market."
          trailing={<span className="farmer-tool-badge badge-warn">Demo data · not live</span>}
        />
        <Notice tone="warning">
          Prices below are illustrative sample values, not current mandi quotes. Confirm today's rate, quality grade, and fees with your local market before making a selling decision.
        </Notice>
        <div className="farmer-tool-panel table-panel">
          <div className="farmer-tool-panel-heading">
            <h3>Sample crop references</h3>
            <span className="farmer-tool-muted">Example values only</span>
          </div>
          <div className="farmer-tool-table-wrap">
            <table className="farmer-tool-table">
              <thead><tr><th>Crop</th><th>Market</th><th>Sample reference</th><th>Unit</th></tr></thead>
              <tbody>
                {samplePrices.map(row => (
                  <tr key={row.crop}>
                    <td><strong>{row.crop}</strong></td>
                    <td>{row.market}</td>
                    <td className="market-price">{row.price}</td>
                    <td>{row.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  if (page === "Buy Seeds & Products") {
    return (
      <section className="farmer-tool-page">
        <PageHeading
          eyebrow="FARM SHOP"
          title="Buy seeds & products"
          description="Browse seed, soil-care, and field supply listings."
          trailing={<span className="farmer-tool-count">Basket · {cartCount}</span>}
        />
        <Notice>Sample listings only. This demo does not process orders or payments; confirm product suitability and seller details before buying.</Notice>
        <div className="product-browse-tools">
          <label className="product-search">
            Search products
            <span className="product-search-controls">
              <input
                type="search"
                value={productSearch}
                onChange={event => setProductSearch(event.target.value)}
                placeholder="Search seeds, soil care, equipment..."
              />
              <button
                type="button"
                className="product-search-clear"
                onClick={() => setProductSearch("")}
                disabled={!productSearch}
              >
                Clear
              </button>
            </span>
          </label>
          <div className="farmer-tool-filter-row" aria-label="Filter products by category">
            {productCategories.map(category => (
              <button
                type="button"
                className={productCategoryFilter === category ? "farmer-tool-filter is-selected" : "farmer-tool-filter"}
                onClick={() => setProductCategoryFilter(category)}
                key={category}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="farmer-tool-muted">Showing {visibleProducts.length} of {products.length} sample listings</p>
        </div>
        <div className="product-grid">
          {visibleProducts.map(product => (
            <article className="farmer-tool-card product-card" key={product.id}>
              <span className="farmer-tool-icon" aria-hidden="true">{product.icon}</span>
              <p className="farmer-tool-eyebrow">{product.category}</p>
              <h3>{product.name}</h3>
              <p>{product.detail}</p>
              <div className="product-card-footer">
                <strong>{product.price}</strong>
                <button
                  type="button"
                  className="farmer-tool-button"
                  onClick={() => setCart({ ...cart, [product.id]: (cart[product.id] || 0) + 1 })}
                >
                  Add to basket
                </button>
              </div>
              {cart[product.id] > 0 && <span className="product-quantity">In basket: {cart[product.id]}</span>}
            </article>
          ))}
          {visibleProducts.length === 0 && (
            <p className="product-empty">No products match your search. Try another name or category.</p>
          )}
        </div>
      </section>
    );
  }

  if (page === "Farming Tips") {
    const tipCategories = ["All", ...new Set(farmingTips.map(tip => tip.category))];
    return (
      <section className="farmer-tool-page">
        <PageHeading
          eyebrow="PRACTICAL GUIDANCE"
          title="Farming tips"
          description="Short reminders for field scouting, water planning, and seasonal preparation."
        />
        <div className="farmer-tool-filter-row" aria-label="Filter farming tips">
          {tipCategories.map(category => (
            <button
              type="button"
              className={selectedTipCategory === category ? "farmer-tool-filter is-selected" : "farmer-tool-filter"}
              onClick={() => setSelectedTipCategory(category)}
              key={category}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="farmer-tool-card-grid">
          {visibleTips.map(tip => (
            <article className="farmer-tool-card tip-card" key={tip.title}>
              <span className="farmer-tool-badge">{tip.category}</span>
              <h3>{tip.title}</h3>
              <p>{tip.detail}</p>
            </article>
          ))}
        </div>
        <Notice>Crop, soil, and pest advice can vary by region and season. Ask your local extension service for recommendations specific to your field.</Notice>
      </section>
    );
  }

  if (page === "Notifications") {
    return (
      <section className="farmer-tool-page">
        <PageHeading
          eyebrow="UPDATES"
          title="Notifications"
          description="Review reminders and keep track of what still needs attention."
          trailing={<span className="farmer-tool-count">{unreadCount} unread</span>}
        />
        <div className="farmer-tool-panel">
          <div className="farmer-tool-panel-heading">
            <h3>Recent reminders</h3>
            <button
              type="button"
              className="farmer-tool-link-button"
              onClick={() => setNotifications(notifications.map(item => ({ ...item, read: true })))}
              disabled={unreadCount === 0}
            >
              Mark all read
            </button>
          </div>
          <div className="notification-list">
            {notifications.map(item => (
              <article className={`notification-item ${item.read ? "is-read" : ""}`} key={item.id}>
                <span className="notification-dot" aria-hidden="true" />
                <div>
                  <div className="notification-title-row"><h3>{item.title}</h3><span>{item.time}</span></div>
                  <p>{item.detail}</p>
                </div>
                {!item.read && (
                  <button
                    type="button"
                    className="farmer-tool-link-button"
                    onClick={() => setNotifications(notifications.map(notification =>
                      notification.id === item.id ? { ...notification, read: true } : notification
                    ))}
                  >
                    Mark read
                  </button>
                )}
              </article>
            ))}
          </div>
        </div>
        <Notice>These are sample reminders. Live device and weather notifications are not connected in this demo.</Notice>
      </section>
    );
  }

  if (page === "Farmer Community") {
    return (
      <section className="farmer-tool-page">
        <PageHeading
          eyebrow="LEARN TOGETHER"
          title="Farmer community"
          description="Share a question or field practice with other farmers."
        />
        <Notice>Community posts are visible only in this browser session; this demo does not publish them online.</Notice>
        <form className="farmer-tool-panel community-form" onSubmit={addCommunityPost}>
          <label>
            Topic
            <select value={communityTopic} onChange={event => setCommunityTopic(event.target.value)}>
              <option>Crop planning</option>
              <option>Water saving</option>
              <option>Soil health</option>
              <option>Equipment</option>
              <option>General question</option>
            </select>
          </label>
          <label>
            Your post
            <textarea
              value={communityMessage}
              onChange={event => setCommunityMessage(event.target.value)}
              placeholder="Share a useful tip or ask a question..."
              maxLength={500}
              rows="3"
              required
            />
          </label>
          <div className="farmer-tool-form-footer">
            <span>{communityMessage.length}/500</span>
            <button type="submit" className="farmer-tool-button">Share post</button>
          </div>
        </form>
        <div className="community-post-list">
          {communityPosts.map(post => (
            <article className="farmer-tool-panel community-post" key={post.id}>
              <div className="community-post-meta"><strong>{post.author}</strong><span>{post.topic}</span></div>
              <p>{post.message}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (page === "My Profile") {
    return (
      <section className="farmer-tool-page">
        <PageHeading
          eyebrow="YOUR ACCOUNT"
          title="My profile"
          description="Manage the farm details shown in this demo workspace."
        />
        <form
          className="farmer-tool-panel profile-form"
          onSubmit={event => {
            event.preventDefault();
            setProfileSaved(true);
          }}
          onChange={() => setProfileSaved(false)}
        >
          <div className="profile-identity">
            <span className="profile-avatar" aria-hidden="true">{username.slice(0, 1).toUpperCase() || "F"}</span>
            <div><strong>{username}</strong><span>Farmer account</span></div>
          </div>
          <div className="profile-field-grid">
            <label>Farm name<input value={profile.farmName} onChange={event => setProfile({ ...profile, farmName: event.target.value })} required /></label>
            <label>District<input value={profile.district} onChange={event => setProfile({ ...profile, district: event.target.value })} required /></label>
            <label>Farm area (acres)<input type="number" min="0" step="0.1" value={profile.farmArea} onChange={event => setProfile({ ...profile, farmArea: event.target.value })} required /></label>
            <label>Phone (optional)<input type="tel" value={profile.phone} onChange={event => setProfile({ ...profile, phone: event.target.value })} placeholder="Add a contact number" /></label>
          </div>
          <div className="farmer-tool-form-footer">
            {profileSaved && <span className="farmer-tool-status" role="status">Profile saved for this session.</span>}
            <button type="submit" className="farmer-tool-button">Save profile</button>
          </div>
          <p className="farmer-tool-muted">Profile changes are not sent to a server.</p>
        </form>
      </section>
    );
  }

  if (page === "Help & Support") {
    return (
      <section className="farmer-tool-page">
        <PageHeading
          eyebrow="HELP CENTER"
          title="Help & support"
          description="Find quick answers about the SmartFarm demo."
        />
        <div className="help-layout">
          <div className="farmer-tool-panel help-faq">
            <h3>Frequently asked questions</h3>
            <details>
              <summary>Are my farm records saved?</summary>
              <p>Records and actions in this demo are held in page memory. They are not stored in an account or database.</p>
            </details>
            <details>
              <summary>Does the crop scanner diagnose disease?</summary>
              <p>No. It records a photo and your notes for follow-up; it does not analyze images or recommend treatment.</p>
            </details>
            <details>
              <summary>Are market prices live?</summary>
              <p>No. Prices on the Market Prices page are sample values. Check the latest quote with your local market.</p>
            </details>
            <details>
              <summary>Where can I get crop-specific advice?</summary>
              <p>Contact your local agricultural extension office or a qualified agronomist for recommendations suited to your crop and region.</p>
            </details>
          </div>
          <form
            className="farmer-tool-panel support-form"
            onSubmit={event => {
              event.preventDefault();
              setSupportSent(true);
              setSupportMessage("");
            }}
          >
            <h3>Send a demo support request</h3>
            <label>
              What do you need help with?
              <textarea value={supportMessage} onChange={event => {
                setSupportMessage(event.target.value);
                setSupportSent(false);
              }} rows="4" required />
            </label>
            <button type="submit" className="farmer-tool-button">Submit request</button>
            {supportSent && <p className="farmer-tool-status" role="status">Request recorded in this page session only; no message was sent.</p>}
          </form>
        </div>
      </section>
    );
  }

  return null;
}

export default FarmerTools;
