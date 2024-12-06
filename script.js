const API_URL = "https://api.csdi.gov.hk/apim/dataquery/api/?id=edb_rcd_1629267205213_58940&layer=asfps&limit=10&offset=0";

document.getElementById("search-btn").addEventListener("click", fetchSchoolData);

function fetchSchoolData() {
  const searchInput = document.getElementById("search-input").value.trim().toLowerCase();

  fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(`API error: ${response.status} - ${text}`);
        });
      }
      return response.json();
    })
    .then((data) => {
      const features = data.features || [];
      const matchedSchools = features.filter((feature) => {
        const facilityName = feature.properties.Facility_Name?.toLowerCase() || "";
        return facilityName.includes(searchInput);
      });
      displaySchools(matchedSchools);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Failed to fetch school data. Please try again later.");
    });
}

function displaySchools(schools) {
  const schoolList = document.getElementById("school-list");
  schoolList.innerHTML = ""; // Clear previous results

  if (schools.length === 0) {
    schoolList.innerHTML = "<p>No schools found matching your search.</p>";
    return;
  }

  // Limit to show only the first 4 schools initially
  const initialDisplayLimit = 4;

  // Display the schools
  schools.forEach((school, index) => {
    const properties = school.properties;
    const schoolItem = document.createElement("div");
    schoolItem.className = "school-item";
    schoolItem.style.display = index < initialDisplayLimit ? "block" : "none"; // Hide items beyond the limit
    schoolItem.innerHTML = `
      <p class="school-name">${properties.Facility_Name || "School Name Not Available"}</p>
      <div><img src="img/map.png"></div>
      <div>${properties.Address || "Address Not Available"}</div>
      <div>
        <div class="lastupdate">Last Updated Date<br/>
            <div class="date">
            ${
                properties.Last_Updated_Date___最後更新日期 
                ? new Date(properties.Last_Updated_Date___最後更新日期)
                    .toISOString()
                    .split('T')[0] 
                : "N/A"
            }
            </div>
        </div>
      </div>  
      <div class="dataset">${properties.Dataset}</div>
    `;
    schoolList.appendChild(schoolItem);
  });

  // Add the "More" button if there are more than 4 schools
  if (schools.length > initialDisplayLimit) {
    const moreButton = document.createElement("button");
    moreButton.id = "more-btn";
    moreButton.className = "more-btn";
    moreButton.textContent = "More";

    // Add click event to show hidden items
    moreButton.addEventListener("click", () => {
      const hiddenItems = document.querySelectorAll(".school-item");
      hiddenItems.forEach((item, index) => {
        if (index >= initialDisplayLimit) {
          item.style.display = "block"; // Show hidden items
        }
      });
      moreButton.style.display = "none"; // Hide the "More" button after it's clicked
    });

    schoolList.appendChild(moreButton);
  }
}

document.addEventListener('DOMContentLoaded', function() {
    const customSelect = document.querySelector('.custom-select');
    const selectButton = customSelect.querySelector('.select-button');
    const selectedOption = customSelect.querySelector('.selected-option');
    const options = customSelect.querySelectorAll('.option');
  
    selectButton.addEventListener('click', function() {
      customSelect.classList.toggle('active');
    });
  
    options.forEach(option => {
      option.addEventListener('click', function() {
        const img = this.querySelector('img').cloneNode(true);
        const text = this.textContent.trim();
        
        selectedOption.innerHTML = '';
        selectedOption.appendChild(img);
        selectedOption.appendChild(document.createTextNode(text));
        
        customSelect.classList.remove('active');
      });
    });
  
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!customSelect.contains(e.target)) {
        customSelect.classList.remove('active');
      }
    });
  });

  document.getElementById("hamburger-menu").addEventListener("click", function () {
    const navLinks = document.getElementById("nav-links");
    navLinks.classList.toggle("active");
  
    // Optional: Animate hamburger icon to 'X' shape
    this.classList.toggle("open");
  });
  