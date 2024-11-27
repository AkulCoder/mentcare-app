import React, { useState, useEffect } from "react";
import mockProfilePic from "./assets/images/Mock_Profile_Picture.jpg";

const TherapistListPage = () => {
  const [therapists, setTherapists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState("specialty");
  const [currentPage, setCurrentPage] = useState(1);
  const [therapistsPerPage, setTherapistsPerPage] = useState(1);

  useEffect(() => {
    // TODO: Replace mock data with API call to fetch therapists data
    const mockTherapists = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name:
        i % 7 === 0
          ? `Dr. Therapist ${i + 1}`
          : [
              "Dr. Elizabeth Montgomery",
              "Dr. John Smith",
              "Dr. Ayesha Patel",
              "Dr. William Thompson",
              "Dr. Stephanie O'Connor",
              "Dr. Grace Kim",
              "Dr. Alexander von Humboldt",
            ][i % 7],
      specialty: [
        "Cognitive Behavioral Therapy",
        "Family Therapy",
        "Trauma Therapy",
        "Child Psychology",
        "Behavioral Psychology",
        "Art Therapy",
        "Couples Counseling",
        "Addiction Counseling",
        "Grief Counseling",
        "Stress Management",
        "Long-Term Psychodynamic Therapy",
      ][i % 11],
      profilePic: mockProfilePic,
    }));
    setTherapists(mockTherapists);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const cardWidth = 220;
      const cardHeight = 320;

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
      if (a[criteria] < b[criteria]) return -1;
      if (a[criteria] > b[criteria]) return 1;
      return 0;
    });
    setTherapists(sortedTherapists);
  };

  const filteredTherapists = therapists.filter(
    (therapist) =>
      therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastTherapist = currentPage * therapistsPerPage;
  const indexOfFirstTherapist = indexOfLastTherapist - therapistsPerPage;
  const currentTherapists = filteredTherapists.slice(
    indexOfFirstTherapist,
    indexOfLastTherapist
  );

  const totalPages = Math.ceil(filteredTherapists.length / therapistsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

            {/* Specialization Section */}
            <div
              style={{
                margin: "10px 0",
                textAlign: "center",
                fontFamily: "Arial, sans-serif",
                maxHeight: "40px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "black",
                  fontWeight: "normal",
                }}
              >
                Specialization:
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  color: "black",
                  fontWeight: "bold",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {therapist.specialty}
              </p>
            </div>

            <div style={{ flexGrow: 1 }}></div>
            <button
              onClick={() => {
                // TODO: Implement navigation to therapist's profile page
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: "#34c4a9",
                border: "none",
                borderRadius: "5px",
                color: "white",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              View Profile
            </button>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
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







































































