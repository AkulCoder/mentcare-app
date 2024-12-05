import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import "./Navbar.css";
import "../presets.css";
import NotificationBellImg from "./notification-bell.png";
import NotificationBellActiveImg from "./notification-bell-active.png";
import defaultProfilePic from '../pages/assets/images/default-profile-pic.jpg';
import mentcareLogo from '../pages/assets/images/Mentcare_Symbol.png'

const Navbar = () => {
    const [userData, setUserData] = useState(null);
    const [notifications, setNotifications] = useState(null);
    const [bellImage, setBellImage] = useState(NotificationBellImg);
    const [profileImgUrl, setProfileImgUrl] = useState(null);
    const [isActive, setIsActive] = useState(null);

    //  Routing makes window.location not update on tab clicks
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(location.pathname);

    const bellRef = useRef(null);

    let isLoggedIn;
    const fakeUserID = localStorage.getItem("userID");
    // const isActive = localStorage.getItem("isActive");

    // if (isActive) {
    //     setTherapistIsActive(isActive)
    // }

    if (fakeUserID && fakeUserID !== "0") {
        isLoggedIn = true;
    } else {
        isLoggedIn = false;
    }

    function handleTabClick(path) {
        if (path === "/logout") {
            localStorage.setItem("userID", 0);
            localStorage.removeItem("userType");
            setUserData();
            setSelectedTab("/dashboard");
            return;
        }
        setSelectedTab(path.toLowerCase());
    }

    useEffect(() => {
        const socket = io('http://localhost:5000');

        const fakeUserID = localStorage.getItem("userID");
        const realUserID = localStorage.getItem("realUserID");
        const userType = localStorage.getItem("userType");

        //  Connection
        socket.on('connect', () => {
            console.log('Connected to server');
            socket.emit("init-socket-navbar-comm", { "userID": realUserID });
        });
        //  Disconnect
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        socket.on('update-navbar', () => {
            console.log('Updated navbar!')
            fetch("http://localhost:5000/navbarData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fakeUserID, userType }),
            })
                .then((res) => {
                    if (!res.ok) {
                        setUserData(null);
                        setNotifications(null);
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then((data) => {
                    setUserData(data[0][0]);
                    setNotifications(data[1]);
                    if (userType === 'Therapist') {
                        setIsActive(data[0][0]['isActive'])
                    }
                })
                .catch((err) => console.error("Error fetching data:", err));

            let imageExists = false;
            fetch("http://localhost:5000/retriveProfilePic", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",  // Ensure the request is sent as JSON
                },
                body: JSON.stringify({ realUserID }),
            })
                .then((res) => {
                    if (res.ok) {
                        imageExists = true;
                    }
                    return res.blob();
                })
                .then((data) => {
                    if (imageExists) {
                        const imageUrl = URL.createObjectURL(data);
                        // console.log("Image Blob:", data);
                        // console.log("Image URL:", imageUrl);
                        setProfileImgUrl(imageUrl);
                        imageExists = false;
                    }
                    else {
                        setProfileImgUrl(defaultProfilePic);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching image:", error);
                });
        });

        // Cleanup on component unmount
        return () => {
            socket.emit("rem-socket-navbar-comm", { "userID": realUserID });
            socket.off('update-navbar');
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const fakeUserID = localStorage.getItem("userID");
        const realUserID = localStorage.getItem("realUserID");
        const userType = localStorage.getItem("userType");

        if (localStorage.getItem("userID") !== "0") {
            fetch("http://localhost:5000/navbarData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fakeUserID, userType }),
            })
                .then((res) => {
                    if (!res.ok) {
                        setUserData(null);
                        setNotifications(null);
                        handleTabClick('/');
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log(data[0][0])
                    setUserData(data[0][0]);
                    setNotifications(data[1]);
                    if (userType === 'Therapist') {
                        setIsActive(data[0][0]['isActive'])
                    }
                    handleTabClick(location.pathname);
                })
                .catch((err) => console.error("Error fetching data:", err));

            let imageExists = false;
            fetch("http://localhost:5000/retriveProfilePic", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",  // Ensure the request is sent as JSON
                },
                body: JSON.stringify({ realUserID }),
            })
                .then((res) => {
                    if (res.ok) {
                        imageExists = true;
                    }
                    return res.blob();
                })
                .then((data) => {
                    if (imageExists) {
                        const imageUrl = URL.createObjectURL(data);
                        // console.log("Image Blob:", data);
                        // console.log("Image URL:", imageUrl);
                        setProfileImgUrl(imageUrl);
                        imageExists = false;
                    }
                    else {
                        setProfileImgUrl(defaultProfilePic);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching image:", error);
                });
        }
        else {
            setUserData(null);
            setNotifications(null);
            handleTabClick('/');
        }
    }, [localStorage.getItem("userID"), localStorage.getItem("isActive")]);

    //  Use to update notifications
    useEffect(() => {
        if (!notifications) {
            setBellImage(NotificationBellImg);
        } else {
            setBellImage(NotificationBellActiveImg);
        }
    }, [notifications]);

    //  Use to update current tab clicked
    useEffect(() => {
        console.log(location.pathname);
        handleTabClick(`${location.pathname}`)
    }, [location.pathname])

    function toggleNotifications() {
        if (bellRef.current.className === "notifs-dropdown-items hidden") {
            bellRef.current.className = "notifs-dropdown-items";
        } else {
            bellRef.current.className = "notifs-dropdown-items hidden";
        }
    }

    function handleNotificationClick(redLocation, notificationID) {
        if (redLocation !== "null") {
            handleTabClick(redLocation);
            navigate(redLocation);
            handleRemoveNotification(notificationID);
        }
    }

    function handleRemoveNotification(notificationID) {
        const updatedNotifications = [...notifications].filter(
            (notification) => notification.notificationID !== parseInt(notificationID)
        );
        if (updatedNotifications.length === 0) {
            setNotifications(null);
        } else {
            setNotifications(updatedNotifications);
        }

        fetch("http://localhost:5000/deleteNotification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ notificationID }),
        }).catch((err) => console.error("Error fetching data:", err));
    }

    console.log(isLoggedIn);

    return (
        <nav>
            <div className="left-section flex-row">
                <div className="navbar-img-circle-mask">
                    <img src={mentcareLogo} alt="Logo" className="navbar-profile-pic" />
                </div>
                <Link to="/" onClick={() => handleTabClick(`/`)}>
                    <h2 className={`${selectedTab === "/" ? "active-tab" : "selectable-tab"}`}>MentCare</h2>
                </Link>
            </div>

            <div className="right-section">
                {!isLoggedIn ? (
                    <Link to={`/login`} onClick={() => handleTabClick(`/login`)}>
                        <h2 className={`${selectedTab === "/login" ? "active-tab" : "selectable-tab"}`}>Login</h2>
                    </Link>
                ) : (
                    <>
                        {userData && (
                            <div className="flex-row flex-centered" style={{ gap: '30px' }}>
                                <Link to={`/dashboard`} onClick={() => handleTabClick(`/dashboard`)}>
                                    <h2 className={`${selectedTab === "/dashboard" ? "active-tab" : "selectable-tab"}`}>
                                        Dashboard
                                    </h2>
                                </Link>
                                {userData.userType === "Patient" && (
                                    <Link to={`/therapistlist`} onClick={() => handleTabClick(`/therapistlist`)}>
                                        <h2 className={`${selectedTab === "/therapistlist" ? "active-tab" : "selectable-tab"}`}>
                                            Therapist List
                                        </h2>
                                    </Link>
                                )}
                                {userData.userType === "Therapist" && isActive && (
                                    <Link to={`/therapistprofile/${localStorage.getItem('realUserID')}`} onClick={() => handleTabClick(`/therapistprofile/${localStorage.getItem('realUserID')}`)}>
                                        <h2 className={`${selectedTab === `/therapistprofile/${localStorage.getItem('realUserID')}` ? "active-tab" : "selectable-tab"}`}>
                                            Profile
                                        </h2>
                                    </Link>
                                )}
                                <Link to={`/chat`} onClick={() => handleTabClick(`/chat`)}>
                                    <h2 className={`${selectedTab === "/chat" ? "active-tab" : "selectable-tab"}`}>
                                        Chats
                                    </h2>
                                </Link>
                                {userData ? (
                                    <div className="flex-row user-bell-container">
                                        <div className="dropdown flex-col flex-centered" style={{ gap: "10px", height: "100%" }}>
                                            <div className="flex-row flex-centered" style={{ position: 'relative' }}>
                                                <h2 className={`${selectedTab === "/settings" ? "active-tab" : "selectable-tab"}`} style={{ cursor: 'default' }}>{userData.userName}</h2>
                                                <div className='navbar-profile-pic-container'>
                                                    {profileImgUrl ? (
                                                        <div className="navbar-img-circle-mask">
                                                            <img src={profileImgUrl} alt="Profile" className="navbar-profile-pic" />
                                                        </div>
                                                    ) : (
                                                        <div className="navbar-img-circle-mask">
                                                            <img src={defaultProfilePic} alt="Profile" className="navbar-profile-pic" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="dropdown-items">
                                                    <Link
                                                        to={`/settings`}
                                                        onClick={() => handleTabClick(`/settings`)}
                                                        className="hamburger-item"
                                                    >
                                                        Settings
                                                    </Link>
                                                    <Link
                                                        to={`/login`}
                                                        onClick={() => handleTabClick(`/logout`)}
                                                        className="hamburger-item"
                                                    >
                                                        Log Out
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="notifs-dropdown flex-col flex-centered">
                                            <div
                                                className="flex-col flex-centered"
                                                style={{ height: "100%", marginTop: '20px', marginBottom: '20px' }}
                                            >
                                                <img
                                                    src={bellImage}
                                                    width={"40px"}
                                                    height={"40px"}
                                                    onClick={() => toggleNotifications()}
                                                />
                                            </div>

                                            {notifications && userData.userType === "Therapist" && isActive ? (
                                                <div
                                                    className="notifs-dropdown-items hidden"
                                                    ref={bellRef}
                                                >
                                                    {notifications.map((row, index) => (
                                                        <div
                                                            key={`notif-${index}`}
                                                            onClick={() =>
                                                                handleNotificationClick(
                                                                    `${row.redirectLocation}`,
                                                                    `${row.notificationID}`
                                                                )
                                                            }
                                                            className={`flex-row hamburger-item ${row.redirectLocation
                                                                ? "hamburger-item-pointer"
                                                                : "hamburger-item-no-pointer"
                                                                }`}
                                                        >
                                                            <div className="flex-col flex-centered">
                                                                {row.message}
                                                            </div>
                                                            <input
                                                                type="button"
                                                                value={"X"}
                                                                className='notif-close-btn'
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRemoveNotification(
                                                                        `${row.notificationID}`
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : notifications && userData.userType === "Patient" ? (
                                                <div
                                                    className="notifs-dropdown-items hidden"
                                                    ref={bellRef}
                                                >
                                                    {notifications.map((row, index) => (
                                                        <div
                                                            key={`notif-${index}`}
                                                            onClick={() =>
                                                                handleNotificationClick(
                                                                    `${row.redirectLocation}`,
                                                                    `${row.notificationID}`
                                                                )
                                                            }
                                                            className={`flex-row hamburger-item ${row.redirectLocation
                                                                ? "hamburger-item-pointer"
                                                                : "hamburger-item-no-pointer"
                                                                }`}
                                                        >
                                                            <div className="flex-col flex-centered">
                                                                {row.message}
                                                            </div>
                                                            <input
                                                                type="button"
                                                                value={"X"}
                                                                className='notif-close-btn'
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRemoveNotification(
                                                                        `${row.notificationID}`
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="notifs-dropdown-items">
                                                    <div className="hamburger-item hamburger-item-no-pointer">
                                                        No Notifications!
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p>Loading...</p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </nav >
    );
};

export default Navbar;


