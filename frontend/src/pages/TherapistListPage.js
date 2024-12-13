import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TherapistListPage = () => {
  const [therapists, setTherapists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryGender, setSearchQueryGender] = useState(["Female", "Male", "Other"]);
  const [searchQueryGender2, setSearchQueryGender2] = useState(0);
  const [sortCriteria, setSortCriteria] = useState("specialty");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [therapistsPerPage, setTherapistsPerPage] = useState(1);
  const navigate = useNavigate();

  // Fetch therapists data
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await fetch("http://localhost:5000/getTherapists");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        const formattedTherapists = data.map((therapist) => ({
          id: therapist.userID,
          name: therapist.name,
          specialty: therapist.specializations.join(", ") || "No specialty provided",
          profilePic: therapist.profileImg !== null ? `/assets/profile-pics/${therapist.profileImg}` : '/assets/images/Mock_Profile_Picture.jpg',
          gender: therapist.gender || "Not specified",
          price: therapist.price ? `$${therapist.price}` : "Contact for pricing",
        }));
        setTherapists(formattedTherapists);
      } catch (error) {
        console.error("Failed to fetch therapists:", error);
      }
    };

    fetchTherapists();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const cardWidth = 220;
      const cardHeight = 325; // card height

      const containerWidth = window.innerWidth - 40;
      const containerHeight = window.innerHeight - 200;

      const cardsPerRow = Math.floor(containerWidth / (cardWidth + 20));
      const rowsPerPage = Math.floor(containerHeight / (cardHeight + 20));

      const newTherapistsPerPage = Math.max(cardsPerRow * rowsPerPage, 1);

      setTherapistsPerPage(newTherapistsPerPage);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSort = (criteria) => {
    setSortCriteria(criteria);
    const sortedTherapists = [...therapists].sort((a, b) => {
      if (criteria === "price") {
        const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, "")) || 0;
        const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, "")) || 0;
        return priceA - priceB;
      }
      if (a[criteria] < b[criteria]) {
        return -1;
      }
      if (a[criteria] > b[criteria]) return 1;
      return 0;
    });
    setTherapists(sortedTherapists);
  };

  const filteredTherapists = therapists.filter(
    (therapist) =>
      (therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) && sortCriteria === 'name' ||
        therapist.specialty.toLowerCase().includes(searchQuery.toLowerCase()) && sortCriteria === 'specialty' ||
        searchQueryGender.includes(therapist.gender) && sortCriteria === 'gender' ||
        therapist.price.replace(/[^0-9.-]+/g, "").includes(searchQuery.toLowerCase()) && sortCriteria === 'price') &&
      searchQueryGender.includes(therapist.gender) &&
      (!maxPrice || parseFloat(therapist.price.replace(/[^0-9.-]+/g, "")) <= parseFloat(maxPrice))
  );

  useEffect(() => {
    console.log(searchQueryGender);
    console.log(searchQueryGender2);
    let stringToUse = { 1: "Female", 2: "Male", 3: "Other" }[searchQueryGender2]

    if (searchQueryGender2 !== 0) {
      if (searchQueryGender.includes(stringToUse)) {
        setSearchQueryGender(searchQueryGender.filter(item => item !== stringToUse));
      } else {
        setSearchQueryGender([...searchQueryGender, stringToUse]);
      }
    }
    setSearchQueryGender2(0);
    console.log(searchQueryGender);
  }, [searchQueryGender2]);

  const indexOfLastTherapist = currentPage * therapistsPerPage;
  const indexOfFirstTherapist = indexOfLastTherapist - therapistsPerPage;
  const currentTherapists = filteredTherapists.slice(
    indexOfFirstTherapist,
    indexOfLastTherapist
  );

  const totalPages = Math.ceil(filteredTherapists.length / therapistsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const viewProfile = (id) => {
    navigate(`/therapistProfile/${id}`);
  };

  return (
    <div style={{ padding: 0, margin: 0, width: "100%" }}>
      <h1
        style={{
          textAlign: "center",
          color: "#34c4a9",
          fontSize: "38px",
          fontWeight: "bold",
          margin: 0,
          padding: "20px 0",
          boxSizing: "border-box",
          textShadow: "0px 0px 2px #1a7867, 0px 0px 2px #1a7867, 0px 0px 2px #1a7867, 0px 0px 2px #1a7867, 0px 0px 2px #1a7867, 0px 0px 2px #1a7867"
        }}
      >
        Therapist List
      </h1>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search therapists by name or specialization..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            width: "50%",
            padding: "10px",
            border: "2px solid #34c4a9",
            borderRadius: "5px",
            boxSizing: "border-box",
          }}
        />
        <form>
          <input type="checkbox" id="gender1" name="gender1" value="Female" onChange={() => setSearchQueryGender2(1)} defaultChecked="true" />
          <label for="gender1">Female</label><br />
          <input type="checkbox" id="gender2" name="gender2" value="Male" onChange={() => setSearchQueryGender2(2)} defaultChecked="true" />
          <label for="gender2">Male</label><br />
          <input type="checkbox" id="gender3" name="gender3" value="Other" onChange={() => setSearchQueryGender2(3)} defaultChecked="true" />
          <label for="gender3">Other</label><br />
        </form>
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{
            width: "30%",
            padding: "10px",
            border: "2px solid #34c4a9",
            borderRadius: "5px",
            margin: "10px",
            boxSizing: "border-box",
          }}
        />
        <div>
          <label htmlFor="sort-dropdown" style={{ marginRight: "10px" }}>
            Sort By:
          </label>
          <select
            id="sort-dropdown"
            value={sortCriteria}
            onChange={(e) => handleSort(e.target.value)}
            style={{
              padding: "10px",
              border: "2px solid #34c4a9",
              borderRadius: "5px",
              backgroundColor: "#fff",
              color: "#007460",
              boxSizing: "border-box",
            }}
          >
            <option value="specialty">Specialty</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="gender">Gender</option>
          </select>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
          padding: "0 20px",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        {currentTherapists.map((therapist) => (
          <div
            key={therapist.id}
            style={{
              backgroundColor: "#fff",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "2px solid #34c4a9",
              padding: "15px",
              borderRadius: "10px",
              boxSizing: "border-box",
              minWidth: "200px",
              minHeight: "325px",
            }}
          >
            <img
              src={therapist.profilePic}
              alt={therapist.name}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <h2
              style={{
                color: "#34c4a9",
                margin: "10px 0",
                fontWeight: "bold",
                fontSize: therapist.name.length > 20 ? "16px" : "20px",
              }}
            >
              {therapist.name}
            </h2>
            <p style={{ margin: "5px 0", fontSize: "14px", color: "#666", fontWeight: "bold" }}>
              Gender: <span style={{ fontSize: "15px", color: "#333", fontWeight: "normal" }}>{therapist.gender}</span>
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px", color: "#666", fontWeight: "bold" }}>
              Price: <span style={{ fontSize: "15px", color: "#333", fontWeight: "normal" }}>{therapist.price}</span>
            </p>
            <p style={{ margin: "5px 0", fontSize: "14px", color: "#666", fontWeight: "bold" }}>
              Specialization: <span style={{ fontSize: "15px", color: "#333", fontWeight: "normal" }}>{therapist.specialty}</span>
            </p>
            <button
              onClick={() => viewProfile(therapist.id)}
              style={{
                marginTop: "auto",
                padding: "10px 15px",
                backgroundColor: "#34c4a9",
                border: "none",
                borderRadius: "5px",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                textAlign: "center",
                width: "100%",
              }}
            >
              View Profile
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button
          onClick={() => {
            if (currentPage > 1) paginate(currentPage - 1);
          }}
          disabled={currentPage === 1}
          style={{
            padding: "10px 15px",
            backgroundColor: "#34c4a9",
            border: "none",
            borderRadius: "5px",
            color: "white",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            style={{
              padding: "10px 15px",
              backgroundColor:
                currentPage === index + 1 ? "#007460" : "#34c4a9",
              border: "none",
              borderRadius: "5px",
              color: "white",
              cursor: "pointer",
            }}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => {
            if (currentPage < totalPages) paginate(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
          style={{
            padding: "10px 15px",
            backgroundColor: "#34c4a9",
            border: "none",
            borderRadius: "5px",
            color: "white",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TherapistListPage;













































































